"""Framework-free function calling: schemas + registry + pydantic-style validation."""
import json, datetime

SCHEMAS = [{
  "type": "function",
  "function": {
    "name": "book_meeting",
    "description": "Book a meeting room for given attendees and duration.",
    "parameters": {
      "type": "object",
      "properties": {
        "room":    {"type": "string", "enum": ["A", "B", "C"]},
        "minutes": {"type": "integer", "minimum": 15, "maximum": 240},
        "date":    {"type": "string", "description": "YYYY-MM-DD"},
      },
      "required": ["room", "minutes", "date"],
    }}}, {
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Weather by city name.",
    "parameters": {"type": "object", "required": ["city"],
                   "properties": {"city": {"type": "string"}}}}}]

REGISTRY = {}
def register(name):
    def deco(fn): REGISTRY[name] = fn; return fn
    return deco

@register("book_meeting")
def book_meeting(room: str, minutes: int, date: str):
    datetime.date.fromisoformat(date)                       # validate
    return {"ok": True, "booking": f"room-{room}-{date}-{minutes}min"}

@register("get_weather")
def get_weather(city: str):
    return {"city": city, "temp_c": 27, "sky": "partly cloudy"}  # stub

def validate(args: dict, schema: dict):
    props, req = schema["properties"], schema.get("required", [])
    missing = [r for r in req if r not in args]
    if missing: raise ValueError(f"missing {missing}")
    out = {}
    for k, v in args.items():
        t = props[k]["type"]
        ok = {"string": str, "integer": int}[t]             # minimal demo
        if not isinstance(v, ok): raise ValueError(f"{k} must be {t}")
        if "enum" in props[k] and v not in props[k]["enum"]:
            raise ValueError(f"{k} must be one of {props[k]['enum']}")
        out[k] = v
    return out

def execute(tool_call: dict):                               # tool_call like OpenAI's
    name = tool_call["function"]["name"]
    raw = json.loads(tool_call["function"]["arguments"])
    sch = next(s["function"]["parameters"] for s in SCHEMAS
               if s["function"]["name"] == name)
    try:
        args = validate(raw, sch)
    except Exception as e:
        return {"error": str(e)}                            # errors go BACK to the model
    try:
        return {"result": REGISTRY[name](**args)}
    except Exception as e:
        return {"error": f"{type(e).__name__}: {e}"}

if __name__ == "__main__":
    calls = [{"function": {"name": "get_weather",
              "arguments": '{"city": "Singapore"}'}},
             {"function": {"name": "book_meeting",
              "arguments": '{"room": "Z", "minutes": 30, "date": "2026-09-01"}'}}]
    for c in calls:
        print(execute(c))
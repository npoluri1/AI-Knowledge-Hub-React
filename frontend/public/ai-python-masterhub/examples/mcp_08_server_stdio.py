"""Educational MCP server speaking JSON-RPC on stdin/stdout.
Real projects: use `pip install mcp` + FastMCP. Test with MCP Inspector."""
import sys, json, datetime, hashlib

PROTOCOL = "2024-11-05"
SERVER = {"name": "mini-mcp", "version": "1.0.0"}

TOOLS_SPEC = [{
  "name": "now", "description": "Current UTC time ISO-8601",
  "inputSchema": {"type": "object", "properties": {}, "required": []}}, {
  "name": "sha256", "description": "Hash text",
  "inputSchema": {"type": "object", "properties": {"text": {"type": "string"}},
                  "required": ["text"]}},
]

def call_tool(name, args):
    if name == "now":
        return datetime.datetime.utcnow().isoformat() + "Z"
    if name == "sha256":
        return hashlib.sha256(args["text"].encode()).hexdigest()
    raise ValueError(f"unknown tool {name}")

def handle(req):
    method = req.get("method", "")
    rid = req.get("id")
    def ok(result): return {"jsonrpc": "2.0", "id": rid, "result": result}
    def err(code, msg): return {"jsonrpc": "2.0", "id": rid,
                                "error": {"code": code, "message": msg}}
    if method == "initialize":
        return ok({"protocolVersion": PROTOCOL, "capabilities": {"tools": {}},
                   "serverInfo": SERVER})
    if method == "tools/list":
        return ok({"tools": TOOLS_SPEC})
    if method == "tools/call":
        p = req.get("params", {})
        try:
            text = str(call_tool(p["name"], p.get("arguments", {})))
            return ok({"content": [{"type": "text", "text": text}], "isError": False})
        except Exception as e:
            return ok({"content": [{"type": "text", "text": str(e)}], "isError": True})
    if method.startswith("notifications/"):
        return None                                        # no response for notifications
    return err(-32601, f"method not found: {method}")

if __name__ == "__main__":
    for line in sys.stdin:                                 # one JSON-RPC per line
        line = line.strip()
        if not line: continue
        try:
            resp = handle(json.loads(line))
        except Exception as e:
            resp = {"jsonrpc": "2.0", "id": None,
                    "error": {"code": -32700, "message": f"parse error: {e}"}}
        if resp is not None:
            sys.stdout.write(json.dumps(resp) + "\n"); sys.stdout.flush()

# Try it:  echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | python mcp_08_server_stdio.py
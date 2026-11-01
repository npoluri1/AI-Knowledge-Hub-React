"""pip install fastapi uvicorn   ->  uvicorn api_01_fastapi_jwt_crud:app --reload"""
import time, hmac, hashlib, base64, json
from fastapi import FastAPI, Depends, HTTPException, Header
from pydantic import BaseModel, Field

SECRET = b"dev-secret-change-me"                       # load from vault in prod!
app = FastAPI(title="Items API", version="1.0")
USERS = {"alice": {"pw": "wonder", "role": "admin"}}
DB: dict[int, dict] = {}
_next_id = 1

def b64(d: bytes) -> str: return base64.urlsafe_b64encode(d).rstrip(b"=").decode()

def make_jwt(sub: str, role: str, minutes=30):
    hdr = b64(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    now = int(time.time())
    pay = b64(json.dumps({"sub": sub, "role": role,
                          "exp": now + minutes * 60}).encode())
    sig = b64(hmac.new(SECRET, f"{hdr}.{pay}".encode(), hashlib.sha256).digest())
    return f"{hdr}.{pay}.{sig}"

def verify(token: str) -> dict:
    try:
        h, p, s = token.split(".")
        good = b64(hmac.new(SECRET, f"{h}.{p}".encode(), hashlib.sha256).digest())
        assert hmac.compare_digest(s, good), "bad signature"
        payload = json.loads(base64.urlsafe_b64decode(p + "=" * (-len(p) % 4)))
        assert payload["exp"] > time.time(), "expired"
        return payload
    except Exception as e:
        raise HTTPException(401, f"invalid token: {e}")

def current_user(authorization: str = Header(default="")):
    return verify(authorization.replace("Bearer ", ""))

def require_admin(u: dict = Depends(current_user)):
    if u["role"] != "admin": raise HTTPException(403, "admin only")
    return u

class TokenIn(BaseModel):
    username: str; password: str

class Item(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    price: float = Field(gt=0)

@app.post("/token")
def login(body: TokenIn):
    u = USERS.get(body.username)
    if not u or not hmac.compare_digest(u["pw"], body.password):
        raise HTTPException(401, "bad credentials")
    return {"access_token": make_jwt(body.username, u["role"]), "token_type": "bearer"}

@app.post("/items", status_code=201)
def create(item: Item, u: dict = Depends(current_user)):
    global _next_id
    DB[_next_id] = {**item.model_dump(), "owner": u["sub"]}
    out = {"id": _next_id, **DB[_next_id]}; _next_id += 1
    return out

@app.get("/items")
def list_items(_: dict = Depends(current_user)):
    return [{"id": k, **v} for k, v in DB.items()]

@app.delete("/items/{iid}", status_code=204)
def delete(iid: int, _: dict = Depends(require_admin)):
    if DB.pop(iid, None) is None: raise HTTPException(404)
# Test quickly:
# curl -s -X POST :8000/token -H 'content-type: application/json' \
#   -d '{"username":"alice","password":"wonder"}' 
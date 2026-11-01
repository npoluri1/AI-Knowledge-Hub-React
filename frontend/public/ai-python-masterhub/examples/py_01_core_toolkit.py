"""One-file tour of daily-driver Python: typing, dataclasses, decorators,
generators, context managers, pathlib, logging, walrus, match, asyncio."""
from __future__ import annotations
import asyncio, logging, time
from dataclasses import dataclass, field
from functools import lru_cache, wraps
from pathlib import Path
from typing import Iterable, Iterator

log = logging.getLogger("tour")

# ---------- dataclasses + typing ----------
@dataclass(frozen=True, order=True)
class Task:
    priority: int                      # order=True -> tasks sortable by priority
    title: str
    tags: list[str] = field(default_factory=list)

    def is_urgent(self) -> bool:
        return self.priority <= 2

# ---------- decorator with timing ----------
def timed(fn):
    @wraps(fn)
    def inner(*args, **kwargs):
        t0 = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            log.info("%s took %.3fs", fn.__name__, time.perf_counter() - t0)
    return inner

# ---------- generator pipeline (lazy) ----------
def read_numbers(path: Path) -> Iterator[int]:
    for line in path.read_text().splitlines():        # pretend huge file
        if line.strip().isdigit():
            yield int(line)

@timed
def sum_big(path: Path) -> int:
    return sum(n for n in read_numbers(path) if n > 10)   # nothing materialized

# ---------- memoized pure function ----------
@lru_cache(maxsize=None)
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

# ---------- context manager ----------
from contextlib import contextmanager

@contextmanager
def stage(name: str):
    log.info("-> %s", name)
    try:
        yield
    except Exception:
        log.exception("stage failed: %s", name)
        raise
    else:
        log.info("<- %s ok", name)

# ---------- walrus + match ----------
def classify(tasks: Iterable[Task]) -> dict[str, list[str]]:
    buckets: dict[str, list[str]] = {}
    for t in tasks:
        match t:
            case Task(priority=1, title=title): buckets.setdefault("p1", []).append(title)
            case Task(priority=p) if p <= 3:    buckets.setdefault("mid", []).append(t.title)
            case _:                             buckets.setdefault("low", []).append(t.title)
    return buckets

# ---------- asyncio ----------
async def fetch(i: int) -> int:
    await asyncio.sleep(0.1 * i)          # simulated IO
    return i * i

async def main() -> None:
    results = await asyncio.gather(*(fetch(i) for i in range(5)))
    print("gathered:", results)

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    tmp = Path("nums.txt"); tmp.write_text("\n".join(["5", "20", "3", "99"]))
    with stage("sum"):
        print("sum_big:", sum_big(tmp))
    with stage("fib"):
        print("fib(90) =", fib(90))
    with stage("classify"):
        ts = [Task(1, "hotfix"), Task(2, "deploy", ["infra"]), Task(9, "docs")]
        print(classify(ts))
    asyncio.run(main())
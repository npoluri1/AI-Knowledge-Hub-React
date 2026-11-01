import asyncio, random, time

async def producer(q: asyncio.Queue, n: int):
    for i in range(n):
        await asyncio.sleep(random.uniform(0.01, 0.05))   # simulate IO latency
        await q.put({"job": i})
        print(f"[producer] queued job={i} size={q.qsize()}")
    for _ in range(WORKERS):
        await q.put(None)                                  # poison pills

async def worker(q: asyncio.Queue, sem: asyncio.Semaphore, wid: int):
    while True:
        item = await q.get()
        if item is None:
            q.task_done(); break
        async with sem:                                    # cap concurrency at 2
            await asyncio.sleep(random.uniform(0.05, 0.15))
            print(f"[worker{wid}] done job={item['job']}")
        q.task_done()

WORKERS = 3
async def main():
    q: asyncio.Queue = asyncio.Queue(maxsize=4)            # bounded => backpressure
    sem = asyncio.Semaphore(2)
    prod = asyncio.create_task(producer(q, 8))
    consumers = [asyncio.create_task(worker(q, sem, w)) for w in range(WORKERS)]
    await prod; await q.join()
    await asyncio.gather(*consumers)
    print("pipeline drained")

if __name__ == "__main__":
    t0 = time.perf_counter(); asyncio.run(main())
    print(f"elapsed {time.perf_counter()-t0:.2f}s")
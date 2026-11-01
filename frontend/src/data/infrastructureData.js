export const INFRASTRUCTURE_DATA = {
  "id": "ai-infrastructure",
  "title": "AI Infrastructure",
  "icon": "⚡",
  "description": "150 production-focused AI infrastructure articles. GPU internals, CUDA, distributed training, LLM inference.",
  "categories": [
    {
      "name": "Tensor Computing & GPU",
      "icon": "🎮",
      "concepts": [
        {
          "title": "GPU Memory Hierarchy",
          "slug": "gpu-memory",
          "tldr": "GPU performance is often limited by memory bandwidth, not compute. Understanding the memory hierarchy (SRAM, HBM, CPU RAM) is key to writing efficient AI kernels.",
          "whyItMatters": [
            { "num": "1", "title": "Kernel Optimization", "text": "Writing CUDA kernels that keep data in fast SRAM instead of repeatedly reading from slow HBM can yield 10-100x speedups." },
            { "num": "2", "title": "Model Training", "text": "Fitting large models into GPU memory determines whether you can train at all, driving techniques like gradient checkpointing." },
            { "num": "3", "title": "Inference", "text": "KV cache management directly determines how many concurrent users a serving system can handle." }
          ],
          "howItWorks": "GPUs have three memory tiers: SRAM (on-chip, extremely fast, limited capacity), HBM (main GPU memory, fast, 40-80GB), and CPU RAM (large but slow). Operations are compute-bound when arithmetic intensity exceeds the GPU's operational intensity. For memory-bound ops like attention, optimization focuses on data movement. Techniques include tiling, coalesced memory access, and avoiding redundant HBM reads.",
          "pitfalls": [
            { "text": "Ignoring memory bandwidth leads to kernels that are compute-efficient but memory-starved." },
            { "text": "Register spilling to HBM kills performance." },
            { "text": "Non-contiguous memory access patterns cause GPU threads to stall." },
            { "text": "Tensor core operations require specific data formats (FP16, BF16, INT8)." }
          ],
          "keyTerms": [
            { "term": "SRAM", "definition": "Static RAM on-chip, extremely fast but limited capacity (~20KB/SM)." },
            { "term": "HBM", "definition": "High Bandwidth Memory, the main GPU memory (40-80GB on A100)." },
            { "term": "Arithmetic Intensity", "definition": "Ratio of FLOPs to bytes accessed; determines compute vs memory bound." },
            { "term": "Coalesced Access", "definition": "Adjacent threads accessing adjacent memory addresses for max bandwidth." },
            { "term": "Tiling", "definition": "Breaking computation into blocks that fit in fast on-chip memory." }
          ],
          "codeExample": "import numpy as np\nimport time\n\ndef sequential_access(size):\n    arr = np.random.rand(size)\n    start = time.time()\n    _ = arr.sum()\n    return time.time() - start\n\ndef random_access(size):\n    arr = np.random.rand(size)\n    indices = np.random.permutation(size)\n    start = time.time()\n    _ = arr[indices].sum()\n    return time.time() - start\n\nprint(f'Sequential: {sequential_access(10_000_000):.4f}s')\nprint(f'Random: {random_access(10_000_000):.4f}s')",
          "relatedConcepts": ["CUDA Programming", "FlashAttention", "Quantization"]
        },
        {
          "title": "KV Cache and Memory Management",
          "slug": "kv-cache",
          "tldr": "The KV cache stores computed key-value pairs from previous tokens, avoiding redundant computation. Managing it efficiently is critical for inference throughput.",
          "whyItMatters": [
            { "num": "1", "title": "Concurrent Users", "text": "Each users conversation requires its own KV cache. A 128K context window needs ~16GB on Llama-70B." },
            { "num": "2", "title": "Cost", "text": "KV cache memory determines how many requests a GPU can serve simultaneously." },
            { "num": "3", "title": "Long Context", "text": "Enabling 100K+ context windows requires efficient KV cache compression or offloading." }
          ],
          "howItWorks": "During autoregressive generation, each new token needs attention against all previous tokens. The KV cache stores previously computed key and value matrices so only the new tokens projection needs computation. Memory grows linearly with sequence length and batch size. Optimization: GQA reduces cache size, PagedAttention eliminates fragmentation, KV cache quantization reduces precision.",
          "pitfalls": [
            { "text": "KV cache memory grows linearly with sequence length; can exceed GPU memory." },
            { "text": "Memory fragmentation wastes GPU memory; paged attention solves this." },
            { "text": "Different users need different cache sizes; static allocation wastes memory." },
            { "text": "Cache invalidation is required when context changes." }
          ],
          "keyTerms": [
            { "term": "KV Cache", "definition": "Stored key and value matrices from previous tokens." },
            { "term": "PagedAttention", "definition": "vLLM technique using page-table-like management for KV cache." },
            { "term": "GQA", "definition": "Grouped Query Attention reduces KV cache by sharing heads." },
            { "term": "Prefill", "definition": "Processing the entire prompt in parallel to compute initial KV cache." },
            { "term": "Decode", "definition": "Generating tokens one at a time using the KV cache." }
          ],
          "codeExample": "import torch\n\ndef estimate_kv_cache(model_params, seq_len, batch_size, dtype_bytes=2):\n    n_layers = model_params['n_layers']\n    n_heads = model_params['n_heads']\n    head_dim = model_params['head_dim']\n    bytes_needed = (\n        2 * n_layers * batch_size * seq_len * n_heads * head_dim * dtype_bytes\n    )\n    return bytes_needed / (1024**3)\n\nparams = {'n_layers': 80, 'n_heads': 64, 'head_dim': 128}\nprint(f'KV Cache: {estimate_kv_cache(params, 128000, 1):.1f} GB')",
          "relatedConcepts": ["FlashAttention", "PagedAttention", "Continuous Batching"]
        },
        {
          "title": "Continuous Batching",
          "slug": "continuous-batching",
          "tldr": "Traditional static batching wastes GPU cycles waiting for the longest request. Continuous batching inserts new requests into existing batches as slots free up.",
          "whyItMatters": [
            { "num": "1", "title": "Throughput", "text": "Continuous batching increases serving throughput by 2-10x compared to static batching." },
            { "num": "2", "title": "Latency", "text": "New requests dont wait for the entire batch to finish." },
            { "num": "3", "title": "Cost", "text": "Higher throughput means fewer GPUs needed, reducing serving costs." }
          ],
          "howItWorks": "In static batching, all requests must complete before the next batch starts. If one request generates 100 tokens and another generates 10, the GPU sits idle for 90 token-steps. Continuous batching dynamically inserts new requests as earlier ones complete. The scheduler tracks active sequences, reuses freed KV cache memory, and maintains GPU utilization.",
          "pitfalls": [
            { "text": "Requires dynamic memory management for variable-length sequences." },
            { "text": "Preemption may be needed when memory is full." },
            { "text": "Fairness: long requests should not starve short requests." },
            { "text": "Implementation complexity is higher than static batching." }
          ],
          "keyTerms": [
            { "term": "Static Batching", "definition": "All requests complete before next batch starts." },
            { "term": "Continuous Batching", "definition": "Dynamically inserting new requests as slots free up." },
            { "term": "Preemption", "definition": "Stopping a running sequence to free memory." },
            { "term": "Throughput", "definition": "Total tokens generated per second across all requests." }
          ],
          "codeExample": "import asyncio\n\nclass ContinuousBatchScheduler:\n    def __init__(self, max_batch_size=32):\n        self.max_batch = max_batch_size\n        self.active = []\n        self.waiting = []\n\n    async def submit(self, request):\n        self.waiting.append(request)\n        await self._schedule()\n\n    async def _schedule(self):\n        while len(self.active) < self.max_batch and self.waiting:\n            req = self.waiting.pop(0)\n            self.active.append(req)\n            asyncio.create_task(self._process(req))\n\n    async def _process(self, req):\n        result = await generate(req)\n        self.active.remove(req)\n        await self._schedule()",
          "relatedConcepts": ["KV Cache", "PagedAttention", "Speculative Decoding"]
        }
      ]
    }
  ]
};

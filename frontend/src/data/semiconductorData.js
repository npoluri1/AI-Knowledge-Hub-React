export const SEMICONDUCTOR_DATA = {
  "id": "semiconductors",
  "title": "Semiconductor (Chips Manufacturing)",
  "icon": "💠",
  "description": "How chips are designed and manufactured. From silicon wafers to modern AI accelerators, explained for everyone.",
  "categories": [
    {
      "name": "Silicon Fundamentals",
      "icon": "🔬",
      "concepts": [
        {
          "title": "What is a Semiconductor?",
          "slug": "what-is-semiconductor",
          "tldr": "A semiconductor is a material whose electrical conductivity falls between a conductor (like copper) and an insulator (like rubber). This 'in-between' property makes it the foundation of all modern electronics.",
          "whyItMatters": [
            { num: "1", title: "Every Electronic Device", "text": "Your phone, laptop, car, and washing machine all contain semiconductors. Without them, modern electronics wouldn't exist." },
            { num: "2", title: "AI Accelerators", "text": "GPUs, TPUs, and custom AI chips are all built on semiconductor technology. The AI revolution depends on chip manufacturing advances." },
            { num: "3", title: "Economic Impact", "text": "The global semiconductor industry is worth $600B+ and underpins virtually every other industry from healthcare to defense." }
          ],
          "howItWorks": "Silicon is the most common semiconductor. In its pure form, it's a poor conductor. But by adding tiny amounts of other elements (doping), we can precisely control its conductivity. Adding phosphorus creates N-type (extra electrons), adding boron creates P-type (extra 'holes'). When we join N-type and P-type silicon, we create a PN junction — the fundamental building block of transistors, diodes, and solar cells. By applying voltage, we can switch the junction on/off, creating the binary 1s and 0s of digital computing.",
          "pitfalls": [
            { "text": "Semiconductors aren't just silicon — alternatives like GaAs, SiC, and GaN are used for specific applications." },
            { "text": "Doping concentrations are measured in parts per billion — tiny impurities have huge effects." },
            { "text": "Temperature affects semiconductor behavior; chips need cooling to maintain performance." },
            { "text": "Quantum effects become significant at modern transistor scales (3nm, 5nm)." }
          ],
          "keyTerms": [
            { "term": "Silicon (Si)", definition: "The most common semiconductor material, used in >95% of chips." },
            { "term": "Doping", definition: "Adding impurity atoms to silicon to control its electrical properties." },
            { "term": "N-type", definition: "Silicon doped with phosphorus, having extra free electrons." },
            { "term": "P-type", definition: "Silicon doped with boron, having extra 'holes' (electron vacancies)." },
            { "term": "Band Gap", definition: "The energy gap between the valence band and conduction band in a semiconductor." }
          ],
          "codeExample": "# Conceptual: doping simulation\n# Pure silicon: 4 valence electrons per atom\n# Doped with phosphorus (5 valence electrons):\n#   → 4 electrons bond with silicon neighbors\n#   → 1 extra electron is free to move\n#   → This makes silicon conduct electricity\n\n# Doped with boron (3 valence electrons):\n#   → 3 electrons bond, 1 bond is incomplete\n#   → This 'hole' acts like a positive charge carrier\n#   → Holes move through the crystal lattice\n\n# PN Junction:\n#   P-type ──── N-type\n#   holes      electrons\n#   → When voltage applied: current flows\n#   → This is how a diode/LED works!",
          "relatedConcepts": ["Transistors", "Chip Fabrication", "MOSFET"]
        }
      ]
    },
    {
      "name": "Transistors",
      "icon": "🔌",
      "concepts": [
        {
          "title": "How Transistors Work",
          "slug": "transistors",
          "tldr": "A transistor is a tiny semiconductor switch that can turn electrical current on/off billions of times per second. Modern chips contain billions of transistors.",
          "whyItMatters": [
            { num: "1", title: "Digital Computing", "text": "Every bit of data in your computer is represented by a transistor in either ON or OFF state. All computation boils down to billions of transistors switching." },
            { num: "2", title: "AI Hardware", "text": "NVIDIA's H100 GPU contains 80 billion transistors. More transistors = more parallel computation = faster AI training." },
            { num: "3", title: "Energy Efficiency", "text": "Modern transistors switch in picoseconds and consume femtojoules of energy, enabling the mobile computing revolution." }
          ],
          "howItWorks": "A MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor) is the most common type. It has three terminals: Source, Drain, and Gate. When voltage is applied to the Gate, it creates an electric field that either allows or blocks current flow between Source and Drain. This acts as a switch: Gate ON → current flows (logic 1), Gate OFF → no current (logic 0). By combining transistors into logic gates (AND, OR, NOT), we build processors. A modern chip has billions of transistors, each just nanometers in size.",
          "pitfalls": [
            { "text": "Smaller transistors aren't always better — leakage current increases at tiny scales." },
            { "text": "Transistor count doesn't equal performance; architecture and cache matter enormously." },
            { "text": "Moore's Law (doubling transistors every 2 years) is slowing down as physical limits approach." },
            { "text": "3D transistors (FinFET, GAA) are necessary because traditional 2D scaling hit a wall." }
          ],
          "keyTerms": [
            { "term": "MOSFET", definition: "Metal-Oxide-Semiconductor Field-Effect Transistor — the most common transistor type." },
            { "term": "Gate", definition: "The control terminal that switches the transistor on/off." },
            { "term": "Source/Drain", definition: "The terminals between which current flows when the gate is on." },
            { "term": "FinFET", definition: "A 3D transistor design where the channel is a fin-shaped structure for better control." },
            { "term": "Process Node", definition: "The manufacturing technology generation (3nm, 5nm, 7nm) indicating transistor size." }
          ],
          "codeExample": "# Conceptual: How a CPU uses transistors\n# A 1-bit full adder uses ~28 transistors\n# A 64-bit adder uses ~1,792 transistors\n# A modern CPU core has ~1 billion transistors\n\n# Simple logic gates from transistors:\n# NOT gate: 1 transistor (inverter)\n# AND gate: ~6 transistors\n# OR gate: ~6 transistors\n# XOR gate: ~12 transistors\n# 1-bit register: ~20 transistors\n# SRAM cell: ~6 transistors\n\n# Scaling:\n# Intel 486 (1989): 1.2M transistors\n# Intel Pentium 4 (2000): 42M transistors\n# NVIDIA H100 (2023): 80B transistors\n# Growth: ~66,000x in 34 years",
          "relatedConcepts": ["What is a Semiconductor?", "Chip Fabrication", "Moore's Law"]
        }
      ]
    },
    {
      "name": "AI Chips",
      "icon": "🧠",
      "concepts": [
        {
          "title": "GPU vs TPU vs Custom AI Chips",
          "slug": "ai-chips-comparison",
          "tldr": "Different AI workloads benefit from different hardware: GPUs for parallel matrix math, TPUs for large-scale training, and NPUs for edge inference.",
          "whyItMatters": [
            { num: "1", title: "Training vs Inference", "text": "Training GPT-4 required ~25,000 A100 GPUs. Inference (running the model) can be done on much smaller, specialized hardware." },
            { num: "2", title: "Cost Optimization", "text": "Choosing the right chip for your workload can reduce costs by 10-100x. Training on GPUs, serving on quantized NPUs." },
            { num: "3", title: "Edge AI", "text": "Running AI on phones, cars, and IoT devices requires specialized low-power chips (NPUs, Jetson, Apple Neural Engine)." }
          ],
          "howItWorks": "GPUs (NVIDIA, AMD) excel at parallel matrix operations — thousands of cores doing the same math on different data. TPUs (Google) are custom ASICs optimized specifically for tensor operations, offering better perf/watt for large-scale training. NPUs (Apple, Qualcomm, MediaTek) are neural processing units built into mobile chips for on-device inference. FPGAs (Intel, Xilinx) offer reconfigurable logic for flexible AI acceleration. Each trades off: GPUs are general-purpose but power-hungry; TPUs are efficient but only for Google Cloud; NPUs are tiny but limited in capability.",
          "pitfalls": [
            { "text": "GPUs are overkill for simple inference workloads — NPUs or CPUs might suffice." },
            { "text": "TPU availability is limited to Google Cloud; vendor lock-in risk." },
            { "text": "Memory bandwidth is often the bottleneck, not compute — check both specs." },
            { "text": "Software ecosystem matters: CUDA (NVIDIA) has vastly more libraries than alternatives." }
          ],
          "keyTerms": [
            { "term": "GPU", definition: "Graphics Processing Unit — thousands of cores for parallel computation." },
            { "term": "TPU", definition: "Tensor Processing Unit — Google's custom ASIC for tensor operations." },
            { "term": "NPU", definition: "Neural Processing Unit — mobile/embedded AI accelerator." },
            { "term": "ASIC", definition: "Application-Specific Integrated Circuit — custom chip for a specific task." },
            { "term": "FPGA", definition: "Field-Programmable Gate Array — reconfigurable chip for flexible acceleration." },
            { "term": "TOPS", definition: "Tera Operations Per Second — measure of AI chip throughput." }
          ],
          "codeExample": "# Choosing the right hardware for your AI workload\n\nhardware_guide = {\n    'training_large_llm': {\n        'best': 'NVIDIA H100/H200 or Google TPU v5e',\n        'why': 'Massive parallel matrix math, HBM memory',\n        'cost': '$2-3/hour per GPU'\n    },\n    'serving_api': {\n        'best': 'NVIDIA L4 or Google TPU v4',\n        'why': 'Optimized for inference throughput',\n        'cost': '$0.50-1/hour per GPU'\n    },\n    'mobile_app': {\n        'best': 'Qualcomm Hexagon NPU or Apple Neural Engine',\n        'why': 'Low power, on-device inference',\n        'cost': 'Included in SoC'\n    },\n    'research_prototyping': {\n        'best': 'NVIDIA RTX 4090',\n        'why': 'Good performance, accessible, CUDA ecosystem',\n        'cost': '$1,600 one-time'\n    }\n}\n\nfor workload, info in hardware_guide.items():\n    print(f'{workload}: {info[\"best\"]}')",
          "relatedConcepts": ["GPU Memory Hierarchy", "Quantization", "Distributed Training"]
        },
        {
          "title": "How Chips are Manufactured",
          "slug": "chip-fabrication",
          "tldr": "Chip manufacturing is the most complex human-made process: a silicon wafer goes through 500-1000 steps over 3+ months to become a processor.",
          "whyItMatters": [
            { num: "1", title: "Geopolitics", "text": "TSMC (Taiwan) manufactures ~60% of the world's chips and ~90% of advanced chips. This concentration creates strategic vulnerability." },
            { num: "2", title: "AI Hardware Supply", "text": "NVIDIA's GPUs are manufactured by TSMC. The AI boom depends on TSMC's production capacity." },
            { num: "3", title: "Cost and Scale", "text": "Building a new fab costs $15-20 billion. Leading-edge chips cost $10,000+ per wafer." }
          ],
          "howItWorks": "The process: (1) Crystal Growth — a pure silicon crystal is grown and sliced into thin wafers, (2) Photolithography — ultraviolet light projects circuit patterns onto the wafer through a mask, (3) Etching — chemicals or plasma remove exposed material to create patterns, (4) Deposition — thin layers of materials are deposited, (5) Doping — impurities are introduced to create N/P regions, (6) Metallization — copper/aluminum interconnects link transistors, (7) Packaging — the wafer is cut into dies and packaged. A modern EUV lithography machine (ASML) costs $350M+ and uses light with 13.5nm wavelength.",
          "pitfalls": [
            { "text": "Yield rates: only ~50-80% of chips on a wafer may work; the rest are discarded." },
            { "text": "Each process node (3nm, 5nm) requires entirely new manufacturing equipment." },
            { "text": "Contamination at the atomic level can ruin entire wafers; clean rooms are 10,000x cleaner than hospitals." },
            { "text": "The supply chain spans 100+ countries; a disruption anywhere can halt production." }
          ],
          "keyTerms": [
            { "term": "Wafer", definition: "A thin disc of silicon that serves as the substrate for chip manufacturing." },
            { "term": "Photolithography", definition: "Using light to transfer circuit patterns from a mask onto the wafer." },
            { "term": "EUV", definition: "Extreme Ultraviolet lithography — uses 13.5nm wavelength for the smallest features." },
            { "term": "Fab", definition: "A fabrication facility where chips are manufactured (costs $15-20B to build)." },
            { "term": "Yield", definition: "The percentage of working chips per wafer; higher yield = lower cost per chip." },
            { "term": "Die", definition: "An individual chip cut from a wafer before packaging." }
          ],
          "codeExample": "# Chip manufacturing process (simplified)\n\nprocess_steps = [\n    '1. Crystal Growth → Pure silicon ingot (Czochralski process)',\n    '2. Wafer Slicing → Thin discs (0.75mm thick, 300mm diameter)',\n    '3. Oxidation → Grow silicon dioxide insulating layer',\n    '4. Photolithography → Project circuit pattern using UV/EUV light',\n    '5. Etching → Remove exposed material (RIE or wet etch)',\n    '6. Ion Implantation → Dope silicon to create N/P regions',\n    '7. Deposition → Add thin films (CVD, PVD)',\n    '8. Metallization → Add copper interconnects',\n    '9. CMP → Chemical-mechanical planarization (flatten surfaces)',\n    '10. Repeat steps 4-9 for each metal layer (10-15 layers)',\n    '11. Wafer Testing → Probe each die for defects',\n    '12. Dicing → Cut wafer into individual dies',\n    '13. Packaging → Encapsulate die with connections',\n    '14. Final Test → Validate packaged chip'\n]\n\nfor step in process_steps:\n    print(step)\n\nprint(f'\\nTotal: ~500-1000 steps over 3-4 months')\nprint(f'ASML EUV machine cost: ~$350 million')",
          "relatedConcepts": ["What is a Semiconductor?", "Transistors", "Moore's Law"]
        }
      ]
    }
  ]
};

// Additional hands-on topics. The original semiconductor lessons remain above;
// these entries extend the section with packaging, yield, factory telemetry, and
// an end-to-end chips-manufacturing project.
SEMICONDUCTOR_DATA.categories.push(
  {
    name: 'Chip Manufacturing Operations',
    icon: '🏭',
    concepts: [
      {
        title: 'Yield, Defects, and Wafer Testing',
        slug: 'yield-defects-wafer-testing',
        tldr: 'Yield is the percentage of dies that pass testing. Engineers improve it by finding defect patterns early, not by simply making more wafers.',
        whyItMatters: [
          { num: '1', title: 'Lower Cost', text: 'A higher yield means more working chips come from the same wafer, lowering the cost of every good die.' },
          { num: '2', title: 'Faster Learning', text: 'Defect maps show which process step or tool needs attention before many more lots are affected.' },
          { num: '3', title: 'Reliable Products', text: 'Electrical and burn-in tests help prevent weak dies from reaching a customer device.' }
        ],
        howItWorks: 'A wafer is measured and electrically probed before dicing. Each die receives a pass or fail result, and the locations are placed on a wafer map. Engineers compare the map with tool history, recipe settings, and defect inspection images. A cluster of failures may point to a particle, a lithography focus problem, or a process drift.',
        pitfalls: [
          { text: 'Yield is not the same as performance; a passing die can still be binned into different speed or power grades.' },
          { text: 'A single average yield hides spatial patterns on the wafer.' },
          { text: 'Changing a recipe without a controlled experiment can make the root cause harder to find.' }
        ],
        keyTerms: [
          { term: 'Yield', definition: 'The fraction of dies that pass the required tests.' },
          { term: 'Wafer Map', definition: 'A spatial map showing pass, fail, and bin results for every die.' },
          { term: 'Bin', definition: 'A product grade assigned from speed, power, or functional test results.' },
          { term: 'Defect Density', definition: 'The number of defects per unit area.' }
        ],
        codeExample: 'from collections import Counter\n\n# A toy wafer map: P=pass, F=fail\nwafer_map = [\n    "PPPPPP",\n    "PPFPPP",\n    "PPFFPP",\n    "PPPPPP",\n]\ncounts = Counter(cell for row in wafer_map for cell in row)\nyield_rate = counts["P"] / sum(counts.values())\nprint(f"yield={yield_rate:.1%}, fails={counts[\"F\"]}")',
        relatedConcepts: ['Chip Fabrication', 'Wafer Testing', 'Factory Analytics']
      },
      {
        title: 'Advanced Packaging and Chiplets',
        slug: 'advanced-packaging-chiplets',
        tldr: 'Packaging connects a die to the outside world. Advanced packaging can place multiple chiplets and high-bandwidth memory close together.',
        whyItMatters: [
          { num: '1', title: 'More Compute', text: 'Multiple chiplets can share one package when building one very large die would be too expensive or yield poorly.' },
          { num: '2', title: 'Shorter Connections', text: 'Short package-level links reduce the distance data travels between compute and memory.' },
          { num: '3', title: 'Flexible Design', text: 'A company can combine compute, I/O, cache, and memory dies made on different process nodes.' }
        ],
        howItWorks: 'After wafer testing, dies are attached to a substrate or an interposer and connected with bumps, wires, or through-silicon vias. A chiplet package may contain several specialized dies. The package must manage signal integrity, heat, power delivery, and mechanical stress while providing a reliable path to the circuit board.',
        pitfalls: [
          { text: 'More dies create more interfaces and more places for assembly defects.' },
          { text: 'Thermal design is part of the package design, not an afterthought.' },
          { text: 'Chiplets need compatible protocols, power domains, clocks, and test strategies.' }
        ],
        keyTerms: [
          { term: 'Chiplet', definition: 'A small die designed to work with other dies inside one package.' },
          { term: 'Interposer', definition: 'A routing layer that connects dies with dense short links.' },
          { term: 'HBM', definition: 'High Bandwidth Memory stacked near a processor to move data quickly.' },
          { term: 'Thermal Design Power', definition: 'A practical heat-output target used when designing cooling and power delivery.' }
        ],
        codeExample: 'from dataclasses import dataclass\n\n@dataclass\nclass Chiplet:\n    name: str\n    watts: float\n    bandwidth_gbps: int\n\npackage = [\n    Chiplet("compute", 250, 900),\n    Chiplet("io", 35, 256),\n    Chiplet("hbm-controller", 40, 1200),\n]\nprint("package power:", sum(c.watts for c in package), "W")\nprint("internal links:", sum(c.bandwidth_gbps for c in package), "GB/s")',
        relatedConcepts: ['Chip Fabrication', 'AI Accelerators', 'Thermal Management']
      }
    ]
  },
  {
    name: 'Semiconductor Factory Intelligence',
    icon: '📡',
    concepts: [
      {
        title: 'Real-time Fab Monitoring',
        slug: 'realtime-fab-monitoring',
        tldr: 'A smart fab combines equipment sensors, lot tracking, and alarms to detect process drift while production is still running.',
        whyItMatters: [
          { num: '1', title: 'Catch Drift Early', text: 'A temperature, pressure, or vibration trend can be investigated before it becomes a lot-wide failure.' },
          { num: '2', title: 'Reduce Downtime', text: 'Equipment-health signals help teams schedule maintenance before an unplanned stop.' },
          { num: '3', title: 'Traceability', text: 'Every measurement can be linked to a lot, recipe, tool, operator, and process step.' }
        ],
        howItWorks: 'Sensors publish readings to an ingestion service. The service validates timestamps and units, stores the measurements, calculates rolling limits, and sends an alert when a signal crosses a rule. The production system should keep a durable event history so engineers can replay a period and investigate the cause.',
        pitfalls: [
          { text: 'A noisy sensor should not trigger repeated alarms; use hysteresis and cooldowns.' },
          { text: 'Clock differences make events appear out of order unless timestamps are normalized.' },
          { text: 'A dashboard is not a control system; safety and equipment interlocks remain authoritative.' }
        ],
        keyTerms: [
          { term: 'Lot', definition: 'A tracked group of wafers moving through the factory together.' },
          { term: 'Recipe', definition: 'The controlled set of process settings used by a tool.' },
          { term: 'SPC', definition: 'Statistical Process Control for detecting abnormal process variation.' },
          { term: 'Digital Twin', definition: 'A software representation of a physical process or asset.' }
        ],
        codeExample: 'from collections import deque\n\nwindow = deque(maxlen=5)\n\ndef ingest_sensor(lot_id: str, temperature_c: float):\n    window.append(temperature_c)\n    average = sum(window) / len(window)\n    alert = temperature_c > 82 or average > 78\n    return {"lot": lot_id, "temperature_c": temperature_c, "average_c": round(average, 2), "alert": alert}\n\nfor value in [74, 75, 77, 84, 85]:\n    print(ingest_sensor("LOT-1001", value))',
        relatedConcepts: ['Yield and Wafer Testing', 'Factory Analytics', 'Predictive Maintenance']
      },
      {
        title: 'End-to-End Chip Manufacturing Project',
        slug: 'chip-manufacturing-project',
        tldr: 'A useful learning project models a lot moving through fabrication, inspection, packaging, and final test while showing yield and alerts live.',
        whyItMatters: [
          { num: '1', title: 'Connect the Steps', text: 'The project makes the whole chain visible: process data influences inspection, yield, binning, and shipment.' },
          { num: '2', title: 'Practice Operations', text: 'You learn to handle late events, invalid readings, retries, and an operator review queue.' },
          { num: '3', title: 'Build a Portfolio', text: 'A simulator can demonstrate manufacturing, data engineering, observability, and applied AI in one project.' }
        ],
        howItWorks: 'Start with a deterministic simulator that emits one event per process step. Validate the event, store it, update the lot state, and calculate metrics. Add a simple defect classifier after the workflow works. In production, the same boundaries would connect to MES, equipment interfaces, inspection systems, and a time-series platform.',
        pitfalls: [
          { text: 'Do not use a random demo as evidence of real factory yield; label simulation assumptions clearly.' },
          { text: 'Do not let an AI classifier directly stop equipment without a validated control path and human ownership.' },
          { text: 'Keep raw measurements and derived metrics so a result can be audited.' }
        ],
        keyTerms: [
          { term: 'MES', definition: 'Manufacturing Execution System tracking work-in-progress and process history.' },
          { term: 'Inspection', definition: 'Visual or electrical checking for defects and performance.' },
          { term: 'Traceability', definition: 'The ability to connect an outcome back to its materials and process history.' },
          { term: 'OEE', definition: 'Overall Equipment Effectiveness: availability, performance, and quality together.' }
        ],
        codeExample: 'from dataclasses import dataclass, field\n\n@dataclass\nclass Lot: \n    lot_id: str\n    step: str = "fabrication"\n    alerts: list[str] = field(default_factory=list)\n\n    def advance(self, measurement: float):\n        if not 0 <= measurement <= 100:\n            self.alerts.append("invalid measurement")\n            return\n        self.step = {"fabrication": "inspection", "inspection": "packaging", "packaging": "final-test"}.get(self.step, "complete")\n\nlot = Lot("LOT-1001")\nfor reading in [72.0, 73.5, 74.2, 71.8]:\n    lot.advance(reading)\n    print(lot.lot_id, lot.step, lot.alerts)',
        relatedConcepts: ['Real-time Fab Monitoring', 'Yield and Wafer Testing', 'Advanced Packaging']
      }
    ]
  }
)

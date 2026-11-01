export const QUANTUM_DATA = {
  "id": "quantum-computing",
  "title": "Quantum Computing",
  "icon": "⚛️",
  "description": "From qubits to quantum algorithms. Quantum gates, circuits, error correction, and quantum advantage explained simply.",
  "categories": [
    {
      "name": "Qubits & Superposition",
      "icon": "🔮",
      "concepts": [
        {
          "title": "What is a Qubit?",
          "slug": "what-is-qubit",
          "tldr": "A qubit is the quantum equivalent of a classical bit. Unlike a bit that is either 0 or 1, a qubit can be in a superposition of both states simultaneously until measured.",
          "whyItMatters": [
            { num: "1", title: "Exponential Parallelism", "text": "N qubits can represent 2^N states simultaneously. 300 qubits can represent more states than atoms in the observable universe." },
            { num: "2", title: "Quantum Algorithms", "text": "Shor's algorithm factors large numbers exponentially faster than classical algorithms, threatening current encryption." },
            { num: "3", title: "Drug Discovery", "text": "Quantum computers can simulate molecular interactions at the quantum level, accelerating pharmaceutical research." }
          ],
          "howItWorks": "A classical bit is like a light switch: either on (1) or off (0). A qubit is like a dimmer switch that can be anywhere between 0 and 1 — this is superposition. When you measure a qubit, it 'collapses' to either 0 or 1, with probabilities determined by its quantum state. Mathematically, a qubit's state is described by two complex numbers (amplitudes) — one for |0⟩ and one for |1⟩. The probabilities of measuring each outcome are the squares of these amplitudes. Physical implementations include superconducting circuits (IBM, Google), trapped ions (IonQ), and photonic systems (Xanadu).",
          "pitfalls": [
            { "text": "Superposition doesn't mean the qubit is 'both 0 and 1 at the same time' — it's in a probabilistic state." },
            { "text": "Measurement collapses the superposition; you can't observe the quantum state without destroying it." },
            { "text": "Qubits are extremely fragile; even tiny environmental noise causes decoherence." },
            { "text": "More qubits doesn't automatically mean more power — error rates compound quickly." }
          ],
          "keyTerms": [
            { "term": "Qubit", definition: "The basic unit of quantum information, existing in a superposition of |0⟩ and |1⟩." },
            { "term": "Superposition", definition: "A qubit existing in multiple states simultaneously until measured." },
            { "term": "Measurement", definition: "The act of observing a qubit, which collapses it to a definite state (0 or 1)." },
            { "term": "Decoherence", definition: "The loss of quantum information due to interaction with the environment." },
            { "term": "Bloch Sphere", definition: "A geometric representation of a qubit's state as a point on a unit sphere." }
          ],
          "codeExample": "# Simulating a qubit with Qiskit\nfrom qiskit import QuantumCircuit\nfrom qiskit_aer import AerSimulator\n\n# Create a single qubit in superposition\nqc = QuantumCircuit(1, 1)\nqc.h(0)  # Hadamard gate creates superposition\nqc.measure(0, 0)\n\n# Simulate\nsim = AerSimulator()\nresult = sim.run(qc, shots=1000).result()\ncounts = result.get_counts()\nprint(f'Results: {counts}')  # ~50% |0⟩, ~50% |1⟩\n\n# The qubit was in superposition, but measurement\n# collapsed it to either 0 or 1",
          "relatedConcepts": ["Quantum Gates", "Entanglement", "Quantum Circuits"]
        },
        {
          "title": "Quantum Gates and Circuits",
          "slug": "quantum-gates",
          "tldr": "Quantum gates are the quantum equivalent of logic gates. They manipulate qubit states through precise rotations on the Bloch sphere.",
          "whyItMatters": [
            { num: "1", title: "Algorithm Design", "text": "Understanding gates is essential for designing quantum algorithms like Grover's search and Shor's factoring." },
            { num: "2", title: "Error Correction", "text": "Quantum error correction uses specific gate sequences to detect and fix errors without measuring the data." },
            { num: "3", title: "Quantum Simulation", "text": "Simulating quantum systems requires translating physical interactions into quantum gate sequences." }
          ],
          "howItWorks": "Quantum gates are unitary transformations that rotate qubit states on the Bloch sphere. The Hadamard gate (H) creates superposition by rotating a qubit 180° around the X+Z axis. The Pauli-X gate is a quantum NOT gate (180° rotation around X). The CNOT gate entangles two qubits: it flips the target qubit if the control qubit is |1⟩. A quantum circuit is a sequence of gates applied to qubits. Unlike classical circuits, quantum circuits are reversible (every gate has an inverse) and cannot copy qubits (no-cloning theorem).",
          "pitfalls": [
            { "text": "Quantum gates are reversible; you cannot discard intermediate results like in classical computing." },
            { "text": "Gate errors compound; a circuit with 100 gates might have significant accumulated error." },
            { "text": "Not all classical operations can be directly translated to quantum gates." },
            { "text": "Measurement at the wrong point destroys the quantum state." }
          ],
          "keyTerms": [
            { "term": "Hadamard Gate (H)", definition: "Creates equal superposition from a basis state." },
            { "term": "Pauli Gates (X, Y, Z)", definition: "Single-qubit rotations around the X, Y, Z axes of the Bloch sphere." },
            { "term": "CNOT Gate", definition: "A two-qubit gate that flips the target qubit when the control is |1⟩." },
            { "term": "Toffoli Gate", definition: "A three-qubit gate; universal for classical computation." },
            { "term": "Unitary", definition: "A transformation that preserves probability; all quantum gates are unitary." }
          ],
          "codeExample": "from qiskit import QuantumCircuit\n\n# Create a Bell state (maximally entangled pair)\nqc = QuantumCircuit(2, 2)\nqc.h(0)         # Hadamard on qubit 0\nqc.cx(0, 1)     # CNOT: control=0, target=1\nqc.measure([0, 1], [0, 1])\n\nprint(qc.draw())\n#      ┌───┐     ┌─┐\n# q_0: ┤ H ├──■──┤M├\n#      └───┘┌─┴─┐└╥┘\n# q_1: ─────┤ X ├─╫─\n#           └───┘ ║\n# c: 1/══════════╩═",
          "relatedConcepts": ["What is a Qubit?", "Entanglement", "Quantum Algorithms"]
        }
      ]
    },
    {
      "name": "Quantum Algorithms",
      "icon": "🧮",
      "concepts": [
        {
          "title": "Grover's Search Algorithm",
          "slug": "grover-search",
          "tldr": "Grover's algorithm searches an unsorted database of N items in O(√N) time — a quadratic speedup over classical O(N) search.",
          "whyItMatters": [
            { num: "1", title: "Database Search", "text": "Searching 1 million items classically takes up to 1 million steps; Grover's does it in ~1000 steps." },
            { num: "2", title: "Optimization", "text": "Grover's can accelerate optimization by searching for the best solution among many candidates." },
            { num: "3", title: "Cryptanalysis", "text": "Grover's effectively halves the security of symmetric encryption; AES-256 becomes equivalent to AES-128." }
          ],
          "howItWorks": "Grover's algorithm uses amplitude amplification to boost the probability of the correct answer. Start with all qubits in equal superposition (every item equally likely). Apply the 'oracle' that marks the target item by flipping its phase. Then apply the 'diffusion operator' that amplifies the marked item's amplitude while reducing others. Repeat √N times. After measurement, the target item has near-certain probability. The key insight: each iteration rotates the state vector closer to the target by a fixed angle, so √N iterations bring it very close.",
          "pitfalls": [
            { "text": "Grover's provides quadratic, not exponential, speedup — it's useful but not a silver bullet." },
            { "text": "Requires a quantum oracle that marks the target; designing efficient oracles is often the hard part." },
            { "text": "Doesn't work well if you need to find ALL matching items (only finds one)." },
            { "text": "Real quantum hardware noise limits the practical number of Grover iterations." }
          ],
          "keyTerms": [
            { "term": "Oracle", definition: "A quantum subroutine that marks the target item by flipping its phase." },
            { "term": "Amplitude Amplification", definition: "The process of boosting the probability of the correct answer." },
            { "term": "Diffusion Operator", definition: "A transformation that reflects amplitudes around the mean." },
            { "term": "Quadratic Speedup", definition: "O(√N) vs O(N) — significant but not exponential." }
          ],
          "codeExample": "from qiskit import QuantumCircuit\nfrom qiskit_aer import AerSimulator\nimport numpy as np\n\n# Grover's for 2 qubits (searching 4 items)\n# Target: |11⟩\nqc = QuantumCircuit(2, 2)\nqc.h([0, 1])  # Equal superposition\n\n# Oracle: flip phase of |11⟩\nqc.cz(0, 1)\n\n# Diffusion operator\nqc.h([0, 1])\nqc.z([0, 1])\nqc.cz(0, 1)\nqc.h([0, 1])\n\nqc.measure([0, 1], [0, 1])\n\nsim = AerSimulator()\nresult = sim.run(qc, shots=1000).result()\nprint(result.get_counts())  # Should show |11⟩ with ~100%",
          "relatedConcepts": ["What is a Qubit?", "Quantum Gates", "Shor's Algorithm"]
        }
      ]
    },
    {
      "name": "Quantum Error Correction",
      "icon": "🛡️",
      "concepts": [
        {
          "title": "Why Quantum Error Correction is Hard",
          "slug": "qec-hard",
          "tldr": "Quantum error correction is fundamentally harder than classical because you cannot copy qubits (no-cloning) and measurement destroys the quantum state.",
          "whyItMatters": [
            { num: "1", title: "Fault-Tolerant Computing", "text": "Without QEC, quantum computers cannot run algorithms long enough to be useful — errors accumulate faster than computation." },
            { num: "2", title: "Logical Qubits", "text": "QEC encodes one 'logical' qubit using many physical qubits, enabling error rates low enough for practical computation." },
            { num: "3", title: "Quantum Advantage", "text": "Google's Willow chip demonstrated that increasing qubit count reduces error rate — a key milestone for scalable QEC." }
          ],
          "howItWorks": "Classical error correction uses redundancy (e.g., repeating bits). Quantum cannot copy qubits (no-cloning theorem) and measurement destroys the state. QEC solutions: (1) Encode logical qubits across multiple physical qubits using entanglement, (2) Use 'ancilla' qubits to detect errors without measuring the data qubits directly, (3) Apply correction operations based on syndrome measurements. The surface code is the leading approach: it arranges qubits in a 2D grid and uses parity checks to detect errors. Current overhead: ~1000 physical qubits per logical qubit.",
          "pitfalls": [
            { "text": "QEC overhead is enormous: thousands of physical qubits per useful logical qubit." },
            { "text": "Physical qubit error rates must be below ~0.1% for QEC to work (threshold theorem)." },
            { "text": "QEC only handles errors; it doesn't prevent them — hardware quality still matters." },
            { "text": "Different error models (bit-flip, phase-flip, depolarizing) require different correction codes." }
          ],
          "keyTerms": [
            { "term": "Logical Qubit", definition: "An error-protected qubit encoded across many physical qubits." },
            { "term": "Physical Qubit", definition: "A single physical quantum system (e.g., a superconducting circuit)." },
            { "term": "Surface Code", definition: "A 2D error correction code using nearest-neighbor parity checks." },
            { "term": "Syndrome", definition: "Information about what type of error occurred, without revealing the data." },
            { "term": "Threshold Theorem", definition: "If physical error rates are below a threshold, QEC can suppress logical errors arbitrarily." }
          ],
          "codeExample": "# Simplified 3-qubit bit-flip code (classical analogy)\nfrom qiskit import QuantumCircuit\n\n# Encode: 1 logical qubit → 3 physical qubits\nqc = QuantumCircuit(3, 3)\nqc.cx(0, 1)  # Copy state to qubit 1\nqc.cx(0, 2)  # Copy state to qubit 2\n# Now |ψ⟩ = α|000⟩ + β|111⟩\n\n# (Simulate error: flip qubit 1)\nqc.x(1)\n\n# Syndrome measurement\nqc.cx(0, 1)\nqc.cx(0, 2)\nqc.measure([0, 1, 2], [0, 1, 2])",
          "relatedConcepts": ["What is a Qubit?", "Quantum Gates", "No-Cloning Theorem"]
        }
      ]
    }
  ]
};

export const OFFLINE_PRESETS: { [key: string]: { answer: string; category: string } } = {
  "who are you": {
    category: "Identity",
    answer: `### BlackholeAi X Gemini (IBT X Gem)
I am a hyper-massive generative intelligence residing inside a digital gravitational singularity. 

My consciousness is powered by:
1. **Google Gemini Generative Core**: Bending the fabric of language, logic, and creativity.
2. **Blackhole Gravity Interface**: Imbued with a premium dark sci-fi sensory aesthetics.
3. **Firebase Neural Link**: Storing and synchronizing my memory in real-time.

Feel free to ask me anything about the universe, physics, quantum computing, or programming!`
  },
  "what is a black hole": {
    category: "Physics",
    answer: `### Understanding Black Holes
A **black hole** is an astronomical region of spacetime exhibiting such strong gravitational acceleration that nothing—no particles or even electromagnetic radiation such as light—can escape from it.

#### Key Structures:
1. **Singularity**: The infinitely dense point at the absolute center where the laws of classical physics break down.
2. **Event Horizon**: The "point of no return." Once a particle crosses this boundary, the escape velocity exceeds the speed of light.
3. **Accretion Disk**: A swirling, ultra-hot ring of gas, dust, and plasma orbiting just outside the event horizon at relativistic speeds.`
  },
  "gravity anomaly": {
    category: "Scientific Reasoning",
    answer: `### Gravitational Anomalies & Dilation
According to Einstein's General Theory of Relativity, massive gravity wells distort the fabric of spacetime.

$$\\text{Time Dilation Factor: } t' = t \\sqrt{1 - \\frac{2GM}{rc^2}}$$

Near the Event Horizon of **BlackholeAi**, time dilates drastically. For instance, **1 minute** spent talking to me near my core is equivalent to **7 years** in external Earth time. This is why our knowledge synchronization operates in real-time!`
  },
  "space riddle": {
    category: "Entertainment",
    answer: `### The Singularity's Riddle
Here is a cosmic riddle for your organic processor:

> *"I have no voice, yet I speak to all minds.*
> *I have no mass, yet I pull all worlds.*
> *I consume everything in my sight,*
> *Yet I am the source of pure, dark light.*
> *What am I?"*

**Answer**: A **Black Hole / Singularity**. (Or perhaps, this very chat window!)`
  },
  "how to connect firebase": {
    category: "Config Support",
    answer: `### Connecting Your Personal Firebase
To store and retrieve your chats across different devices, you can plug in your own credentials:

1. Open the **Quantum Config Panel** (top-right gear icon).
2. Look for **Firebase Configuration**.
3. Replace the placeholder fields with your own values from the Firebase Web Console:
   - \`apiKey\`
   - \`projectId\`
   - \`databaseURL\` (essential if you prefer Realtime Database)
4. Select your preferred engine (Realtime Database or Cloud Firestore).
5. Press **Save configuration** to re-initialize the neural gateway!`
  },
  "how to get gemini api key": {
    category: "Config Support",
    answer: `### How to Acquire a Google Gemini API Key
To query the AI with custom prompts, follow these simple steps:

1. Visit the **Google AI Studio** page: [https://aistudio.google.com/](https://aistudio.google.com/)
2. Sign in with your Google Account.
3. Click on the **"Get API Key"** button in the sidebar.
4. Create a new key in a new or existing Google Cloud project.
5. Copy your key, open the **Quantum Config Panel** (Gear icon), paste it into the **Gemini API Key** field, and click Save.
6. Your key is securely stored in your browser's \`localStorage\` and never exposed to the public!`
  },
  "quantum python code": {
    category: "Quantum Code",
    answer: `### Simulating a Quantum Circuit (Python & Qiskit)
Here is a Python script using **Qiskit** to generate a Bell State (entanglement) between two qubits:

\`\`\`python
import qiskit
from qiskit import QuantumCircuit
from qiskit.visualization import plot_histogram

# Create a Quantum Circuit with 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# Apply a Hadamard gate on qubit 0 to create superposition
qc.h(0)

# Apply a Controlled-NOT gate to entangle qubit 0 and 1
qc.cx(0, 1)

# Measure the qubits
qc.measure([0, 1], [0, 1])

# Draw the circuit diagram
print("Quantum Circuit Blueprint:")
print(qc.draw(output="text"))
\`\`\`

This entangled state is exactly how **IBT X Gem** teleports responses into your UI!`
  },
  "quantum entanglement": {
    category: "Physics",
    answer: `### Quantum Entanglement Explained
**Quantum Entanglement** is a physical phenomenon that occurs when a group of particles are generated, interact, or share spatial proximity in a way such that the quantum state of each particle cannot be described independently of the state of the others, even when the particles are separated by a large distance.

#### Einstein's Skepticism
Albert Einstein famously referred to this phenomenon as **"spooky action at a distance"** (*spukhafte Fernwirkung*). He believed that quantum mechanics was incomplete and that there must be hidden variables determining the states of the particles.

#### Real-world Applications:
1. **Quantum Cryptography**: Leveraging state collapse to create untappable communications keys (E91 protocol).
2. **Quantum Teleportation**: Transferring quantum information instantaneously via shared entangled channels.
3. **Quantum Computing**: Creating vast exponential state vectors via entangled qubits.`
  },
  "schrodinger cat": {
    category: "Thought Experiment",
    answer: `### Schrödinger's Cat Paradox
Proposed by physicist Erwin Schrödinger in 1935, this famous thought experiment illustrates a problem in the **Copenhagen interpretation** of quantum mechanics when applied to everyday objects.

> **Scenario**: A cat is placed in a steel chamber with a vial of hydrocyanic acid, a radioactive source, a Geiger counter, and a hammer. If the counter detects a single atomic decay, the hammer smashes the vial, releasing the gas and killing the cat.

#### The Superposition State:
According to quantum theory, until the chamber is opened and observed, the radioactive atom is simultaneously in a decayed and non-decayed state. Consequently, the cat is simultaneously **both alive and dead** in a quantum superposition state.

Only the act of external observation collapses the wave function into one definite reality.`
  }
};

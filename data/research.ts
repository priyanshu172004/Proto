export type ResearchMotif = "topology" | "contours" | "stroke" | "spectrum" | "federated";

export type ResearchProject = {
  id: string;
  /** Short codename, set in Doto on the card. */
  title: string;
  /** The descriptive name, sitting under the codename. */
  subtitle: string;
  domain: string;
  problem: string;
  approach: string;
  application: string;
  motif: ResearchMotif;
};

export const research: ResearchProject[] = [
  {
    id: "iot-vector-attacks",
    title: "IOT_VECTOR ATTACKS",
    subtitle: "Low-Factorization IoT Vector Attacks",
    domain: "Security · IoT",
    motif: "topology",
    problem:
      "Traditional network defence models struggle to predict multi-hop lateral movement inside heterogeneous IoT environments, and resource-constrained edge devices lack the memory or compute capacity to run standard security agents.",
    approach:
      "Matrix factorisation and dimensionality-reduction strategies represent large, complex network graphs in a low-factorised dense format. Framing topology this way lets optimisation algorithms — graph-based shortest-path solvers, reinforcement learning agents — identify vulnerabilities and model efficient multi-device attack trajectories without overwhelming compute constraints.",
    application:
      "Automating penetration testing inside enterprise smart offices, industrial manufacturing lines, and connected utility grids to strengthen perimeter defences.",
  },
  {
    id: "computer-vision-tce",
    title: "COMPUTER VISION_TCE",
    subtitle: "Texture-Contrast Extraction for Biometric Liveness",
    domain: "Biometrics · Vision",
    motif: "contours",
    problem:
      "Standard biometric systems are prone to spoofing — a static photo or video playback held up to a camera — and suffer elevated false acceptance rates under varied lighting or poor camera conditions.",
    approach:
      "TCE points to specialised feature pipelines: Texture-Contrast Extraction and temporal-spatial consistency processing. Rather than matching two flat face shapes, the pipeline isolates microscopic surface textures, micro-expressions, and active presentation patterns, feeding deep convolutional backbones to maximise biometric entropy and classify biological traits robustly.",
    application:
      "High-security facility access control, banking vaults, and touchless corporate authentication where tolerance for false access is near zero.",
  },
  {
    id: "myct",
    title: "MYCT",
    subtitle: "Signature Forgery Detection",
    domain: "Document Forensics",
    motif: "stroke",
    problem:
      "Expert forgers replicate the static shape of a signature well enough that standard shape-matching software cannot detect fraud on legal or financial documentation.",
    approach:
      "An offline signature verification engine built on deep networks — Siamese architectures and Vision Transformers — that looks past macro geometry to micro-structural stroke dynamics, pixel-level pressure gradients approximated through grey-level analysis, angle variance, and fine-grained spatial fluctuation.",
    application:
      "Automated fraud prevention inside commercial banks, insurance claim verification, and digital legal notary pipelines.",
  },
  {
    id: "deepfake-ml-analysis",
    title: "DEEPFAKE ML ANALYSIS",
    subtitle: "DeepFake Detection Model",
    domain: "Media Forensics",
    motif: "spectrum",
    problem:
      "Generative tools produce hyper-realistic synthetic media that reliably fools human observers, threatening the integrity of digital evidence and accelerating misinformation.",
    approach:
      "Synthetic faces look clean to the eye but leave structural artefacts. The forensic architecture tracks cross-frame temporal inconsistency, irregular biological rhythms — out-of-sync blinking, unnatural blood-flow reflections on skin — and high-frequency discrepancies in the Fourier domain.",
    application:
      "Content moderation for large social networks, media authentication for journalistic institutions, and forensic verification for legal enforcement.",
  },
  {
    id: "fedtwin",
    title: "FEDTWIN",
    subtitle: "FedTwin ITS · Federated Digital Twins",
    domain: "Federated Learning · Digital Twins",
    motif: "federated",
    problem:
      "City-wide traffic AI needs continuous streaming data from competing private entities — rival delivery fleets, public transit, private vehicles — but merging that tracking data onto one master server raises serious privacy and data-leak exposure.",
    approach:
      "The system bridges digital twins, a real-time virtual mapping of the physical city, with federated learning. Instead of uploading raw telemetry or GPS logs to a cloud hub, each traffic entity computes model updates on its own local data silo and sends only encrypted parameters to a global coordinator, keeping real-world telemetry entirely local.",
    application:
      "Cross-jurisdiction traffic flow optimisation, autonomous fleet routing across municipal grids, and emergency vehicle dispatch planning.",
  },
];

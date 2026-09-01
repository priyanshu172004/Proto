export type ProjectVisual =
  | "vision"
  | "agents"
  | "resume"
  | "documents"
  | "transfer"
  | "analytics"
  | "churn"
  | "terminal";

export type Project = {
  id: string;
  title: string;
  category: string;
  /** One line for the card face. */
  tagline: string;
  /** Full copy for the detail dialog. */
  description: string;
  features: string[];
  stack: string[];
  github?: string;
  status?: "in-progress";
  visual: ProjectVisual;
  /** Bento footprint on the 4-column desktop grid. */
  span: "1x1" | "2x1" | "2x2";
};

export const projects: Project[] = [
  {
    id: "sentinal-vision",
    title: "SENTINAL_VISION",
    category: "Computer Vision · Security",
    tagline: "Turns raw camera streams into structured situational awareness.",
    description:
      "An intelligent visual monitoring system that converts raw camera streams into structured situational awareness. Rather than requiring continuous human observation, it performs real-time detection and tracking, scores deviations from learned normal activity, and escalates only genuine events — reducing operator load while improving response time to actual threats.",
    features: [
      "Real-time multi-object detection and tracking",
      "Anomaly scoring against baseline activity",
      "Event-driven alerting with frame-level evidence capture",
      "Modular detector backbone for swappable models",
    ],
    stack: ["Python", "OpenCV", "PyTorch", "YOLO", "NumPy"],
    github: "https://github.com/priyanshu172004/SENTINAL_AI",
    visual: "vision",
    span: "2x2",
  },
  {
    id: "cthroughai",
    title: "CTHROUGHAI",
    category: "Multi-Agent Systems · RAG",
    tagline: "Five specialist agents, one decision-grade brief.",
    description:
      "A multi-agent document assessment and research platform that decomposes complex source material into specialist analyses. Five coordinated agents — Finance, Market, Risk, News, and Workflow & Implementation — evaluate a corpus in parallel, and an orchestration layer synthesises their outputs into a single decision-grade brief. An integrated agentic RAG chat layer allows the underlying documents to be interrogated conversationally, with responses grounded in retrieved passages.",
    features: [
      "Five domain-specialised agents with an orchestration layer",
      "Agentic RAG retrieval with citation grounding",
      "Cross-agent synthesis into a unified assessment",
      "Conversational follow-up over the ingested corpus",
    ],
    stack: ["Python", "LangChain", "LangGraph", "Vector DB", "FastAPI", "LLM APIs"],
    github: "https://github.com/priyanshu172004/CThroughAI",
    visual: "agents",
    span: "2x2",
  },
  {
    id: "docx-ai",
    title: "DOCX.AI",
    category: "Document Intelligence · SaaS",
    tagline: "Document review compressed from hours into minutes.",
    description:
      "A document intelligence SaaS for teams operating on high volumes of PDFs and long-form text. It handles ingestion, hierarchical summarisation, and retrieval-backed question answering, compressing document review from hours into minutes while keeping every answer traceable to its source passage.",
    features: [
      "Multi-format ingestion pipeline",
      "Hierarchical summarisation",
      "Semantic search across a workspace",
      "Citation-linked answers",
      "Document and workspace management",
    ],
    stack: ["Next.js", "Python", "Vector DB", "LLM APIs", "MongoDB"],
    github: "https://github.com/priyanshu172004/Docx.AI",
    visual: "documents",
    span: "2x1",
  },
  {
    id: "resume-io",
    title: "RESUME.IO",
    category: "Applied AI · Product",
    tagline: "Career history in, ATS-ready document out.",
    description:
      "An AI-assisted resume builder that transforms unstructured career history into role-targeted, ATS-compatible documents. The system generates and refines section content against a supplied job description, enforces typographic and structural consistency, and surfaces alignment gaps before the document is exported.",
    features: [
      "AI content generation and rewriting",
      "Job-description keyword alignment",
      "ATS-safe templating",
      "Live preview with export",
    ],
    stack: ["React", "Node.js", "Express", "LLM APIs", "MongoDB"],
    github: "https://github.com/priyanshu172004/Resume.io",
    visual: "resume",
    span: "1x1",
  },
  {
    id: "swiftsend",
    title: "SWIFTSEND",
    category: "Platform Engineering",
    tagline: "Fast, resumable, permissioned file transfer.",
    description:
      "A file management and sharing platform engineered for fast, reliable, permissioned transfer. Large uploads are chunked and resumable, links carry configurable expiry and access rules, and stored assets remain organised and retrievable rather than scattered across ad-hoc shares.",
    features: [
      "Chunked, resumable uploads",
      "Expiring links with access control",
      "Real-time transfer progress",
      "Structured storage and shareable spaces",
    ],
    stack: ["Node.js", "Express", "Socket.io", "Redis", "BullMQ", "MongoDB"],
    github: "https://github.com/priyanshu172004/SwiftSend",
    visual: "transfer",
    span: "1x1",
  },
  {
    id: "resx",
    title: "RESX",
    category: "Data Analysis · AI-Native Systems",
    tagline: "An analyst, not a dashboard.",
    description:
      "A personalised, AI-native analysis system designed to behave like an analyst rather than a dashboard. It ingests a dataset, profiles its structure automatically, and returns a complete narrative account — distributions, relationships, anomalies, and recommended next steps — in natural language, supported by generated visualisations.",
    features: [],
    stack: ["Python", "Pandas", "LLM APIs"],
    status: "in-progress",
    visual: "analytics",
    span: "2x1",
  },
  {
    id: "crmised-io",
    title: "CRMISED.IO",
    category: "Predictive Analytics · CRM",
    tagline: "Retention predicted before revenue is lost.",
    description:
      "A customer relationship platform with predictive retention built into the core workflow. A churn-prediction model scores every account continuously and surfaces at-risk relationships together with their contributing factors, allowing commercial teams to intervene before revenue is lost rather than diagnosing it afterwards.",
    features: [
      "Continuous churn scoring",
      "Feature-attribution explanations for each prediction",
      "Pipeline and contact management",
      "Segment-level analytics",
    ],
    stack: ["Python", "XGBoost", "Pandas", "Scikit-learn", "React"],
    status: "in-progress",
    visual: "churn",
    span: "1x1",
  },
  {
    id: "tresscure",
    title: "TRESSCURE",
    category: "Java · CLI Systems",
    tagline: "A rule-based regimen engine in the terminal.",
    description:
      "A Java command-line application for structured hair-health management. It captures user profile and condition inputs, applies a rule-based assessment engine, and generates a personalised care regimen with longitudinal tracking of adherence and change over time.",
    features: [
      "Rule-based assessment engine",
      "Personalised regimen generation",
      "Progress tracking across sessions",
      "Persistent local records",
      "Clean object-oriented domain model",
    ],
    stack: ["Java", "OOP", "File I/O"],
    github: "https://github.com/priyanshu172004/TRESSCURE-APP",
    visual: "terminal",
    span: "1x1",
  },
];

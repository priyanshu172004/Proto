export type StackDomain = "languages" | "frontend" | "backend" | "data" | "infra";

export type Tech = {
  id: string;
  label: string;
  /** A technology can belong to several domains — that is what makes chips travel. */
  domains: StackDomain[];
};

export const domains: { id: StackDomain; label: string }[] = [
  { id: "languages", label: "Languages" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "data", label: "Data & ML" },
  { id: "infra", label: "Infra & Tools" },
];

export const stack: Tech[] = [
  { id: "java", label: "Java", domains: ["languages", "backend"] },
  { id: "javascript", label: "JavaScript", domains: ["languages", "frontend", "backend"] },
  { id: "python", label: "Python", domains: ["languages", "data", "backend"] },
  { id: "sql", label: "SQL", domains: ["languages", "data"] },

  { id: "react", label: "React", domains: ["frontend"] },
  { id: "nextjs", label: "Next.js", domains: ["frontend"] },
  { id: "html5", label: "HTML5", domains: ["frontend"] },
  { id: "css", label: "CSS", domains: ["frontend"] },
  { id: "tailwind", label: "Tailwind CSS", domains: ["frontend"] },

  { id: "nodejs", label: "Node.js", domains: ["backend"] },
  { id: "express", label: "Express", domains: ["backend"] },
  { id: "django", label: "Django", domains: ["backend"] },
  { id: "flask", label: "Flask", domains: ["backend"] },
  { id: "springboot", label: "Spring Boot", domains: ["backend"] },
  { id: "fastapi", label: "FastAPI", domains: ["backend", "data"] },
  { id: "hibernate", label: "Hibernate", domains: ["backend"] },
  { id: "socketio", label: "Socket.io", domains: ["backend", "infra"] },
  { id: "bullmq", label: "BullMQ", domains: ["backend", "infra"] },

  { id: "mysql", label: "MySQL", domains: ["data", "backend"] },
  { id: "mongodb", label: "MongoDB", domains: ["data", "backend"] },
  { id: "redis", label: "Redis", domains: ["data", "infra"] },
  { id: "firebase", label: "Firebase", domains: ["data", "infra"] },

  { id: "pytorch", label: "PyTorch", domains: ["data"] },
  { id: "tensorflow", label: "TensorFlow", domains: ["data"] },
  { id: "keras", label: "Keras", domains: ["data"] },
  { id: "sklearn", label: "Scikit-learn", domains: ["data"] },
  { id: "xgboost", label: "XGBoost", domains: ["data"] },
  { id: "opencv", label: "OpenCV", domains: ["data"] },
  { id: "transformers", label: "Hugging Face Transformers", domains: ["data"] },
  { id: "langchain", label: "LangChain", domains: ["data"] },
  { id: "langgraph", label: "LangGraph", domains: ["data"] },
  { id: "nltk", label: "NLTK", domains: ["data"] },
  { id: "spacy", label: "spaCy", domains: ["data"] },
  { id: "numpy", label: "NumPy", domains: ["data"] },
  { id: "pandas", label: "Pandas", domains: ["data"] },
  { id: "seaborn", label: "Seaborn", domains: ["data"] },
  { id: "matplotlib", label: "Matplotlib", domains: ["data"] },
  { id: "scipy", label: "SciPy", domains: ["data"] },

  { id: "nginx", label: "Nginx", domains: ["infra"] },
  { id: "git", label: "Git", domains: ["infra"] },
  { id: "github", label: "GitHub", domains: ["infra"] },
  { id: "docker", label: "Docker", domains: ["infra"] },
  { id: "postman", label: "Postman", domains: ["infra"] },
  { id: "linux", label: "Linux", domains: ["infra"] },
  { id: "maven", label: "Maven", domains: ["infra"] },
];

/** Capabilities rather than tools — rendered as a distinct chip variant. */
export const concepts: string[] = [
  "Deep Learning",
  "Neural Networks",
  "Transformers",
  "NLP",
  "Computer Vision",
  "RAG",
  "Multi-Agent Systems",
  "Model Fine-Tuning",
  "Feature Engineering",
  "Time-Series Analysis",
  "Federated Learning",
];

/** All technologies in a domain, in declaration order. */
export function byDomain(domain: StackDomain) {
  return stack.filter((t) => t.domains.includes(domain));
}

/** Breadth per domain — a count of real entries, never a proficiency score. */
export function domainBreadth() {
  return domains.map((d) => ({
    domain: d.label,
    count: stack.filter((t) => t.domains.includes(d.id)).length,
  }));
}

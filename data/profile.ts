export type Education = {
  stage: string;
  institution: string;
  location: string;
};

export type Book = {
  title: string;
  author: string;
};

export const profile = {
  name: "Priyanshu Srivastava",
  shortName: "Priyanshu",
  initials: "PS",
  roles: ["Developer", "Software Engineer", "Fullstack", "AI & ML"],
  location: "Okhla, New Delhi, IN · 110020",
  timezone: "Asia/Kolkata",

  tagline:
    "I engineer AI-native systems from the ground up — combining intelligent models, software architecture, and automation to build products that are not just powered by AI, but fundamentally designed around it.",

  summary:
    "Computer Science Engineer working at the intersection of machine learning research and production software. Currently building AI/ML systems as an R&D intern at ARI Simulations, with prior work spanning multi-agent document intelligence, computer-vision monitoring, and full-stack product engineering. Most interested in the layer where models stop being demos and start being infrastructure.",

  disciplines: ["AI/ML", "Software Engineering", "AI-Native Systems"],

  knowsAbout: [
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "Natural Language Processing",
    "Multi-Agent Systems",
    "Retrieval-Augmented Generation",
    "Full Stack Development",
  ],

  education: [
    {
      stage: "Class X",
      institution: "Birla Vidya Mandir",
      location: "Nainital, Uttarakhand",
    },
    {
      stage: "Class XII",
      institution: "Amity International School",
      location: "Lucknow, Uttar Pradesh",
    },
    {
      stage: "B.E. Computer Science & Engineering",
      institution: "Chitkara University",
      location: "Rajpura, Punjab, India",
    },
  ] satisfies Education[],

  interests: [
    { label: "Football", icon: "football" as const },
    { label: "Reading", icon: "reading" as const },
  ],

  recentReads: [
    { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson" },
    { title: "Surrounded by Psychopaths", author: "Thomas Erikson" },
    { title: "The Psychology of Money", author: "Morgan Housel" },
    { title: "Think and Grow Rich", author: "Napoleon Hill" },
    { title: "Atomic Habits", author: "James Clear" },
  ] satisfies Book[],
} as const;

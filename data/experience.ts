export type Role = {
  id: string;
  role: string;
  organisation: string;
  start: string;
  end: string;
  current?: boolean;
  /** Kept to one factual line each — nothing inferred about responsibilities. */
  note?: string;
};

export const experience: Role[] = [
  {
    id: "ari-simulations",
    role: "AI & ML Research and Development Intern",
    organisation: "ARI Simulations",
    start: "May 2025",
    end: "Present",
    current: true,
  },
  {
    id: "acm-chitkara",
    role: "Tech Lead",
    organisation: "ACM Student Chapter, Chitkara University",
    start: "Jul 2025",
    end: "Dec 2025",
    note: "Former",
  },
  {
    id: "fixyourhr",
    role: "Full Stack Developer",
    organisation: "FixYourHR.com",
    start: "Apr 2025",
    end: "Jun 2025",
    note: "Freelance",
  },
];

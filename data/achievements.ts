export type OpenSource = {
  id: string;
  program: string;
  year: string;
};

export type Hackathon = {
  id: string;
  event: string;
  organisation?: string;
  location?: string;
  year: string;
  result: string;
  /** The strongest result carries the single accent in this section. */
  highlight?: boolean;
};

export const openSource: OpenSource[] = [
  { id: "gssoc", program: "GirlScript Summer of Code", year: "2025" },
  { id: "oscindia", program: "Open Source Connect India", year: "'25" },
  { id: "hacktoberfest", program: "Hacktoberfest", year: "'25" },
];

export const hackathons: Hackathon[] = [
  {
    id: "ai-hiring-show",
    event: "The AI Hiring Show",
    organisation: "Rabbit AI",
    year: "'25",
    result: "First Runner-Up",
    highlight: true,
  },
  {
    id: "hackrx",
    event: "HackRx",
    organisation: "Bajaj Finserv",
    year: "'25",
    result: "Rank 194 · All India",
  },
  {
    id: "hackthemountains",
    event: "HackTheMountains",
    location: "Rajkot, Gujarat",
    year: "'24",
    result: "Finalist",
  },
  {
    id: "hackfest",
    event: "HackFest",
    organisation: "SAP",
    location: "PSG iTech, Coimbatore",
    year: "'24",
    result: "Top 10 Finalist",
  },
  {
    id: "sih",
    event: "Smart India Hackathon",
    location: "Freelance Platform domain",
    year: "'24",
    result: "Regional Qualifier",
  },
];

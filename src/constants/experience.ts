import { IExperience } from "../interfaces/components";
import playarka from "../assets/playarka-logo.svg";
import aerchain from "../assets/aerchain.png";
import freelance from "../assets/freelance.webp";

export const Experience: IExperience[] = [
  {
    company: "Playarka",
    logo: playarka,
    role: "Software Engineer",
    duration: "July 2026 – Present",
    description: [
      "Developing drone precision landing algorithms for autonomous docking systems utilizing OpenCV and specialized drone SDKs.",
      "Engineered low-level firmware for high-precision autonomous battery swapping mechanisms.",
      "Currently spearheading firmware development and integration for an automated duckpin bowling system.",
    ],
  },
  {
    company: "Playarka",
    logo: playarka,
    role: "Software Engineer Intern",
    duration: "Feb 2026 – June 2026",
    description: [
      "Curated datasets and trained a high-performance Machine Learning model for automated chick counting, achieving an impressive 96-98% accuracy.",
      "Contributed to full-stack web development by designing and building scalable frontend and backend architectures.",
    ],
  },
  {
    company: "Aerchain",
    logo: aerchain,
    role: "Software Engineer Intern",
    duration: "Aug 2024 – March 2025",
    location: "Bengaluru, Karnataka",
    description: [
      "Designed and implemented secure, scalable REST APIs using Node.js, Express, and PostgreSQL, with JWT authentication, RBAC, and hardened input validation.",
      "Transitioned to core backend development, designing and implementing scalable new features to enhance the overall platform architecture.",
      "Optimized and debugged code by finding bottlenecks, fixing logical bugs, and improving response times, ensuring stable performance and a smooth user experience.",
      "Engineered robust internal tools using Appsmith for the customer support team, streamlining operational workflows and significantly reducing issue resolution times.",
      "Collaborated with the hotfix team to rapidly resolve and deploy high-priority bug fixes for enterprise clients, ensuring optimal system reliability.",
    ],
  },
  {
    company: "Freelance",
    logo: freelance,
    role: "Software Engineer",
    duration: "Jan 2024 – July 2024",
    location: "Bhopal, M.P.",
    description: [
      "Delivered multiple freelance projects end-to-end, collaborating with clients to ship reliable, production-ready solutions on time.",
      "Built and improved backend systems for client applications, handling APIs, databases, and integrations while focusing on clean, maintainable code and performance.",
      "Projects included a subscription-management platform for a spiritual magazine, screens for a travel booking app, and a business website with hotel booking and order management.",
    ],
  },
];

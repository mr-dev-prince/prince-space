import { IProject } from "../interfaces/components";
import journio from "../assets/projects/journio.jpg";
import splito from "../assets/projects/splito.jpg";
import learnbit from "../assets/projects/learnbit.jpg";
import indicRoots from "../assets/projects/indic-roots.jpg";

export const Projects: IProject[] = [
  {
    name: "Journio",
    featured: true,
    image: journio,
    tagline: "A travellers-first social media platform",
    icon: "compass",
    stack: [
      "TypeScript",
      "Next.js",
      "Redux Toolkit",
      "MongoDB",
      "Mongoose",
      "Socket.io",
      "Cloudinary",
      "Tailwind CSS",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mr-dev-prince/Journio",
        kind: "github",
      },
      { label: "Live", href: "https://journio-two.vercel.app", kind: "live" },
    ],
    description: [
      "Full-stack social media platform for travelers built on Next.js, MongoDB, and Mongoose with secure JWT authentication and modular REST APIs.",
      "Paginated routing and server-side data fetching power seamless infinite scrolling while keeping API response times low.",
      "Scalable database schemas for users, posts, and destinations using relational referencing, aggregation pipelines, and optimized indexing.",
      "Real-time interactions run on a dedicated Socket.io server, with media uploads and cropping handled through Cloudinary.",
      "Responsive, user-centric UI focused on clean layouts, accessibility, and smooth interactions.",
    ],
  },
  {
    name: "Splito",
    featured: true,
    image: splito,
    tagline: "Split expenses. Not friendships.",
    icon: "wallet",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "TypeScript",
      "React",
      "Redux",
      "Tailwind CSS",
      "Framer Motion",
    ],
    links: [
      {
        label: "Client",
        href: "https://github.com/mr-dev-prince/splito-client",
        kind: "github",
      },
      {
        label: "Server",
        href: "https://github.com/mr-dev-prince/splito-server",
        kind: "server",
      },
      { label: "Live", href: "https://splito-client.vercel.app", kind: "live" },
    ],
    description: [
      "Smart money management application enabling expense tracking, group splits, and balance settlements through a clean, intuitive workflow.",
      "Async FastAPI backend on PostgreSQL with SQLAlchemy 2.0, handling users, groups, and transactions with accuracy and consistency.",
      "Scalable architecture and clean code practices make the system easy to extend with features like analytics and reminders.",
      "Bento-style interface with spending insights in Recharts and micro-interactions built with Framer Motion.",
    ],
  },
  {
    name: "Binflow",
    tagline: "Plug in a board, pick a firmware file, press Flash",
    icon: "chip",
    stack: [
      "TypeScript",
      "Next.js",
      "Web Serial",
      "WebUSB",
      "esptool-js",
      "Bun",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mr-dev-prince/binflow",
        kind: "github",
      },
    ],
    description: [
      "Browser-based firmware flasher for the ESP32 family over Web Serial via the ROM bootloader, and for RP2040/RP2350 boards over WebUSB via PICOBOOT.",
      "Converts ELF files into flashable images in the browser and decodes UF2 files into address runs, honouring partition tables and app offsets.",
      "Reboots a running Pico into BOOTSEL mode using the 1200-baud trick, with unit tests covering image conversion and flashing protocols.",
    ],
  },
  {
    name: "Learnbit",
    featured: true,
    image: learnbit,
    tagline: "An open-source personal learning management platform",
    icon: "book",
    stack: [
      "TypeScript",
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "Supabase",
      "Lexical",
      "TanStack Query",
      "Redux Toolkit",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mr-dev-prince/learnbit",
        kind: "github",
      },
      { label: "Live", href: "https://learnbit.vercel.app", kind: "live" },
    ],
    description: [
      "Open-source LMS for organising personal learning, built on the Next.js App Router with Supabase auth and a Prisma-backed PostgreSQL data layer.",
      "Rich-text notes powered by the Lexical editor, with Markdown rendering and Mermaid diagram support.",
      "Client state and server caching handled with Redux Toolkit and TanStack Query; ships with contribution guidelines for collaborators.",
    ],
  },
  {
    name: "Trekies",
    tagline: "Trek booking and management on mobile",
    icon: "mobile",
    stack: [
      "React Native",
      "Expo",
      "Expo Router",
      "Redux Toolkit",
      "NativeWind",
      "Firebase",
      "Google Places API",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mr-dev-prince/charlie-android",
        kind: "github",
      },
    ],
    description: [
      "Trek booking and management mobile app built with React Native (Expo) for both trekkers and organizers.",
      "Booking, scheduling, and trek management systems with Google Places for locations and Firebase for push notifications.",
      "Reliable state handling with Redux Toolkit and a performance-focused UX designed for real-world usage.",
    ],
  },
  {
    name: "Indic Roots",
    featured: true,
    image: indicRoots,
    tagline: "The Indian heritage and culture platform",
    icon: "landmark",
    stack: [
      "Next.js",
      "MongoDB",
      "Clerk",
      "OpenAI API",
      "Framer Motion",
      "Tailwind CSS",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mr-dev-prince/indic-roots",
        kind: "github",
      },
      { label: "Live", href: "https://indic-roots.vercel.app", kind: "live" },
    ],
    description: [
      "Built for the Smart India Hackathon 2025 Grand Finale: a digital museum, learning platform, and marketplace for Indian heritage.",
      "Interactive 5,000-year history timeline, region-wise culture explorer, monuments showcase, quizzes with leaderboards, and a heritage marketplace.",
      "Clerk authentication, MongoDB content storage, and an AI heritage guide backed by the OpenAI API.",
    ],
  },
  {
    name: "Kisaan AI",
    tagline: "One-stop AI solution for farmers",
    icon: "leaf",
    stack: [
      "React",
      "Vite",
      "Node.js",
      "Express",
      "MongoDB",
      "Gemini API",
      "Docker",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mr-dev-prince/kisaan-ai",
        kind: "github",
      },
      { label: "Live", href: "https://kai-dun.vercel.app", kind: "live" },
    ],
    description: [
      "AI-powered agriculture platform offering crop recommendations, disease prediction, real-time market prices, and weather forecasts.",
      "Secure farmer profiles, personalised market watchlists, and an admin dashboard for managing data and analytics.",
      "Fully containerised with Docker Compose; placed 3rd at the Savishkar MadhyaBharat innovation hackathon.",
    ],
  },
  {
    name: "DPI-Easy",
    tagline: "Deep packet inspection, made approachable",
    icon: "network",
    stack: ["Python", "Scapy", "FastAPI", "Multithreading"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/mr-dev-prince/DPI-Easy",
        kind: "github",
      },
    ],
    description: [
      "Multi-threaded deep packet inspection and traffic monitoring system that sniffs live TCP, UDP, DNS, and HTTP traffic with Scapy.",
      "Stateful connection tracking, DNS query inspection, HTTP payload inspection, and load-balanced packet processing across workers.",
      "Traffic telemetry exposed through FastAPI monitoring endpoints.",
    ],
  },
];

export const FeaturedProjects = Projects.filter((project) => project.featured);

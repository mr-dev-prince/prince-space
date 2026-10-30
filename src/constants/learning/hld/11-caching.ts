import { ILearningTopic } from "../../../interfaces/components";
import {
  LuBraces,
  LuDatabase,
  LuHardDrive,
  LuKeyRound,
  LuMemoryStick,
  LuNewspaper,
  LuRadio,
  LuServer,
  LuUser,
  LuZap,
} from "react-icons/lu";

export const Caching: ILearningTopic = {
  id: "caching",
  title: "Caching",
  summary:
    "What a cache is, why only a subset is cached, and where caches show up",
  slides: [
    {
      title: "Caching",
      blocks: [
        {
          type: "list",
          items: [
            {
              text: "Caches are anything that helps you avoid an expensive **network I/O, disk I/O, or computation**.",
              items: [
                "API call to get profile information",
                "Reading a specific line from a large file",
                "Doing multiple table joins",
              ],
            },
            "Store frequently accessed data in a temporary storage location.",
          ],
        },
        {
          type: "flow",
          width: 800,
          height: 220,
          nodes: [
            {
              id: "user",
              label: "User",
              icon: LuUser,
              x: 60,
              y: 100,
              w: 72,
              kind: "circle",
            },
            {
              id: "api",
              label: "API server",
              icon: LuServer,
              x: 240,
              y: 100,
              w: 190,
              h: 64,
            },
            {
              id: "cache",
              label: "Cache",
              sub: "temporary storage",
              icon: LuZap,
              x: 480,
              y: 100,
              w: 180,
              h: 90,
              kind: "db",
              tone: "accent",
              glow: true,
            },
            {
              id: "db",
              label: "Database",
              icon: LuDatabase,
              x: 710,
              y: 100,
              w: 170,
              h: 90,
              kind: "db",
            },
            {
              id: "hot",
              label: "frequently accessed data",
              x: 480,
              y: 185,
              w: 200,
              h: 32,
              kind: "chip",
              tone: "accent",
            },
          ],
          edges: [
            { from: "user", to: "api", pulse: true },
            { from: "api", to: "cache", pulse: true, tone: "accent" },
            { from: "cache", to: "db", both: true },
          ],
        },
      ],
    },
    {
      title: "Caches are faster and expensive",
      blocks: [
        {
          type: "list",
          items: [
            "Hence we do not cache all the data but just a **subset** of it which is most likely to be accessed frequently.",
            "Caches that we typically use are **in-memory** caches like Redis or Memcached.",
          ],
        },
        {
          type: "flow",
          width: 760,
          height: 300,
          nodes: [
            {
              id: "all",
              label: "All the data",
              sub: "in the database",
              icon: LuDatabase,
              x: 120,
              y: 150,
              w: 200,
              h: 110,
              kind: "db",
            },
            {
              id: "subset",
              label: "Frequently accessed",
              sub: "the subset most likely to be accessed",
              icon: LuZap,
              x: 380,
              y: 150,
              w: 270,
              h: 64,
            },
            {
              id: "cache",
              label: "In-memory cache",
              sub: "Redis, Memcached",
              icon: LuMemoryStick,
              x: 650,
              y: 150,
              w: 200,
              h: 100,
              kind: "db",
              tone: "accent",
              glow: true,
            },
            {
              id: "faster",
              label: "faster",
              x: 650,
              y: 50,
              w: 110,
              h: 32,
              kind: "chip",
              tone: "good",
            },
            {
              id: "expensive",
              label: "expensive",
              x: 650,
              y: 250,
              w: 120,
              h: 32,
              kind: "chip",
              tone: "bad",
            },
          ],
          edges: [
            { from: "all", to: "subset", pulse: true, tone: "accent" },
            { from: "subset", to: "cache", pulse: true, tone: "accent" },
          ],
        },
      ],
    },
    {
      title: "Caches are not restricted to RAM based storage",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            {
              icon: LuHardDrive,
              title: "Redis",
              text: "Redis does store data on RAM but it can also store data on disk.",
            },
            {
              icon: LuZap,
              title: "Nearer and faster",
              text: "Anything kept nearer and faster to access than the original source of data can be considered a cache.",
              tone: "accent",
            },
            {
              icon: LuBraces,
              title: "Glorified hashmaps",
              text: "In their simplest form, caches are just glorified hashmaps that store key-value pairs.",
            },
          ],
        },
      ],
    },
    {
      title: "Some examples",
      blocks: [
        {
          type: "cards",
          columns: 3,
          items: [
            {
              icon: LuNewspaper,
              title: "Google News",
              text: "The most recent news articles are more likely to be accessed, hence served from cache.",
              meta: [
                { label: "Cached", value: "the most recent articles" },
                { label: "Why", value: "more likely to be accessed" },
              ],
            },
            {
              icon: LuKeyRound,
              title: "Auth tokens",
              text: "Authentication tokens are cached to avoid load on the database.",
              meta: [
                { label: "Cached", value: "authentication tokens" },
                { label: "Why", value: "avoid load on the database" },
              ],
            },
            {
              icon: LuRadio,
              title: "Live stream",
              text: "The last 10 minutes of a live stream are cached on the CDN as they will be accessed the most.",
              meta: [
                { label: "Cached", value: "the last 10 minutes, on the CDN" },
                { label: "Why", value: "accessed the most" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

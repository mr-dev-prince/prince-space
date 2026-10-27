import { ILearningTopic } from "../../../interfaces/components";
import {
  LuBookOpen,
  LuCalculator,
  LuCircleCheck,
  LuDatabase,
  LuFileText,
  LuGitBranch,
  LuHardDrive,
  LuLayers,
  LuLock,
  LuMonitorSmartphone,
  LuRotateCw,
  LuSave,
  LuShield,
  LuShieldCheck,
  LuTable,
  LuTriangleAlert,
  LuZapOff,
} from "react-icons/lu";

export const RelationalDatabases: ILearningTopic = {
  id: "relational-databases",
  title: "Relational Databases",
  summary: "Tables, relationships, and ACID transactions",
  slides: [
    {
      title: "Relational Databases",
      blocks: [
        {
          type: "list",
          items: [
            "Databases are the most critical component of any system design and the most brittle part of it.",
            "If you solve the database problem, you have solved **50%** of the system design problem.",
            "In relational databases, data is stored in tables [ rows and columns ] and relationships are established between them.",
          ],
        },
        {
          type: "entities",
          relation: "publishes",
          cardinality: ["1", "N"],
          entities: [
            {
              name: "USER",
              fields: [
                { name: "id", type: "int", key: "PK" },
                { name: "name", type: "string" },
                { name: "total_posts", type: "int" },
              ],
            },
            {
              name: "POST",
              fields: [
                { name: "id", type: "int", key: "PK" },
                { name: "user_id", type: "int", key: "FK" },
                { name: "content", type: "string" },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Computers first did accounting",
      blocks: [
        {
          type: "list",
          items: [
            {
              text: "Computers first did - accounting → ledgers → rows & columns",
              items: [
                "That's why the key properties were related to financial transactions and accounting.",
              ],
            },
          ],
        },
        {
          type: "flow",
          width: 700,
          height: 455,
          nodes: [
            {
              id: "accounting",
              label: "Accounting",
              icon: LuCalculator,
              x: 115,
              y: 60,
              w: 220,
            },
            {
              id: "ledgers",
              label: "Ledgers",
              icon: LuBookOpen,
              x: 115,
              y: 150,
              w: 220,
            },
            {
              id: "rows",
              label: "Rows & Columns",
              icon: LuTable,
              x: 115,
              y: 240,
              w: 220,
            },
            {
              id: "db",
              label: "Relational DB",
              icon: LuDatabase,
              x: 340,
              y: 240,
              w: 160,
              h: 130,
              kind: "db",
              tone: "accent",
              glow: true,
            },
            {
              id: "consistency",
              label: "Consistency",
              icon: LuCircleCheck,
              x: 590,
              y: 60,
              w: 200,
              h: 56,
            },
            {
              id: "durability",
              label: "Durability",
              icon: LuHardDrive,
              x: 590,
              y: 150,
              w: 200,
              h: 56,
            },
            {
              id: "integrity",
              label: "Integrity",
              icon: LuShieldCheck,
              x: 590,
              y: 240,
              w: 200,
              h: 56,
            },
            {
              id: "constraints",
              label: "Constraints",
              icon: LuLock,
              x: 590,
              y: 330,
              w: 200,
              h: 56,
            },
            {
              id: "one-place",
              label: "Everything",
              sub: "in one place",
              icon: LuLayers,
              x: 590,
              y: 420,
              w: 200,
              h: 60,
            },
          ],
          edges: [
            { from: "accounting", to: "ledgers" },
            { from: "ledgers", to: "rows" },
            { from: "rows", to: "db", pulse: true, tone: "accent" },
            { from: "db", to: "consistency", anchor: "x" },
            { from: "db", to: "durability", anchor: "x" },
            { from: "db", to: "integrity" },
            { from: "db", to: "constraints", anchor: "x" },
            { from: "db", to: "one-place", anchor: "x" },
          ],
        },
      ],
    },
    {
      title: "Transactions",
      layout: "stack",
      blocks: [
        {
          type: "text",
          text: "Due to the same reason - relational databases provide → **Transactions**",
        },
        {
          type: "cards",
          columns: 4,
          items: [
            { badge: "A", title: "Atomicity", text: "All or nothing" },
            {
              badge: "C",
              title: "Consistency",
              text: "Never an incorrect state",
            },
            {
              badge: "I",
              title: "Isolation",
              text: "Parallel transactions don't step on each other",
            },
            {
              badge: "D",
              title: "Durability",
              text: "Committed = survives outages",
            },
          ],
        },
      ],
    },
    {
      title: "A - Atomicity",
      blocks: [
        {
          type: "list",
          items: [
            "All statements within a transaction take effect or none of them take effect.",
            {
              text: "For example - Publish a post and increase total post count by 1.",
              items: [
                "Update 1 - Insert a new post in the database",
                "Update 2 - Increase the total post count by 1",
                "If the first update is successful and second update fails, then the database will be in an inconsistent state.",
              ],
            },
            "So you wrap these two updates in a transaction, so that either both of them succeed or none of them succeed.",
          ],
        },
        {
          type: "sequence",
          width: 560,
          actors: [
            { label: "App", icon: LuMonitorSmartphone },
            { label: "Database", icon: LuDatabase },
          ],
          steps: [
            { from: 0, to: 1, label: "BEGIN" },
            { from: 0, to: 1, label: "Update 1 - INSERT post" },
            { from: 0, to: 1, label: "Update 2 - total_posts + 1" },
            { section: "both succeed", tone: "good" },
            {
              from: 1,
              to: 0,
              label: "COMMIT - post + count saved",
              tone: "good",
            },
            { section: "Update 2 fails", tone: "bad" },
            {
              from: 1,
              to: 0,
              label: "ROLLBACK - post removed too",
              tone: "bad",
            },
          ],
        },
      ],
    },
    {
      title: "C - Consistency",
      blocks: [
        {
          type: "list",
          items: [
            "Data will never go into an incorrect state, no matter what",
            "Database should always move from one consistent state to another consistent state.",
            {
              text: "To ensure that the data is always in a consistent state, you can use -",
              items: [
                "Constraints",
                "Triggers",
                "Stored Procedures",
                "Cascades",
              ],
            },
          ],
        },
        {
          type: "flow",
          width: 620,
          height: 425,
          nodes: [
            {
              id: "a",
              label: "Consistent",
              sub: "State A",
              icon: LuCircleCheck,
              x: 110,
              y: 40,
              w: 200,
              h: 64,
              tone: "good",
            },
            {
              id: "b",
              label: "Consistent",
              sub: "State B",
              icon: LuCircleCheck,
              x: 510,
              y: 40,
              w: 200,
              h: 64,
              tone: "good",
            },
            {
              id: "guard",
              label: "Constraints · Triggers",
              sub: "Stored Procedures · Cascades",
              icon: LuShield,
              x: 310,
              y: 230,
              w: 320,
              h: 100,
              kind: "hex",
              tone: "accent",
              glow: true,
            },
            {
              id: "incorrect",
              label: "Incorrect State",
              icon: LuTriangleAlert,
              x: 310,
              y: 390,
              w: 220,
              tone: "bad",
            },
          ],
          edges: [
            {
              from: "a",
              to: "b",
              label: "Transaction",
              pulse: true,
              tone: "good",
            },
            {
              from: "a",
              to: "guard",
              label: "bad write",
              anchor: "y",
              tone: "bad",
            },
            {
              from: "guard",
              to: "incorrect",
              blocked: true,
              tone: "bad",
            },
          ],
        },
      ],
    },
    {
      title: "I - Isolation",
      blocks: [
        {
          type: "list",
          items: [
            "When multiple transactions are executing parallelly, the isolation level determines how much of the changes of one transaction are visible to other transactions.",
            {
              text: "For example - Transaction 1 is updating a post and Transaction 2 is reading the same post.",
              items: [
                "If Transaction 1 has not committed yet, then Transaction 2 should not be able to see the changes made by Transaction 1.",
                "If Transaction 1 has committed, then Transaction 2 should be able to see the changes made by Transaction 1.",
              ],
            },
          ],
        },
        {
          type: "sequence",
          width: 620,
          actors: [
            { label: "Transaction 1", icon: LuGitBranch },
            { label: "Post", icon: LuFileText },
            { label: "Transaction 2", icon: LuGitBranch },
          ],
          steps: [
            { from: 0, to: 1, label: "UPDATE post (not committed)" },
            { from: 2, to: 1, label: "READ post" },
            { from: 1, to: 2, label: "old value" },
            { from: 0, to: 1, label: "COMMIT", tone: "accent" },
            { from: 2, to: 1, label: "READ post" },
            { from: 1, to: 2, label: "new value", tone: "good" },
          ],
        },
      ],
    },
    {
      title: "Four Isolation Levels",
      blocks: [
        {
          type: "list",
          items: [
            "Read Uncommitted",
            "Read Committed",
            "Repeatable Read → **Default Isolation Level in MySQL**",
            "Serializable",
          ],
        },
        {
          type: "note",
          text: "In most cases you don't need to tune isolation level!",
        },
        {
          type: "spectrum",
          from: "faster, less isolated",
          to: "slower, fully isolated",
          steps: [
            { label: "Read Uncommitted" },
            { label: "Read Committed" },
            { label: "Repeatable Read", badge: "MySQL default" },
            { label: "Serializable" },
          ],
        },
      ],
    },
    {
      title: "D - Durability",
      blocks: [
        {
          type: "list",
          items: [
            "When a transaction commits, the changes should outlive outages",
            "Relational databases give you this guarantee",
          ],
        },
        {
          type: "flow",
          width: 670,
          height: 340,
          nodes: [
            {
              id: "commit",
              label: "COMMIT",
              icon: LuSave,
              x: 90,
              y: 65,
              w: 170,
              h: 54,
              kind: "pill",
              tone: "accent",
            },
            {
              id: "disk",
              label: "Disk",
              icon: LuHardDrive,
              x: 320,
              y: 65,
              w: 150,
              h: 110,
              kind: "db",
            },
            {
              id: "outage",
              label: "Outage / Crash",
              icon: LuZapOff,
              x: 555,
              y: 65,
              w: 220,
              tone: "bad",
            },
            {
              id: "restart",
              label: "Restart",
              icon: LuRotateCw,
              x: 555,
              y: 290,
              w: 220,
            },
            {
              id: "safe",
              label: "Data still there",
              icon: LuCircleCheck,
              x: 290,
              y: 290,
              w: 230,
              tone: "good",
              glow: true,
            },
          ],
          edges: [
            { from: "commit", to: "disk", pulse: true, tone: "accent" },
            { from: "disk", to: "outage", tone: "bad" },
            { from: "outage", to: "restart" },
            { from: "restart", to: "safe", tone: "good" },
            {
              from: "disk",
              to: "safe",
              label: "survives",
              anchor: "y",
              tone: "good",
            },
          ],
        },
      ],
    },
  ],
};

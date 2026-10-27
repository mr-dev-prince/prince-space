import { ILearningTopic } from "../../../interfaces/components";
import {
  LuCircleCheck,
  LuEye,
  LuGitBranch,
  LuListOrdered,
  LuLock,
  LuRepeat,
  LuRows3,
  LuSave,
  LuShield,
  LuTrendingDown,
} from "react-icons/lu";

export const IsolationLevels: ILearningTopic = {
  id: "isolation-levels",
  title: "Isolation Levels",
  summary: "What a read returns under each of the four isolation levels",
  slides: [
    {
      title: "Isolation Levels",
      blocks: [
        {
          type: "list",
          items: [
            {
              text: "In relational databases - there are **4 isolation levels** that determine how transactions interact with each other.",
              items: [
                "Read Uncommitted",
                "Read Committed",
                "Repeatable Read",
                "Serializable",
              ],
            },
          ],
        },
        {
          type: "spectrum",
          from: "lowest isolation level",
          to: "highest isolation level",
          steps: [
            { label: "Read Uncommitted" },
            { label: "Read Committed", badge: "PostgreSQL default" },
            { label: "Repeatable Read", badge: "MySQL default" },
            { label: "Serializable" },
          ],
        },
      ],
    },
    {
      title: "Side by side",
      blocks: [
        {
          type: "cards",
          columns: 2,
          items: [
            {
              icon: LuEye,
              title: "Read Uncommitted",
              text: "Returns the latest value, including uncommitted changes. Con - dirty reads, non-repeatable reads and phantom reads.",
            },
            {
              icon: LuSave,
              title: "Read Committed",
              tone: "accent",
              text: "Returns the latest committed value. Default in PostgreSQL. Con - multiple reads within the same transaction can return different values.",
            },
            {
              icon: LuRepeat,
              title: "Repeatable Read",
              tone: "accent",
              text: "Returns the same value the row had when the transaction started. Default in MySQL. Pro - consistent view throughout the transaction.",
            },
            {
              icon: LuListOrdered,
              title: "Serializable",
              text: "Transactions are completely isolated from each other. Pro - prevents all anomalies. Con - reduced performance due to increased locking.",
            },
          ],
        },
      ],
    },
    {
      title: "1. Repeatable Read",
      blocks: [
        {
          type: "list",
          items: [
            {
              text: "In a transaction, a row will always return the same value that it had when the transaction started, even if other transactions are updating it. This is the default isolation level in **MySQL**.",
              items: ["Consistent view throughout the transaction."],
            },
          ],
        },
        {
          type: "sequence",
          width: 620,
          actors: [
            { label: "Transaction 1", icon: LuGitBranch },
            { label: "Row", icon: LuRows3 },
            { label: "Transaction 2", icon: LuGitBranch },
          ],
          steps: [
            { from: 2, to: 1, label: "BEGIN + READ row" },
            { from: 1, to: 2, label: "value at start" },
            { from: 0, to: 1, label: "UPDATE row + COMMIT", tone: "accent" },
            { from: 2, to: 1, label: "READ row" },
            { from: 1, to: 2, label: "same value as at start", tone: "good" },
          ],
        },
      ],
    },
    {
      title: "2. Read Committed",
      blocks: [
        {
          type: "list",
          items: [
            {
              text: "In a transaction, a row will return the latest committed value, even if other transactions are updating it. This is the default isolation level in **PostgreSQL**.",
              items: [
                "con - multiple reads within the same transaction can return different values if other transactions are committing changes to the same row.",
              ],
            },
          ],
        },
        {
          type: "sequence",
          width: 620,
          actors: [
            { label: "Transaction 1", icon: LuGitBranch },
            { label: "Row", icon: LuRows3 },
            { label: "Transaction 2", icon: LuGitBranch },
          ],
          steps: [
            { from: 2, to: 1, label: "READ row" },
            { from: 1, to: 2, label: "latest committed value" },
            { from: 0, to: 1, label: "UPDATE row + COMMIT", tone: "accent" },
            { from: 2, to: 1, label: "READ row (same transaction)" },
            {
              from: 1,
              to: 2,
              label: "new committed value - different",
              tone: "bad",
            },
          ],
        },
      ],
    },
    {
      title: "3. Read Uncommitted",
      blocks: [
        {
          type: "list",
          items: [
            {
              text: "In a transaction, a row will return the latest value, including uncommitted changes from other transactions. This is the lowest isolation level and can lead to dirty reads.",
              items: [
                "con - dirty reads, non-repeatable reads, and phantom reads can occur, leading to inconsistent data being read by transactions.",
              ],
            },
          ],
        },
        {
          type: "sequence",
          width: 620,
          actors: [
            { label: "Transaction 1", icon: LuGitBranch },
            { label: "Row", icon: LuRows3 },
            { label: "Transaction 2", icon: LuGitBranch },
          ],
          steps: [
            { from: 0, to: 1, label: "UPDATE row (not committed)" },
            { from: 2, to: 1, label: "READ row" },
            {
              from: 1,
              to: 2,
              label: "uncommitted value - dirty read",
              tone: "bad",
            },
          ],
        },
      ],
    },
    {
      title: "4. Serializable",
      blocks: [
        {
          type: "list",
          items: [
            "This is the highest isolation level, where transactions are processed in a way that ensures they are completely isolated from each other.",
            "This prevents all anomalies but can lead to reduced performance due to increased locking.",
          ],
        },
        {
          type: "flow",
          width: 790,
          height: 400,
          nodes: [
            {
              id: "serializable",
              label: "Serializable",
              icon: LuListOrdered,
              x: 115,
              y: 200,
              w: 200,
              h: 54,
              kind: "pill",
              tone: "accent",
              glow: true,
            },
            {
              id: "isolated",
              label: "Completely isolated",
              sub: "from each other",
              icon: LuShield,
              x: 390,
              y: 200,
              w: 230,
              h: 64,
            },
            {
              id: "anomalies",
              label: "Prevents all anomalies",
              icon: LuCircleCheck,
              x: 650,
              y: 60,
              w: 230,
              h: 64,
              tone: "good",
            },
            {
              id: "locking",
              label: "Increased locking",
              icon: LuLock,
              x: 650,
              y: 200,
              w: 230,
              h: 64,
            },
            {
              id: "performance",
              label: "Reduced performance",
              icon: LuTrendingDown,
              x: 650,
              y: 340,
              w: 230,
              h: 64,
              tone: "bad",
            },
          ],
          edges: [
            {
              from: "serializable",
              to: "isolated",
              pulse: true,
              tone: "accent",
            },
            { from: "isolated", to: "anomalies", anchor: "x", tone: "good" },
            { from: "isolated", to: "locking", anchor: "x" },
            { from: "locking", to: "performance", tone: "bad" },
          ],
        },
      ],
    },
  ],
};

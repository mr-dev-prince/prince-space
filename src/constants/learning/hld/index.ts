import { ILearningTrack } from "../../../interfaces/components";
import { Commencement } from "./01-commencement";
import { WhatIsSystemDesign } from "./02-what-is-system-design";
import { HowToApproachSystemDesign } from "./03-how-to-approach-system-design";
import { SignsOfAGoodSystem } from "./04-signs-of-a-good-system";
import { RelationalDatabases } from "./05-relational-databases";
import { IsolationLevels } from "./06-isolation-levels";
import { ScalingDatabases } from "./07-scaling-databases";
import { ShardingAndPartitioning } from "./08-sharding-and-partitioning";
import { NonRelationalDatabases } from "./09-non-relational-databases";

export const HldTrack: ILearningTrack = {
  id: "hld",
  label: "HLD",
  title: "High-Level Design",
  topics: [
    Commencement,
    WhatIsSystemDesign,
    HowToApproachSystemDesign,
    SignsOfAGoodSystem,
    RelationalDatabases,
    IsolationLevels,
    ScalingDatabases,
    ShardingAndPartitioning,
    NonRelationalDatabases,
  ],
};

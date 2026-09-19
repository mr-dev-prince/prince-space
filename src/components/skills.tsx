import { ISkill, ISkillGroup } from "../interfaces/components";
import Reveal from "./reveal";

const SkillTile = ({ name, icon: Icon, color }: ISkill) => (
  <div
    title={name}
    aria-label={name}
    className="flex aspect-square w-full items-center justify-center rounded-xl border border-dashed border-white/15 bg-[#0f0f0f] transition-colors hover:bg-white/5 sm:aspect-auto sm:h-14 sm:w-14"
  >
    <Icon size={20} color={color ?? "rgba(255,255,255,0.9)"} />
  </div>
);

const SkillGrid = ({ skills }: { skills: ISkill[] }) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
    {skills.map((skill, index) => (
      <Reveal key={skill.name} delay={index * 0.02} y={10}>
        <SkillTile {...skill} />
      </Reveal>
    ))}
  </div>
);

export const SkillGroup = ({ data }: { data: ISkillGroup }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
    <p className="shrink-0 text-xs font-light uppercase tracking-widest text-white/50 sm:w-40 sm:pt-1.5">
      {data.category}
    </p>
    <div className="flex flex-wrap gap-2">
      {data.items.map((item) => (
        <span
          key={item}
          className="rounded-xl border border-white/5 bg-[#0f0f0f] px-3 py-1 text-sm font-light text-white/70"
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default SkillGrid;

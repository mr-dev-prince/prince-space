import Row from "./row";
import Reveal from "./reveal";
import ExperienceCard from "./experience";
import ProjectCard from "./project";
import SkillGrid, { SkillGroup } from "./skills";
import { Experience } from "../constants/experience";
import { Projects } from "../constants/projects";
import { Skills, Coursework } from "../constants/skills";

export const ExperienceRows = () => (
  <>
    {Experience.map((item, index) => (
      <Row key={`${item.company}-${index}`}>
        <Reveal>
          <ExperienceCard data={item} />
        </Reveal>
      </Row>
    ))}
  </>
);

export const ProjectRows = () => (
  <>
    {Projects.map((item) => (
      <Row key={item.name}>
        <Reveal>
          <ProjectCard data={item} />
        </Reveal>
      </Row>
    ))}
  </>
);

export const SkillRows = () => (
  <>
    <Row>
      <SkillGrid skills={Skills} />
    </Row>
    <Row>
      <Reveal>
        <SkillGroup data={Coursework} />
      </Reveal>
    </Row>
  </>
);

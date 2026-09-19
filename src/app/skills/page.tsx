import Frame from "../../components/frame";
import HorizontalLines from "../../components/horizontal-lines";
import PageHeader from "../../components/page-header";
import { SkillRows } from "../../components/sections";

export const metadata = {
  title: "Skills · Prince Chaurasia",
  description: "Languages, frameworks, and tools I work with.",
};

const SkillsPage = () => {
  return (
    <Frame>
      <HorizontalLines />
      <PageHeader
        title="Skills"
        subtitle="Languages, frameworks, and tools I work with."
      />
      <SkillRows />
      <HorizontalLines />
    </Frame>
  );
};

export default SkillsPage;

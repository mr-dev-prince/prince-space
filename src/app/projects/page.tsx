import Frame from "../../components/frame";
import HorizontalLines from "../../components/horizontal-lines";
import PageHeader from "../../components/page-header";
import { ProjectRows } from "../../components/sections";
import { Projects } from "../../constants/projects";

export const metadata = {
  title: "Projects · Prince Chaurasia",
  description: "Everything I have built, broken, and rebuilt.",
};

const ProjectsPage = () => {
  return (
    <Frame>
      <HorizontalLines />
      <PageHeader
        title="All Projects"
        subtitle={`${Projects.length} things I have built, broken, and rebuilt.`}
      />
      <ProjectRows />
      <HorizontalLines />
    </Frame>
  );
};

export default ProjectsPage;

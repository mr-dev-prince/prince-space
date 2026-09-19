import Frame from "../../components/frame";
import HorizontalLines from "../../components/horizontal-lines";
import PageHeader from "../../components/page-header";
import { ExperienceRows } from "../../components/sections";

export const metadata = {
  title: "Experience · Prince Chaurasia",
  description: "Where I have worked and what I shipped.",
};

const ExperiencePage = () => {
  return (
    <Frame>
      <HorizontalLines />
      <PageHeader
        title="Experience"
        subtitle="Where I have worked and what I shipped. Expand a role for details."
      />
      <ExperienceRows />
      <HorizontalLines />
    </Frame>
  );
};

export default ExperiencePage;

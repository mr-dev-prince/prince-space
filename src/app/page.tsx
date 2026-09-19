import Frame from "../components/frame";
import HorizontalLines from "../components/horizontal-lines";
import Hero from "../components/hero";
import Heading from "../components/heading";
import Row from "../components/row";
import Reveal from "../components/reveal";
import Doodle from "../components/doodle";
import FeaturedProjectCard from "../components/featured-project";
import LinkButton from "../components/link-button";
import GithubActivity from "../components/github-activity";
import { ExperienceRows, SkillRows } from "../components/sections";
import { FaArrowRight } from "react-icons/fa";
import { FeaturedProjects } from "../constants/projects";

const page = () => {
  return (
    <Frame>
      <HorizontalLines />
      <div className="relative">
        <Reveal y={12}>
          <Hero />
        </Reveal>
        <Doodle kind="keyboard" className="-right-[310px] top-12" rotate={-8} />
        <Doodle
          kind="mouse"
          className="-right-[150px] top-52"
          rotate={14}
          float={4}
        />
      </div>
      <HorizontalLines />

      {/* On phones this lives under the Experience tab. */}
      <section className="relative hidden md:block">
        <Heading text="Experience" />
        <ExperienceRows />
        <HorizontalLines />
        <Doodle
          kind="headphones"
          className="-left-[300px] top-20"
          rotate={-10}
        />
      </section>

      <Heading text="Projects" />
      <Row>
        <div className="grid gap-8 py-2 sm:grid-cols-2 sm:gap-6">
          {FeaturedProjects.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.08}>
              <FeaturedProjectCard data={item} />
            </Reveal>
          ))}
        </div>
      </Row>
      <Row>
        <Reveal className="flex justify-center">
          <LinkButton
            href="/projects"
            text="More"
            icon={
              <FaArrowRight
                size={11}
                className="text-white/80 transition-transform group-hover:translate-x-0.5"
              />
            }
          />
        </Reveal>
      </Row>
      <HorizontalLines />

      {/* On phones this lives under the Skills tab. */}
      <section className="relative hidden md:block">
        <Heading text="Skills" />
        <SkillRows />
        <HorizontalLines />
        <Doodle
          kind="espBoard"
          className="-right-[240px] top-10"
          rotate={16}
          float={5}
        />
      </section>

      <div className="relative">
        <Heading text="GitHub Activity" />
        <Row>
          <Reveal>
            <GithubActivity />
          </Reveal>
        </Row>
        <HorizontalLines />
        <Doodle
          kind="raspberryPi"
          className="-left-[330px] top-24"
          rotate={-6}
        />
      </div>
    </Frame>
  );
};

export default page;

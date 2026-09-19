import { IHeading } from "../interfaces/components";
import Reveal from "./reveal";

const Heading = ({ text }: IHeading) => (
  <Reveal y={10}>
    <h2 className="flex h-[50px] w-fit items-center px-4 font-serif text-xl tracking-wide sm:px-6 sm:text-2xl">
      {text}
    </h2>
  </Reveal>
);

export default Heading;

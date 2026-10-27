import { ILearningTrack } from "../../interfaces/components";
import { HldTrack } from "./hld";

/**
 * Diagrams are drawn in their own pixel space and scaled into the slide, so
 * the x/y values in the topic files only need to be right relative to each
 * other.
 */
export const LearningTracks: ILearningTrack[] = [HldTrack];

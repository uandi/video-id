import { VideoService } from "../types";
import { vimeo } from "./vimeo";
import { youtube } from "./youtube";

export const services: VideoService[] = [youtube, vimeo];

export function getService(url: string) {
  return services.find((service) => service.regex.test(url));
}

import { getService } from "./service";
import { VideoMetadata } from "./types";
import { sanitizeUrl } from "./utils";

export function getVideoId(videoUrl: string): VideoMetadata {
  if (typeof videoUrl !== "string") {
    throw new TypeError("getVideoId expects a string");
  }

  const sanitized = sanitizeUrl(videoUrl);
  const service = getService(sanitized);

  if (!service)
    return {
      id: undefined,
      service: undefined,
    };

  return {
    service: service.service,
    id: service.callback(sanitized),
  };
}

import { VideoService } from "../types";

export const vimeo: VideoService = {
  service: "vimeo",
  regex: /vimeo/,
  callback: (url: string) => {
    let urlString = url;

    if (urlString.includes("#")) {
      [urlString] = urlString.split("#");
    }

    if (urlString.includes("?") && !urlString.includes("clip_id=")) {
      [urlString] = urlString.split("?");
    }

    let id;
    let array;

    const event = /https?:\/\/vimeo\.com\/event\/(\d+)$/;

    const eventMatches = event.exec(urlString);

    if (eventMatches?.[1]) {
      return eventMatches[1];
    }

    const primary = /https?:\/\/vimeo\.com\/(\d+)/;

    const matches = primary.exec(urlString);
    if (matches?.[1]) {
      return matches[1];
    }

    const vimeoPipe = [
      "https?://player.vimeo.com/video/[0-9]+$",
      "https?://vimeo.com/channels",
      "groups",
      "album",
    ].join("|");

    const vimeoRegex = new RegExp(vimeoPipe, "gim");

    if (vimeoRegex.test(urlString)) {
      array = urlString.split("/");
      if (array.length > 0) {
        id = array.pop();
      }
    } else if (/clip_id=/gim.test(urlString)) {
      array = urlString.split("clip_id=");
      if (array.length > 0) {
        [id] = array[1].split("&");
      }
    }

    return id;
  },
};

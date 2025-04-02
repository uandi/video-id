import { VideoService } from "../types";

function stripParameters(shortcodeString: string) {
  if (shortcodeString.includes("?")) {
    shortcodeString = shortcodeString.split("?")[0];
  }

  if (shortcodeString.includes("/")) {
    shortcodeString = shortcodeString.split("/")[0];
  }

  if (shortcodeString.includes("&")) {
    shortcodeString = shortcodeString.split("&")[0];
  }

  return shortcodeString;
}

export const youtube: VideoService = {
  service: "youtube",
  regex: /youtube|youtu\.be|y2u\.be|i.ytimg\./,
  callback: (url: string) => {
    const urlString = url
      .replace("-nocookie", "") // Remove the '-nocookie' flag from url
      .replace(/#t=.*$/, "") // Remove time hash at the end of the string
      .replace(/^https?:\/\//, ""); // Strip the leading protocol

    // Shortcode
    const shortCode = /youtube:\/\/|youtu\.be\/|y2u\.be\//g;
    if (shortCode.test(urlString)) {
      const shortCodeId = urlString.split(shortCode)[1];
      return stripParameters(shortCodeId);
    }

    // Shorts
    const shortsUrl = /\/shorts\//g;
    if (shortsUrl.test(urlString)) {
      const shortsId = urlString.split(shortsUrl)[1];
      return stripParameters(shortsId);
    }

    // V= or vi=
    const parameterV = /v=|vi=/g;
    if (parameterV.test(urlString)) {
      const vArray = urlString.split(parameterV)[1].split("&");
      return stripParameters(vArray[0]);
    }

    // /v/ or /vi/ or /watch/
    const inlinev = /\/v\/|\/vi\/|\/watch\//g;
    if (inlinev.test(urlString)) {
      const inlineId = urlString.split(inlinev)[1];
      return stripParameters(inlineId);
    }

    // Format an_webp
    const parameterwebp = /\/an_webp\//g;
    if (parameterwebp.test(urlString)) {
      const webp = urlString.split(parameterwebp)[1];
      return stripParameters(webp);
    }

    // /e/
    const eformat = /\/e\//g;
    if (eformat.test(urlString)) {
      const estring = urlString.split(eformat)[1];
      return stripParameters(estring);
    }

    // Embed
    const embedreg = /\/embed\//g;
    if (embedreg.test(urlString)) {
      const embedid = urlString.split(embedreg)[1];
      return stripParameters(embedid);
    }

    // ignore /user/username pattern
    const usernamereg = /\/user\/([a-zA-Z\d]*)$/g;

    if (usernamereg.test(urlString)) {
      return undefined;
    }

    // User
    const userreg = /\/user\/(?!.*videos)/g;

    if (userreg.test(urlString)) {
      const element = urlString.split("/").pop();
      if (!element) return undefined;
      return stripParameters(element);
    }

    // Attribution_link
    const attrreg = /\/attribution_link\?.*v%3D([^%&]*)(%26|&|$)/;

    if (attrreg.test(urlString)) {
      const match = attrreg.exec(urlString);
      if (!match) return undefined;
      return stripParameters(match[1]);
    }

    // Live
    const livereg = /\/live\//g;
    if (livereg.test(urlString)) {
      const liveid = urlString.split(livereg)[1];
      return stripParameters(liveid);
    }

    return undefined;
  },
};

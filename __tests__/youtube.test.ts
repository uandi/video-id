import { expect, test, describe } from "vitest";
import { getVideoId } from "../src";

/**
 * Youtube should be able to find these patterns:
 *
 *  // shortcodes
 *  http://youtu.be/id?
 *  https://youtu.be/id
 *  http://youtu.be/id
 *  http://y2u.be/id
 *  youtube://
 *
 *  // shorts
 *  https://youtube.com/shorts/*
 *  https://www.youtube.com/shorts/*
 *
 *  // /v/ or /vi/
 *  http://www.youtube.com/v/id
 *  http://youtube.com/vi/id?
 *  http://youtube.com/v/id?
 *
 *  // v= or vi=
 *  http://www.youtube.com/ytscreeningroom?v=id
 *  http://www.youtube.com/watch?v=id?&
 *  https://www.youtube.com/watch?v=id
 *  http://youtube.com/watch?vi=id&
 *  http://youtube.com/?vi=id&
 *  http://youtube.com/?v=id
 *
 *  // /e/
 *  https://www.youtube.com/e/id
 *  http://www.youtube.com/e/id
 *  www.youtube.com/e/id
 *  youtube.com/e/id
 *
 *  // embed
 *  http://www.youtube.com/embed/id?
 *  https://www.youtube.com/embed/id
 *
 *  // user
 *  http://www.youtube.com/user/username#p/a/u/2/id
 *  http://www.youtube.com/user/username#p/u/1/id?
 *  http://www.youtube.com/user/username#p/u/1/id
 *
 *  // iframe embed
 *  <iframe width="560" height="315" src="https://www.youtube.com/embed/id" frameborder="0" allowfullscreen></iframe>
 *
 *  // attribution_link
 *  http://www.youtube.com/attribution_link?u=%2Fwatch%3Fv%3D*%26
 *  https://www.youtube.com/attribution_link?u=%2Fwatch%3Fv%3D*%26
 *
 * // -nocookie urls
 * www.youtube-nocookie.com/embed/id?
 * www.youtube-nocookie.com/embed/id?
 *
 */

const fn = getVideoId;

const testObj = (id: string | undefined) => ({ id, service: "youtube" });

describe("YouTube", () => {
  test("gets youtube metadata from iframe", () => {
    expect(
      fn(
        '<iframe width="560" height="315" src="https://www.youtube.com/embed/1234" frameborder="0" allowfullscreen></iframe>'
      )
    ).toMatchObject(testObj("1234"));
  });

  test("gets id from youtube shorts", () => {
    expect(fn("https://youtube.com/shorts/123?i=4")).toMatchObject(
      testObj("123")
    );
    expect(fn("https://www.youtube.com/shorts/1234?i=4")).toMatchObject(
      testObj("1234")
    );
    expect(fn("https://youtube.com/shorts/123")).toMatchObject(testObj("123"));
  });

  test("gets metadata from youtube shortcode formats", () => {
    expect(fn("youtube://1234")).toMatchObject(testObj("1234"));
    expect(fn("https://youtu.be/ABC12302")).toMatchObject(testObj("ABC12302"));
    expect(fn("http://youtu.be/ABC12303")).toMatchObject(testObj("ABC12303"));
    expect(
      fn("http://youtu.be/ABC12304?feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12304"));
    expect(fn("http://y2u.be/ABC12304")).toMatchObject(testObj("ABC12304"));
  });

  test("handles youtube v= and vi= formats", () => {
    expect(
      fn("http://www.youtube.com/ytscreeningroom?v=ABC1230")
    ).toMatchObject(testObj("ABC1230"));
    expect(fn("https://www.youtube.com/watch?v=ABC12301")).toMatchObject(
      testObj("ABC12301")
    );
    expect(
      fn(
        "http://www.youtube.com/watch?v=ABC12302&list=abc123&index=2&feature=plpp_video"
      )
    ).toMatchObject(testObj("ABC12302"));
    expect(
      fn("http://www.youtube.com/watch?v=ABC12303&feature=channel")
    ).toMatchObject(testObj("ABC12303"));
    expect(
      fn(
        "http://www.youtube.com/watch?v=ABC12304&playnext_from=TL&videos=abc123&feature=sub"
      )
    ).toMatchObject(testObj("ABC12304"));
    expect(
      fn("http://www.youtube.com/watch?v=ABC12305&feature=channel")
    ).toMatchObject(testObj("ABC12305"));
    expect(
      fn(
        "http://www.youtube.com/watch?v=ABC12306&playnext_from=TL&videos=abc123&feature=sub"
      )
    ).toMatchObject(testObj("ABC12306"));
    expect(fn("http://www.youtube.com/watch?v=ABC12307")).toMatchObject(
      testObj("ABC12307")
    );
    expect(
      fn("http://youtube.com/?v=ABC12308&feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12308"));
    expect(
      fn("http://youtube.com/?vi=ABC12309&feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12309"));
    expect(
      fn("http://youtube.com/watch?v=ABC12310&feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12310"));
    expect(
      fn("http://youtube.com/watch?vi=ABC12311&feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12311"));
    expect(
      fn("http://www.youtube.com/watch?v=ABC12312&feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12312"));
    expect(
      fn("http://www.youtube.com/watch?v=ABC12313&feature=youtu.be")
    ).toMatchObject(testObj("ABC12313"));
  });

  test("handles youtube /v/ and /vi/ formats", () => {
    expect(fn("http://www.youtube.com/v/ABC1230")).toMatchObject(
      testObj("ABC1230")
    );
    expect(
      fn("http://youtube.com/v/ABC12301?feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12301"));
    expect(
      fn("http://youtube.com/vi/ABC12302?feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12302"));
    expect(
      fn("https://i.ytimg.com/vi/0okagl9U2eo/hqdefault.jpg")
    ).toMatchObject(testObj("0okagl9U2eo"));
  });

  test("handles youtube /watch/ formats", () => {
    expect(fn("http://www.youtube.com/watch/ABC1230")).toMatchObject(
      testObj("ABC1230")
    );
    expect(fn("http://www.youtube.com/watch/ABC1230/")).toMatchObject(
      testObj("ABC1230")
    );
    expect(
      fn("http://youtube.com/watch/ABC12301?feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12301"));
    expect(
      fn("http://youtube.com/watch/ABC12301/?feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12301"));
    expect(
      fn("http://youtube.com/watch/ABC12302?feature=youtube_gdata_player")
    ).toMatchObject(testObj("ABC12302"));
  });

  test("handles youtube /e/ formats", () => {
    expect(fn("https://www.youtube.com/e/E1230")).toMatchObject(
      testObj("E1230")
    );
    expect(fn("http://www.youtube.com/e/E1231")).toMatchObject(
      testObj("E1231")
    );
    expect(fn("www.youtube.com/e/E1232")).toMatchObject(testObj("E1232"));
    expect(
      fn("https://youtube.com/e/E1233?feature=youtube_gdata_player")
    ).toMatchObject(testObj("E1233"));
  });

  test("handles youtube formats without protocols", () => {
    expect(fn("youtu.be/P1230")).toMatchObject(testObj("P1230"));
    expect(fn("youtube.com/e/P1231")).toMatchObject(testObj("P1231"));
    expect(fn("y2u.be/P1232")).toMatchObject(testObj("P1232"));
    expect(fn("i.ytimg.com/an_webp/P1233/mqdefault_6s.webp")).toMatchObject(
      testObj("P1233")
    );
  });

  test("handles youtube image /an_webp/{id}/ formats", () => {
    expect(
      fn("https://i.ytimg.com/an_webp/MYDcdp-VNmQ/mqdefault_6s.webp")
    ).toMatchObject(testObj("MYDcdp-VNmQ"));
  });

  test("handles youtube /embed/ formats", () => {
    expect(fn("https://www.youtube.com/embed/ABC1230")).toMatchObject(
      testObj("ABC1230")
    );
    expect(fn("www.youtube-nocookie.com/embed/ABC12301?rel=0")).toMatchObject(
      testObj("ABC12301")
    );
    expect(fn("http://www.youtube.com/embed/ABC12302?rel=0")).toMatchObject(
      testObj("ABC12302")
    );
  });

  test("handles youtube /user/ formats", () => {
    expect(
      fn("http://www.youtube.com/user/username#p/u/1/ABC1230")
    ).toMatchObject(testObj("ABC1230"));
    expect(
      fn("http://www.youtube.com/user/username#p/a/u/2/ABC12301")
    ).toMatchObject(testObj("ABC12301"));
    expect(
      fn("http://www.youtube.com/user/username#p/u/1/ABC12302?rel=0")
    ).toMatchObject(testObj("ABC12302"));
    expect(
      fn("https://youtube.com/user/WMFinland#p/a/u/1/G-3YxlZIhus")
    ).toMatchObject(testObj("G-3YxlZIhus"));
  });

  test("ignores youtube.com/user/* patterns", () => {
    expect(
      fn("https://www.youtube.com/user/ThreeDaysGraceVideos")
    ).toMatchObject(testObj(undefined));
  });

  test("returns id:undefined with /user/ format that does not have a video id", () => {
    expect(
      fn("https://www.youtube.com/user/ThreeDaysGraceVideos/videos")
    ).toMatchObject(testObj(undefined));
  });

  test("removes -nocookie", () => {
    expect(
      fn("www.youtube-nocookie.com/ytscreeningroom?v=ABC12300")
    ).toMatchObject(testObj("ABC12300"));
    expect(
      fn("http://www.youtube-nocookie.com/ytscreeningroom?v=ABC12300")
    ).toMatchObject(testObj("ABC12300"));
    expect(fn("http://www.youtube-nocookie.com/v/ABC12301")).toMatchObject(
      testObj("ABC12301")
    );
    expect(
      fn("http://www.youtube-nocookie.com/user/username#p/u/1/ABC12302")
    ).toMatchObject(testObj("ABC12302"));
    expect(fn("https://www.youtube-nocookie.com/embed/ABC12303")).toMatchObject(
      testObj("ABC12303")
    );
  });

  test("handles youtube attribution_links", () => {
    expect(
      fn(
        "http://www.youtube.com/attribution_link?u=%2Fwatch%3Fv%3DABC12300%26feature%3Dshare&a=JdfC0C9V6ZI"
      )
    ).toMatchObject(testObj("ABC12300"));
    expect(
      fn(
        "https://www.youtube.com/attribution_link?a=JdfC0C9V6ZI&u=%2Fwatch%3Fv%3DABC12301%26feature%3Dshare"
      )
    ).toMatchObject(testObj("ABC12301"));
    expect(
      fn(
        "http://www.youtube.com/attribution_link?u=/watch?v=ABC12302&feature=share&list=UUsnCjinFcybOuyJU1NFOJmg&a=LjnCygXKl21WkJdyKu9O-w"
      )
    ).toMatchObject(testObj("ABC12302"));
    expect(
      fn(
        "http://www.youtube.com/attribution_link?u=/watch?v=ABC12303&feature=share&a=9QlmP1yvjcllp0h3l0NwuA"
      )
    ).toMatchObject(testObj("ABC12303"));
    expect(
      fn(
        "http://www.youtube.com/attribution_link?a=fF1CWYwxCQ4&u=/watch?v=ABC12304&feature=em-uploademail"
      )
    ).toMatchObject(testObj("ABC12304"));
    expect(
      fn(
        "http://www.youtube.com/attribution_link?a=fF1CWYwxCQ4&feature=em-uploademail&u=/watch?v=ABC12305"
      )
    ).toMatchObject(testObj("ABC12305"));
  });

  test("handles youtube /live/ formats", () => {
    expect(fn("https://www.youtube.com/live/ABC1230")).toMatchObject(
      testObj("ABC1230")
    );
    expect(
      fn("www.youtube-nocookie.com/live/ABC12301?feature=share")
    ).toMatchObject(testObj("ABC12301"));
    expect(
      fn("http://www.youtube.com/live/ABC12302?feature=share")
    ).toMatchObject(testObj("ABC12302"));
  });

  test("youtube links returns undefined id if id missing", () => {
    expect(fn("https://www.youtube.com")).toMatchObject(testObj(undefined));
  });

  test("extracts ids from urls with time hashes", () => {
    expect(
      fn("https://www.youtube.com/watch?v=G-3YxlZIhus#t=0m10s")
    ).toMatchObject(testObj("G-3YxlZIhus"));
    expect(
      fn("http://www.youtube.com/watch?v=G-3YxlZIhus#t=0m10s")
    ).toMatchObject(testObj("G-3YxlZIhus"));
  });

  test("extracts ids from urls with trailing parameters", () => {
    expect(fn("http://youtu.be/G-3YxlZIhus&feature=channel")).toMatchObject(
      testObj("G-3YxlZIhus")
    );
    expect(
      fn("http://youtube.com/vi/G-3YxlZIhus&feature=channel")
    ).toMatchObject(testObj("G-3YxlZIhus"));
    expect(fn("http://youtube.com/vi/G-3YxlZIhus&feature=share")).toMatchObject(
      testObj("G-3YxlZIhus")
    );
    expect(fn("http://youtube.com/vi/G-3YxlZIhus&foo=bar")).toMatchObject(
      testObj("G-3YxlZIhus")
    );
  });
});

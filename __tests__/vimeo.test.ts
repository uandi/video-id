import { expect, test, describe } from "vitest";
import { getVideoId } from "../src";

/**
 *  Vimeo should be able to find these patterns:
 *
 *  // urls
 *  https://vimeo.com/id
 *  https://player.vimeo.com/video/id
 *  https://vimeo.com/id?
 *  https://www.vimeo.com/id?
 *  https://www.vimeo.com/id
 *  https://vimeo.com/id/hash
 *
 *  // iframe
 *  iframe src="https://player.vimeo.com/video/id"
 *
 *  // events
 *  https://vimeo.com/event/id
 *
 *  // channels groups and albums
 *  https://vimeo.com/channels/id
 *  https://vimeo.com/channels/yourchannel/id
 *  https://vimeo.com/groups/name/videos/id
 *  https://vimeo.com/album/album_id/video/id
 *  http://vimeo.com/name.swf?clip_id=id
 */

const fn = getVideoId;

const testObj = (id: string | undefined) => ({ id, service: "vimeo" });

describe("Vimeo", () => {
  test("gets vimeo metadata from url", () => {
    expect(fn("https://player.vimeo.com/video/123450987")).toMatchObject(
      testObj("123450987")
    );
    expect(fn("https://vimeo.com/1230897")).toMatchObject(testObj("1230897"));
    expect(fn("https://vimeo.com/140542479#t=0m3s")).toMatchObject(
      testObj("140542479")
    );
    expect(
      fn(
        "https://player.vimeo.com/video/176337266?color=ffffff&title=0&byline=0&portrait=0&badge=0"
      )
    ).toMatchObject(testObj("176337266"));

    expect(fn("https://player.vimeo.com/video/123450987#t=0m3s")).toMatchObject(
      testObj("123450987")
    );
    expect(fn("https://vimeo.com/123450987/randomhash")).toMatchObject(
      testObj("123450987")
    );
  });

  test("gets vimeo metadata from iframe", () => {
    expect(
      fn(
        '<iframe src="https://player.vimeo.com/video/97682350" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="https://vimeo.com/97682350">Todo list application utilizing the Swift programming language</a> from <a href="https://vimeo.com/user27750098">Rex Fatahi</a> on <a href="https://vimeo.com">Vimeo</a>.</p>'
      )
    ).toMatchObject(testObj("97682350"));
  });

  test("handles [uncommon] leading 'www' in vimeo urls", () => {
    expect(fn("https://www.vimeo.com/187191771")).toMatchObject(
      testObj("187191771")
    );
    expect(
      fn(
        '<iframe src="https://www.player.vimeo.com/video/97682350" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
      )
    ).toMatchObject(testObj("97682350"));
    expect(fn("https://www.player.vimeo.com/video/123450987")).toMatchObject(
      testObj("123450987")
    );
    expect(fn("https://www.vimeo.com/1230897")).toMatchObject(
      testObj("1230897")
    );
    expect(fn("https://www.vimeo.com/140542479#t=0m3s")).toMatchObject(
      testObj("140542479")
    );
    expect(
      fn(
        "https://www.player.vimeo.com/video/176337266?color=ffffff&title=0&byline=0&portrait=0&badge=0"
      )
    ).toMatchObject(testObj("176337266"));
    expect(
      fn("https://www.player.vimeo.com/video/123450987#t=0m3s")
    ).toMatchObject(testObj("123450987"));
    expect(fn("https://www.vimeo.com/123450987/randomhash")).toMatchObject(
      testObj("123450987")
    );
  });

  test("handles vimeo channel, groups, albums url patterns", () => {
    expect(fn("https://vimeo.com/channels/1234")).toMatchObject(
      testObj("1234")
    );
    expect(fn("https://vimeo.com/channels/yourchannel/12345")).toMatchObject(
      testObj("12345")
    );
    expect(fn("https://vimeo.com/groups/name/videos/123456")).toMatchObject(
      testObj("123456")
    );
    expect(fn("https://vimeo.com/album/album_id/video/1234567")).toMatchObject(
      testObj("1234567")
    );
  });

  test("handles swf embed patterns", () => {
    expect(
      fn(
        "http://vimeo.com/name.swf?clip_id=1234&server=vimeo.com&show_title=0&show_byline=0&show_portrait=0&color=00adef&fullscreen=1"
      )
    ).toMatchObject(testObj("1234"));
    expect(
      fn(
        "https://vimeo.com/name.swf?clip_id=1234&server=vimeo.com&show_title=0&show_byline=0&show_portrait=0&color=00adef&fullscreen=1"
      )
    ).toMatchObject(testObj("1234"));
    expect(fn("http://vimeo.com/name.swf?clip_id=1234")).toMatchObject(
      testObj("1234")
    );
    expect(fn("https://vimeo.com/name.swf?clip_id=1234")).toMatchObject(
      testObj("1234")
    );
  });

  test("handles vimeo events patterns", () => {
    expect(fn("https://vimeo.com/event/12345")).toMatchObject(testObj("12345"));
  });

  test("vimeo links returns undefined id if id missing", () => {
    expect(fn("https://www.vimeo.co")).toMatchObject(testObj(undefined));
  });
});

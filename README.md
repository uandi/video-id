# @uandi/video-id

> Get the YouTube, Vimeo video id from a url or embed string.

This is a fork of the original [get-video-id](https://github.com/radiovisual/get-video-id) package created by [radiovisual](https://github.com/radiovisual) ported to TypeScript without any dependencies.

It currently only supports YouTube and Vimeo urls as this is what we need for now. More will eventually added if needed.

## Install

You can install the package with your favourite package manager (we use pnpm):

```
pnpm add @uandi/video-id
```

## Usage

Import the `getVideoId` function and supply a url or embed string. If the service is supported it will return an object with `id` and `service`.

```js
import { getVideoId } from "@uandi/video-id";

getVideoId("https://www.youtube.com/watch?v=SbW_ugHq16U");
// => { id: "SbW_ugHq16U", service: "youtube" }

const { id } = getVideoId("https://www.youtube.com/watch?v=SbW_ugHq16U");
// => "SbW_ugHq16U"
```

## License

MIT © [u+i interact GmbH](https://uandi.com)

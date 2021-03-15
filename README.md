# Yōgan

## [![NPM Package][npm]][npm-url] [![Build Size][build-size]][build-size-url] [![NPM Downloads][npm-downloads]][npmtrends-url]


Yōgan automatically detect the WebGL programs and provide a smart GUI for the uniforms through [leva](https://github.com/pmndrs/leva).

#### Support :

- Support all types of postprocess (three/example/postprocess, postprocess, react-postprocess)
- Support material with onBeforeCompile
- Support troika derive material and troika-3d-text
- React and Vanilla builds
- Support SSR framework such as NextJS

## Shader initialize range
It is possible to specify the range of your uniforms:

`uniform float amount; // { "value": 0.5, "min": 0, "max": 10 }`

For the moment only float are supported, vectors should be added soon: https://github.com/pmndrs/leva/issues/141


<!-- 
Demo : [codesandbox](https://codesandbox.io/s/yoganvanilla-l55jn)

[`See more - @yogan/vanilla`](https://github.com/RenaudRohlinger/yogan/tree/main/packages/vanilla) -->

## React-Three-Fiber

```sh
yarn add -D @yogan/react
```

```jsx
import {
  Yogan, useEditorComposer,
} from '@yogan/react';

<Canvas>
  <Yogan />
  <EffectComposer ref={useEditorComposer()}></EffectComposer>
</Canvas>;
```
## Vanilla

```sh
yarn add -D @yogan/vanilla
```

```jsx
import {
  Yogan, useEditorComposer,
} from '@yogan/vanilla';

Yogan(scene, renderer);
let composer = new EffectComposer(renderer); // if using postprocess
useEditorComposer(composer);
```
<!-- 
Demo : [codesandbox](https://codesandbox.io/s/yoganreact-z59h4)

[`See more - @yogan/react`](https://github.com/RenaudRohlinger/yogan/tree/main/packages/react) -->

----
## Automatically removed in production

Yogan is automatically remove from the production build based on the `process.env.NODE_ENV`.

To render the editor in production :

```jsx
import { Yogan } from '@yogan/vanilla/dist/vanilla.cjs.development';
```

OR a custom env variable is available :

```jsx
process.env.YOGAN_PROD === 'SHOW';
```


[npm]: https://img.shields.io/npm/v/@yogan/core
[npm-url]: https://www.npmjs.com/package/@yogan/core
[build-size]: https://badgen.net/bundlephobia/minzip/@yogan/core
[build-size-url]: https://bundlephobia.com/result?p=@yogan/core
[npm-downloads]: https://img.shields.io/npm/dw/@yogan/core
[npmtrends-url]: https://www.npmtrends.com/@yogan/core

# How to contribute :

If you like this project, please consider helping out. All contributions are welcome as well as donations to [`paypal.me/renaudrohlinger`](https://www.paypal.me/renaudrohlinger) or by `BTC : 3DxQy7MAaFgJpuMpn8oHTyc679vREq5g6p`

[`twitter 🐈‍⬛ @onirenaud`](https://twitter.com/onirenaud)

# Yōgan

## [![NPM Package][npm]][npm-url] [![Build Size][build-size]][build-size-url] [![NPM Downloads][npm-downloads]][npmtrends-url]

Automatically detect the WebGL programs and provide a GUI for the uniforms.

![image](https://user-images.githubusercontent.com/15867665/106269312-b2778000-626f-11eb-906f-6def286e6c52.png)

#### Support :

- Support all types of postprocess (three/example/postprocess, postprocess, react-postprocess)
- Support material with onBeforeCompile
- Support troika derive material and troika-3d-text
- React and Vanilla builds
- Support SSR framework such as NextJS

## Quick start - Vanilla

```sh
yarn add -D @yogan/vanilla
```

```jsx
import {
  Yogan,
  useEditorComposer,
} from '@yogan/vanilla';

// add the editor in the init function of your app
Yogan(scene, renderer, {
  camera: camera, // handle responsize dpr for fullscreen
});

let composer = new EffectComposer(renderer);
useEditorComposer(composer);
```
<!-- 
Demo : [codesandbox](https://codesandbox.io/s/yoganvanilla-l55jn)

[`See more - @yogan/vanilla`](https://github.com/RenaudRohlinger/yogan/tree/main/packages/vanilla) -->

## Quick start - React-Three-Fiber

```sh
yarn add -D @yogan/react
```

```jsx
import {
  Yogan,
  useEditorComposer,
} from '@yogan/react';

<Canvas>
  <Yogan />
  <EffectComposer ref={useEditorComposer()}>...</EffectComposer>
</Canvas>;
```
<!-- 
Demo : [codesandbox](https://codesandbox.io/s/yoganreact-z59h4)

[`See more - @yogan/react`](https://github.com/RenaudRohlinger/yogan/tree/main/packages/react) -->

## Automatically removed in production

The Material Editor is automatically remove from the production build based on the `process.env.NODE_ENV`.

To render the editor in production :

```jsx
import { Yogan } from '@yogan/vanilla/dist/vanilla.cjs.development';
```

OR a custom env variable is available :

```jsx
process.env.TME_PROD === 'SHOW';
```

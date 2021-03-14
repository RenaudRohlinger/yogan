import React, { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import {
  editorState,
  editorContext,
  GuiDom,
  materialsToProgram,
} from '@yogan/core';

type YoganOptions = {
  camera?: PerspectiveCamera | OrthographicCamera;
  overrideRaf?: boolean;
  fullScreen?: boolean;
}

const optionsDefault: YoganOptions = {
  overrideRaf: false,
  fullScreen: true,
};

export let updateEditor = (
  _scene: Scene,
  _gl: WebGLRenderer,
  _options?: YoganOptions
) => {};
export let useEditorComposer = (
  _composer: any
) => {};
export let Yogan = (
  _scene: Scene,
  _gl: WebGLRenderer,
  _options?: YoganOptions
) => {};

if (process.env.NODE_ENV === 'production' && process.env.YOGAN_PROD !== 'SHOW') {
} else {
  const _resizeCanvasToDisplaySize = (
    gl: WebGLRenderer,
    options?: YoganOptions
  ) => {
    const canvas = gl.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      gl.setSize(width, height, false);
      if (options?.camera) {
        const camera = options.camera;

        if (camera.type === 'PerspectiveCamera') {
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
      }
    }

    return needResize;
  };

  updateEditor = (
    scene: Scene,
    gl: WebGLRenderer,
    _options?: YoganOptions
  ) => {
    const options = Object.assign(optionsDefault, _options);

    materialsToProgram(scene, gl);
    _resizeCanvasToDisplaySize(gl, options);
  };

  useEditorComposer = (composer: any) => {
    editorContext.composer = composer
  }


  const App = (props: any) => {
    useLayoutEffect(() => {
      editorState.scene = props.scene;
    });

    return (
      <>
        <GuiDom position={props.position} />
      </>
    );
  };

  Yogan = (
    scene: Scene,
    gl: WebGLRenderer,
    _options?: YoganOptions
  ) => {
    const options = Object.assign(optionsDefault, _options);
    Object.assign(editorState, options);

    materialsToProgram(scene, gl);
    if (!options || (options && !options.overrideRaf)) {
      const animate = () => {
        updateEditor(scene, gl, options);
        requestAnimationFrame(animate);
      };
      animate();
    }
    
    ReactDOM.render(<App scene={scene} />, document.body);
  };
}

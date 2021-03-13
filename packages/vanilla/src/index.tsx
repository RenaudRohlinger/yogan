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

type MaterialGuiOptions = {
  camera?: PerspectiveCamera | OrthographicCamera;
  overrideRaf?: boolean;
  fullScreen?: boolean;
}

const optionsDefault: MaterialGuiOptions = {
  overrideRaf: false,
  fullScreen: true,
};

export let updateEditor = (
  _scene: Scene,
  _gl: WebGLRenderer,
  _options?: MaterialGuiOptions
) => {};
export let useEditorComposer = (
  _composer: any
) => {};
export let MaterialGui = (
  _scene: Scene,
  _gl: WebGLRenderer,
  _options?: MaterialGuiOptions
) => {};

if (process.env.NODE_ENV === 'production' && process.env.TME_PROD !== 'SHOW') {
} else {
  const _resizeCanvasToDisplaySize = (
    gl: WebGLRenderer,
    options?: MaterialGuiOptions
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
    _options?: MaterialGuiOptions
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

  MaterialGui = (
    scene: Scene,
    gl: WebGLRenderer,
    _options?: MaterialGuiOptions
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

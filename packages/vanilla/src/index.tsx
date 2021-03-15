import React, { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import {
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
  overrideRaf?: boolean;
}

const optionsDefault: YoganOptions = {
  overrideRaf: false,
};

export let updateYogan = (
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
  updateYogan = (
    scene: Scene,
    gl: WebGLRenderer,
    _options?: YoganOptions
  ) => {
    const options = Object.assign(optionsDefault, _options);

    materialsToProgram(scene, gl);
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
        updateYogan(scene, gl, options);
        requestAnimationFrame(animate);
      };
      animate();
    }
    
    ReactDOM.render(<App scene={scene} />, document.body);
  };
}

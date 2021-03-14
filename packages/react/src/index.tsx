import React, { useCallback } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import {
  GuiDom,
  editorState,
  editorContext,
  materialsToProgram,
} from '@yogan/core';
import { Html } from './html';


type YoganOptions = {
  overrideRaf?: boolean;
  className?: string;
  fullScreen?: boolean;
}

const optionsDefault: YoganOptions = {
  overrideRaf: false,
  fullScreen: true,
};



export let Logic = () => null;
export let Yogan = (
  _options?: YoganOptions
) => {};

export let useEditorComposer = () => {};

if (process.env.NODE_ENV === 'production' && process.env.YOGAN_PROD !== 'SHOW') {
} else {
  Logic = () => {
    const { scene, gl } = useThree();

    useFrame(() => {
      materialsToProgram(scene, gl);
    });

    return null;
  };
  useEditorComposer = () => {
    const onRefChange = useCallback(node => {
      if (node === null) { 
        editorContext.composer = null
      } else {
        editorContext.composer = node
      }
    }, []);
    
    return onRefChange
  }

  Yogan = (_options?: YoganOptions) => {
    const options = Object.assign(optionsDefault, _options);
    Object.assign(editorState, options);

    return (
      <>
        <Logic />
        <Html>
          <GuiDom className={editorState.className} />
        </Html>
      </>
    );
  };
}

import React, { useCallback } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import {
  GuiDom,
  editorState,
  editorContext,
  materialsToProgram,
} from '@yogan/core';
import { Html } from './html';


type MaterialGuiOptions = {
  overrideRaf?: boolean;
  className?: string;
  fullScreen?: boolean;
}

const optionsDefault: MaterialGuiOptions = {
  overrideRaf: false,
  fullScreen: true,
};



export let Logic = () => null;
export let MaterialGui = (
  _options?: MaterialGuiOptions
) => {};

export let useEditorComposer = () => {};

if (process.env.NODE_ENV === 'production' && process.env.TME_PROD !== 'SHOW') {
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

  MaterialGui = (_options?: MaterialGuiOptions) => {
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

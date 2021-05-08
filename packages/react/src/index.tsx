import React, { useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  GuiDom,
  editorState,
  editorContext,
  materialsToProgram,
} from '@yogan/core';
import { Html } from './html';
import { useHelpers } from './helpers/useLights';
import DebugGrid from './helpers/debugGrid';
import { useControls } from 'leva';

type YoganOptions = {
  grid: boolean
}

const optionsDefault: YoganOptions = {
  grid: true
};



export let Logic = () => null;
export let Yogan = (
  _options?: YoganOptions
) => {};

export let useYoganComposer = () => {};
export let useYoganHelper = (node: any) => {};

if (process.env.NODE_ENV === 'production' && process.env.YOGAN_PROD !== 'SHOW') {
} else {
  Logic = () => {
    const { scene, gl } = useThree();

    useFrame(() => {
      materialsToProgram(scene, gl);
    });

    return null;
  };

  const YoganDebug = () => {
    const { grid } = useControls('debug', {
      grid: true
    })
    return (
      <>
      {grid && <DebugGrid />}
      </>
    )
  }

  useYoganComposer = () => {
    const onRefChange = useCallback(node => {
      if (node === null) { 
        editorContext.composer = null
      } else {
        editorContext.composer = node
      }
    }, []);
    
    return onRefChange
  }

  useYoganHelper = (node :any) => {
    useHelpers(node)
  }



  Yogan = (_options?: YoganOptions) => {
    const options = Object.assign(optionsDefault, _options);
    Object.assign(editorState, options);

    return (
      <>
        <Logic />
        {options.grid && <YoganDebug />}
        <Html>
          <GuiDom />
        </Html>
      </>
    );
  };
}

import React, { VFC } from 'react';
import { Gui } from './gui';
import { traverseMaterialsToProgram } from './middleware';
import { editorState as state, editorContextState } from './state';

export interface Props {
  className?: any;
  position?: string | undefined;
}
/**
 * Core components
 */
export let GuiDom: VFC<Props> = () => null;
export let editorState: any = {};
export let editorContext: any = {};
export let materialsToProgram: any = {};

if (process.env.NODE_ENV === 'production' && process.env.TMG_PROD !== 'SHOW') {
} else {
  GuiDom = ({}) => {
    return <Gui />;
  };
  editorState = state;
  editorContext = editorContextState;
  materialsToProgram = traverseMaterialsToProgram;
}

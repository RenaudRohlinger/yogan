import { levaStore } from 'leva';
import { StoreType } from 'leva/dist/declarations/src/types';
import { Material, Scene } from 'three';
import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

const levaStoreCtx = levaStore

export interface State {
  showUniforms: boolean;
  triggerUpdate: number;
  store: StoreType;
  length: number;
  numberPrograms: number;
  scene: Scene | null;
  composer: any | null;
  materials: Material[];
}

export const editorState = proxy<State>({
  showUniforms: false,
  length: 0,
  numberPrograms: 0,
  triggerUpdate: 0,
  scene: null,
  composer: null,
  materials: [],
  store: levaStoreCtx
});
devtools(editorState, 'material editor');

interface Map {
  [key: string]: any;
}

export const editorContextState: Map = {
  materials: {},
  programs: [],
  gl: null,
};

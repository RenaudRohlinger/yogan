import { Material, Scene } from 'three';
import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

export interface State {
  showUniforms: boolean;
  triggerUpdate: number;
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

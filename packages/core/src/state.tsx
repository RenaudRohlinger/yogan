import { Material, Scene } from 'three';
import { proxy } from 'valtio';
import { devtools } from 'valtio/utils';

export interface State {
  className: string;
  showUniforms: boolean;
  triggerUpdate: number;
  length: number;
  scene: Scene | null;
  composer: any | null;
  materials: Material[];
  tabs: any;
  activeMaterial: {
    type: string;
    open: boolean;
    model?: null | string;
  };
}

export const editorState = proxy<State>({
  className: '',
  showUniforms: false,
  length: 0,
  triggerUpdate: 0,
  scene: null,
  composer: null,
  materials: [],
  tabs: {},
  activeMaterial: {
    type: '',
    open: false,
    model: null,
  },
});
devtools(editorState, 'material editor');

interface Map {
  [key: string]: any;
}

export const editorContextState: Map = {
  materials: {},
  activeMaterialRef: {},
  programs: [],
  editorWidth: 520,
  editorMinusHeight: 0,
  gl: null,
};

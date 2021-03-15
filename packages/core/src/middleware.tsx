import { Color, FrontSide, Mesh, MeshBasicMaterial, Scene } from 'three';
import { addShaderDebugMaterial } from './helpers/improveMaterial';
import { editorState, editorContextState } from './state';

const getMUIIndex = (muid: string) => muid === 'muidEditor';

const isAlreadyDerived: any = {};
const nativePPisAlreadyDerived: any = [];

let hasInit = false

const _insertMaterialToEditor = (element: any, container: any, isEffect?: boolean) => {
  const el = isEffect ? element.screen : element
  if (!el.material.defines) {
    el.material.defines = {};
  }

  if (!el.material.defines.muidEditor) {
    el.material.defines = Object.assign(el.material.defines || {}, {
      muidEditor: el.material.id
    });
   
  }
  const muid = el.material.id;
  // prevent to derive loop
  if (
    muid &&
    !container[muid] &&
    el.material.defines
  ) {
    const { material } = addShaderDebugMaterial(el.material);
    el.material = material;

    // to check if multiple material users
    el.tmeDerived = true;
    el.material.numberOfMaterialsUser = 1
    container[muid] = el.material;
    container[muid].mesh = el;
    // handle postprocess and react-postprocess libs
    if (element.effects) {
      let id = 0
      for(const effect of element.effects) {
        effect.id = id++
        effect.isEffect = true
      }
      el.material.postprocess = element
      element.recompile()
    }
  }
}

const _insertNativePostProcessToEditor = (el: any, container: any) => {
  const muid = el.material.id;
  // prevent to derive loop
  if (
    muid &&
    !container[muid]
  ) {
    
    const { material } = addShaderDebugMaterial(el.material);
    el.material = material;
    // to check if multiple material users
    el.tmeDerived = true;
    el.material.postprocess = true

    container[muid] = el.material;
    container[muid].mesh = el;
  }
}

const meshDebugger:any = new Mesh(undefined, new MeshBasicMaterial({
  color: new Color(0xff0000),
  side: FrontSide,
  wireframe: true,
  visible: false
}))
meshDebugger.debugMaterial = true

export const traverseMaterialsToProgram = (scene: Scene, gl: any) => {
  editorContextState.gl = gl;

  if (!hasInit) {
    hasInit = true
  }
  if (editorContextState.composer) {
    editorContextState.composer.passes.forEach((pass: any) => {
      // check if is basic three shaderpass
      if (pass.fsQuad) {
        _insertNativePostProcessToEditor(pass, nativePPisAlreadyDerived)
      }

      // handle postprocess and react-postprocess libs
      if (pass.screen) {
        _insertMaterialToEditor(pass, isAlreadyDerived, true)
      }
    })
  }
  const programs: object[] = [];
  // update
  scene?.traverse((el: any) => {
    // Vanilla return Object3D so (el instanceof Mesh || el instanceof InstancedMesh) doesn't work ?
    if (el.material) {
      if (el.debugMaterial) {
        return
      }
      _insertMaterialToEditor(el, isAlreadyDerived)
      // inc counter if the mesh also use the material
      if (el.material.defines && !el.tmeDerived) {
        el.tmeDerived = true;
        el.material.numberOfMaterialsUser++
      }
    }
  });
  gl?.info?.programs?.forEach((program: any) => {
    const cacheKeySplited = program.cacheKey.split(',');
    // convert and supply all mesh associated to this material to a debugger material
    const muidDerived = cacheKeySplited[cacheKeySplited.findIndex(getMUIIndex) + 1];

    if (!isNaN(muidDerived) && isAlreadyDerived[muidDerived]) {
      isAlreadyDerived[muidDerived].program = program
      if (isAlreadyDerived[muidDerived].postprocess) {
        for(const effect of isAlreadyDerived[muidDerived].postprocess.effects) {
          programs.push({
            material: effect,
            program: program,
            effect: isAlreadyDerived[muidDerived].postprocess
          });
       };
      } else {
        programs.push({
          material: isAlreadyDerived[muidDerived],
          program: program,
        });
      }
     
    } else {
      const result = nativePPisAlreadyDerived.filter((e:any) => e.fragmentShader.includes(cacheKeySplited[0]))
      if (result.length > 0) {
        result.forEach((pickedMaterial: any) => {
          programs.push({
            material: pickedMaterial,
            program: program
          });
        });
      }
    }
  });
  if (
    programs.length !== editorContextState.programs.length
  ) {
    editorContextState.programs = programs;
    editorState.numberPrograms = programs.length;
    editorState.triggerUpdate++;
  }
};

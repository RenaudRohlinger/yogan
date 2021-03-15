import {
  getShaderWithObc,
} from './shaderToMaterial';

export const addShaderDebugMaterial = (material: any) => {
  let newMaterial = material;
  const shader = getShaderWithObc(newMaterial)
  newMaterial = Object.assign(newMaterial, shader);
  // wait the first compilation that will inject data into the material shaders
  setTimeout(() => {
    newMaterial.onBeforeCompile = function (shader: any) {
      if (!newMaterial.postprocess) {
        shader.uniforms = Object.assign(shader.uniforms, newMaterial.uniforms);
      }
      // @ts-ignore
      if (this.editorOnBeforeCompile) {
        // @ts-ignore
        this.editorOnBeforeCompile.call(this, shader)
      }
    };
  }, 0);
  return {
    debug: null,
    material: newMaterial,
  };
};

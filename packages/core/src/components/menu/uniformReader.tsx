

import React, { useEffect } from 'react';
import { editorContextState as editorContext, editorState } from '../../state';
import { folder, LevaPanel, useControls, useCreateStore, useStoreContext, LevaStoreProvider } from "leva";
import { useSnapshot } from 'valtio';
import * as THREE from 'three'
import { getNameForEditorMaterial, makeControls } from '../../helpers/shaderToMaterial';

// foreach
const color = new THREE.Color()
export const UniformReader = () => {
  const [arr, set]:any = React.useState([])
  const store = useCreateStore()

  const snapshot = useSnapshot(editorState);

  useEffect(() => {
    const tempArr:any = []

    editorContext.programs.forEach((program: any) => {
      const material: any = program.material;
      const programGl = program.program;
      if (!programGl) {
        return null
      }
      const name = getNameForEditorMaterial(material, programGl)
  
      if (!material.uniforms) {
        return null
      }
      const test = formatUniforms(material, programGl.id)
      tempArr.push({name: name, format: test, material: material})
    })
    set(tempArr)
    editorState.triggerUpdate++
  }, [editorState.numberPrograms])


  return (
    <div key={snapshot.triggerUpdate}>
      <LevaPanel store={store} />
      <LevaStoreProvider store={store}>
        {arr.map(({format, material, name}:any) => {
          return <UniformComp format={format} material={material} name={name} key={name.toString()} />;
        })}
      </LevaStoreProvider>
    </div>
  )
};


const UniformComp = ({format, material, name} :any) => {
  const obj:any = {}
  obj[name] = folder(format)
  if (!obj) {
    return null
  }

  const store = useStoreContext()
  const elements = useControls(obj, {store})

  // @ts-ignore
  useEffect(() => {
    if (material) {
      if (!material.uniforms) {
        return null
      }
      const uniforms = material.uniforms

      for (const [key, value] of Object.entries(elements)) {
        const val:any = value
        const keyWithoutProgId = key.split('_').shift()
        if (!keyWithoutProgId) {
          return
        }
        var materialUniform = uniforms instanceof Map ? uniforms.get(keyWithoutProgId) : uniforms[keyWithoutProgId]
        
        // is image
        if (typeof value === 'string' || !value) {
          loadTexture(uniforms, materialUniform, keyWithoutProgId, value)
        } else {

          if (materialUniform) {
            if (val['r'] && val['g'] && val['b']) {
              const factor =  255
              materialUniform.value = color.setRGB(val['r'] / factor, val['g'] / factor, val['b'] / factor)
              setUniformValue(uniforms, materialUniform, keyWithoutProgId)

            } else {
              materialUniform.value = value
              setUniformValue(uniforms, materialUniform, keyWithoutProgId)
            }
          }
        }
      }
    }
  }, [material, elements])

  return null
}




const formatUniforms = (material: any, id: number) => {
  const filteredItems:any = {}
  const improveLevaRange = makeControls(material.vertexShader, material.fragmentShader)

  if (material.uniforms.size && material.uniforms.size > 0) {
    material.uniforms.forEach((uniform: any, key: any) => {
      if (!uniform.isNativeUniforms && key !== 'time') {
        if (improveLevaRange && improveLevaRange[key]) {
          const range = improveLevaRange[key]
          if (!uniform.rangeInitialized) {
            uniform.value = range.value
            uniform.rangeInitialized = true
          }
  
          uniform.min = range.min
          uniform.max = range.max
        } else if (typeof uniform.value === 'number') {
          uniform.min = -1
          uniform.max = 1
        }
        if (uniform.type) {
          delete uniform.type
        }

        if (uniform && uniform.value && uniform.value.image) {
          filteredItems[`${key}_${id}`] = {image: uniform.value}
          uniform.copyRef = uniform.value.image.currentSrc
        } else if (uniform.value && uniform.value.isColor) {
          const col = uniform.value
          filteredItems[`${key}_${id}`] = {r: col.r * 255, g: col.g * 255, b: col.b * 255}
        } else {
          filteredItems[`${key}_${id}`] = uniform
        }
        material.uniforms.set(key, uniform)
        Object.entries(filteredItems[`${key}_${id}`]).map(([skey, value]) => {
          if (typeof value === 'string') {
            delete filteredItems[`${key}_${id}`][skey]
          }
        })
      }
    })
  } else if (typeof material.uniforms === 'object') {
    if (Object.keys(material.uniforms).length === 0) {
      return null
    }

    Object.entries(material.uniforms).map(([key, uniform]: any) => {
      if (!uniform.isNativeUniforms && key !== 'time') {
        if (improveLevaRange && improveLevaRange[key]) {
          const range = improveLevaRange[key]
          if (!uniform.rangeInitialized) {
            uniform.value = range.value
            uniform.rangeInitialized = true
          }
  
          uniform.min = range.min
          uniform.max = range.max
        } else if (typeof uniform.value === 'number') {
          uniform.min = Math.min(-1, -Math.round(uniform.value))
          uniform.max = Math.max(1, Math.round(uniform.value))
        }
        if (uniform.type) {
          delete uniform.type
        }
        if (uniform && uniform.value && uniform.value.image) {
          filteredItems[`${key}_${id}`] = {image: uniform.value}
          uniform.copyRef = uniform.value.image.currentSrc

        } else if (uniform.value && uniform.value.isColor) {
          const col = uniform.value
          filteredItems[`${key}_${id}`] = {r: col.r * 255, g: col.g * 255, b: col.b * 255}
        } else {
          filteredItems[`${key}_${id}`] = uniform
        }

        Object.entries(filteredItems[`${key}_${id}`]).map(([skey, value]) => {
          if (typeof value === 'string') {
            delete filteredItems[`${key}_${id}`][skey]
          }
        })
      }
    })
  }
  return filteredItems
}

const loadTexture = (uniforms: any, materialUniform: any, key: string, value: any) => {

  if (materialUniform && materialUniform.value && materialUniform.value.image) {
    if (value && value !== materialUniform.value.image.preventDouble) {
      new THREE.TextureLoader().load(value, (x) => {
        materialUniform.value = x
        materialUniform.value.wrapS = materialUniform.value.wrapT = THREE.RepeatWrapping

        materialUniform.value.image.preventDouble = value
        materialUniform.value.image.isOriginal = false
        materialUniform.value.needsUpdate = true
        setUniformValue(uniforms, materialUniform, key)

      })
    } else if (!value && !materialUniform.value.image.isOriginal) {
      new THREE.TextureLoader().load(materialUniform.copyRef, (x) => {
        materialUniform.value = x
        materialUniform.value.wrapS = materialUniform.value.wrapT = THREE.RepeatWrapping

        materialUniform.value.image.preventDouble = value
        materialUniform.value.image.isOriginal = true
        materialUniform.value.needsUpdate = true
        setUniformValue(uniforms, materialUniform, key)
      })
    }
  }
 
}

const setUniformValue = (uniforms: any, materialUniform: any, key: string) => {
  if (!uniforms[key]) {
    uniforms.set(key, materialUniform)
  }
}
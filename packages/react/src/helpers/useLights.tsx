import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import {useControls, useStoreContext} from 'leva'
import {editorState} from '@yogan/core'

function findHelper(node: any) {
  if (node.type.includes('Light')) {
    switch (node.type) {
      case 'DirectionalLight':
       return THREE.DirectionalLightHelper
      case 'SpotLight':
        return THREE.SpotLightHelper
      default:
        break;
    }
  }
}
function useHelpers(object3D: any, ...args: any[]) {
  // const {far, near, bias } = useControls({
  //   bias: { value: 0, max: 0.1, min: 0, onChange: (value, path, { disabled }) => {
  //     if (object3D.current) {
  //       object3D.current.bias = value
  //     }
  //   } },
  //   far: { value: 20, max: 20, min: 0, onChange: (value, path, { disabled }) => {
  //     if (object3D.current) {
  //       object3D.current.far = value
  //     }
  //   } },
  //   near: { value: 5, max: 20, min: 0, onChange: (value, path, { disabled }) => {
  //     if (object3D.current) {
  //       object3D.current.near = value
  //     }
  //   } },
  // }, editorState.store)

  const helper = useRef<any>(null)
  const camera = useRef<any>(null)
  const { scene } = useThree()
  useEffect(() => {
    if (object3D.current) {
      const proto = findHelper(object3D.current)

      if (!proto) return
      helper.current = new proto(object3D.current, ...args)
      
      if (helper.current) {
        scene.add(helper.current)
        if (object3D.current.shadow && object3D.current.shadow.camera) {
          camera.current = new THREE.CameraHelper(
            object3D.current.shadow.camera
          )
          scene.add(camera.current)
        }
      }
    }

    return () => {
      if (helper.current) {
        scene.remove(helper.current)
      }
      if (camera.current) {
        scene.remove(camera.current)
      }
    }
  }, [scene, object3D, args])
  useFrame(() => {
    if (helper.current) {
      helper.current.update()
    }
    if (camera.current) {
      camera.current.update()
    }
  })
  return helper
}

export { useHelpers }

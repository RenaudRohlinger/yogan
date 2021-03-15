import * as THREE from 'three'
import React, { useRef, Suspense, useEffect, useLayoutEffect } from 'react'
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber'
import { ContactShadows, Loader, useTexture } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { postProcessing } from './shaders/postprocessing'
import mergeRefs from 'react-merge-refs'
import { Yogan, useYoganComposer } from '@yogan/react'
import './shaders/MoonMaterial'
import img from './testtest.jpeg'

extend({ EffectComposer, ShaderPass, RenderPass, UnrealBloomPass })

function Moon(props) {
  const mesh = useRef()
  const lunarTexture = useTexture(img)

  useLayoutEffect(() => {
    lunarTexture.wrapS = lunarTexture.wrapT = THREE.MirroredRepeatWrapping
  }, [lunarTexture])

  useFrame(({ clock }, delta) => {
    mesh.current.material.time = clock.elapsedTime
    mesh.current.position.y = Math.sin(clock.elapsedTime) / 6
    mesh.current.rotation.x = mesh.current.rotation.y += delta / 10
  })

  return (
    <mesh ref={mesh} {...props}>
      <icosahedronBufferGeometry args={[1, 1]} />
      <moonMaterial side={THREE.DoubleSide} landscape={lunarTexture} />
    </mesh>
  )
}

function Effects() {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  useFrame((_, delta) => composer.current.render(delta), -1)
  return (
    <effectComposer ref={mergeRefs([composer, useYoganComposer()])} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[undefined, 1, 1, 0.6]} />
      <shaderPass attachArray="passes" args={[postProcessing]} />
    </effectComposer>
  )
}


export default function App() {
  
  return (
    <>
    <Canvas concurrent camera={{ position: [0, 0, 3], fov: 75 }}>
      <color attach="background" args={['#202020']} />
      <Suspense fallback={null}>
        <group position={[0, 0.25, 0]}>
          <Moon />
          <ContactShadows
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, -1.6, 0]}
            opacity={0.6}
            width={10}
            height={10}
            blur={1}
            far={1.35}
          />
        </group>

        <Effects />
      </Suspense>
      <Yogan />
      <Perf position={'bottom-right'} />
    </Canvas>
    {/* <Loader /> */}
  </>
  )
}

import React from 'react'
import { Canvas } from 'react-three-fiber';
import { MaterialGui, useEditorComposer } from '@yogan/react';
import { Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import { EffectComposer, Vignette } from '@react-three/postprocessing'
import './index.css'

function MyComponent() {
  return null
}

export default function App() {
  
  return (
    <Canvas concurrent orthographic pixelRatio={[1, 2]} camera={{ position: [0, 0, 5], near: 1, far: 15, zoom: 100 }}>
      <ambientLight />
      <MaterialGui />
      <React.Suspense fallback={null}>
        <Sphere
          args={[1, 32, 32]}
        >
          <MeshDistortMaterial factor={2} color={'black'} />
        </Sphere>
        <Environment preset={'studio'} />
        <EffectComposer ref={useEditorComposer()}>
          {/* <Noise opacity={0.4} /> */}
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>

      </React.Suspense>
    </Canvas>
  )
}

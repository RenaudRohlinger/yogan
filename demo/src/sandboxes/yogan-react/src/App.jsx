import React, {useRef, useState} from 'react'
import { Canvas, extend } from '@react-three/fiber';
import { Yogan, useYoganComposer, useYoganHelper } from '@yogan/react';
import { Environment, MeshDistortMaterial, OrbitControls, shaderMaterial, Sphere } from '@react-three/drei'
import { EffectComposer, Noise, Outline, Vignette } from '@react-three/postprocessing'
import './index.css'


const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform vec2 offset; // { "value": [0.1, 0.0], "max": [10., 10.0], "min": [-5., -5.0]}

  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.xy += + offset;
    gl_Position = projectionMatrix *  modelViewMatrix *  vec4(pos, 1.0);
  }
`
const fragmentShader = /* glsl */ `
  uniform float amount; // { "value": 0.5, "min": 0, "max": 10 }
  varying vec2 vUv;

  void main() {
    gl_FragColor = vec4(vUv * amount, 0., 1.);
  }
`

const MyMaterial = shaderMaterial(
  {
    amount: 0.5,
    offset: [0, -.2]
  },
  vertexShader,
  fragmentShader
)

extend({ MyMaterial })

function Test () {
  const light = useRef()
  useYoganHelper(light)
  const [state, setstate] = useState(false)
  setTimeout(() => {
   setstate(3000)
  }, 2000);
  return state ? (
    <directionalLight ref={light} />

    // <Sphere
    //       args={[1, 32, 32]}
    //     >
    //       <MeshDistortMaterial factor={2} color={'black'} />
    //     </Sphere>
  ) : null
}
export default function App() {
  return (
    <Canvas linear pixelRatio={[1, 2]} camera={{ position: [0, 0, 5] }}>
      <color attach='background' args={['#333']} />
      {/* <ambientLight /> */}
      <Yogan />
      <React.Suspense fallback={null}>
        <Sphere
          args={[1, 32, 32]}
        >
          <myMaterial />
        </Sphere>
        <Test />
        {/* <directionalLight position={[-15,5,0]} /> */}
        {/* <Environment preset={'studio'} /> */}
        {/* <EffectComposer ref={useYoganComposer()}>
          <Noise opacity={0.4} />
          <Outline edgeThickness={1} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer> */}
      </React.Suspense>
      <OrbitControls />
    </Canvas>
  )
}

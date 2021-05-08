import React from 'react'

function undepth(obj: any) {
  if (obj && obj.material) {
    obj.material.depthWrite = false
  }
}

function DebugGrid() {
  return (
    <group>
      <gridHelper ref={undepth} renderOrder={9000} args={[1000, 1000, '#17141F', '#060606']} />
      <gridHelper
        ref={undepth}
        renderOrder={9001}
        args={[100, 100, '#fff', '#17141F']}
        scale={10}
      />
      <axesHelper ref={undepth} renderOrder={9002} scale={20} />
    </group>
  )
}

export default DebugGrid

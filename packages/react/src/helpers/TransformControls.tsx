// @ts-nocheck
import React, { forwardRef, useLayoutEffect, useEffect, useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { TransformControls as TransformControlsImpl } from 'three/examples/jsm/controls/TransformControls'

const TransformControls = forwardRef(
  ({ children, object, orbitControlsRef, onObjectChange, onDraggingChange, ...props }, ref) => {
    const [camera, gl] = useThree((state) => [state.camera, state.gl])
    const controls = useMemo(() => new TransformControlsImpl(camera, gl.domElement), [
      camera,
      gl.domElement
    ])

    useLayoutEffect(() => {
      controls.attach(object)

      return () => void controls.detach()
    }, [object, controls])

    useEffect(() => {
      const callback = (event) => {
        // useStore.setState({
        //   transforming: event.value
        // })
      }

      if (controls) {
        controls.addEventListener('dragging-changed', callback)
      }

      return () => {
        controls.removeEventListener('dragging-changed', callback)
      }
    }, [controls, orbitControlsRef])

    useEffect(() => {
      if (onObjectChange) {
        controls.addEventListener('objectChange', onObjectChange)
      }

      return () => {
        if (onObjectChange) {
          controls.removeEventListener('objectChange', onObjectChange)
        }
      }
    }, [onObjectChange, controls])

    useEffect(() => {
      if (onDraggingChange) {
        controls.addEventListener('dragging-changed', onDraggingChange)
      }

      return () => {
        if (onDraggingChange) {
          controls.removeEventListener('dragging-changed', onDraggingChange)
        }
      }
    }, [controls, onDraggingChange])

    return <primitive dispose={null} object={controls} ref={ref} {...props} />
  }
)

export default TransformControls

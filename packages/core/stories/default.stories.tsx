import React from 'react'
import { Story, Meta } from '@storybook/react'

import { useControls } from '../src'

export default {
  title: 'Default',
} as Meta

const Controls = () => {
  return (
    <div>
    </div>
  )
}

const Template: Story<any> = () => {
  const [mounted, toggle] = React.useState(true)
  return (
    <div>
     <button onClick={() => toggle((t) => !t)}>{mounted ? 'Unmount' : 'Mount'}</button>
      {mounted && <Controls />}
    </div>
  )
}

export const Caching = Template.bind({})

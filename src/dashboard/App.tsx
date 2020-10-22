import * as React from 'react'
import { Typography } from '@actyx/industrial-ui'
import { Machines } from './Machines'
import { Orders } from './Orders'

// responsive css to show the dashboard on a smartphone
import './main.css'

export const App = (): JSX.Element => (
  <div className="main">
    <div style={{ flex: '1' }}>
      <Typography variant="distance">Machines</Typography>
      <Machines />
    </div>
    <div style={{ flex: '1' }}>
      <Typography variant="distance">Orders</Typography>
      <Orders />
    </div>
  </div>
)

import * as React from 'react'
import { Typography } from '@actyx/industrial-ui'
import { Machines } from './Machines'
import { Orders } from './Orders'

// responsive css to show the dashboard on a smartphone
import './main.css'

export const App = (): JSX.Element => (
  <div className="main" style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{ padding: '42px' }}>
      <Typography variant="distance" semiBold>
        Machines
      </Typography>
      <Machines />
    </div>
    <div style={{ padding: '42px' }}>
      <Typography variant="distance" semiBold>
        Orders
      </Typography>
      <Orders />
    </div>
  </div>
)

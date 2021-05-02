import * as React from 'react'
import { Toolbar, Typography } from '@actyx/industrial-ui'
import { Machines } from './Machines'
import { Orders } from './Orders'

// responsive css to show the dashboard on a smartphone
import './main.css'

export const App = (): JSX.Element => (
  <>
    <Toolbar variant="dark">
      <div style={{ width: '24px' }}></div>
      <Typography variant="distance" color="#ffffff">
        Dashboard
      </Typography>
    </Toolbar>
    <div className="main" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px' }}>
        <Typography variant="distance" semiBold>
          Available Machines
        </Typography>
        <Machines />
      </div>
      <div style={{ padding: '24px' }}>
        <Typography variant="distance" semiBold>
          ERP Orders
        </Typography>
        <Orders />
      </div>
    </div>
  </>
)

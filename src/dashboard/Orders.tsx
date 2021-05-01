import * as React from 'react'
import { useRegistryFish } from '@actyx-contrib/react-pond'
import { Typography } from '@actyx/industrial-ui'
import { OrderFish } from '../fish/orderFish'

export const Orders = () => {
  // Get all order states with the useRegistryFish. If a state changes or the registry changes, the component gets redrawn
  const orders = useRegistryFish(OrderFish.registry, Object.keys, OrderFish.of)
  // This component gets drawn for each entry in the machines array and just shows the state of the machine
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
        maxWidth: '500px',
      }}
    >
      {orders
        .map((s) => {
          console.log(s)
          return s
        })
        .map((m, idx) => (
          <div
            key={m.state.stateType !== 'undefined' ? m.state.name : idx}
            style={{
              backgroundColor: 'white',
              borderRadius: 15,
              padding: '12px',
              marginBottom: '24px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* this check will never fail. But technically, an order fish could be in the undefined state */}
            {m.state.stateType !== 'undefined' && (
              <>
                {/* in the `props` you will get the properties provided to the fish factory */}
                <Typography variant="distance">Order Number: {m.props}</Typography>
                <br />
                {/* display some interesting data to the user */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>
                    <Typography variant="standard">State: {m.state.stateType}</Typography>{' '}
                  </div>
                  <div>
                    <Typography variant="standard">Machine: {m.state.machine}</Typography>{' '}
                  </div>
                  <div>
                    <Typography variant="standard">Duration: {m.state.duration}h</Typography>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  )
}

import * as React from 'react'
import { useRegistryFish } from '@actyx-contrib/react-pond'
import { MachineFish } from '../fish/machineFish'
import { Typography } from '@actyx/industrial-ui'

export const Machines = () => {
  // get all machine states with the useRegistryFish
  const machines = useRegistryFish(MachineFish.registry, Object.keys, MachineFish.of)

  // this component gets drawn for each entry in the machines array and just shows the state of the machine
  return (
    <div>
      {machines.map((m) => (
        <div
          key={m.state.name}
          style={{
            backgroundColor: 'white',
            margin: '15px 5px',
            padding: '15px 25px',
            borderRadius: 15,
          }}
        >
          <div>
            <Typography variant="distance">{m.props}</Typography>
            <Typography variant="standard"> ({m.state.stateType})</Typography>
          </div>

          {(m.state.stateType === 'active' || m.state.stateType === 'finish') && (
            <div style={{ display: 'flex' }}>
              <div style={{ flex: '1' }}>
                <Typography variant="standard">current order:</Typography>{' '}
                <Typography variant="standard" bold>
                  {m.state.order.name}
                </Typography>
              </div>
              <div style={{ flex: '1' }}>
                <Typography variant="standard">duration: {m.state.order.duration}</Typography>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

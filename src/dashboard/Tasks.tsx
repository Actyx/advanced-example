import * as React from 'react'
import { useRegistryFish } from '@actyx-contrib/react-pond'
import { Typography } from '@actyx/industrial-ui'
import { TaskFish } from '../fish/taskFish'

export const Tasks = () => {
  // Get all task states with the useRegistryFish if a state change or the registry change. The component get redrawn
  const tasks = useRegistryFish(TaskFish.registry, Object.keys, TaskFish.of)
  // This component get drawn for each entry in the machines array and just shows the state of the machine
  return (
    <div>
      {tasks
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
              padding: '10px 15px',
              margin: '15px 5px',
            }}
          >
            {/* this check will never fail. But technically, a task fish could be in the undefined state */}
            {m.state.stateType !== 'undefined' && (
              <>
                {/* in the `props` you will get the properties provided to the fish factory */}
                <Typography variant="distance">Task: {m.props}</Typography>
                <br />
                {/* display some interesting data to the user */}
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: '1' }}>
                    <Typography variant="standard">State: {m.state.stateType}</Typography>{' '}
                  </div>
                  <div style={{ flex: '1' }}>
                    <Typography variant="standard">Machine: {m.state.machine}</Typography>{' '}
                  </div>
                  <div style={{ flex: '1' }}>
                    <Typography variant="standard">Duration: {m.state.duration} Sec</Typography>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
    </div>
  )
}
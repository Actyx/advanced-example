import * as React from 'react'

import { Typography, Button, Input, ToggleButtons } from '@actyx/industrial-ui'
import { useFish, usePond } from '@actyx-contrib/react-pond'
import { MachineFish } from '../fish/machineFish'
import { TaskFish } from '../fish/taskFish'

export const App = (): JSX.Element => {
  // Define some react states for the user interactions
  const [name, setName] = React.useState<string>('')
  const [duration, setDuration] = React.useState<number>(15)
  const [machine, setMachine] = React.useState<string>('')

  // Get the state of the MachineRegistry fish. We use this later to create a select field
  const machines = useFish(MachineFish.registry)
  // get the pond to emit events
  const pond = usePond()

  // click eventHandler to place the new task
  const placeTask = () => {
    // check if the input is valid
    if (name === '' || duration === 0 || machine === '') {
      return
    }

    // prepare the tags for the event
    const taskTag = TaskFish.tags.task.withId(name)
    const taskForMachineTag = TaskFish.tags.taskForMachine.withId(machine)
    // emit the event with pond.emit
    pond.emit(taskTag.and(taskForMachineTag), {
      eventType: 'placed',
      duration,
      machine,
      name,
    })
    // reset the input field to avoid spamming
    setName('')
  }

  // create the react app.
  // I use the actyx industrial-ui to create shop-floor proven components
  return (
    <div
      style={{
        margin: '120px auto',
        width: 600,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: '30px 10px',
      }}
    >
      <div style={{ margin: '10px 10px' }}>
        <Typography variant="heading">Place a new task</Typography>
      </div>
      <div style={{ margin: '10px 10px' }}>
        <Typography variant="distance">Name</Typography>
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Input value={name} type="text" onChange={({ target }) => setName(target.value)} />
        </div>
      </div>
      <div style={{ margin: '10px 10px' }}>
        <Typography variant="distance">Duration</Typography>
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <ToggleButtons
            items={[
              { id: '5', label: '5 Sec' },
              { id: '15', label: '15 Sec' },
              { id: '30', label: '30 Sec' },
            ]}
            onToggle={(value) => setDuration(parseInt(value))}
          />
        </div>
      </div>

      <div style={{ margin: '10px 10px' }}>
        <Typography variant="distance">Machine</Typography>
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <ToggleButtons
            /*
             * the items of the machine select came from the machine registry.
             * I just map the keys of the registry state to the React data.
             *
             * As soon the state change. The component is triggered automatically to redraw
             */
            items={Object.keys(machines.state).map((m) => ({ id: m, label: m }))}
            onToggle={(value) => setMachine(value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button
          text="Place task"
          variant="raised"
          color="primary"
          // Add the click eventHandler to the button onClick
          onClick={placeTask}
          disabled={name === '' || duration === 0 || machine === ''}
        />
      </div>
    </div>
  )
}

import * as React from 'react'

import { Typography, Button, Input, ToggleButtons } from '@actyx/industrial-ui'
import { useFish, usePond } from '@actyx-contrib/react-pond'
import { MachineFish } from '../fish/machineFish'
import { OrderFish } from '../fish/orderFish'

export const App = (): JSX.Element => {
  // Define some react states for the user interactions
  const [name, setName] = React.useState<string>('')
  const [duration, setDuration] = React.useState<number>(15)
  const [machine, setMachine] = React.useState<string>('')

  // Get the state of the MachineRegistry fish. We use this later to create a select field
  const machines = useFish(MachineFish.registry)
  // get the pond to emit events
  const pond = usePond()

  // click eventHandler to place the new order
  const placeOrder = () => {
    // check if the input is valid
    if (name === '' || duration === 0 || machine === '') {
      return
    }

    // prepare the tags for the event
    const orderTag = OrderFish.tags.order.withId(name)
    const orderForMachineTag = OrderFish.tags.orderForMachine.withId(machine)
    // emit the event with pond.emit
    pond.emit(orderTag.and(orderForMachineTag), {
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
        width: '100%',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
      }}
    >
      <div>
        <Typography variant="heading">Place a new order</Typography>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <Typography variant="distance">Order Number</Typography>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Input value={name} type="text" onChange={({ target }) => setName(target.value)} />
        </div>
      </div>
      <div style={{ marginBottom: '12px' }}>
        <Typography variant="distance">Planned Duration</Typography>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <ToggleButtons
            items={[
              { id: '1', label: '1h' },
              { id: '3', label: '3h' },
              { id: '5', label: '5h' },
            ]}
            onToggle={(value) => setDuration(parseInt(value))}
          />
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <Typography variant="distance">Machine</Typography>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <ToggleButtons
            /*
             * the items of the machine select came from the machine registry.
             * I just map the keys of the registry state to the React data.
             *
             * As soon the state changes, the component is triggered automatically to redraw
             */
            items={Object.keys(machines.state).map((m) => ({ id: m, label: m }))}
            onToggle={(value) => setMachine(value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <Button
          text="Place order"
          variant="raised"
          color="primary"
          // Add the click eventHandler to the button onClick
          onClick={placeOrder}
          disabled={name === '' || duration === 0 || machine === ''}
        />
      </div>
    </div>
  )
}

/* std pattern */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Pond } from '@actyx-contrib/react-pond'
import { App } from './App'

// user ReactDOM to render te application
ReactDOM.render(
  <React.StrictMode>
    {/* Pond initialize the connection to ActyxOS and draw the children when the connection is established */}
    <Pond loadComponent={<div>Connecting to ActyxOS</div>}>
      {/* App that can use usePond, useFish, useRegistryFish, ... */}
      <App />
    </Pond>
  </React.StrictMode>,
  document.getElementById('root'),
)

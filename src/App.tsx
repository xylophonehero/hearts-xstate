import { createContext, useContext, useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Player from './Player'
import { worker } from './startWorker'
import { useInterpret } from '@xstate/react'
import { HeartsMachine, heartsMachine } from './heartsMachine'
import { useSelector } from '@xstate/react'
import { InterpreterFrom } from 'xstate'
import { HeartsContext } from './service'
import {
  createTRPCProxyClient,
  createWSClient,
  httpLink,
  splitLink,
  wsLink,
} from '@trpc/client';
import type { AppRouter } from '../server/server';
import { socket } from './socket'

// const wsClient = createWSClient({
//   url: `ws://localhost:2022`,
// });
// const trpc = createTRPCProxyClient<AppRouter>({
//   links: [
//     // call subscriptions through websockets and the rest over http
//     splitLink({
//       condition(op) {
//         return op.type === 'subscription';
//       },
//       true: wsLink({
//         client: wsClient,
//       }),
//       false: httpLink({
//         url: `http://localhost:2022`,
//       }),
//     }),
//   ],
// });
// const WorkerContext = React.createContext(worker)

function App({ id }) {
  useEffect(() => {
    socket.connect()
    return () => {
      socket.close()
    }
  }, [])

  return (
    <Player id={id} />
    // <Player id="2" />
    // <Player id="3" />
    // <Player id="4" />
  )

}

export default App


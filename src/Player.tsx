import { useHeartsService } from "./service"
import { useActor, useInterpret } from "@xstate/react"
import Hand from "./Hand"

import { HeartsContext } from './service'
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { HeartsMachine, heartsMachine, HandActor } from "./heartsMachine"
// import { worker } from "./startWorker"
import Start from "./Start"
import { socket } from "./socket"

interface Props {
  id: string
}

const PlayerWrapper = ({ id }: Props) => {
  const service = useInterpret<HeartsMachine>(heartsMachine)
  const sendRef = useRef(service.send)

  useEffect(() => {
    socket.on('message', (event) => {
      console.log(event)
      // sendRef.current(event)
    })
  }, [service])


  return <HeartsContext.Provider value={Object.assign(service, {
    // replace dafault send to with a send to socket
    send: (event) => {
      socket.send(event)
    }
  })}>
    <Player id={id} />
  </HeartsContext.Provider>
}

function Player({ id }: Props) {
  const service = useHeartsService()
  const [state] = useActor(service)

  return (
    // Used to get a unique ref in server version
    // <HeartsContext.Provider value={service}>
    <div className="grid items-end  justify-center">
      <div>Player 2</div>
      <Hand handId="hand-2" handActor={service.system.get('hand-' + 2) as HandActor} />
      <Hand handId={`hand-${id}`} handActor={service.system.get('hand-' + id) as HandActor} />
      {state.matches('starting') && <Start />}
    </div>
    // </HeartsContext.Provider>
  )
}
export default PlayerWrapper

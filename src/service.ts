import { createContext, useContext } from "react"
import { InterpreterFrom } from "xstate"
import { HeartsMachine } from "./worker"
import { worker } from "./startWorker"
import { socket } from "./socket"
import { useActor } from "@xstate/react"

export const HeartsContext = createContext<InterpreterFrom<HeartsMachine> | null>(null)

export const useHeartsService = () => {
  const ctx = useContext(HeartsContext)
  if (!ctx) throw new Error("useHeartsService must be used within a HeartsProvider")
  // const send = (event) => {
  //   console.log(event)
  //   return worker.postMessage(event)
  // }
  // Object.assign(ctx, {
  //   oldSend: ctx.send,
  //   send,
  // })
  return ctx
}

export const useHeartsSubService = (systemId: string) => {
  const mainService = useHeartsService()
  const subService = mainService.system.get(systemId)
  if (!subService) throw new Error("useHeartsService must be used within a HeartsProvider")
  // useActor(subService)
  return Object.assign(useActor(subService), {
    1: (event) => socket.send(event)
  })
}

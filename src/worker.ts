import { interpret } from "xstate"
import { heartsMachine } from "./heartsMachine"


const service = interpret(heartsMachine, { devTools: true })
service.subscribe((state) => {
  console.log(service.system.get('hand-1'))
  // postMessage(state.event)
})
service.start()


onmessage = (event) => {
  service.send(event.data)
  // Get the raised event lists and apply it to all  machines
  // Filter out what eachh client canot see
  console.log(event.data)
  postMessage(event.data)
}


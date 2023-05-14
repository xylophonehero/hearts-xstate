import { useHeartsService } from "./service"

function Start() {
  const service = useHeartsService()
  return <button onClick={() => service.send({ type: 'START' })}>Start</button>
}

export default Start

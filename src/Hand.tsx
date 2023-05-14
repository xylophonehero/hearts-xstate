import { useActor } from "@xstate/react";
import { HandActor } from "./worker";
import CardComp from "./Card";
import { useHeartsService, useHeartsSubService } from "./service";

interface Props {
  handActor: HandActor
  handId: string
}
function Hand({ handId }: Props) {
  const [state, send] = useHeartsSubService(handId)
  // const service = useHeartsService()
  // const [state] = useActor(service)
  const { cards } = state.context

  return (
    <div className="flex -space-x-2">
      {cards.map((card) => (
        <CardComp onClick={() => send({ type: 'REMOVE_CARD', card })} key={card.id} card={card} />
      ))}
    </div>
  )
}

export default Hand

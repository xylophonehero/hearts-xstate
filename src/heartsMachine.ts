import { createMachine, sendParent, pure, sendTo, assign, ActorRefFrom, raise } from "xstate";
const suits = ['hearts', 'diamonds', 'spades', 'clubs'] as const;
type Suit = typeof suits[number];

export interface Card {
  id: number;
  suit: Suit;
  rank: number;
}

const iniitalizeDeck: Card[] = () => {
  return [...Array(52).keys()].map((cardId) => ({
    id: cardId,
    suit: suits[Math.floor(cardId / 13)],
    rank: cardId % 13 + 1,
  })).sort(() => Math.random() - 0.5);
}

const deckMachine = createMachine({
  context: {
    cards: iniitalizeDeck(),
  },
  on: {
    DEAL: {
      actions: ['deal', sendParent({ type: 'NEXT' })],
      // actions: 'deal',
    },
  },
}, {
  actions: {
    deal: pure(({ event, context }) => {
      return [
        ...context.cards.map((card, index) => sendTo(({ system }) => system.get([...event.handIds][index % 4]), {
          type: 'ADD_CARD',
          card: card,
        })),
        assign({
          cards: [],
        }),
        // sendTo('root', { type: 'NEXT' })
      ]
    })
  }
});

const zoneMachine = createMachine({
  types: {
    events: {} as
      | { type: 'DEAL', targets: string[] }
  },
  context: {
    cards: [] as Card[],
  },
  on: {
    ADD_CARD: {
      actions: 'addCard',
    },
    REMOVE_CARD: {
      actions: 'removeCard',
    },
    EMPTY: {
      actions: 'empty',
    },
    DEAL: {
      actions: ['deal'],
    },
    DRAW: {
      actions: 'draw',
    },
  },
}, {
  actions: {
    addCard: assign({
      cards: ({ context, event }) => [...context.cards, event.card],
    }),
    removeCard: assign({
      cards: ({ context, event }) => context.cards.filter((card) => card.id !== event.card.id),
    }),
    empty: assign({
      cards: [],
    }),
    deal: pure(({ event, context }) => {
      return [
        ...context.cards.map((card, index) => sendParent({
          type: 'QUEUE',
          event: sendTo(({ system }) => system.get([...event.targets][index % event.targets.length]), {
            type: 'ADD_CARD',
            card: card,
          })
        })
        ),
        sendParent({
          type: 'QUEUE',
          event: sendTo(({ system }) => system.get(context.systemId), {
            type: 'EMPTY',
          })
        }),
        sendParent({
          type: 'QUEUE',
          event: raise({ type: 'NEXT' }),
        })
      ]
    })
  }
});

export type HandActor = ActorRefFrom<typeof zoneMachine>


export const heartsMachine = createMachine({
  id: 'hearts',
  types: {
    context: {
      deck: {} as ActorRefFrom<typeof zoneMachine>,
      hand: {} as Map<string, ActorRefFrom<typeof zoneMachine>>,
    },
    events: {} as
      | { type: 'NEXT' }
      | { type: 'START' }
      | {
        type: 'MOVE_CARD',
        fromId: string,
        toId: string,
        card: Card,
      },
  },
  context: {
    $queue: [] as any[],
  },
  invoke: [{
    systemId: 'deck',
    src: zoneMachine,
  },
  {
    systemId: 'table',
    src: zoneMachine,
  },
  {
    systemId: 'hand-1',
    src: zoneMachine,
  },
  {
    systemId: 'hand-2',
    src: zoneMachine,
  },
  {
    systemId: 'hand-3',
    src: zoneMachine,
  },
  {
    systemId: 'hand-4',
    src: zoneMachine,
  }
  ],
  entry: [
    // 'spawnHands',
  ],
  initial: 'starting',
  on: {
    REMOVE_CARD: {
      actions: sendTo(({ system }) => system.get('hand-2'), ({ event }) => event),
    },
    MOVE_CARD: {
      actions: [
        sendTo(({ system, event }) => system.get(event.toId), ({ event }) => ({ type: 'ADD_CARD', card: event.card })),
        sendTo(({ system, event }) => system.get(event.fromId), ({ event }) => ({ type: 'REMOVE_CARD', card: event.card })),
      ],
    },
    QUEUE: {
      actions: assign({
        $queue: ({ context, event }) => [...context.$queue, event.event],
      }),
    },
    EMPTY_QUEUE: pure(({ context }) => {
      return [
        ...context.$queue.forEach((event) => {
          raise(event)
        }),
        assign({
          $queue: [],
        }),
      ]
    }),
  },
  states: {
    starting: {
      on: {
        START: 'dealing',
      },
    },
    dealing: {
      entry: ['deal'],
      on: {
        NEXT: 'playing',
      },
    },
    playing: {},
  },
}, {
  actions: {
    // spawnDeck: assign({
    //   deck: ({ spawn }) => spawn(deckMachine, { systemId: 'deck' }),
    // }),
    // spawnHands: assign({
    //   hand: ({ spawn }) => {
    //     const handMap = new Map();
    //     [...Array(4).keys()].forEach((playerId) => {
    //       handMap.set(playerId, spawn(handMachine, { systemId: `hand-${playerId}` }))
    //     });
    //     return handMap
    //   }
    // }),
    deal: sendTo(({ system }) => {
      return system.get('deck')
    }, {
      type: 'DEAL', count: 'all', targets: ['hand-1', 'hand-2', 'hand-3', 'hand-4']
    }),
  }
});

export type HeartsMachine = typeof heartsMachine

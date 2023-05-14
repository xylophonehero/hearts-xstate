import React from 'react'
import { Card } from './heartsMachine'
import { cva } from "class-variance-authority";

const cardCva = cva([
  'h-20', 'w-12', 'bg-gray-100', 'border', 'border-gray-600', 'rounded',
  'hover:bg-gray-200',
], {
  variants: {
    suit: {
      clubs: 'text-gray-700',
      diamonds: 'text-red-500',
      hearts: 'text-red-500',
      spades: 'text-gray-700'
    },
  }
})

const suitIcons = {
  clubs: '♣',
  diamonds: '♦',
  hearts: '♥',
  spades: '♠'
}

const rankText = {
  1: 'A',
  11: 'J',
  12: 'Q',
  13: 'K',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10'
}

interface Props {
  card: Card
}

function CardComp({ card, onClick }: Props) {
  const { suit, rank } = card
  return (
    <div onClick={onClick} className={cardCva({ suit })} >
      <div>{rankText[rank]}</div>
      <div>{suitIcons[suit]}</div>
    </div>
  )
}

export default CardComp

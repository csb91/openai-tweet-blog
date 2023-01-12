import { useState, useEffect } from 'react'
import TweetCard from './TweetCard'

export default function List ({ tweets }) {

  return (
    <>
    {tweets.map((tweet, index) => (
      <TweetCard tweet={tweet} key={index} />
    ))}
    </>
  )
}


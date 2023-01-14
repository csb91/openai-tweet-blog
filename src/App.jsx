import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios';
import './App.css'
import OpenAIForm from './OpenAIForm'
import TweetList from './TweetList'

export default function App() {
  const [count, setCount] = useState(0)
  const [tweets, setTweets] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/all')
    .then(res => {
      setTweets(res.data)
    })
    .catch(err => {console.log(err)})
  }, [])

  console.log('here', tweets)
  return (
    <div className="App">
      <h1>OpenAI + Twitter</h1>
      <div>
        <OpenAIForm tweets={tweets} setTweets={setTweets} />
      </div>
      <div className='listContainer'>
        <TweetList tweets={tweets} />
      </div>
    </div>
  )
}
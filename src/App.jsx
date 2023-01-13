import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios';
import './App.css'
import ChatGPTForm from './ChatGPTForm'
import TweetList from './TweetList'

export default function App() {
  const [count, setCount] = useState(0)
  const [tweets, setTweets] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/all')
    .then(res => {
      //console.log(res.data)
      setTweets(res.data)
    })
    .catch(err => {console.log(err)})
  }, [])

  console.log(tweets)
  return (
    <div className="App">
      <h1>ChatGPT + Twitter</h1>
      <div>
        <ChatGPTForm />
      </div>
      <div className='listContainer'>
        <TweetList tweets={tweets}/>
      </div>
    </div>
  )
}
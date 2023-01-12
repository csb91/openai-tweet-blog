import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios';
import './App.css'
import Form from './Form'
import List from './List'

export default function App() {
  const [count, setCount] = useState(0)
  const [tweets, setTweets] = useState(['hi', 'hi', 'hi'])

  useEffect(() => {
    axios.get('http://localhost:3000/all')
    .then(res => {console.log('get', res)})
    .catch(err => {console.log(err)})
  }, [tweets])

  return (
    <div className="App">
      <h1>ChatGPT + Twitter</h1>
      <div>
        <Form />
      </div>
      <div className='listContainer'>
        <List tweets={tweets}/>
      </div>
    </div>
  )
}
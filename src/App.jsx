import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import axios from 'axios';
import './App.css'
import Form from './Form'
import List from './List'

export default function App() {
  const [count, setCount] = useState(0)
  const [tweets, setTweets] = useState(['hi', 'hi', 'hi'])

  // const test = axios.post('http://localhost:3000/generate', {
  //   "prompt": "Create 10 viral tweets about react, make some of them contain polls in twitter format"
  // })
  // .then(res => {console.log(res)})
  // .catch(err => {console.log(err)})

  useEffect(() => {
    axios.get('http://localhost:3000/all')
    .then(res => {console.log('get', res)})
  }, [tweets])

  return (
    <div className="App">
      <h1>ChatGPT + Twitter</h1>
      <Form />
      <div className="card">

      </div>
      <List tweets={tweets}/>
    </div>
  )
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import TwitterIcon from '@mui/icons-material/Twitter';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VerifiedIcon from '@mui/icons-material/Verified';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function TweetCard({ tweet }) {
  const[tweetSent, setTweetSent] = useState(false)
  const databaseId = tweet._id;

  const sendTweet = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/createTweet', {
      'tweet': tweet
    })
    .catch(err => console.log(err))
    window.location.reload();
  }

  const deleteDB = (e) => {
    e.preventDefault();
  }

  const deleteTwitter = (e) => {
    e.preventDefault();
  }

  return (
    <>
    <ListItem sx={{border:'1px solid grey', width:'60vw', minHeight:'7em', marginBottom: '1em', borderRadius: '8px', overflow: 'hidden'}}>
        <ListItemText primary={tweet.tweet} />
        <ListItemIcon>
          {tweet.tweetId === 'false' &&
            <>
            <TwitterIcon sx={{paddingRight: '1em', paddingLeft: '3em', '&:hover': {color: 'blue'}}} onClick={sendTweet} />
            <DeleteForeverIcon sx={{'&:hover': {color: 'red'}}} onClick={deleteDB} />
            </>
          }
          {tweet.tweetId !== 'false' &&
            <>
            <VerifiedIcon sx={{paddingRight: '1em', paddingLeft: '3em'}} />
            <DeleteIcon sx={{'&:hover': {color: 'red'}}} onClick={deleteTwitter} />
            </>
          }
        </ListItemIcon>
    </ListItem>
    </>
  )
}
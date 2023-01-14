import { useState, useEffect } from 'react'
import TwitterIcon from '@mui/icons-material/Twitter';
import DeleteIcon from '@mui/icons-material/Delete';
import VerifiedIcon from '@mui/icons-material/Verified';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function TweetCard({ tweet }) {
  const[tweetSent, setTweetSent] = useState(false)
  const databaseId = tweet._id;

  const sendTweet = () => {
    setTweetSent(!tweetSent)
  }

  return (
    <>
    <ListItem sx={{border:'1px solid grey', width:'60vw', minHeight:'7em', marginBottom: '1em', borderRadius: '8px', overflow: 'hidden' }}>
        <ListItemText primary={tweet.tweet} />
        <ListItemIcon>
          {!tweetSent &&
            <TwitterIcon sx={{paddingRight: '1em', paddingLeft: '3em', '&:hover': {color: 'blue'}}} onClick={sendTweet}/>
          }
          {tweetSent &&
            <VerifiedIcon sx={{paddingRight: '1em', paddingLeft: '3em'}}/>
          }
          <DeleteIcon sx={{'&:hover': {color: 'red'}}} onClick={()=>{console.log('delete')}}/>
        </ListItemIcon>
    </ListItem>
    </>
  )
}
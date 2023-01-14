import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TweetCard from './TweetCard';


export default function tweetList({ tweets }) {

  return (
    <>
    <Box sx={{width: '100%', minWidth: 480, bgcolor: 'background.black', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <nav aria-label="main mailbox folders">
        <List>
          {tweets.map((tweet, index) => (
            <TweetCard tweet={tweet} key={index} />
          ))}
        </List>
      </nav>
    </Box>
    </>
  )
}


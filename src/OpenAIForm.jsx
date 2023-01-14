import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const model = [
  {
    value: 'text-davinci-003',
    label: 'text-davinci-003'
  },
  {
    value: 'code-davinci-002',
    label: 'code-davinci-002'
  }
]

export default function OpenAIForm({ tweets, setTweets }) {
  const [test, setTest] = useState([]);
  const [temperature, setTemperature] = useState('');
  const [maxTokens, setMaxTokens] = useState('');
  const [numberTweets, setNumberTweets] = useState('');
  const [loader, setLoader] = useState(0);

  const handleTempChange = (e) => {
    const newTemp = e.target.value;
    if (newTemp >= 0 && newTemp <= 1) {
      setTemperature(newTemp);
    } else {
      alert('Out of Range');
    }
  }

  const handleTokenChange = (e) => {
    const newMax = Math.round(e.target.value);
    if (newMax >= 0 && newMax <= 4096) {
      setMaxTokens(newMax);
    } else {
      alert('Out of Range');
    }
  }

  const handleNumberTweetsChange = (e) => {
    const newNumTweets = Math.round(e.target.value);
    if (newNumTweets >= 0 && newNumTweets <= 30) {
      setNumberTweets(newNumTweets);
    } else {
      alert('Out of Range');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let model = e.target.elements.model.value;
    let temp = Number(temperature);
    let max_tokens = Number(maxTokens);
    let nTweets = Number(numberTweets);
    let prompt = e.target.elements.prompt.value;

    if (temp && maxTokens && e.target.elements.model.value.length > 1 && e.target.elements.prompt.value.length >= 15) {
      setLoader(1);
      axios.post('http://localhost:3000/generate', {
        'model': model,
        'prompt': prompt,
        'temperature': temp,
        'max_tokens': max_tokens,
        'numberTweets': nTweets
      })
      .then(res => {
        setLoader(0);
        setTweets(res.data);
      })
      .catch(err => {console.log(err)})
    } else {
      alert('Please Check Input Minimum Requirements');
    }
  }

  return (
    <Box
      onSubmit={handleSubmit}
      display="flex"
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: 500, maxWidth: '100%' },
        flexDirection: 'column'
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="model"
          name="model"
          select
          label="Select"
          defaultValue="text-davinci-003"
          helperText="Please select your model"
        >
          {model.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="temperature"
          name="temperature"
          label="Input Number from 0 to 1.0"
          helperText="Please select the randomness of the response, 0 = conservative & 1.0 = creative"
          value={temperature}
          onChange={handleTempChange}
        >
        </TextField>
        <TextField
          id="max_tokens"
          name="max_tokens"
          label="Input Number from 0 to 4096"
          helperText="Please select the max characters in the response"
          value={maxTokens}
          onChange={handleTokenChange}
        >
        </TextField>
        <TextField
          id="max_tokens"
          name="max_tokens"
          label="Input Number from 0 to 30"
          helperText="Please select the number of tweets to generate"
          value={numberTweets}
          onChange={handleNumberTweetsChange}
        >
        </TextField>
      </div>
      <div>
        <TextField
          id="prompt"
          name="prompt"
          label="Input Prompt"
          multiline
          rows={5}
          helperText="Enter prompt here, minimum of 15 characters"
          variant="standard"
        />
      </div>
      <div>
        {loader === 0 &&
          <button type='submit'>
            Generate Tweets
          </button>
        }
        {loader === 1 &&
          <CircularProgress />
        }
      </div>
    </Box>
  );
}
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const model = [
  {
    value: 'text-davinci-003',
    label: 'text-davinci-003'
  }
]

export default function Form() {
  const [test, setTest] = useState([])
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(e.target.elements.model.value)
    console.log(e.target.elements.temperature.value)
    console.log(e.target.elements.max_tokens.value)
    console.log(e.target.elements.prompt.value)
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
          inputProps={{
            step: 0.05,
            min: 0,
            max: 1.0,
            type: "number"
          }}
        >
        </TextField>
        <TextField
          id="max_tokens"
          name="max_tokens"
          label="Input number from 0 to 4096"
          helperText="Please select the max characters in the response"
          inputProps={{
            step: 96,
            min: 0,
            max: 4096,
            type: "number"
          }}
        >
        </TextField>
      </div>
      <div>
      <TextField
          id="prompt"
          name="prompt"
          label="Prompt"
          multiline
          rows={5}
          defaultValue="Enter prompt here..."
          variant="standard"
        />
      </div>
      <div>
        <button type='submit'>
          Generate Tweets
        </button>
      </div>
    </Box>
  );
}
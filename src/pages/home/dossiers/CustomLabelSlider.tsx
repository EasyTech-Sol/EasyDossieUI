import * as React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const options = [
  'A,B,C',
  'A,B,C,D',
  'A,B,C,D,E'
];



export default function CustomLabelSlider() {
  const [value, setValue] = React.useState(0);
  const [output, setOutput] = React.useState("A,B,C")

  return (
    <Slider
      value={value}
      min={0}
      max={options.length - 1}
      step={1}
      marks
      color='success'
      valueLabelDisplay="auto"
      valueLabelFormat={(v) => options[v]}
      onChange={(e, newValue) => {
        setValue(newValue as number)
        setOutput(options[newValue])
      }}
    />
  );
}

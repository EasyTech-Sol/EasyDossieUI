import * as React from 'react';
import Slider from '@mui/material/Slider';

const options = [
  'A,B,C',
  'A,B,C,D',
  'A,B,C,D,E'
];

interface CustomLabelSliderProps {
  setOutput: (output: string) => void;
}

export default function CustomLabelSlider({ setOutput }: CustomLabelSliderProps) {
  const [value, setValue] = React.useState(0);

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
      onChange={(_e, newValue) => {
        setValue(newValue as number);
        setOutput(options[newValue]);
      }}
      sx={{
        width: '100%',
        maxWidth: 'calc(100% - 24px)', 
        marginBottom: 2,
      }}
    />
  );
}

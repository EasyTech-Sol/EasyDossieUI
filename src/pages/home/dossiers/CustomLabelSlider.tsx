import * as React from 'react';
import Slider from '@mui/material/Slider';

const options: Concept[] = [
  'A,B,C',
  'A,B,C,D',
  'A,B,C,D,E'
];

interface CustomLabelSliderProps {
  setOutput: (output: Concept) => void
  initialValue?: Concept
}



export default function CustomLabelSlider({ setOutput, initialValue }: CustomLabelSliderProps) {
  const [value, setValue] = React.useState(initialValue ? options.indexOf(initialValue) : 0);

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

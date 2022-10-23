import './App.css';
import { Wheel } from 'react-custom-roulette';
import React, { useState } from 'react';
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';
const colors = {
  green: '#1B5E20',
  black: '#212121',
  red: '#B71C1C',
  gold: '#F9A825'
}

function App() {
  const data : Array<WheelData> = [
    { option: '28' },
    { option: '9' },
    { option: '26' },
    { option: '30' },
    { option: '11' },
    { option: '7' },
    { option: '20' },
    { option: '32' },
    { option: '17' },
    { option: '5' },
    { option: '22' },
    { option: '34' },
    { option: '15' },
    { option: '3' },
    { option: '24' },
    { option: '36' },
    { option: '13' },
    { option: '1' },
    { option: '00',
      style: {
        backgroundColor: colors.green
      }},
    { option: '27' },
    { option: '10' },
    { option: '25' },
    { option: '29' },
    { option: '12' },
    { option: '8' },
    { option: '19' },
    { option: '31' },
    { option: '18' },
    { option: '6' },
    { option: '21' },
    { option: '33' },
    { option: '16' },
    { option: '4' },
    { option: '23' },
    { option: '35' },
    { option: '14' },
    { option: '2' },
    { option: '0',
    style: {
      backgroundColor: colors.green
    }},
  ];

  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if ( mustSpin !== false ) return;
    const newPrizeNumber = Math.floor(Math.random() * data.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true);
  }
  type betColor = 'green' | 'red' | 'black';
  const [betColor, setBetColor] = useState<betColor | null>(null);
  const handleStop = () => {
    setMustSpin(false);

    if( Number(data[prizeNumber].option) !== 0 ){
      if( prizeNumber % 2 === 0 )
        setBetColor('black');
      else
        setBetColor('red');
    }else
      setBetColor('green');
  }

  return (
    <>
       <Wheel 
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        spinDuration={0.01}
        data={data}
        backgroundColors={[colors.black, colors.red]}
        textColors={['#ffffff']}
        perpendicularText={true}
        textDistance={90}
        outerBorderWidth={5}
        outerBorderColor={colors.gold}
        innerRadius={82}
        onStopSpinning={handleStop}
      />
      <button onClick={handleSpinClick}>
        SPIN
      </button>
    </>
  );
}

export default App;

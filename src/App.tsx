import './App.css';
import { Wheel } from 'react-custom-roulette';
import React, { useState } from 'react';
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';
import PropTypes, {InferProps} from 'prop-types';
const colors = {
  green: '#1B5E20',
  black: '#212121',
  red: '#B71C1C',
  gold: '#F9A825'
}

function Table({numbers}: InferProps<typeof Table.propTypes>) {

  return <div id='rouletteTable'>
    <div id='zeros'>
      <div id='N0'>
        <button className='straight'>0</button>
        <button className='split'></button>
      </div>
      <div id='N00'>
        <button className='straight'>00</button>
      </div>
    </div>
    <div id='inside'>
      {
        numbers.map( (number, i) => {
          return <div
            id={`N${number}`}
            key={i}
          >
            <button className='straight'>{number}</button>
            <button className={ ( i % 3 === 0 ) ? 'street' : 'bottom'}></button>
            { 
            ( number === 1 || number === 3 ) ?
              <button className='right'></button> :
            ( number === 2 ) ? <>
                <button className='split0'></button> 
                <button className='basket'></button> 
                <button className='split00'></button>
              </> : ''
            }
            {
              ( number !== 34 && number !== 35 && number !== 36 ) ?<>
                <button className={ ( i % 3 === 0 ) ? 'dbStreet' : 'corner'}></button>
                <button className='left'></button>
              </>: ''
            }
            {
              ( number === 1 && number === 2 && number === 3 ) ?
              <button className={ (number === 1) ? 'topLine' : 'trio'}></button> : ''
            }
            </div>;
        })
      }
    </div>
    <div id='columns'>
      <div id='COL1'>
        <button>2 TO 1</button>
      </div>
      <div id='COL2'>
        <button>2 TO 1</button>
      </div>
      <div id='COL3'>
        <button>2 TO 1</button>
      </div>
    </div>
    <div id='evens'>
      <div id='D1'>
        <button>1ST 12</button>
      </div>
      <div id='D2'>
        <button>2ND 12</button>
      </div>
      <div id='D3'>
        <button>3RD 12</button>
      </div>
      <div id='1TO18'>
        <button>1 TO 18</button>
      </div>
      <div id='even'>
        <button>EVEN</button>
      </div>
      <div id='red'>
        <button>RED</button>
      </div>
      <div id='black'>
        <button>BLACK</button>
      </div>
      <div id='odd'>
        <button>ODD</button>
      </div>
      <div id='19TO36'>
        <button>19 TO 36</button>
      </div>
    </div>
  </div>;
}
Table.propTypes = {
  numbers: PropTypes.array.isRequired
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

  const tableNumbers = Array.from(
    data.filter(t => Number(t.option) !== 0),
    i => Number(i.option))
  .sort(
    (a, b) => a - b
    )
  return <>
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
      <Table
        numbers={tableNumbers}
      />
    </>;
}

export default App;

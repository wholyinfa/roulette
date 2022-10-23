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

type betColor = 'green' | 'red' | 'black';
interface idNumbers{
  number: number,
  color: betColor
}
function Table({numbers}: InferProps<typeof Table.propTypes>) {
  let groupedNumbers: idNumbers[][] = [];

  let I = 0;
  let numberRow: idNumbers[] = [];
  for ( let i = 1; i <= numbers.length; i++ ){
    numberRow.push(numbers[i - 1]);
    if ( i % 3 === 0 ) {
      groupedNumbers.push(numberRow);
      numberRow = [];
      I++;
    };
  }
  console.log(groupedNumbers);
  return <div id='rouletteTable'>
    <div id='zeros'>
      <div id='N0'>
        <button className='straight' style={{backgroundColor: colors.green}}>0</button>
        <button className='split'></button>
      </div>
      <div id='N00'>
        <button className='straight' style={{backgroundColor: colors.green}}>00</button>
      </div>
    </div>
    <div id='inside'>
      {
        groupedNumbers.map( (numbers, i) => {
          return <div className='row' key={i}>
          {
            numbers.map( (idNumber, ii) => {
              const num = idNumber.number;
              return <div
                id={`N${num}`}
                key={ii}
              >
                <button className='straight' style={{backgroundColor: colors[idNumber.color]}}>{num}</button>
                <button className={ ( num % 3 === 0 ) ? 'street' : 'bottom'}></button>
                { 
                ( num === 1 || num === 3 ) ?
                  <button className='right'></button> :
                ( num === 2 ) ? <>
                    <button className='split0'></button> 
                    <button className='basket'></button> 
                    <button className='split00'></button>
                  </> : ''
                }
                {
                  ( num !== 34 && num !== 35 && num !== 36 ) ?<>
                    <button className={ ( ii % 3 === 0 ) ? 'dbStreet' : 'corner'}></button>
                    <button className='left'></button>
                  </>: ''
                }
                {
                  ( num === 1 ) ?
                  <button className={'trio'}></button> : ''
                }
                {
                  ( num === 3 ) ? <>
                  <button className={'topLine'}></button>
                  <button className={'trio'}></button></> : ''
                }
                </div>;
            })
          }
          </div>
        })
      }
    </div>
    <div id='outsideLeft'>
      <div id='COL1'>
        <button className='diamondButton'>2 TO 1</button>
      </div>
      <div id='COL2'>
        <button className='diamondButton'>2 TO 1</button>
      </div>
      <div id='COL3'>
        <button className='diamondButton'>2 TO 1</button>
      </div>
    </div>
    <div id='outsideBottom'>
      <div id='dozens'>
        <div id='D1'>
          <button className='diamondButton'>1ST 12</button>
        </div>
        <div id='D2'>
          <button className='diamondButton'>2ND 12</button>
        </div>
        <div id='D3'>
          <button className='diamondButton'>3RD 12</button>
        </div>
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

  const idNumbers: idNumbers[] = data.map( (n , i) => ({
    number: Number(n.option),
    color: ( i % 2 === 0 ) ? 'black' : 'red'
  }))

  const tableNumbers: idNumbers[] = Array.from(
    idNumbers.filter(t => Number(t.number) !== 0),
    i => i)
  .sort(
    (a, b) => a.number - b.number
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

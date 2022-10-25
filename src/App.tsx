import './App.css';
import { Wheel } from 'react-custom-roulette';
import React, { useEffect, useRef, useState } from 'react';
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
                    <button className={ ( num % 3 === 0 ) ? 'dbStreet' : 'corner'}></button>
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
      <div id='evens'>
        <div id='F1TO18'>
          <button className='diamondButton'>1 TO 18</button>
        </div>
        <div id='even'>
          <button className='diamondButton'>EVEN</button>
        </div>
        <div id='red'>
          <button className='theRedBlack'>RED</button>
            <div className='diamond' style={{borderBottomColor: colors.red}}>
              <div className='extension' style={{borderTopColor: colors.red}}></div>
            </div>
            <div className='diamond border'>
              <div className='extension'></div>
            </div>
        </div>
        <div id='black'>
          <button className='theRedBlack'>BLACK</button>
          <div className='diamond' style={{borderBottomColor: colors.black}}>
            <div className='extension' style={{borderTopColor: colors.black}}></div>
          </div>
          <div className='diamond border'>
            <div className='extension'></div>
          </div>
        </div>
        <div id='odd'>
          <button className='diamondButton'>ODD</button>
        </div>
        <div id='F19TO36'>
          <button className='diamondButton'>19 TO 36</button>
        </div>
      </div>
    </div>
  </div>;
}
Table.propTypes = {
  numbers: PropTypes.array.isRequired
}


interface chips{
  c5: number,
  c25: number,
  c50: number,
  c100: number,
  c500: number,
  c1000: number,
  c5000: number,
  c10000: number,
}
function BetBoard({children, totalMoney, setTotalMoney, calculateChips}: InferProps<typeof BetBoard.propTypes>) {

  const maxAmount = 100000;
  const minAmount = 100;
  function addDots(num: number){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const value = ( target.value === '' ) ? '' : target.value.match(/[0-9]/g)?.join('');
    console.log(value);
    if(
      ( value || value === '' ) &&
      Number(value) <= maxAmount
    ) setTotalMoney(value);
  }
  const [boughtIn, setBoughtIn] = useState<boolean>(true);
  const handleSubmit = () => {
    if( totalMoney >= minAmount ) setBoughtIn(true);
    else document.querySelector('#minNotice')?.classList.add('active');
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { target } = Object(e);
    const cleanUp = ( target.parentElement.classList.contains('active') ) ? true : false;
    document.querySelectorAll('#chips .chipContainer').forEach(element => {
      if ( !cleanUp )
      element.classList.add('fade');
      else
      element.classList.remove('fade');

      element.classList.remove('active');
    });
    
    if ( cleanUp ) return;
    target.parentElement.classList.add('active');
    target.parentElement.classList.remove('fade');
  }

  const chips: chips = calculateChips();
  return <div id='betBoard'>
    
    {
      boughtIn ?
        <div id='betConsole'>
          <h2 id='amountSection'>
            <div>AMOUNT LEFT:</div>
            <div>{addDots(totalMoney)} €</div>
          </h2>
          <div id='chipSection'>
            <div id='chips'>
              {
                Object.entries(chips).map( ([key, value], i) => {
                  if( value )
                  return <div key={i} className='chipContainer'>
                    <button onClick={(e) => handleClick(e)} className={`chip ${key}`}>

                    </button>
                    <div className='amount'>
                      {value}
                    </div>
                  </div>;
                })
              }
            </div>
          </div>
        </div> :
        <div id='buyInConsole'>
          <h2>HOW MUCH DO YOU WANT TO BUY IN?</h2>
          <div id='minNotice'>MIN: {addDots(minAmount)} €</div>
          <div id='maxNotice'>MAX: {addDots(maxAmount)} €</div>
          <input type='text ' name='totalAmount' value={totalMoney} onChange={ (e) => handleChange(e)} />
          <button className='card charcoalButton' onClick={handleSubmit}>PLAY!</button>
        </div>
    }
    
  </div>
}
BetBoard.propTypes = {
  children: PropTypes.any,
  totalMoney: PropTypes.any.isRequired,
  setTotalMoney: PropTypes.func.isRequired,
  calculateChips: PropTypes.func.isRequired,
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
  const [totalMoney, setTotalMoney] = useState<number>(100000);
  const calculateChips = () => {
    function division(total: number,num: number){
      return Math.floor(total / num);
    }
    const cChips = {
      c5: 0,
      c25: 0,
      c50: 0,
      c100: 0,
      c500: 0,
      c1000: 0,
      c5000: 0,
      c10000: 0,
    };
    Object.keys(cChips).map( key => {
      const extractedNum = parseInt(key.replace('c',''));
      (cChips as any)[key] = division(totalMoney, extractedNum);
    });
    return cChips;
  }

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
      <BetBoard
        totalMoney={totalMoney}
        setTotalMoney={setTotalMoney}
        calculateChips={calculateChips}
      />
    </>;
}

export default App;

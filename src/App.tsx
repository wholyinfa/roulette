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
type betTypes = 
  'straight' | 'split' | 'trio' | 'corner' |
  'street' | 'dbStreet' | 'column' | '1st12' |
  '2nd12' | '3rd12' | '1to18' | 'even' | 'odd' |
  'red' | 'black' | '19to36' | 'topLine' ;
interface idNumbers{
  number: number,
  color: betColor
}
interface Bet {
  chip: string,
  score: number,
  id: string,
  betClass: string,
  betCount: number,
  affectedNumbers: number[] | string[]
} 
function BetButton({children, id, activeBet, removeBet}: InferProps<typeof BetButton.propTypes>){
  const bets = activeBet.filter( c => c.id === id);
  
  const handleClick = (id: string) => 
    Object(document.querySelector(id)).click();

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, i: number) => {
    e.preventDefault();
    removeBet(i);
  }

  return <div id={id}>
      {
        (bets) ?
            bets.map( (b, i) => {
              const style = 
              ( b.betClass === 'left' ) ? {left: '0%', top: '50%'} :
              ( b.betClass === 'right' ) ? {left: '100%', top: '50%'} :
              ( b.betClass === 'bottom' || b.betClass === 'street' ) ? {left: '50%', top: '100%'} :
              ( b.betClass === 'top' ) ? {left: '50%', top: '0%'} :
              ( b.betClass === 'topLine' || (b.betClass === 'trio' && id === 'N1') ) ? {left: '100%', top: '100%'} :
              ( b.betClass === 'trio' && id === 'N3' ) ? {left: '100%', top: '0%'} :
              ( b.betClass === 'basket' ) ? {left: '100%', top: '50%'} :
              ( b.betClass === 'corner' || b.betClass === 'dbStreet' ) ? {left: '0%', top: '100%'} :
              ( b.betClass === 'split0' ) ? {left: '100%', top: '25%'} :
              ( b.betClass === 'split00' ) ? {left: '100%', top: '75%'} :
              ( b.betClass === 'split' ) ? {left: '50%', top: '100%'} :
              {left: '50%', top: '50%'}
              ;
              return <div
                key={i}
                onClick={(e) => handleClick(`#${id} .${b.betClass}`)}
                onContextMenu={(e) => handleContextMenu(e, activeBet.findIndex( bet => bet === b))}
                className={`chip ${b.chip}`}
                style={style}> </div>
            })
          : ''
      }
    {children}
    </div>;
}
BetButton.propTypes = {
  children: PropTypes.any,
  id: PropTypes.string.isRequired,
  activeBet: PropTypes.array.isRequired,
  removeBet: PropTypes.func.isRequired
}
function Table({numbers, handleBet, activeBet, removeBet}: InferProps<typeof Table.propTypes>) {
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

  const handleBetType = (bet: betTypes) => bet;
  return <div id='rouletteTable'>
    <div id='zeros'>
      <BetButton
          id='N0'
          activeBet={activeBet}
          removeBet={removeBet}
      >
        <button onClick={(e) => handleBet(e, handleBetType('straight'))} className='straight' style={{backgroundColor: colors.green}}>0</button>
        <button onClick={(e) => handleBet(e, handleBetType('split'))} className='split'></button>
      </BetButton>
      <BetButton
          id='N00'
          activeBet={activeBet}
          removeBet={removeBet}
      >
        <button onClick={(e) => handleBet(e, handleBetType('straight'))} className='straight' style={{backgroundColor: colors.green}}>00</button>
      </BetButton>
    </div>
    <div id='inside'>
      {
        groupedNumbers.map( (numbers, i) => {
          return <div className='row' key={i}>
          {
            numbers.map( (idNumber, ii) => {
              const num = idNumber.number;
              return <BetButton
                  id={`N${num}`}
                  key={ii}
                  activeBet={activeBet}
                  removeBet={removeBet}
                  >
                <button onClick={(e) => handleBet(e, handleBetType('straight'))} className='straight' style={{backgroundColor: colors[idNumber.color]}}>{num}</button>
                <button
                  onClick={(e) => handleBet(e, handleBetType(( num % 3 === 0 ) ? 'street' : 'split'))}
                  className={ ( num % 3 === 0 ) ? 'street' : 'bottom'}
                ></button>
                { 
                ( num === 1 || num === 3 ) ?
                  <button onClick={(e) => handleBet(e, handleBetType('split'))} className='right'></button> :
                ( num === 2 ) ? <>
                    <button onClick={(e) => handleBet(e, handleBetType('split'))} className='split0'></button> 
                    <button onClick={(e) => handleBet(e, handleBetType('trio'))} className='basket'></button> 
                    <button onClick={(e) => handleBet(e, handleBetType('split'))} className='split00'></button>
                  </> : ''
                }
                {
                  ( num !== 34 && num !== 35 && num !== 36 ) ?<>
                    <button onClick={(e) => handleBet(e, handleBetType( ( num % 3 === 0 ) ? 'dbStreet' : 'corner'))} className={ ( num % 3 === 0 ) ? 'dbStreet' : 'corner'}></button>
                    <button onClick={(e) => handleBet(e, handleBetType('split'))} className='left'></button>
                  </>: ''
                }
                {
                  ( num === 1 ) ?
                  <button onClick={(e) => handleBet(e, handleBetType('trio'))} className={'trio'}></button> : ''
                }
                {
                  ( num === 3 ) ? <>
                  <button onClick={(e) => handleBet(e, handleBetType('topLine'))} className={'topLine'}></button>
                  <button onClick={(e) => handleBet(e, handleBetType('trio'))} className={'trio'}></button></> : ''
                }
                </BetButton>;
            })
          }
          </div>
        })
      }
    </div>
    <div id='outsideLeft'>
      <BetButton
          id='COL1'
          activeBet={activeBet}
          removeBet={removeBet}
      >
        <button onClick={(e) => handleBet(e, handleBetType('column'))} className='diamondButton'>2 TO 1</button>
      </BetButton>
      <BetButton
          id='COL2'
          activeBet={activeBet}
          removeBet={removeBet}
      >
        <button onClick={(e) => handleBet(e, handleBetType('column'))} className='diamondButton'>2 TO 1</button>
      </BetButton>
      <BetButton
          id='COL3'
          activeBet={activeBet}
          removeBet={removeBet}
      >
        <button onClick={(e) => handleBet(e, handleBetType('column'))} className='diamondButton'>2 TO 1</button>
      </BetButton>
    </div>
    <div id='outsideBottom'>
      <div id='dozens'>
        <BetButton
            id='D1'
            activeBet={activeBet}
            removeBet={removeBet}
        >
          <button onClick={(e) => handleBet(e, handleBetType('1st12'))} className='diamondButton'>1ST 12</button>
        </BetButton>
        <BetButton
            id='D2'
            activeBet={activeBet}
            removeBet={removeBet}
        >
          <button onClick={(e) => handleBet(e, handleBetType('2nd12'))} className='diamondButton'>2ND 12</button>
        </BetButton>
        <BetButton
            id='D3'
            activeBet={activeBet}
            removeBet={removeBet}
        >
          <button onClick={(e) => handleBet(e, handleBetType('3rd12'))} className='diamondButton'>3RD 12</button>
        </BetButton>
      </div>
      <div id='evens'>
        <BetButton
            id='F1TO18'
            activeBet={activeBet}
            removeBet={removeBet}
        >
          <button onClick={(e) => handleBet(e, handleBetType('1to18'))} className='diamondButton'>1 TO 18</button>
        </BetButton>
        <BetButton
            id='even'
            activeBet={activeBet}
            removeBet={removeBet}
        >
          <button onClick={(e) => handleBet(e, handleBetType('even'))} className='diamondButton'>EVEN</button>
        </BetButton>
        <BetButton
            id='red'
            activeBet={activeBet}
            removeBet={removeBet}
        >
          <button onClick={(e) => handleBet(e, handleBetType('red'))} className='theRedBlack'>RED</button>
            <div className='diamond' style={{borderBottomColor: colors.red}}>
              <div className='extension' style={{borderTopColor: colors.red}}></div>
            </div>
            <div className='diamond border'>
              <div className='extension'></div>
            </div>
        </BetButton>
        <BetButton
            id='black'
            activeBet={activeBet}
            removeBet={removeBet}
        >
          <button onClick={(e) => handleBet(e, handleBetType('black'))} className='theRedBlack'>BLACK</button>
          <div className='diamond' style={{borderBottomColor: colors.black}}>
            <div className='extension' style={{borderTopColor: colors.black}}></div>
          </div>
          <div className='diamond border'>
            <div className='extension'></div>
          </div>
        </BetButton>
        <BetButton
            id='odd'
            activeBet={activeBet}
            removeBet={removeBet}
        >
          <button onClick={(e) => handleBet(e, handleBetType('odd'))} className='diamondButton'>ODD</button>
        </BetButton>
        <BetButton
            id='F19TO36'
            activeBet={activeBet}
            removeBet={removeBet}
        >
          <button onClick={(e) => handleBet(e, handleBetType('19to36'))} className='diamondButton'>19 TO 36</button>
        </BetButton>
      </div>
    </div>
  </div>;
}
Table.propTypes = {
  numbers: PropTypes.array.isRequired,
  handleBet: PropTypes.func.isRequired,
  activeBet: PropTypes.array.isRequired,
  removeBet: PropTypes.func.isRequired
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
function BetBoard({children, totalMoney, setTotalMoney, calculateChips, activeChip}: InferProps<typeof BetBoard.propTypes>) {

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
    
    if ( cleanUp ) {
      activeChip.current = null;
      return;
    };
    target.parentElement.classList.add('active');
    target.parentElement.classList.remove('fade');
    activeChip.current = target;
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
  activeChip: PropTypes.any.isRequired,
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

  const activeChip = useRef<HTMLButtonElement | null>(null);
  interface Bet {
    chip: string,
    score: number,
    id: string,
    betClass: string,
    betCount: number,
    affectedNumbers: number[] | string[]
  } 
  const activeBet = useRef<Bet[]>([]);
  const getNum = (num: any) => num.match(/\d+/)[0];
  const handleBet = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, betType: betTypes) => {
    const chips = calculateChips();
    if ( activeChip.current === null ) return;
    const chipType = Array.from(activeChip.current.classList).filter( c => c.match(/(c[0-9]+)/g))[0];
    if ( chips[chipType as keyof chips] === 0 ) return;
    if ( chips[chipType as keyof chips] === 1 ) {
      const chipNames = Object.keys(chips);
      const prevChipIndex = Object.values(chips).findIndex( c => c === 1) - 1;
      Object(document.querySelector(`#chips .chip.${chipNames[prevChipIndex]}`)).click();
    };

    const { target } = Object(e);
    const targetClass = target.classList[0];
    const targetId = target.parentElement.id;

    const score = (
      betType === '1to18' || betType === '19to36' || 
      betType === 'odd' || betType === 'even' || 
      betType === 'red' || betType === 'black'
    ) ? 1 : (
      betType === 'column' || betType === '1st12' || 
      betType === '2nd12' || betType === '3rd12'
    ) ? 2 :
    ( betType === 'straight' ) ? 35 :
    ( betType === 'split' ) ? 17 :
    ( betType === 'corner' ) ? 8 :
    ( betType === 'dbStreet' ) ? 5 :
    ( betType === 'street' || betType === 'trio' ) ? 11 :
    ( betType === 'topLine' ) ? 6 : 0;
    let affectedNumbers: any[] = [];
    const exNum = (returnNum?: boolean) => (returnNum) ? Number(getNum(targetId)) : getNum(targetId)[0];
    if( betType === 'straight' )
      affectedNumbers.push(
        exNum(exNum() !== '0' && exNum() !== '00')
      )
    else if ( betType === 'corner' ){
      const num = exNum(true);
      affectedNumbers = [num, num+1, num+3, num+4]
    }
    else if ( betType === 'dbStreet' ){
      const num = exNum(true);
      affectedNumbers = [num-2, num-1, num, num+1, num+2, num+3]
    }
    else if ( betType === 'split' ){
      const num = exNum(true);
      if( num === 0 ) affectedNumbers = [exNum(), '00'];
      else if( targetClass === 'left' ) affectedNumbers = [num, num+3];
      else if( targetClass === 'right' && num === 1 ) affectedNumbers = [num, '0'];
      else if( targetClass === 'right' && num === 3 ) affectedNumbers = [num, '00'];
      else if( targetClass === 'bottom' ) affectedNumbers = [num, num+1];
      else if( targetClass === 'split0' ) affectedNumbers = [num, '0'];
      else if( targetClass === 'split00' ) affectedNumbers = [num, '00'];
    }
    else if ( betType === 'street' ){
      const num = exNum(true);
      affectedNumbers = [num-2, num-1, num]
    }
    else if ( betType === 'topLine' )
      affectedNumbers = ['0', '00', 1, 2, 3];
    else if ( betType === 'trio' ){
      const num = exNum(true);
      if( targetClass === 'basket' ) affectedNumbers = [num, '0', '00'];
      else if( num === 1 ) affectedNumbers = [num, num+1, '0'];
      else if( num === 3 ) affectedNumbers = [num, num-1, '00'];
    }
    else{
      tableNumbers.map( (n, i) => {
        const num = n.number;
        if (  betType === '1to18' && num > 0 && num < 19 ) affectedNumbers.push(num);
        else if ( betType === '19to36' && num > 18 && num < 37 ) affectedNumbers.push(num);
        else if ( betType === 'black' && n.color === 'black' ) affectedNumbers.push(num)
        else if ( betType === 'red' && n.color === 'red' ) affectedNumbers.push(num)
        else if ( betType === 'even' && num % 2 === 0 ) affectedNumbers.push(num)
        else if ( betType === 'odd' && num % 2 !== 0 ) affectedNumbers.push(num)
        else if ( betType === '1st12' && num > 0 && num < 13 ) affectedNumbers.push(num)
        else if ( betType === '2nd12' && num > 12 && num < 25 ) affectedNumbers.push(num)
        else if ( betType === '3rd12' && num > 24 && num < 37 ) affectedNumbers.push(num)
        else if ( betType === 'column' ){
          if ( targetId.match(1) && i % 3 === 0 ) affectedNumbers.push(num);
          else if ( targetId.match(2) && i % 3 === 1 ) affectedNumbers.push(num);
          else if ( targetId.match(3) && i % 3 === 2 ) affectedNumbers.push(num);
        }
      } );
    }
    
    const updateBet = () => {
      activeBet.current.push({
        chip: chipType,
        score: score,
        id: targetId,
        betCount: 1,
        betClass: targetClass,
        affectedNumbers: affectedNumbers,
      });
      setTotalMoney(totalMoney - Number(getNum(chipType)));
    }
    if( activeBet.current.length ){
      let newBet = true;
      activeBet.current.map( (b, i) => {
        if(
          affectedNumbers.join('') === b.affectedNumbers.join('') &&
          targetId === b.id &&
          chipType === b.chip
          ){
            newBet = false;
            activeBet.current[i].betCount += 1;
            const currentBet = activeBet.current.splice(i, 1)[0];
            activeBet.current.push(currentBet);
            setTotalMoney(totalMoney - Number(getNum(chipType)));
          }
      });
      if( newBet ) updateBet();
    }else updateBet();
  }

  const removeBet = (i: number) => {
    let targetBet = activeBet.current[i];
    if( targetBet.betCount === 1 )
      targetBet = activeBet.current.splice(i, 1)[0];
    else
      activeBet.current[i].betCount -= 1;
    
    setTotalMoney(totalMoney + Number(getNum(targetBet.chip)));
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
        handleBet={handleBet}
        activeBet={activeBet.current}
        removeBet={removeBet}
      />
      <BetBoard
        totalMoney={totalMoney}
        setTotalMoney={setTotalMoney}
        calculateChips={calculateChips}
        activeChip={activeChip}
      />
    </>;
}

export default App;

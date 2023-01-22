import './App.scss';
import React, { useCallback, useState } from 'react';
import TextEditor from './components/TextEditor';
import Alert from './components/Alert';
import { ERROR, DIVIDERS } from './constants/constants'



function App() {
  const [addressList, setAddressList] = useState([]);
  const [input, setInput] = useState('0x2CB99F193549681e06C6770dDD5543812B4FaFE8 10\n0xEb0D38c92deB969b689acA94D962A07515CC5204 10\n0xF4aDE8368DDd835B70b625CF7E3E1Bc5791D18C1 10\n0x09ae5A64465c18718a46b3aD946270BD3E5e6aaB 10\n0x8B3392483BA26D65E331dB86D4F430E9B3814E5e 10');
  const [errorList, setErrorList] = useState([]);
  const [success, setSuccess] = useState(false);


  const combineBalances = () => {
    let newAddressList = { ...addressList }, newInput = '';
    Object.entries(addressList).forEach(([address, val]) => {
      if (val.length > 1) {
        let combBalance = val.reduce((acc, obj) => {
          return Number(obj.amount) + acc;
        }, 0);
        let newIdx = val[0].idx;
        newAddressList[address] = [{ amount: combBalance, idx: newIdx }]
      }
    });

    Object.entries(newAddressList).forEach(([address, val]) => {
      newInput += `${address}=${val[0].amount}\n`
    })

    setAddressList(newAddressList)
    setInput(newInput)
  }


  const keepFirstOne = () => {
    let newAddressList = { ...addressList }, newInput = '';

    Object.entries(addressList).forEach(([address, val]) => {
      if (val.length > 1) {
        newAddressList[address] = addressList[address].slice(0, 2)
        // newInput += `${address}=${val[0].amount}\n`
      }
    })

    Object.entries(newAddressList).forEach(([address, val]) => {
      newInput += `${address}=${val[0].amount}\n`
    })

    setAddressList(newAddressList)
    setInput(newInput)
  }


  const onSubmit = () => {
    // Reset Error
    setErrorList([]);
    let errList = [], adrList = {}

    input.split(/\n/).forEach((item, idx) => {

      DIVIDERS.forEach((el) => {
        if (item.includes(el)) {
          item = item.split(el)
        }
      })

      if (item.length !== 2) {
        errList.push({
          type: ERROR.INVALID_INPUT,
          index: idx
        })
      } else if (isNaN(item[1])) {
        errList.push({
          type: ERROR.INVALID_AMOUNT,
          index: idx
        })
      }

      if (!adrList[item[0]]?.length) {
        adrList[item[0]] = [{ amount: item[1], idx: idx }]
      } else {
        adrList[item[0]].push({ amount: item[1], idx: idx })
      }
    })

    if (errList.length) {
      setErrorList(errList)
      return
    }


    // if inputs are valid, then check for dublicates
    console.log(adrList);
    setAddressList(adrList)

    Object.entries(adrList).forEach(([address, val]) => {
      if (val.length > 1) {
        let idxList = val.map(obj => {
          return obj.idx
        })

        errList.push({
          type: ERROR.DUPLICATE_ADDRESS,
          address: address,
          idxList: idxList
        })
      }
    });


    if (errList.length) {
      setErrorList(errList)
      return
    } else {
      setSuccess(true)
    }

  }

  const onInputChange = useCallback((value, viewUpdate) => {
    setErrorList([]);
    setInput(value);
  }, []);

  return (
    <div className="App">
      <h2 className='heading'>Addresses with Amounts</h2>
      <TextEditor input={input} onChange={onInputChange} />
      <h2 className='heading'>Seperated by {DIVIDERS.map((el, i) => `'${el}' ${i !== DIVIDERS.length - 1 ? 'or ' : ''}`)}</h2>
      <div className='alert-container'>
        {errorList.length > 0 && <Alert errorList={errorList} combineBalances={combineBalances} keepFirstOne={keepFirstOne} />}
      </div>
      <button className='btn' onClick={onSubmit}>NEXT</button>
    </div>
  );
}

export default App;

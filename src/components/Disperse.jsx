import React, { useState } from 'react'
import TextEditor from './TextEditor';
import Alert from './Alert';
import { ERROR, DIVIDERS } from '../constants/constants'

function Disperse() {
  const [errorList, setErrorList] = useState([]);
  const [success, setSuccess] = useState(false);
  const [input, setInput] = useState('0x2CB99F193549681e06C6770dDD5543812B4FaFE8 10\n0xEb0D38c92deB969b689acA94D962A07515CC5204 10\n0xF4aDE8368DDd835B70b625CF7E3E1Bc5791D18C1 10\n0x09ae5A64465c18718a46b3aD946270BD3E5e6aaB 10\n0x8B3392483BA26D65E331dB86D4F430E9B3814E5e 10');
  const [addressList, setAddressList] = useState([]); //Filtered Input 
  // Structure of addressList = { address1/key : [{index : i , amount:x}, {index : j , amount:y}] }


  /// Combine duplicate balances
  const combineBalances = () => {
    let newAddressList = { ...addressList }, newInput = '';
    Object.entries(addressList).forEach(([address, val]) => {
      if (val.length > 1) {
        //combined balance
        let combBalance = val.reduce((acc, obj) => {
          return Number(obj.amount) + acc;
        }, 0);
        let newIdx = val[0].idx;

        // Update value for the address
        newAddressList[address] = [{ amount: combBalance, idx: newIdx }]
      }
    });

    // Convert from new address list to input string.
    Object.entries(newAddressList).forEach(([address, val]) => {
      newInput += `${address} ${val[0].amount}\n`
    })

    // Update state of editor
    setAddressList(newAddressList)
    setInput(newInput.trimEnd('\n'))
  }


  /// TO keep first of the duplicate values
  const keepFirstOne = () => {
    let newAddressList = { ...addressList }, newInput = '';
    Object.entries(addressList).forEach(([address, val]) => {
      if (val.length > 1) {
        // Slice duplicates
        newAddressList[address] = addressList[address].slice(0, 2); // Slce duplicates
      }
    })

    // Convert from new address list to input string
    Object.entries(newAddressList).forEach(([address, val]) => {
      newInput += `${address} ${val[0].amount}\n`
    })

    // Update state of editor
    setAddressList(newAddressList)
    setInput(newInput.trimEnd('\n'))
  }


  /// On Submit
  const onSubmit = () => {
    setErrorList([]); // Reset error list
    let errList = [], inputDataObject = {};

    // Filter Input
    input.split(/\n/).forEach((item, idx) => {

      // Split address and amount
      DIVIDERS.forEach((el) => {
        if (item.includes(el)) {
          item = item.split(el)
        }
      })

      // Identify syntax errors
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

      // Update address/amount object using address as key
      if (!inputDataObject[item[0]]?.length) {
        inputDataObject[item[0]] = [{ amount: item[1], idx: idx }]
      } else {
        inputDataObject[item[0]].push({ amount: item[1], idx: idx })
      }
    })

    // Throw error, in case of syntax error
    if (errList.length) {
      setErrorList(errList)
      return
    }

    // If inputs are valid, then check for duplicates/logical errors
    setAddressList(inputDataObject);
    // check for duplicates in inputDataObject
    Object.entries(inputDataObject).forEach(([address, data]) => {
      if (data.length > 1) {

        // List of duplicate indexes
        let idxList = data.map(obj => {
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
      // Throw error if duplicate are present
      setErrorList(errList)
      return
    } else {
      // Else return success
      setSuccess(true)
    }
  }

  // On text editor input
  const onInputChange = (value) => {
    if (success) setSuccess(false);
    if (errorList.length != 0) setErrorList([]);
    setInput(value);
  }

  return (
    <div className="App">
      <h2 className='heading'>Addresses with Amounts</h2>
      <TextEditor input={input} onChange={onInputChange} />
      <h2 className='heading'>Seperated by {DIVIDERS.map((el, i) => `'${el}' ${i !== DIVIDERS.length - 1 ? 'or ' : ''}`)}</h2>
      <div className='alert-container'>
        {success && <div className='success-message'><span className='success-message__icon'>&#10003;</span> Successfully Submitted!</div>}
        {errorList.length > 0 && <Alert errorList={errorList} combineBalances={combineBalances} keepFirstOne={keepFirstOne} />}
      </div>
      <button className='btn' onClick={onSubmit}>NEXT</button>
    </div>
  );
}

export default Disperse
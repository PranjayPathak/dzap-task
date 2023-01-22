import React from 'react'
import { ERROR, DIVIDERS } from '../constants/constants'
// import { ERROR } from '../constants.js'


const ErrorContainer = ({ children }) => {
  return <div className='error-container'>
    <span className='error-container__icon'>&#9888;</span><div className='error-container__message'>{children}</div>
  </div>
}
function Alert({ errorList, combineBalances, keepFirstOne }) {

  if (errorList[0].type == ERROR.DUPLICATE_ADDRESS) {
    return (
      <>
        <div className='duplication-error'>
          <span> Duplicated</span>
          <div>
            <span className='duplication-error__links' onClick={keepFirstOne}>Keep the first one</span> 
            <span className='divid'>|</span>
            <span className='duplication-error__links' onClick={combineBalances}>Combine Balance</span>
            </div>
        </div>
        <ErrorContainer>
          {errorList.map((err, idx) => {
            return <span key={idx}>{`Address ${err.address} encountered duplicate in Line: ${err.idxList.map((i) => `${i + 1}`)}`}</span>
          })}
        </ErrorContainer>
      </>
    )
  } else {
    return <ErrorContainer>{
      errorList.map((err, idx) => {
        return <span key={idx}>{`Line: ${err.index + 1} ${err.type}`}</span>
      })
    }  </ErrorContainer>
  }
}

export default Alert
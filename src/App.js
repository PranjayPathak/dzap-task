import './App.scss';
import React, { useCallback, useState } from 'react';
import TextEditor from './components/TextEditor';

function App() {
  const [input, setInput] = useState('');
  const [addressList, setAddressList] = useState([]);
  const onInputChange = useCallback((value, viewUpdate) => {
    setInput(value);

    console.log(value.split(/\n/));
    setAddressList(value.split(/\n/));
  }, []);

  return (
    <div className="App">
      <TextEditor input={input} onInputChange={onInputChange} />
    </div>
  );
}

export default App;

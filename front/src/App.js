import './App.css';
import Header from './compnents/header';
import Body from './compnents/body';
import { useState } from 'react';

function App() {
  const [userInfo, setUserInfo] = useState({});
  function submitValues(e){
    e.preventDefault();
    console.log(userInfo);
  }
  return (
    <div className="App">
      <Header 
        setUserInfo={setUserInfo} 
        userInfo={userInfo}
        submitValues={submitValues}
      />
      <Body 
        userInfo={userInfo}
      />
    </div>
  );
}

export default App;

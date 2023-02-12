import './App.css';
import Header from './compnents/header';
import Body from './compnents/body';
import { useState } from 'react';

function App() {
  const [userInfo, setUserInfo] = useState({});
  return (
    <div className="App">
      <Header 
        setUserInfo={setUserInfo} 
        userInfo={userInfo}
      />
      <Body 
        userInfo={userInfo}
      />
    </div>
  );
}

export default App;

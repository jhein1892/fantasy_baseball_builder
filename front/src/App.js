import './App.css';
import Header from './compnents/header';
import Body from './compnents/body';
import axios from 'axios';
import { useEffect, useState } from 'react';


function App() {
  const [userInfo, setUserInfo] = useState({});
  function submitValues(e){
    e.preventDefault();
    console.log(userInfo);
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/`)
      .then((response) => {
        console.log(response);
      }) 
  },[])
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

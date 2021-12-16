import { useState, useEffect } from 'react';

import Login from './Login';
import Home from './Home';
import firebase from '../firebase';
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//import './App.css';



function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    })
  }, [])

  console.log(user);

  if (user != null){
    return(
      <Home />
    )
  }

  else{
    return(
      <Login />
    )
  }


}

export default App;


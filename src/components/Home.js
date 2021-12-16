
import { auth } from '../firebase'

//import '../App.css';

   
import TextEditor from "../TextEditor"
import React from 'react';
import Navbar from './google-drive/Navbar'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import { v4 as uuidV4 } from "uuid"

const Home = ({ user }) => {


    return (
      <Router>
        <div className="home">
        {/* Navbar */}
        <Navbar bg="light" expand="sm"/>
        <Switch>
          {/* Home page */}
          <Route path="/" exact> 
            <Redirect to={`/documents/${uuidV4()}`} />
          </Route>
          {/* TextEditor */}
          <Route path="/documents/:id" component={TextEditor}> 
            <TextEditor />
          </Route>
        </Switch>
        <button className="button signout" onClick={() => auth.signOut()}>Sign out</button>
    </div>
    </Router>
        
    )
    }
  

  export default Home;
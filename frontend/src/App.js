import React from 'react';
import logo from './logo.svg';
import './App.css';
import {fetchFiles} from "./api/fileApi";
import lifecycle from 'react-pure-lifecycle';


const App = () => (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
);

//todo test
const componentDidMount = (props) => {
  fetchFiles();
};

export default lifecycle({componentDidMount}) (App);

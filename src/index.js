import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from "react-moralis";
import {BrowserRouter} from "react-router-dom"


//ID and Server URL from moralis to use moralis api hooks

ReactDOM.render(
  <MoralisProvider appId={process.env.REACT_APP_YOUR_APP_ID} serverUrl={process.env.REACT_APP_YOUR_SERVER_URL}>
    <BrowserRouter>
    <App />
    </BrowserRouter>    
  </MoralisProvider>,
  document.getElementById('root')
);

reportWebVitals();

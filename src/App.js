

import './App.css';
import React, { useState, useEffect } from 'react';
import { useERC20Balances } from "react-moralis";
import axios from "axios"
import {ethers} from "ethers";
import {Route, Link, Routes, Navigate} from "react-router-dom"
import Navbar from "./Components/Navbar.js"
import Home from "./Components/Home.js"
import { Line, Pie, Chart } from 'react-chartjs-2';
import PiePort from "./Components/PiePort.js"
import UDPortPage from "./Components/UDPortPage.js"
import "bootstrap/dist/css/bootstrap.min.css"
import logo from "./LogoMakr-1ceYNX.png"
import UAuth from '@uauth/js'

import defaultButton from "./default-button.png"
import pressedButton from "./hover-button.png"
import hoverButton from "./pressed-button.png"

const moment = require("moment")
const {utils, BigNumber} = require('ethers');

function App() {

  
    const [imageSrc, setImageSrc] = useState(defaultButton)
    function handleMouseEnter(){
      setImageSrc(hoverButton)
    }

    function handleMouseLeave() {
      setImageSrc(defaultButton)
    }




    const uauth = new UAuth({
      // These can be copied from the bottom of your app's configuration page on unstoppabledomains.com.
      clientID: "dwUk1YgsNKPxSUXN2x3QwlSulvL1MMG34iUHnDDA8N0=",
      clientSecret: "wSEiEUTSTnriPXFX7gTH/U9RwyrhgZFg8Uzvn8b7qUw=",
  
      // These are the scopes your app is requesting from the ud server.
      scope: 'openid email:optional wallet',
  
      // This is the url that the auth server will redirect back to after every authorization attempt.
      redirectUri: "https://stefan1612.github.io/UDPort",
    })

    const [a , setA] = useState(1)
    const [errorMessage, setErrorMessage] = useState("This is the error message")
    const [whileWaitingForUAUTH, setWhileWaitingForUAUTH] = useState(false)

    const handleLoginButtonClick=
      e => {
      
        setErrorMessage(null)
        uauth.login().catch(error => {
          console.error('login error:', error)
          setErrorMessage('User failed to login.')  
        })
        
      setImageSrc(pressedButton)
      
      }

    const [redirectTo, setRedirectTo] = useState()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)
    const [redirectToLogOut, setRedirectToLogOut] = useState()

    const [udLoginAddress, setUdLoginAddress] = useState()
    const [udLoginDomain, setUdLoginDomain] = useState()

    useEffect(() => {
      
      // Try to exchange authorization code for access and id tokens.
      uauth
        .loginCallback()
        // Successfully logged and cached user in `window.localStorage`
        .then(response => {
          console.log('loginCallback ->', response)
          setRedirectTo('/profile')
          setUdLoginAddress(response.authorization.idToken.wallet_address)
          setUdLoginDomain(response.authorization.idToken.sub)
        })
        
        // Failed to exchange authorization code for token.
        .catch(error => {
          console.error('callback error:', error)
          setRedirectTo('/login?error=' + error.message)
        })
    }, [])
  
    useEffect(() => {
      uauth
        .user()
        .then(setUser)
        .catch(error => {
          console.error('profile error:', error)
          setRedirectToLogOut('/login?error=' + error.message)
        })
    }, [])
      
    const handleLogoutButtonClick=
    e => {
      console.log('logging out!')
      setLoading(true)
      uauth
        .logout()
        .catch(error => {
          console.error('profile error:', error)
          setLoading(false)
        })
        
      setUdLoginAddress(undefined)
      setAreTokensFetched(false)
      setAreTokensGeckoInitialized(false)
      window.location.reload()
    }
    

    //handle State

    const [account, setAccount] = useState("")  
   //handle fetching analytics using moralis, gecko state
   const [areTokensGeckoInitialized, setAreTokensGeckoInitialized] = useState(false)
   const [areTokensFetched, setAreTokensFetched] = useState(false)
   //getting al ERC20 tokens moralis hook
   const { fetchERC20Balances,data, isFetching, error } = useERC20Balances({data: []});
   //final object used to display and handle every ERC20 token
   const [finalObject, setFinalObject] = useState([{
      name: "name",
      symbol: "symbol",
      logo: "logo",
      holderValue: "how much are his holdings worth",
      balance: "balance",
      price: "price",
      decimals: "decimals",
      token_address: "addressOfToken",
      marketCap: "marketCap",
      volume: "volume",
      priceChange: "24Hour"
    }])
    //intermediate while InitializingPort
    let finalArray = undefined

    //provider metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    //requesting account and chainId when user first connected to metamask
    useEffect(() =>{ 
      FirstLoadGettingAccount()
      gettingNetworkNameChainId()     
    },[])
 
    async function FirstLoadGettingAccount(){
      if(typeof window.ethereum !== undefined){
         const accounts = await window.ethereum.request({method: "eth_requestAccounts"}
         )
         setAccount(accounts[0])
      }
     else {
         window.alert("Install Metamask!")
      }
    }
 
    //on chain change
    useEffect(() =>{
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
         window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
    },[])
 
 
    function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    }
 
    //on account change
    useEffect(() =>{
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
         window.ethereum.removeListener('accountsChanged',     handleAccountsChanged)
        }
    },[])
 
    // For now, 'eth_accounts' will continue to always return an array
    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
      }   
      else if (accounts[0] !== account) {
        setAccount(accounts[0])
        window.location.reload();;      
      } 
    }
    //network
    const [network, setNetwork] = useState({
      chanId: "",
      name: ""
    })
    async function gettingNetworkNameChainId(){
      const network = await provider.getNetwork()
      setNetwork(network)
    }

    //used to calculate your Eth balance from bigNum
    function bigNumIntoEther4Decimals (data) {
      // from stackexchange https://ethereum.stackexchange.com/questions/84004/ethers-formatetherwei-with-max-4-decimal-places/97885
      let remainder = data.mod(1e14);
      console.log(utils.formatEther(data.sub(remainder)));
      let res = utils.formatEther(data);
      res = Math.round(res * 1e4) / 1e4;
      return res
    }

    //fetching the ERC20 holdings of an address
    async function getTokens(){
      if(account == ""){
        return window.alert("You need to install and log into Metamask" )
      }
      let id = network.chainId.toString(16)
      id= "0x"+ id
    
      //crazy many ERC20 0x3aB28eCeDEa6cdb6feeD398E93Ae8c7b316B1182
      //mainnet test address 0x953a97B1f704Cb5B492CFBB006388C0fbcF34Bb4
      await fetchERC20Balances({ params: { chain: id ,address: account }})
    
      if(isFetching == false){
      let balance = await provider.getBalance(account);
      //wenn ich portfolio ausrechne muss ich bignum nehmen sonst zu ungenau mit der bigNumIntoEther4Decimals
      balance = await bigNumIntoEther4Decimals(balance)
      setAreTokensFetched(true)
      }
    }

    const [dataLoaded, setDataLoaded] = useState(false)
    const [dataInitialized, setDataInitialized] = useState(false)
    const [portfolioBalance, setPortfolioBalance] = useState(0)

    //fetching all the data for every coin the user holds
  async function intializePortPage(){
    console.log("intializePortPage just ran with " + finalArray + " as finalArray")
    if(finalArray !== undefined || areTokensFetched == false){
      console.log("already initialized")
        return 
    } 
    else{
      finalArray = []
        data.map(e => {
        finalArray.push({
        name: e.name,
        symbol: e.symbol,
        logo: e.logo,
        holderValue: "No information on gecko available",
        balance: e.balance,
        price: "No information on gecko available",
        decimals: e.decimals,        
        token_address: e.token_address,
        marketCap: "No information on gecko available",
        volume: "No information on gecko available",
        priceChange: "No information on gecko available"
        })    
      })
       
      
      setFinalObject(finalArray)

      let something = []
       
      try{
          //here
          await Promise.all(finalArray.map(async(e, i) => {
            let address = e.token_address
            console.log(address)
            let result = await axios.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${address}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`)
            
            let num = 1 / 10 ** e.decimals
            let bal = e.balance * num
            
            something.push({          
              name: e.name,
              symbol: e.symbol,
              logo: e.logo,
              holderValue: bal * result.data[address].usd,
              balance: bal,
              price: result.data[address].usd,
              decimals: e.decimals,            
              token_address: e.token_address,
              marketCap: result.data[address].usd_market_cap,
              volume: result.data[address].usd_24h_vol,
              priceChange: result.data[address].usd_24h_change
            })             
          }))
        }
    
      catch(error){

        
        if(error.response){
          console.log(error.response)
          console.log("this is the error response")
          
        }
        return
      }
           
      setFinalObject(something)
              
      let wholeBalance = 0

      something.map(e => {
        wholeBalance += e.holderValue 
      })

      setPortfolioBalance(wholeBalance)
      setAreTokensGeckoInitialized(true)   
    }    
  }

  useEffect(() => {
      
    intializePortPage()
    console.log("Tokens have been fetched using moralis")
  },[areTokensFetched]);



  
  async function pingGecko(){
    let result = await axios.get("https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true")
    //result = await result.json()
    console.log(result)
  }
  //https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true


   //ERC20 price history Fetching 
   
   const [daysNum, setDaysNum] = useState(29)
 
   function changeDayInterval(num) {
     setDaysNum(num)
     console.log(daysNum)
   };
  
  
   //chart stuff
   const [chartDataPrice, setChartDataPrice] = useState({
    labels: ["No Data"],
    datasets:[{
      label: "No Token selected",
      data:[
        0
      ],
    }]
  })

   const [chartDataVolume, setChartDataVolume] = useState({
    labels: ["No Data"],
    datasets:[{
      label: "No Token selected",
      data:[
        0
      ],
    }]
  })
  
   const [chartDataMarketCap, setChartDataMarketCap] = useState({
    labels: ["No Data"],
    datasets:[{
      label: "No Token selected",
      data:[
        0
      ],
    }]
  })

    const [currentIndex, setCurrentIndex] = useState()


    async function generatingHistoryStats(index){    
      let result
      try{
         result = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${index.token_address}/market_chart/?vs_currency=usd&days=${daysNum}&interval=daily`)         
      }
      catch(error){
        console.log(error)
        return
      }

      let dates1 = Array(Number(daysNum)).fill().map((e, i)=> 
      moment().subtract(i, "d").format("YYYY-MM-DD")).reverse()
  

    setChartDataPrice({
      labels: dates1,
      datasets:[{
        label: `${index.name} Price`,
        data: result.data.prices.map(index => index[1])
      }]
    })
    
    setChartDataVolume({
      labels: dates1,
      datasets:[{
        label: `${index.name} Volume`,
        data: result.data.total_volumes.map(index => index[1])
      }]
    })

    setChartDataMarketCap({
      labels: dates1,
      datasets:[{
        label: `${index.name} Market Cap`,
        data: result.data.market_caps.map(index => index[1])
      }]
    })

    setCurrentIndex(index)
    }


    useEffect(() => {
      console.log("daysNum has been changed to " + daysNum + " generatingHistoryStats will refetch")
      generatingHistoryStats(currentIndex)
    }, [daysNum])

    const [redirect, setRedirect] = useState("/UDPort")

    
    //show this at the beginning to login with UD
    
    if(areTokensFetched == false && udLoginAddress == undefined && whileWaitingForUAUTH == false){
      return(<div className="pages" style={{height: "100vh"}}>
      
      <div className="text-center" style={{paddingTop: "28vh", marginRight: "5vw"}}><img  src={logo}></img></div>
      
      <div style={{paddingTop: "2vh", marginLeft: "37vw"}} >
               <img onMouseEnter={() => handleMouseEnter()} onMouseLeave={() =>handleMouseLeave()}src={imageSrc}  className="pointer"onClick={() => handleLoginButtonClick()}></img>
          </div>
      </div>
      )
    }

    //screen not shown while waiting instead you'll see screen 1
    //screen while waiting for the UD information
    if(udLoginDomain == undefined && whileWaitingForUAUTH == true){
      return(<div className="loader-wrapper"> 
        <div className="loader"></div>
        </div>
      )
    }

    //after you logged in with UD but not having fetched and Initialized your ERC20's
    if(areTokensFetched == false){
      return(<div className="pages " style={{height: "100vh"}}>
        <Navbar account={account} networkName={network.name} networkChainId={network.chainId} udLoginDomain={udLoginDomain}/>
      <div className="text-center" style={{paddingTop: "26vh", marginRight: "5vw"}}><img  src={logo}></img></div>
    <h2 className="text-center" style={{paddingTop: "1vh"}}>You are ready to fetch your ERC20's!</h2>
    <div className="text-center" style={{ fontSize: "80%"}}>
      Important discalimer!<br></br> 
      Due to using the CoinGecko API this App will only work correctly if you only hold ERC20's that ARE listed on CoinGecko else the fetching will not succeed.<br></br>
      Although the feature for "no name" tokens may be added in the future!</div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
  
      <button className="btn  col-md-2 offset-md-5 btn-outline-primary"onClick={() => getTokens()}>Get Started! </button>
      <footer id="footer" className="fixed-bottom" style={{marginTop: "10vh"}}>
       <i className="fab fa-github">&nbsp;&nbsp;&nbsp; </i>
       <i className="fab fa-twitter">&nbsp;&nbsp;&nbsp;  </i> 
       <i className="fab fa-discord">&nbsp;&nbsp;&nbsp;</i>
       <i className="fab fa-linkedin-in">&nbsp;&nbsp;&nbsp;</i>
       <i className="fab fa-youtube">&nbsp;&nbsp;&nbsp;</i>
      </footer>
    </div>
      )
    }

   {/*
    //after logging out
    if (udLoginAddress == undefined) {
      return <Navigate to={redirect} />
    }*/ } 

    //if you dont hold any tokens
    if(areTokensFetched == true && finalObject.length <= 1){
      return(<div className="pages " style={{height: "100vh"}}>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
  
      <Navbar account={account} networkName={network.name} networkChainId={network.chainId} udLoginDomain={udLoginDomain}/>
    <h1 className="text-center" style={{paddingTop: "30vh"}}>
        It seems Like you do not own any ERC20 yet!
      </h1>
      <footer id="footer" className="fixed-bottom" style={{marginTop: "10vh"}}>
        <i className="fab fa-github">&nbsp;&nbsp;&nbsp; </i>
        <i className="fab fa-twitter">&nbsp;&nbsp;&nbsp;  </i> 
            <i className="fab fa-discord">&nbsp;&nbsp;&nbsp;</i>
            <i className="fab fa-linkedin-in">&nbsp;&nbsp;&nbsp;</i>
            <i className="fab fa-youtube">&nbsp;&nbsp;&nbsp;</i>
            <button className="pointer UDButtonLogOut"style={{marginLeft: "30vw"}}onClick={handleLogoutButtonClick}>Logout</button>
        </footer>
    </div>)
    }

    //the portfolio page after logged in and everything is done
    return <div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

      <Navbar account={account} networkName={network.name} networkChainId={network.chainId} udLoginDomain={udLoginDomain}/>
      <h1 className="d-flex justify-content-center" style={{paddingTop: "6vh"}}>{portfolioBalance} USD</h1>
    <button className="btn btn-danger offset-md-1" style={{fontSize: "70%"}}onClick={() => getTokens()}>Refetch</button> 
    <div className="col-md-4 offset-md-1" style={{fontSize: "70%"}}>Refetch Portfolio in case Moralis or CoinGeckos API has issues and You can not see your Data instantely</div>
      
    <div className="col-md-3 offset-md-7 graph position-fixed" >
        <input type="radio" name="dayInterval" onChange={() => changeDayInterval(7)}></input>7 days &nbsp;
        <input type="radio" name="dayInterval" onChange={() => changeDayInterval(14)}></input>14 days &nbsp;
        <input type="radio" name="dayInterval" onChange={() => changeDayInterval(30)}></input>30 days &nbsp;
      </div>

    <div className="col-md-3 offset-md-7 graph position-fixed " style={{marginTop: "2vh"}}>
     <Line data={chartDataPrice}
    ></Line>
    </div>

    <div  className="col-md-3 offset-md-7 graph position-fixed" style={{marginTop: "27vh"}}>
      <Line data={chartDataVolume}
      options={{maintainAspectRation: false}}></Line>  
      </div>

    <div className="col-md-3 offset-md-7 graph position-fixed" style={{marginTop: "52vh"}}>
      <Line data={chartDataMarketCap}
      options={{maintainAspectRation: false}}></Line>
    </div>

    <h3 className="col-md-4 offset-md-1 ">All ERC20 Tokens you hold!</h3>
      {data !== null && <div >
            {finalObject.map(index => {
                return <div key={index.symbol} className="col-md-4 offset-md-1 " style={{border: " 1px solid rgba(0, 0, 0, .5)", marginBottom:"6vh", backgroundColor: "white", padding: "5px", borderRadius: "5px"}}>
                   <div>
                     <div >
                      
                        <img  src={index.logo} style={{width: "4vw"}}></img> 
                        {index.name} 
                          <div className="d-flex justify-content-end" >
                           Get Data Analytics! &nbsp; 
                       <button className="btn" style={{backgroundColor: "rgb(106, 160, 182)", border: "1px solid"}}onClick={() => generatingHistoryStats(index)}>Click here</button>
                       </div>
                    
                    </div>
                     
                       <div>{index.symbol}</div>
                       
                       <div>{index.price} USD</div>
                       <div>You own: {index.balance} tokens</div>
                       <div>Your Tokens are currently worth: {index.holderValue} USD</div>
                       <div>Market Cap: {index.marketCap} USD</div>
                       <div>Volume 24h: {index.volume}</div>
                       {index.priceChange >= 0 && 
                       <div >Price 24h <span style={{color: "green"}}>{index.priceChange} %</span></div>
                       }
                       {index.priceChange < 0 && 
                       <div >Price 24h <span style={{color: "red"}}>{index.priceChange} %</span></div>
                       }                                            
                                                           
                   </div>                    
                </div>
            })}               
       </div>}

     <footer id="footer" className="fixed-bottom" style={{marginTop: "10vh"}}>
      <i className="fab fa-github">&nbsp;&nbsp;&nbsp; </i>
      <i className="fab fa-twitter">&nbsp;&nbsp;&nbsp;  </i> 
          <i className="fab fa-discord">&nbsp;&nbsp;&nbsp;</i>
          <i className="fab fa-linkedin-in">&nbsp;&nbsp;&nbsp;</i>
          <i className="fab fa-youtube">&nbsp;&nbsp;&nbsp;</i>
          <button className="pointer UDButtonLogOut"style={{marginLeft: "30vw"}}onClick={handleLogoutButtonClick}>Logout</button>
      </footer>
   
  </div>;

  }

export default App;

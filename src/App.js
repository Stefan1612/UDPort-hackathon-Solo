
import './App.css';
import React, { useState, useEffect } from 'react';
import { useERC20Balances } from "react-moralis";
import axios from "axios"
import {ethers} from "ethers";
import {Route, Link, Routes} from "react-router-dom"
import Navbar from "./Components/Navbar.js"
import Home from "./Components/Home.js"
import PiePort from "./Components/PiePort.js"
import "bootstrap/dist/css/bootstrap.min.css"
import logo from "./LogoMakr-1ceYNX.png"


const moment = require("moment")
const {utils, BigNumber} = require('ethers');

function App() {

   //handle State
   //handle currently logged in account
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
         window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
     }
 },[])
 
 // For now, 'eth_accounts' will continue to always return an array
 function handleAccountsChanged(accounts) {
     if (accounts.length === 0) {
     // MetaMask is locked or the user has not connected any accounts
     console.log('Please connect to MetaMask.');
     } else if (accounts[0] !== account) {
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
    
     //mainnet test address 0x953a97B1f704Cb5B492CFBB006388C0fbcF34Bb4
     await fetchERC20Balances({ params: { chain: id ,address: "0x953a97B1f704Cb5B492CFBB006388C0fbcF34Bb4" }})
     
     
     console.log("0x953a97B1f704Cb5B492CFBB006388C0fbcF34Bb4")
     //here
     
     if(isFetching == false){
      let balance = await provider.getBalance("0x953a97B1f704Cb5B492CFBB006388C0fbcF34Bb4");
      //wenn ich portfolio ausrechne muss ich bignum nehmen sonst zu ungenau mit der bigNumIntoEther4Decimals
      balance = await bigNumIntoEther4Decimals(balance)
      setAreTokensFetched(true)
     }
     
   }
 
  /* function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }*/


 /* //setup for pieChart page
 const [pieDataMarketCap, setPieDataMarketCap] = useState({      
    labels: [         
     "hey"
    ],
    datasets: [{
      label: 'My First Dataset',
      data: 0,          
      hoverOffset: 4,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
        ]
      } ]
    })
  
    let labels = []
    let dataPie = []*/

    

  const [dataLoaded, setDataLoaded] = useState(false)
  const [dataInitialized, setDataInitialized] = useState(false)

  const [portfolioBalance, setPortfolioBalance] = useState(0)

    //setup for pieChart page
  /*useEffect(() => {
      
    getPieChart()
    console.log("finalObject change and getPieChart ran")
},[portfolioBalance]);*/


  //fetching all the data for every coin the user holds
  async function intializePortPage(){
    
    if(finalArray !== undefined){
      console.log("already initialized")
        return 
    } else{
        finalArray = []
          data.map(e => {
          finalArray.push( {
          name: e.name,
          symbol: e.symbol,
          logo: e.logo,
          holderValue: "CurrentHoldings",
          balance: e.balance,
          price: "price",
          decimals: e.decimals,        
          token_address: e.token_address,
          marketCap: "marketCap",
          volume: "volume",
          priceChange: "24Hour"
          })    
        })
       
        setFinalObject(finalArray)

        let something = []
       
        try{
            //here
            await Promise.all(finalArray.map(async(e, i) => {
              let address = e.token_address
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
              console.log(error)
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


   
 
   //ERC20 price history Fetching 
   
   const [daysNum, setDaysNum] = useState(29)
 
   function changeDayInterval(num) {
     setDaysNum(num)
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



  //
  
   async function generatingHistoryStats(index){    
        let result
        try{
             result = await axios.get(`https://api.coingecko.com/api/v3/coins/ethereum/contract/${index.token_address}/market_chart/?vs_currency=usd&days=${daysNum}&interval=daily`)         
        }
        catch(error){
          console.log(error)
          return
        }

        let dates1 = Array(Number(30)).fill().map((e, i)=> 
        moment().subtract(i, "d").format("YYYY-MM-DD")
        ).reverse()
      

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
        }

        //setup for pieChart page
     /* function getPieChart(){
         
          finalObject.map(e => {
            labels.push(e.name)
          })
       
          finalObject.map(e => {
            dataPie.push(e.holderValue)
          })
          
          console.log(labels)

          setPieDataMarketCap({      
            labels: [         
                       
                labels
              
            ],
            datasets: [{
              label: 'My First Dataset',
              data: dataPie,          
              hoverOffset: 5,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                
                'rgb(255, 205, 86)'
              ],
              title:{
                display: true,
                text: "This is the title"
              },
              maintainAspectRation: false,
              legend: {
                plugins : {
                  display: true,
                  position: "bottom"
                  }
                }
           }]
         })
       }*/
        
       useEffect(() => {
      
        intializePortPage()
        console.log("Tokens have been fetched using moralis")
    },[areTokensFetched]);

      
        
       if(areTokensFetched == false){
         return <div className="pages " style={{height: "100vh"}}>
           <div className="text-center" style={{paddingTop: "26vh", marginRight: "5vw"}}><img  src={logo}></img></div>
         <h2 className="text-center" style={{paddingTop: "1vh"}}>Login and load your Portfolio!</h2>
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
       }

      return (<div >
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <Navbar account={account} networkName={network.name} networkChainId={network.chainId}/>
             
     <div className="pages">
     <Routes  >

       <Route  exact path="/UDPort" element={<Home intializePortPage={intializePortPage} getTokens={getTokens} chartDataPrice={chartDataPrice} chartDataVolume={chartDataVolume} chartDataMarketCap={chartDataMarketCap} portfolioBalance={portfolioBalance} data={data} finalObject={finalObject} generatingHistoryStats={generatingHistoryStats} changeDayInterval={changeDayInterval}/>} />

       {/*<Route exact path="/PiePort" element={<PiePort pieDataMarketCap={pieDataMarketCap} />} />*/}

     </Routes>
     </div >
     <footer id="footer" className="fixed-bottom" style={{marginTop: "10vh"}}>
      <i className="fab fa-github">&nbsp;&nbsp;&nbsp; </i>
      <i className="fab fa-twitter">&nbsp;&nbsp;&nbsp;  </i> 
          <i className="fab fa-discord">&nbsp;&nbsp;&nbsp;</i>
          <i className="fab fa-linkedin-in">&nbsp;&nbsp;&nbsp;</i>
          <i className="fab fa-youtube">&nbsp;&nbsp;&nbsp;</i>
      </footer>
    </div>
   );
 }

export default App;

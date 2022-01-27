import { Line, Pie, Chart } from 'react-chartjs-2';

import { Chart as ChartJS } from 'chart.js/auto'

const Home = (props) => {


  let portfolioBalance = props.portfolioBalance
  portfolioBalance = portfolioBalance.toFixed(2)


  return <div >
    {/* <button className="col-md-3 " onClick={() => props.intializePortPage()}>Initialize port</button>  
      <div>Load all your ERC20 Tokens (It may take a few seconds)</div>*/}
      <h1 className="d-flex justify-content-center" style={{paddingTop: "6vh"}}>{portfolioBalance} USD</h1>
    <button className="btn btn-danger offset-md-1" style={{fontSize: "70%"}}onClick={() => props.getTokens()}>Refetch</button> 
    <div className="col-md-4 offset-md-1" style={{fontSize: "70%"}}>Refetch Portfolio in case Moralis or CoinGeckos API has issues and You can not see your Data instantely</div>
   
   
      <div className="col-md-3 offset-md-7 graph position-fixed" >
        <input type="radio" name="dayInterval"></input>7 days &nbsp;
        <input type="radio" name="dayInterval"></input>14 days &nbsp;
        <input type="radio" name="dayInterval"></input>30 days &nbsp;
      </div>

     <div className="col-md-3 offset-md-7 graph position-fixed " style={{marginTop: "2vh"}}>
     <Line data={props.chartDataPrice}
    ></Line>
     </div>

   <div  className="col-md-3 offset-md-7 graph position-fixed" style={{marginTop: "27vh"}}>
      <Line data={props.chartDataVolume}
      options={{maintainAspectRation: false}}></Line>  
      </div>

      <div className="col-md-3 offset-md-7 graph position-fixed" style={{marginTop: "52vh"}}>
      <Line data={props.chartDataMarketCap}
      options={{maintainAspectRation: false}}></Line>
      </div>
  

      <h3 className="col-md-4 offset-md-1 ">All ERC20 Tokens you hold!</h3>
      {props.data !== null && <div >
            {props.finalObject.map(index => {
                return <div key={index.symbol} className="col-md-4 offset-md-1 " style={{border: " 1px solid rgba(0, 0, 0, .5)", marginBottom:"6vh", backgroundColor: "white", padding: "5px", borderRadius: "5px"}}>
                   <div>
                     <div >
                      
                        <img  src={index.logo} style={{width: "4vw"}}></img> 
                        {index.name} 
                          <div className="d-flex justify-content-end" >
                           Get Data Analytics! &nbsp; 
                       <button className="btn" style={{backgroundColor: "rgb(106, 160, 182)", border: "1px solid"}}onClick={() => props.generatingHistoryStats(index)}>Click here</button>
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
  </div>;
};

export default Home;

import {Link} from "react-router-dom"


const Navbar = (props) => {
  return <div id="Navbar">
    
     
      
      <Link to="/UDPortPage" className="Nav">UDPortPage</Link>
     
      <div>
        <div style={{fontSize: "50%", textAlign: "auto"}}>{props.account}</div>  
        <div style={{fontSize: "50%", textAlign: "auto"}}>{props.networkName}: {props.networkChainId}</div>    
      </div>
      <div className="UDLogOut"style={{fontSize: "50%", textAlign: "auto"}}>
      {props.udLoginDomain}
      </div>
  </div>;
};

export default Navbar;


import './App.css';


function App() {

  /*const serverUrl = process.env.REACT_APP_YOUR_SERVER_URL;
const appId = process.env.REACT_APP_YOUR_APP_ID;
Moralis.start({ serverUrl, appId });

/** Add from here down */
/*async function login() {
  let user = Moralis.User.current();
  if (!user) {
   try {
      user = await Moralis.authenticate({ signingMessage: "Hello World!" })
      console.log(user)
      console.log(user.get('ethAddress'))
   } catch(error) {
     console.log(error)
   }
  }
}

async function logOut() {
  console.log("start of logging out")
  await Moralis.User.logOut();
  console.log("logged out");
}*/

//<button id="btn-login" onClick={login}>Moralis Login</button>
//<button id="btn-logout" onClick={logOut}>Logout </button>
        


  return (
    <div className="App">
      <header className="App-header">

      
      Hello
      
      </header>
    </div>
  );
}

export default App;

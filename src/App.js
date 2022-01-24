
import './App.css';


function App() {

 Moralis.serverUrl = "https://t4sirwflpnha.usemoralis.com:2053/server";
Moralis.appId = "2VLj5S3kq8IKfTV2jEkJME6MYTLJniAdydB1xBnk";
Moralis.start({ serverUrl, appId });

/** Add from here down */
async function login() {
  let user = await Moralis.User.current();
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
}


  return (
    <div className="App">
      <header className="App-header">

      
      Hello
      <button id="btn-login" onClick={login}>Moralis Login</button>
    <button id="btn-logout" onClick={logOut}>Logout </button>
      </header>
    </div>
  );
}

export default App;

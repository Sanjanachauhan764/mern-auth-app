import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user,setUser] = useState(null);

async function registerUser(){
  const res = await axios.post(
    "http://localhost:5000/register",
    {
      name,
      email,
      password
    }
  );
  alert(res.data.message);
  setName("");
  setEmail("");
  setPassword("");
}

async function loginUser(){
  const res = await axios.post(
    "http://localhost:5000/login",
    {
      email: loginEmail,
      password: loginPassword
    }
  );
  if(res.data.token){
    localStorage.setItem("token",res.data.token);
    setIsLoggedIn(true);
    getProfile();
    alert("Login Successful");
  }else{
    alert(res.data.message);
  }
}

useEffect(() => {
  const token = localStorage.getItem("token");
  if(token){
    setIsLoggedIn(true);
    getProfile();
  }
}, []);

function logoutUser(){
  localStorage.removeItem("token");
  setIsLoggedIn(false);
}

async function getProfile(){
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:5000/profile",
    {
      headers:{
        authorization: token
      }
    }
  );
  setUser(res.data.user);
}

  return (
    <div className="container">
        { isLoggedIn ? (
            <div>
                <h1>Dashboard</h1>
                <h2 className="welcome">Welcome {user?.email} 🎉</h2>
                <button onClick={logoutUser} className="logout-btn">Logout</button>
            </div>
        ) : (  
        <>
      <h1>Register</h1>
      <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/><br /><br />
      <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/><br /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/><br /><br />
      <button onClick={registerUser}>Register</button>
      <hr />
      <h1>Login</h1>
      <input type="email" placeholder="Email" value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)}/><br /><br />
      <input type="password" placeholder="Password" value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)}/><br /><br />
      <button onClick={loginUser}>Login</button>
      </>
      )}
    </div>
  );

}
export default App;
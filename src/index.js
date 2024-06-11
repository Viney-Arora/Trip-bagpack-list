import React  from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Signin from './components/signin';
import Signup from './components/signup';
import Mainpage from './components/mainpage';
import {BrowserRouter,Routes, Route} from "react-router-dom";


export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainpage />}/>
        <Route path="/signin" element={<Signin />}/>1
        <Route path="/signup" element={<Signup />}/>
      </Routes>
    </BrowserRouter>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


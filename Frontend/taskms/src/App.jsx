import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Signin';
import './app.css';
import Homepage from './Pages/Homepage';
import Productpage from './Components/Task/Productpage';


function App() {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/product" element={<Productpage />} />
     
      </Routes>
    </div>  );
}
export default App;

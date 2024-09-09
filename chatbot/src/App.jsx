import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import Login from './Components/Login';
import Register from './Components/Register';
import OTP from './Components/OTP';
import Dashboard from './Components/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';
import PolicyChat from './Components/PolicyChat';
import RagSystem from './Components/RagSystem';

const App = () => {
  return (
    <Router>
      <div className="relative">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OTP />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/policy-chat" element={<PolicyChat />} />
            <Route path="/rag-system" element={<RagSystem />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
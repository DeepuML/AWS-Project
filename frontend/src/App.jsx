import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import FitnessChatBot from './components/ChatBot';
import Home from './pages/Home';
import Classes from './pages/Classes';
import Trainers from './pages/Trainers';
import Membership from './pages/Membership';
import JoinForm from './pages/JoinForm';
import MemberDetail from './pages/MemberDetail';
import FlexFitEntryForm from './pages/FlexFitEntryForm';
import FlexFitEntryDetail from './pages/FlexFitEntryDetail';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';

// Styles
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/add" element={<JoinForm />} />
            <Route path="/edit/:id" element={<JoinForm />} />
            <Route path="/member/:id" element={<MemberDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-flex-fit" element={<FlexFitEntryForm />} />
            <Route path="/edit-flex-fit/:id" element={<FlexFitEntryForm />} />
            <Route path="/flex-fit-entry/:id" element={<FlexFitEntryDetail />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" autoClose={3000} />
        <FitnessChatBot />
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/fonts.css';
import './styles/GlobalStyles.css';
import CompanyQuestions from "./pages/CompanyQuestions";
import Feedback from './pages/Feedback';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header'; 
import MockTest from './pages/MockTest';
import AdvancedSearch from './pages/AdvancedSearch';
import CodeEditor from './pages/CodeEditor';
import Community from './pages/Community';
import InterviewExperience from './pages/InterviewExperience';
import APIIntegration from './pages/APIIntegration';

export default function App(){
  return (
    <BrowserRouter>
        <div className="app-container">
        <Header />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/company/:id" element={<CompanyQuestions />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/mock-test" element={<MockTest />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/code-editor" element={<CodeEditor />} />
          <Route path="/community" element={<Community />} />
          <Route path="/interview-experience" element={<InterviewExperience />} />
          <Route path="/api-integration" element={<APIIntegration />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </BrowserRouter>
  );
}

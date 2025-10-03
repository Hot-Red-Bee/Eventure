
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import RSVP from './pages/RSVP';
import Admin from './pages/Admin';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import './index.css';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import UserDashboard from './pages/UserDashboard';

const App = () => (
  <BrowserRouter>
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/rsvp" element={<RSVP />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event/:eventId" element={<EditEvent />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path ="/reset-password" element={<ResetPassword/>} />
          <Route path ="/change-password" element={<ChangePassword/>} />
          <Route path ="/reset-password/confirm" element={<ResetPasswordConfirm/>} />
          <Route path ="/dashboard" element={<UserDashboard/>} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);

export default App;
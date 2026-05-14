import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ApplicantDetail from './pages/applicants/ApplicantDetail';
import ApplicantsList from './pages/applicants/ApplicantsList';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import JobCreate from './pages/jobs/JobCreate';
import JobEdit from './pages/jobs/JobEdit';
import JobsList from './pages/jobs/JobsList';
import Profile from './pages/profile/Profile';
const Private=({children})=><ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>;
export default function App(){return <Routes><Route path="/" element={<Navigate to="/dashboard"/>}/><Route path="/login" element={<Login/>}/><Route path="/signup" element={<Signup/>}/><Route path="/dashboard" element={<Private><Dashboard/></Private>}/><Route path="/jobs" element={<Private><JobsList/></Private>}/><Route path="/jobs/create" element={<Private><JobCreate/></Private>}/><Route path="/jobs/:id/edit" element={<Private><JobEdit/></Private>}/><Route path="/applicants" element={<Private><ApplicantsList/></Private>}/><Route path="/applicants/:id" element={<Private><ApplicantDetail/></Private>}/><Route path="/profile" element={<Private><Profile/></Private>}/></Routes>}

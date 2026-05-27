import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import ClassManagement from './pages/admin/ClassManagement'
import SectionManagement from './pages/admin/SectionManagement'
import SubjectManagement from './pages/admin/SubjectManagement'
import Admission from './pages/clerk/Admission'
import FeePayment from './pages/clerk/FeePayment'
import Attendance from './pages/teacher/Attendance'
import Performance from './pages/teacher/Performance'
import Syllabus from './pages/teacher/Syllabus'
import ClassSchedule from './pages/principal/ClassSchedule'
import Reports from './pages/principal/Reports'
import Analysis from './pages/principal/Analysis'
import StudentPortal from './pages/student/StudentPortal'

function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<PrivateRoute roles={['ADMIN']}><UserManagement /></PrivateRoute>} />
        <Route path="classes" element={<PrivateRoute roles={['ADMIN']}><ClassManagement /></PrivateRoute>} />
        <Route path="sections" element={<PrivateRoute roles={['ADMIN']}><SectionManagement /></PrivateRoute>} />
        <Route path="subjects" element={<PrivateRoute roles={['ADMIN']}><SubjectManagement /></PrivateRoute>} />
        <Route path="admission" element={<PrivateRoute roles={['CLERK','ADMIN']}><Admission /></PrivateRoute>} />
        <Route path="fees" element={<PrivateRoute roles={['CLERK','ADMIN','PRINCIPAL']}><FeePayment /></PrivateRoute>} />
        <Route path="attendance" element={<PrivateRoute roles={['TEACHER','ADMIN']}><Attendance /></PrivateRoute>} />
        <Route path="performance" element={<PrivateRoute roles={['TEACHER','ADMIN','PRINCIPAL']}><Performance /></PrivateRoute>} />
        <Route path="syllabus" element={<PrivateRoute roles={['TEACHER','ADMIN','PRINCIPAL']}><Syllabus /></PrivateRoute>} />
        <Route path="schedule" element={<PrivateRoute roles={['PRINCIPAL','ADMIN']}><ClassSchedule /></PrivateRoute>} />
        <Route path="reports" element={<PrivateRoute roles={['PRINCIPAL','ADMIN','CLERK']}><Reports /></PrivateRoute>} />
        <Route path="analysis" element={<PrivateRoute roles={['PRINCIPAL','ADMIN']}><Analysis /></PrivateRoute>} />
        <Route path="student" element={<PrivateRoute roles={['STUDENT']}><StudentPortal /></PrivateRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

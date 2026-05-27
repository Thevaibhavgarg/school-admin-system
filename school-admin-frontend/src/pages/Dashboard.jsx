import { useEffect, useState } from 'react'
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Button } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import PaymentIcon from '@mui/icons-material/Payment'
import SchoolIcon from '@mui/icons-material/School'
import EventNoteIcon from '@mui/icons-material/EventNote'
import PersonIcon from '@mui/icons-material/Person'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAdmissionReport } from '../api/reportApi'
import { getFeeSummary } from '../api/feeApi'

function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" fontWeight={700}>{value ?? '—'}</Typography>
          </Box>
          <Box sx={{ bgcolor: color, borderRadius: '50%', p: 1.5, color: '#fff' }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'STUDENT') { setLoading(false); return }
    const load = async () => {
      try {
        const [admissionRes, feeRes] = await Promise.allSettled([
          getAdmissionReport(),
          getFeeSummary('2024-2025'),
        ])
        setStats({
          totalStudents: admissionRes.value?.data?.totalStudents,
          totalCollected: feeRes.value?.data?.totalCollected,
          totalPending: feeRes.value?.data?.totalPending,
        })
      } catch (_) {}
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>

  if (user?.role === 'STUDENT') {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <PersonIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>Welcome, {user?.fullName}!</Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>Go to your portal to view your profile, attendance and performance.</Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/student')}>Open My Portal</Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Welcome, {user?.fullName} 👋
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Role: {user?.role} &nbsp;|&nbsp; Academic Year: 2024-2025
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Students" value={stats.totalStudents} icon={<PeopleIcon />} color="#1565c0" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Fee Collected (₹)" value={stats.totalCollected?.toLocaleString()} icon={<PaymentIcon />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Fee Pending (₹)" value={stats.totalPending?.toLocaleString()} icon={<SchoolIcon />} color="#e65100" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Academic Year" value="2024-25" icon={<EventNoteIcon />} color="#7b1fa2" />
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 3, boxShadow: 1 }}>
        <Typography variant="h6" fontWeight={600} mb={1}>Quick Access</Typography>
        <Typography variant="body2" color="text.secondary">
          Use the sidebar to navigate between modules. Your role ({user?.role}) determines which modules are accessible.
        </Typography>
      </Box>
    </Box>
  )
}

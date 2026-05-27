import { useEffect, useState } from 'react'
import {
  Box, Typography, Tabs, Tab, Card, CardContent, Grid, Chip,
  Table, TableHead, TableRow, TableCell, TableBody, CircularProgress,
  LinearProgress, TextField, MenuItem, Avatar
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import EventNoteIcon from '@mui/icons-material/EventNote'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { getMyProfile } from '../../api/studentApi'
import { getMyAttendance, getMyAttendanceSummary } from '../../api/attendanceApi'
import { getMyPerformance } from '../../api/performanceApi'
import { toast } from 'react-toastify'

const YEARS = ['2024-2025', '2023-2024']
const STATUS_COLOR = { PRESENT: 'success', ABSENT: 'error', LATE: 'warning', LEAVE: 'info' }

function gradeColor(pct) {
  if (pct >= 75) return 'success'
  if (pct >= 50) return 'primary'
  if (pct >= 35) return 'warning'
  return 'error'
}

export default function StudentPortal() {
  const [tab, setTab] = useState(0)
  const [profile, setProfile] = useState(null)
  const [attendance, setAttendance] = useState([])
  const [summary, setSummary] = useState(null)
  const [performance, setPerformance] = useState([])
  const [year, setYear] = useState('2024-2025')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProfile()
    loadAttendance()
  }, [])

  useEffect(() => {
    if (tab === 2) loadPerformance()
  }, [tab, year])

  const loadProfile = async () => {
    try {
      const { data } = await getMyProfile()
      setProfile(data)
    } catch { toast.error('Failed to load profile') }
  }

  const loadAttendance = async () => {
    try {
      const [a, s] = await Promise.allSettled([getMyAttendance(), getMyAttendanceSummary()])
      setAttendance(a.status === 'fulfilled' ? (a.value?.data || []) : [])
      setSummary(s.status === 'fulfilled' ? (s.value?.data || null) : null)
    } catch { /* attendance may be empty on first load */ }
  }

  const loadPerformance = async () => {
    setLoading(true)
    try {
      const { data } = await getMyPerformance(year)
      setPerformance(data)
    } catch { toast.error('Failed to load performance') }
    setLoading(false)
  }

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    )
  }

  const presentDays = summary?.presentDays ?? 0
  const totalDays = summary?.totalDays ?? 0
  const attPct = totalDays > 0 ? Math.round(presentDays / totalDays * 100) : 0

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: 24 }}>
          {profile.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700}>{profile.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profile.schoolClass?.className} — Section {profile.section?.name} &nbsp;|&nbsp; Adm: {profile.admissionNumber}
          </Typography>
        </Box>
      </Box>

      {/* Summary cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          ['Class', `${profile.schoolClass?.className} - ${profile.section?.name}`, 'primary', <SchoolIcon />],
          ['Attendance', `${attPct}%`, attPct >= 75 ? 'success' : attPct >= 60 ? 'warning' : 'error', <EventNoteIcon />],
          ['Performance Records', performance.length || '—', 'secondary', <EmojiEventsIcon />],
        ].map(([label, value, color, icon]) => (
          <Grid item xs={12} sm={4} key={label}>
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main` }}>{icon}</Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography variant="h6" fontWeight={700} color={`${color}.main`}>{value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="My Profile" />
        <Tab label="My Attendance" />
        <Tab label="My Performance" />
      </Tabs>

      {/* Tab 0 — Profile */}
      {tab === 0 && (
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>Personal Details</Typography>
            <Grid container spacing={2}>
              {[
                ['Full Name', profile.name],
                ['Admission No.', profile.admissionNumber],
                ['Date of Birth', profile.dateOfBirth],
                ['Gender', profile.gender],
                ['Blood Group', profile.bloodGroup],
                ['Class', `${profile.schoolClass?.className} — Section ${profile.section?.name}`],
                ['Admission Date', profile.admissionDate],
                ['Address', `${profile.address || ''}, ${profile.city || ''}, ${profile.state || ''} ${profile.pincode || ''}`],
                ['Father', profile.fatherName],
                ['Mother', profile.motherName],
                ['Parent Contact', profile.parentContact],
                ['Parent Email', profile.parentEmail],
              ].map(([label, value]) => value ? (
                <Grid item xs={12} sm={6} key={label}>
                  <Typography variant="body2"><strong>{label}:</strong> {value}</Typography>
                </Grid>
              ) : null)}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tab 1 — Attendance */}
      {tab === 1 && (
        <Box>
          {totalDays > 0 && (
            <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <CardContent>
                <Grid container spacing={3}>
                  {[
                    ['Total Days', totalDays, 'primary'],
                    ['Present', presentDays, 'success'],
                    ['Absent', totalDays - presentDays, 'error'],
                  ].map(([label, val, color]) => (
                    <Grid item xs={4} key={label} sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={700} color={`${color}.main`}>{val}</Typography>
                      <Typography variant="body2" color="text.secondary">{label}</Typography>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" mb={0.5}>Attendance: {attPct}%</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={attPct}
                    color={attPct >= 75 ? 'success' : attPct >= 60 ? 'warning' : 'error'}
                    sx={{ borderRadius: 2, height: 10 }}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
          {Array.isArray(attendance) && attendance.length > 0 ? (
            <Box sx={{ bgcolor: '#fff', borderRadius: 3, boxShadow: 1, overflow: 'auto' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f6fa' }}>
                  <TableRow>
                    {['Date', 'Status'].map(h => <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.slice(-30).reverse().map(a => (
                    <TableRow key={a.id} hover>
                      <TableCell>{a.date}</TableCell>
                      <TableCell><Chip label={a.status} color={STATUS_COLOR[a.status]} size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <Typography variant="body1">No attendance records found yet.</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Tab 2 — Performance */}
      {tab === 2 && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <TextField select label="Academic Year" value={year} onChange={e => setYear(e.target.value)} size="small" sx={{ minWidth: 160 }}>
              {YEARS.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </TextField>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : Array.isArray(performance) && performance.length > 0 ? (
            <Box sx={{ bgcolor: '#fff', borderRadius: 3, boxShadow: 1, overflow: 'auto' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f6fa' }}>
                  <TableRow>
                    {['Subject', 'Exam Type', 'Marks', 'Max', '%', 'Term'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {performance.map(r => {
                    const pct = Math.round(r.marks / r.maxMarks * 100)
                    return (
                      <TableRow key={r.id} hover>
                        <TableCell>{r.subject?.name}</TableCell>
                        <TableCell><Chip label={r.examType} size="small" variant="outlined" /></TableCell>
                        <TableCell>{r.marks}</TableCell>
                        <TableCell>{r.maxMarks}</TableCell>
                        <TableCell><Chip label={`${pct}%`} color={gradeColor(pct)} size="small" /></TableCell>
                        <TableCell>{r.term}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <Typography variant="body1">No performance records found for {year}.</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

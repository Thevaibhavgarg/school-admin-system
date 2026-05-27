import { useEffect, useState } from 'react'
import {
  Box, Typography, Tabs, Tab, Grid, TextField, MenuItem, Button,
  Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Chip, LinearProgress
} from '@mui/material'
import { getAdmissionReport, getSyllabusReport, getClassStudentReport, getAttendanceReport, getPerformanceReport } from '../../api/reportApi'
import { getClasses } from '../../api/studentApi'
import { toast } from 'react-toastify'

const YEARS = ['2024-2025', '2023-2024']

export default function Reports() {
  const [tab, setTab] = useState(0)
  const [classes, setClasses] = useState([])
  const [classId, setClassId] = useState('')
  const [year, setYear] = useState('2024-2025')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getClasses().then(r => setClasses(r.data)).catch(() => {})
    loadAdmissions()
  }, [])

  const loadAdmissions = async () => {
    setLoading(true)
    try { const r = await getAdmissionReport(); setData(r.data) }
    catch { toast.error('Failed to load') }
    setLoading(false)
  }

  const loadReport = async (tabValue = tab) => {
    if (!classId && tabValue !== 0 && tabValue !== 4) return
    setLoading(true)
    try {
      let r
      if (tabValue === 1) r = await getSyllabusReport(classId, year)
      else if (tabValue === 2) r = await getAttendanceReport(classId)
      else if (tabValue === 3) r = await getPerformanceReport(classId, year)
      else if (tabValue === 4) r = await getClassStudentReport()
      setData(r?.data)
    } catch { toast.error('Failed to load report') }
    setLoading(false)
  }

  const handleTabChange = (_, v) => { setTab(v); setData(null); if (v === 0) loadAdmissions(); if (v === 4) loadReport(v) }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Reports</Typography>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb:3 }} variant="scrollable">
        <Tab label="Admission Report" />
        <Tab label="Syllabus Report" />
        <Tab label="Attendance Report" />
        <Tab label="Performance Report" />
        <Tab label="Class Summary" />
      </Tabs>

      {tab !== 0 && tab !== 4 && (
        <Card sx={{ borderRadius:3, boxShadow:2, mb:3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} sm={4}>
                <TextField fullWidth select label="Class" value={classId} onChange={e=>setClassId(e.target.value)}>
                  {Array.isArray(classes) ? classes.map(c=><MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>) : null}
                </TextField>
              </Grid>
              {(tab === 1 || tab === 3) && (
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth select label="Academic Year" value={year} onChange={e=>setYear(e.target.value)}>
                    {Array.isArray(YEARS) ? YEARS.map(y=><MenuItem key={y} value={y}>{y}</MenuItem>) : null}
                  </TextField>
                </Grid>
              )}
              <Grid item xs={12} sm={2}>
                <Button variant="contained" fullWidth onClick={() => loadReport(tab)} disabled={!classId}>Generate</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Box sx={{ display:'flex', justifyContent:'center', py:6 }}><CircularProgress /></Box>
      ) : data ? (
        <Box>
          {/* Admission Report */}
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius:3, textAlign:'center', p:2 }}>
                  <Typography variant="h3" fontWeight={700} color="primary">{data.totalStudents}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Active Students</Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Card sx={{ borderRadius:3, boxShadow:1 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} mb={2}>Students by Class</Typography>
                    <Table size="small">
                      <TableHead><TableRow>{['Class','Count'].map(h=><TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>)}</TableRow></TableHead>
                      <TableBody>
                        {data.byClass && Object.entries(data.byClass).map(([cls, cnt]) => (
                          <TableRow key={cls}><TableCell>{cls}</TableCell><TableCell>{cnt}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
                  <Typography variant="h6" fontWeight={600} p={2}>Recent Admissions</Typography>
                  <Table>
                    <TableHead sx={{ bgcolor:'#f5f6fa' }}><TableRow>{['Adm No','Name','Class','Section','Date'].map(h=><TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>)}</TableRow></TableHead>
                    <TableBody>
                      {data.recentAdmissions?.map(s => (
                        <TableRow key={s.id} hover>
                          <TableCell>{s.admissionNumber}</TableCell>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.schoolClass?.className}</TableCell>
                          <TableCell>{s.section?.name}</TableCell>
                          <TableCell>{s.admissionDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* Syllabus Report */}
          {tab === 1 && (
            <Box>
              <Grid container spacing={2} sx={{ mb:3 }}>
                {[['Total Topics', data.totalTopics, 'primary'],['Completed', data.completedTopics, 'success'],['Pending', data.pendingTopics, 'warning']].map(([l,v,c])=>(
                  <Grid item xs={4} key={l}>
                    <Card sx={{ textAlign:'center', p:2, borderRadius:3 }}>
                      <Typography variant="h4" fontWeight={700} color={`${c}.main`}>{v}</Typography>
                      <Typography variant="body2" color="text.secondary">{l}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="body1" mb={1}>Completion: {data.completionPercent}%</Typography>
              <LinearProgress variant="determinate" value={data.completionPercent} sx={{ height:10, borderRadius:2, mb:3 }} color={data.completionPercent>=75?'success':'warning'} />
              <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
                <Table>
                  <TableHead sx={{ bgcolor:'#f5f6fa' }}><TableRow>{['Subject','Term','Topic','Status'].map(h=><TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>)}</TableRow></TableHead>
                  <TableBody>
                    {data.syllabi?.map(s => (
                      <TableRow key={s.id} hover>
                        <TableCell>{s.subject?.name}</TableCell>
                        <TableCell>{s.term}</TableCell>
                        <TableCell>{s.topic}</TableCell>
                        <TableCell><Chip label={s.completed?'Done':'Pending'} color={s.completed?'success':'warning'} size="small" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* Attendance Report */}
          {tab === 2 && (
            <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
              <Table>
                <TableHead sx={{ bgcolor:'#f5f6fa' }}><TableRow>{['Adm No','Student','Total Days','Present','Absent','Attendance %'].map(h=><TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>)}</TableRow></TableHead>
                <TableBody>
                  {data.attendanceData?.map(r => (
                    <TableRow key={r.studentId} hover>
                      <TableCell>{r.admissionNumber}</TableCell>
                      <TableCell>{r.studentName}</TableCell>
                      <TableCell>{r.totalDays}</TableCell>
                      <TableCell>{r.presentDays}</TableCell>
                      <TableCell>{r.totalDays - r.presentDays}</TableCell>
                      <TableCell>
                        <Chip label={`${r.percentage}%`} color={r.percentage>=75?'success':r.percentage>=60?'warning':'error'} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}

          {/* Performance Report */}
          {tab === 3 && (
            <Box>
              <Typography variant="h6" fontWeight={600} mb={2}>Average Score by Subject</Typography>
              <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
                <Table>
                  <TableHead sx={{ bgcolor:'#f5f6fa' }}><TableRow>{['Subject','Average %'].map(h=><TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>)}</TableRow></TableHead>
                  <TableBody>
                    {data.averageBySubject && Object.entries(data.averageBySubject).map(([sub, avg]) => (
                      <TableRow key={sub} hover>
                        <TableCell>{sub}</TableCell>
                        <TableCell><Chip label={`${Math.round(avg)}%`} color={avg>=75?'success':avg>=50?'primary':'error'} size="small" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}

          {/* Class Summary */}
          {tab === 4 && (
            <Box>
              <Typography variant="h6" fontWeight={600} mb={2}>Active Students: {data.totalActiveStudents}</Typography>
              <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
                <Table>
                  <TableHead sx={{ bgcolor:'#f5f6fa' }}><TableRow>{['Class','Student Count'].map(h=><TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>)}</TableRow></TableHead>
                  <TableBody>
                    {data.classes?.map(c => (
                      <TableRow key={c.classId} hover>
                        <TableCell>{c.className}</TableCell>
                        <TableCell>{c.studentCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}
        </Box>
      ) : tab !== 0 ? (
        <Box sx={{ textAlign:'center', py:8, color:'text.secondary' }}>
          <Typography variant="body1">Select a class above and click "Generate" to view this report</Typography>
        </Box>
      ) : null}
    </Box>
  )
}

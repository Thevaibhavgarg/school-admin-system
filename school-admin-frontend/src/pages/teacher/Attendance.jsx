import { useEffect, useState } from 'react'
import {
  Box, Typography, Grid, TextField, MenuItem, Button, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, Chip, CircularProgress, Tabs, Tab, IconButton
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import DeleteIcon from '@mui/icons-material/Delete'
import { markAttendance, getAttendanceByClassSectionDate, deleteAttendance } from '../../api/attendanceApi'
import { getStudentsByClassSection, getClasses, getSections } from '../../api/studentApi'
import { toast } from 'react-toastify'

const STATUS_OPTIONS = ['PRESENT', 'ABSENT', 'LATE', 'LEAVE']
const STATUS_COLOR = { PRESENT:'success', ABSENT:'error', LATE:'warning', LEAVE:'info' }

export default function Attendance() {
  const [tab, setTab] = useState(0)
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [existing, setExisting] = useState([])
  const [filter, setFilter] = useState({ classId:'', sectionId:'', date: new Date().toISOString().split('T')[0] })
  const [loading, setLoading] = useState(false)

  useEffect(() => { getClasses().then(r => setClasses(r.data)).catch(() => {}) }, [])

  const handleClassChange = async (classId) => {
    setFilter(f => ({ ...f, classId, sectionId:'' }))
    setStudents([])
    setSections([])
    if (classId) {
      try {
        const { data } = await getSections(classId)
        setSections(data)
      } catch (err) {
        toast.error('Failed to load sections')
        setSections([])
      }
    }
  }

  const loadStudents = async () => {
    if (!filter.classId || !filter.sectionId) return
    setLoading(true)
    try {
      const [sRes, aRes] = await Promise.allSettled([
        getStudentsByClassSection(filter.classId, filter.sectionId),
        getAttendanceByClassSectionDate(filter.classId, filter.sectionId, filter.date)
      ])
      setStudents(sRes.status === 'fulfilled' ? (sRes.value?.data || []) : [])
      setExisting(aRes.status === 'fulfilled' ? (aRes.value?.data || []) : [])
      const map = {}
      if (sRes.status === 'fulfilled') {
        sRes.value.data.forEach(s => { map[s.id] = 'PRESENT' })
      }
      if (aRes.status === 'fulfilled') {
        aRes.value.data.forEach(a => { map[a.student.id] = a.status })
      }
      setAttendance(map)
    } catch (err) { 
      console.error('Load error:', err)
      toast.error('Failed to load')
    }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!students.length) return
    setLoading(true)
    try {
      const entries = students.map(s => ({ studentId: s.id, status: attendance[s.id] || 'PRESENT' }))
      await markAttendance({ classId: Number(filter.classId), sectionId: Number(filter.sectionId), date: filter.date, entries })
      toast.success('Attendance saved successfully')
      loadStudents()
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save') }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id)
      toast.success('Record deleted')
      loadStudents()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const presentCount = Object.values(attendance).filter(v => v === 'PRESENT').length
  const absentCount = Object.values(attendance).filter(v => v === 'ABSENT').length

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>Attendance Management</Typography>
      </Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Mark Attendance" />
        <Tab label="View Records" />
      </Tabs>

      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={3}>
              <TextField fullWidth select label="Class" value={filter.classId} onChange={e=>handleClassChange(e.target.value)}>
                {Array.isArray(classes) && classes.map(c=><MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth select label="Section" value={filter.sectionId} onChange={e=>setFilter(f=>({...f,sectionId:e.target.value}))} disabled={!filter.classId}>
                {Array.isArray(sections) && sections.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth label="Date" type="date" InputLabelProps={{ shrink:true }} value={filter.date} onChange={e=>setFilter(f=>({...f,date:e.target.value}))} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" fullWidth onClick={loadStudents} disabled={!filter.classId||!filter.sectionId}>
                Load Students
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display:'flex', justifyContent:'center', py:6 }}><CircularProgress /></Box>
      ) : tab === 0 ? (
        Array.isArray(students) && students.length > 0 ? (
          <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1 }}>
            <Box sx={{ p:2, display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #eee' }}>
              <Typography variant="body1">
                Total: <strong>{students.length}</strong> | Present: <strong style={{color:'green'}}>{presentCount}</strong> | Absent: <strong style={{color:'red'}}>{absentCount}</strong>
              </Typography>
              <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleSubmit}>
                Save Attendance
              </Button>
            </Box>
            <Table>
              <TableHead sx={{ bgcolor:'#f5f6fa' }}>
                <TableRow>
                  {['#','Adm No','Name','Status'].map(h=><TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((s, i) => (
                  <TableRow key={s.id} hover>
                    <TableCell>{i+1}</TableCell>
                    <TableCell>{s.admissionNumber}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>
                      <TextField select size="small" value={attendance[s.id] || 'PRESENT'}
                        onChange={e=>setAttendance(a=>({...a,[s.id]:e.target.value}))}
                        sx={{ minWidth:130 }}>
                        {STATUS_OPTIONS.map(o=>(
                          <MenuItem key={o} value={o}><Chip label={o} color={STATUS_COLOR[o]} size="small" /></MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Box sx={{ textAlign:'center', py:8, color:'text.secondary' }}>
            <Typography variant="body1">Select a class and section above, then click "Load Students" to mark attendance</Typography>
          </Box>
        )
      ) : (
        existing.length > 0 ? (
          <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor:'#f5f6fa' }}>
                <TableRow>
                  {['#','Student','Admission No','Date','Status','Action'].map(h=><TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {existing.map((a, i) => (
                  <TableRow key={a.id} hover>
                    <TableCell>{i+1}</TableCell>
                    <TableCell>{a.student?.name}</TableCell>
                    <TableCell>{a.student?.admissionNumber}</TableCell>
                    <TableCell>{a.date}</TableCell>
                    <TableCell><Chip label={a.status} color={STATUS_COLOR[a.status]} size="small" /></TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => handleDelete(a.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Box sx={{ textAlign:'center', py:8, color:'text.secondary' }}>
            <Typography variant="body1">Select a class, section and date above, then click "Load Students" to view records</Typography>
          </Box>
        )
      )}
    </Box>
  )
}

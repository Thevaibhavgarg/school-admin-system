import { useEffect, useState } from 'react'
import {
  Box, Typography, Grid, TextField, MenuItem, Button, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, CircularProgress,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Chip
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { createSchedule, updateSchedule, getScheduleByClassSection, deleteSchedule, getTeachers } from '../../api/scheduleApi'
import { getClasses, getSections, getSubjects } from '../../api/studentApi'
import { toast } from 'react-toastify'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]
const YEARS = ['2024-2025', '2023-2024']
const INIT = { classId:'', sectionId:'', subjectId:'', teacherId:'', day:'Monday', period:1, startTime:'09:00', endTime:'09:45', academicYear:'2024-2025' }

export default function ClassSchedule() {
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(INIT)
  const [schedules, setSchedules] = useState([])
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [filter, setFilter] = useState({ classId:'', sectionId:'' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.allSettled([getClasses(), getTeachers()])
      .then(([c, t]) => { 
        setClasses(c.status === 'fulfilled' ? (c.value?.data || []) : [])
        setTeachers(t.status === 'fulfilled' ? (t.value?.data || []) : [])
      })
      .catch(() => {})
  }, [])

  const handleClassChange = async (classId, target) => {
    if (target === 'filter') { setFilter(f=>({...f,classId,sectionId:''})); setSections([]) }
    else setForm(f=>({...f,classId,sectionId:'',subjectId:''}))
    if (classId) {
      try {
        const [sec, sub] = await Promise.allSettled([getSections(classId), getSubjects(classId)])
        setSections(sec.status === 'fulfilled' ? (sec.value?.data || []) : [])
        if (target !== 'filter') setSubjects(sub.status === 'fulfilled' ? (sub.value?.data || []) : [])
      } catch (err) {
        console.error('Failed to load data:', err)
        toast.error('Failed to load data')
        setSections([])
        setSubjects([])
      }
    }
  }

  const loadSchedules = async () => {
    if (!filter.classId || !filter.sectionId) return
    setLoading(true)
    try {
      const { data } = await getScheduleByClassSection(filter.classId, filter.sectionId)
      setSchedules(data)
    } catch { toast.error('Failed to load') }
    setLoading(false)
  }

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, classId:Number(form.classId), sectionId:Number(form.sectionId), subjectId:Number(form.subjectId), teacherId:Number(form.teacherId), period:Number(form.period) }
      editId ? await updateSchedule(editId, payload) : await createSchedule(payload)
      toast.success(editId ? 'Updated' : 'Schedule created')
      setOpen(false); setEditId(null); setForm(INIT); loadSchedules()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    try { await deleteSchedule(id); toast.success('Deleted'); loadSchedules() }
    catch { toast.error('Delete failed') }
  }

  // Group by day for timetable view
  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = schedules.filter(s => s.day === day).sort((a,b) => a.period - b.period)
    return acc
  }, {})

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>Class Schedule</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditId(null); setForm(INIT); setOpen(true) }}>Add Period</Button>
      </Box>

      <Card sx={{ borderRadius:3, boxShadow:2, mb:3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select label="Class" value={filter.classId} onChange={e=>handleClassChange(e.target.value,'filter')}>
              {Array.isArray(classes) ? classes.map(c=><MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>) : null}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth select label="Section" value={filter.sectionId} onChange={e=>setFilter(f=>({...f,sectionId:e.target.value}))} disabled={!filter.classId}>
              {Array.isArray(sections) ? sections.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>) : null}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" fullWidth onClick={loadSchedules} disabled={!filter.classId||!filter.sectionId}>Load Timetable</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display:'flex', justifyContent:'center', py:6 }}><CircularProgress /></Box>
      ) : Array.isArray(schedules) && schedules.length > 0 ? (
        <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor:'#f5f6fa' }}>
              <TableRow>
                {['Day','Period','Time','Subject','Teacher','Actions'].map(h=>(
                  <TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {DAYS.flatMap(day => byDay[day].map(s => (
                <TableRow key={s.id} hover>
                  <TableCell><Chip label={s.day} size="small" color="primary" variant="outlined" /></TableCell>
                  <TableCell>{s.period}</TableCell>
                  <TableCell>{s.startTime} - {s.endTime}</TableCell>
                  <TableCell>{s.subject?.name}</TableCell>
                  <TableCell>{s.teacher?.fullName}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => { setEditId(s.id); setForm({classId:s.schoolClass?.id,sectionId:s.section?.id,subjectId:s.subject?.id,teacherId:s.teacher?.id,day:s.day,period:s.period,startTime:s.startTime,endTime:s.endTime,academicYear:s.academicYear}); setOpen(true) }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(s.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Box sx={{ textAlign:'center', py:8, color:'text.secondary' }}>
          <Typography variant="body1">Select a class and section above, then click "Load Timetable" to view the schedule</Typography>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit' : 'Add'} Class Period</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2 }}>
            <TextField select label="Class" required value={form.classId} onChange={e=>handleClassChange(e.target.value,'form')}>
              {Array.isArray(classes) ? classes.map(c=><MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>) : null}
            </TextField>
            <TextField select label="Section" required value={form.sectionId} onChange={set('sectionId')} disabled={!form.classId}>
              {Array.isArray(sections) ? sections.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>) : null}
            </TextField>
            <TextField select label="Subject" required value={form.subjectId} onChange={set('subjectId')}>
              {Array.isArray(subjects) ? subjects.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>) : null}
            </TextField>
            <TextField select label="Teacher" required value={form.teacherId} onChange={set('teacherId')}>
              {Array.isArray(teachers) ? teachers.map(t=><MenuItem key={t.id} value={t.id}>{t.fullName}</MenuItem>) : null}
            </TextField>
            <TextField select label="Day" value={form.day} onChange={set('day')}>
              {DAYS.map(d=><MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={4}><TextField fullWidth select label="Period" value={form.period} onChange={set('period')}>{PERIODS.map(p=><MenuItem key={p} value={p}>{p}</MenuItem>)}</TextField></Grid>
              <Grid item xs={4}><TextField fullWidth label="Start" type="time" InputLabelProps={{ shrink:true }} value={form.startTime} onChange={set('startTime')} /></Grid>
              <Grid item xs={4}><TextField fullWidth label="End" type="time" InputLabelProps={{ shrink:true }} value={form.endTime} onChange={set('endTime')} /></Grid>
            </Grid>
            <TextField label="Academic Year" value={form.academicYear} onChange={set('academicYear')} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : (editId?'Update':'Save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

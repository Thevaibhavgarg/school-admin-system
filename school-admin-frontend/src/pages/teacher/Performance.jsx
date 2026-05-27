import { useEffect, useState } from 'react'
import {
  Box, Typography, Grid, TextField, MenuItem, Button, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, Chip, CircularProgress,
  Tabs, Tab, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { recordPerformance, updatePerformance, getPerformanceByStudentYear, deletePerformance } from '../../api/performanceApi'
import { getStudents, getClasses, getSubjects } from '../../api/studentApi'
import { toast } from 'react-toastify'

const EXAM_TYPES = ['CLASS_TEST', 'UNIT_TEST', 'MIDTERM', 'FINAL', 'ASSIGNMENT']
const TERMS = ['Term 1', 'Term 2', 'Term 3']
const YEARS = ['2024-2025', '2023-2024']

const INIT = { studentId:'', subjectId:'', examType:'CLASS_TEST', marks:'', maxMarks:'100', term:'Term 1', academicYear:'2024-2025', remarks:'' }

function gradeColor(pct) {
  if (pct >= 75) return 'success'
  if (pct >= 50) return 'primary'
  if (pct >= 35) return 'warning'
  return 'error'
}

export default function Performance() {
  const [tab, setTab] = useState(0)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(INIT)
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState({ studentId:'', academicYear:'2024-2025' })

  useEffect(() => {
    Promise.allSettled([getStudents(), getClasses()])
      .then(([s, c]) => { 
        setStudents(s.status === 'fulfilled' ? (s.value?.data || []) : [])
        setClasses(c.status === 'fulfilled' ? (c.value?.data || []) : [])
      })
      .catch(() => {})
  }, [])

  const handleClassChange = async (classId) => {
    if (classId) {
      try {
        const { data } = await getSubjects(classId)
        setSubjects(data)
      } catch (err) {
        toast.error('Failed to load subjects')
        setSubjects([])
      }
    }
  }

  const loadRecords = async () => {
    if (!filter.studentId) return
    setLoading(true)
    try {
      const { data } = await getPerformanceByStudentYear(filter.studentId, filter.academicYear)
      // Map subjects to performance records if not already included
      const enrichedData = await Promise.all(data.map(async (record) => {
        if (!record.subject && record.subjectId) {
          // Find subject name from our subjects list
          const subject = subjects.find(s => s.id === record.subjectId)
          return { ...record, subject: subject || { id: record.subjectId, name: 'Unknown Subject' } }
        }
        return record
      }))
      setRecords(enrichedData)
    } catch { toast.error('Failed to load') }
    setLoading(false)
  }

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, studentId:Number(form.studentId), subjectId:Number(form.subjectId), marks:Number(form.marks), maxMarks:Number(form.maxMarks) }
      editId ? await updatePerformance(editId, payload) : await recordPerformance(payload)
      toast.success(editId ? 'Updated' : 'Recorded successfully')
      setOpen(false); setEditId(null); setForm(INIT); loadRecords()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    try { await deletePerformance(id); toast.success('Deleted'); loadRecords() }
    catch { toast.error('Delete failed') }
  }

  const openEdit = (r) => {
    setEditId(r.id)
    setForm({ studentId:r.student?.id, subjectId:r.subject?.id, examType:r.examType, marks:r.marks, maxMarks:r.maxMarks, term:r.term, academicYear:r.academicYear, remarks:r.remarks||'' })
    setOpen(true)
  }

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>Student Performance</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditId(null); setForm(INIT); setOpen(true) }}>Add Record</Button>
      </Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="View Performance" />
      </Tabs>

      <Card sx={{ borderRadius:3, boxShadow:2, mb:3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={5}>
              <TextField fullWidth select label="Student" value={filter.studentId} onChange={e=>setFilter(f=>({...f,studentId:e.target.value}))}>
                {Array.isArray(students) ? students.filter(s=>s.active).map(s=><MenuItem key={s.id} value={s.id}>{s.name} ({s.admissionNumber})</MenuItem>) : null}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth select label="Academic Year" value={filter.academicYear} onChange={e=>setFilter(f=>({...f,academicYear:e.target.value}))}>
                {YEARS.map(y=><MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" fullWidth onClick={loadRecords} disabled={!filter.studentId}>Load</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display:'flex', justifyContent:'center', py:6 }}><CircularProgress /></Box>
      ) : Array.isArray(records) && records.length > 0 ? (
        <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor:'#f5f6fa' }}>
              <TableRow>
                {['Subject','Exam Type','Marks','Max Marks','%','Term','Remarks','Actions'].map(h=>(
                  <TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map(r => {
                const pct = Math.round(r.marks/r.maxMarks*100)
                return (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.subject?.name}</TableCell>
                    <TableCell><Chip label={r.examType} size="small" /></TableCell>
                    <TableCell>{r.marks}</TableCell>
                    <TableCell>{r.maxMarks}</TableCell>
                    <TableCell><Chip label={`${pct}%`} color={gradeColor(pct)} size="small" /></TableCell>
                    <TableCell>{r.term}</TableCell>
                    <TableCell>{r.remarks}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => openEdit(r)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(r.id)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Box sx={{ textAlign:'center', py:8, color:'text.secondary' }}>
          <Typography variant="body1">Select a student above and click "Load" to view performance records</Typography>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit' : 'Add'} Performance Record</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2 }}>
            <TextField select label="Student" required value={form.studentId} onChange={set('studentId')}>
              {Array.isArray(students) ? students.filter(s=>s.active).map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>) : null}
            </TextField>
            <TextField select label="Class (for subjects)" onChange={e=>handleClassChange(e.target.value)} defaultValue="">
              {Array.isArray(classes) ? classes.map(c=><MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>) : null}
            </TextField>
            <TextField select label="Subject" required value={form.subjectId} onChange={set('subjectId')}>
              {Array.isArray(subjects) ? subjects.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>) : null}
            </TextField>
            <TextField select label="Exam Type" value={form.examType} onChange={set('examType')}>
              {EXAM_TYPES.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label="Marks" type="number" required value={form.marks} onChange={set('marks')} /></Grid>
              <Grid item xs={6}><TextField fullWidth label="Max Marks" type="number" required value={form.maxMarks} onChange={set('maxMarks')} /></Grid>
            </Grid>
            <TextField select label="Term" value={form.term} onChange={set('term')}>
              {TERMS.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField label="Academic Year" value={form.academicYear} onChange={set('academicYear')} />
            <TextField label="Remarks" value={form.remarks} onChange={set('remarks')} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={20} color="inherit" /> : (editId ? 'Update' : 'Save')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

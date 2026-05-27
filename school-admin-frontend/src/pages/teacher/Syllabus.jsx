import { useEffect, useState } from 'react'
import {
  Box, Typography, Grid, TextField, MenuItem, Button, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, Chip, CircularProgress,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { addSyllabus, updateSyllabus, getSyllabusByClassYear, deleteSyllabus } from '../../api/syllabusApi'
import { getClasses, getSubjects } from '../../api/studentApi'
import { toast } from 'react-toastify'

const TERMS = ['Term 1', 'Term 2', 'Term 3']
const YEARS = ['2024-2025', '2023-2024']
const INIT = { classId:'', subjectId:'', term:'Term 1', topic:'', description:'', completedDate:'', completed:false, academicYear:'2024-2025' }

export default function Syllabus() {
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(INIT)
  const [syllabi, setSyllabi] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [filter, setFilter] = useState({ classId:'', academicYear:'2024-2025' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { getClasses().then(r=>setClasses(r.data)).catch(()=>{}) }, [])

  const handleClassChange = async (classId, target) => {
    if (target === 'filter') setFilter(f => ({ ...f, classId }))
    else setForm(f => ({ ...f, classId }))
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

  const loadSyllabi = async () => {
    if (!filter.classId) return
    setLoading(true)
    try {
      const { data } = await getSyllabusByClassYear(filter.classId, filter.academicYear)
      setSyllabi(data)
    } catch { toast.error('Failed to load') }
    setLoading(false)
  }

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, classId:Number(form.classId), subjectId:Number(form.subjectId) }
      editId ? await updateSyllabus(editId, payload) : await addSyllabus(payload)
      toast.success(editId ? 'Updated' : 'Added successfully')
      setOpen(false); setEditId(null); setForm(INIT); loadSyllabi()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    try { await deleteSyllabus(id); toast.success('Deleted'); loadSyllabi() }
    catch { toast.error('Delete failed') }
  }

  const completed = syllabi.filter(s => s.completed).length
  const pct = syllabi.length ? Math.round(completed / syllabi.length * 100) : 0

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5" fontWeight={700}>Syllabus Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditId(null); setForm(INIT); setOpen(true) }}>Add Topic</Button>
      </Box>

      <Card sx={{ borderRadius:3, boxShadow:2, mb:3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select label="Class" value={filter.classId} onChange={e=>handleClassChange(e.target.value,'filter')}>
                {Array.isArray(classes) ? classes.map(c=><MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>) : null}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth select label="Academic Year" value={filter.academicYear} onChange={e=>setFilter(f=>({...f,academicYear:e.target.value}))}>
                {YEARS.map(y=><MenuItem key={y} value={y}>{y}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" fullWidth onClick={loadSyllabi} disabled={!filter.classId}>Load</Button>
            </Grid>
          </Grid>
          {Array.isArray(syllabi) && syllabi.length > 0 && (
            <Box sx={{ mt:2 }}>
              <Typography variant="body2" mb={0.5}>Completion: {completed}/{syllabi.length} topics ({pct}%)</Typography>
              <LinearProgress variant="determinate" value={pct} color={pct>=75?'success':pct>=50?'primary':'warning'} sx={{ borderRadius:2, height:8 }} />
            </Box>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display:'flex', justifyContent:'center', py:6 }}><CircularProgress /></Box>
      ) : Array.isArray(syllabi) && syllabi.length > 0 ? (
        <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor:'#f5f6fa' }}>
              <TableRow>
                {['Subject','Term','Topic','Description','Status','Completed On','Actions'].map(h=>(
                  <TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {syllabi.map(s => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.subject?.name}</TableCell>
                  <TableCell>{s.term}</TableCell>
                  <TableCell>{s.topic}</TableCell>
                  <TableCell sx={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.description}</TableCell>
                  <TableCell>
                    <Chip icon={s.completed ? <CheckCircleIcon /> : undefined} label={s.completed?'Completed':'Pending'} color={s.completed?'success':'warning'} size="small" />
                  </TableCell>
                  <TableCell>{s.completedDate || '—'}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => { setEditId(s.id); setForm({classId:s.schoolClass?.id,subjectId:s.subject?.id,term:s.term,topic:s.topic,description:s.description||'',completedDate:s.completedDate||'',completed:s.completed,academicYear:s.academicYear}); setOpen(true) }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(s.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Box sx={{ textAlign:'center', py:8, color:'text.secondary' }}>
          <Typography variant="body1">Select a class above and click "Load" to view syllabus topics</Typography>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit' : 'Add'} Syllabus Topic</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2 }}>
            <TextField select label="Class" required value={form.classId} onChange={e=>handleClassChange(e.target.value,'form')}>
              {Array.isArray(classes) ? classes.map(c=><MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>) : null}
            </TextField>
            <TextField select label="Subject" required value={form.subjectId} onChange={set('subjectId')}>
              {Array.isArray(subjects) ? subjects.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>) : null}
            </TextField>
            <TextField select label="Term" value={form.term} onChange={set('term')}>
              {TERMS.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
            <TextField label="Topic" required value={form.topic} onChange={set('topic')} />
            <TextField label="Description" multiline rows={3} value={form.description} onChange={set('description')} />
            <TextField label="Academic Year" value={form.academicYear} onChange={set('academicYear')} />
            <TextField select label="Status" value={form.completed} onChange={e=>setForm(f=>({...f,completed:e.target.value==='true'}))}>
              <MenuItem value="false">Pending</MenuItem>
              <MenuItem value="true">Completed</MenuItem>
            </TextField>
            {form.completed && <TextField label="Completed Date" type="date" InputLabelProps={{ shrink:true }} value={form.completedDate} onChange={set('completedDate')} />}
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

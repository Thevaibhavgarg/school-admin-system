import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Stepper, Step, StepLabel, TextField, MenuItem,
  Grid, Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Chip, Tabs, Tab, IconButton
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { admitStudent, getStudents, getClasses, getSections, updateStudent, deactivateStudent } from '../../api/studentApi'
import { toast } from 'react-toastify'
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'

const STEPS = ['Personal Details', 'Parent & Address', 'Academic Info', 'Review & Submit']
const GENDERS = ['Male', 'Female', 'Other']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const INIT = {
  name:'', dateOfBirth:'', gender:'', bloodGroup:'', address:'', city:'', state:'', pincode:'',
  fatherName:'', motherName:'', parentContact:'', parentEmail:'', parentOccupation:'',
  classId:'', sectionId:'', previousClass:'', previousPercentage:'', previousGrade:'',
  previousSchool:'', admissionDate: new Date().toISOString().split('T')[0]
}

export default function Admission() {
  const [tab, setTab] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState(INIT)
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [editDialog, setEditDialog] = useState(false)

  const load = async () => {
    setListLoading(true)
    try {
      const [s, c] = await Promise.allSettled([getStudents(), getClasses()])
      console.log('Students result:', s)
      console.log('Classes result:', c)
      const studentData = s.status === 'fulfilled' ? (s.value?.data || []) : []
      const classData = c.status === 'fulfilled' ? (c.value?.data || []) : []
      console.log('Setting students:', studentData)
      console.log('Setting classes:', classData)
      setStudents(studentData)
      setClasses(classData)
    } catch (err) { 
      console.error('Load error:', err)
      toast.error('Failed to load data')
    }
    setListLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleClassChange = async (classId) => {
    setForm(f => ({ ...f, classId, sectionId: '' }))
    if (classId) {
      try {
        const { data } = await getSections(classId)
        setSections(data)
      } catch (err) {
        console.error('Failed to load sections:', err)
        toast.error('Failed to load sections')
        setSections([])
      }
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deactivateStudent(studentId)
        toast.success('Student deleted successfully!')
        load()
      } catch (err) {
        console.error('Delete error:', err)
        toast.error(err.response?.data?.message || 'Failed to delete student')
      }
    }
  }

  const handleEdit = (student) => {
    setEditId(student.id)
    setForm({
      name: student.name,
      dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || '',
      bloodGroup: student.bloodGroup || '',
      address: student.address || '',
      city: student.city || '',
      state: student.state || '',
      pincode: student.pincode || '',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      parentContact: student.parentContact || '',
      parentEmail: student.parentEmail || '',
      parentOccupation: student.parentOccupation || '',
      classId: student.schoolClass?.id || '',
      sectionId: student.section?.id || '',
      previousClass: student.previousClass || '',
      previousPercentage: student.previousPercentage || '',
      previousGrade: student.previousGrade || '',
      previousSchool: student.previousSchool || '',
      admissionDate: student.admissionDate || ''
    })
    setSections([])
    setEditDialog(true)
  }

  const handleEditSubmit = async () => {
    setLoading(true)
    try {
      await updateStudent(editId, {
        ...form,
        classId: Number(form.classId),
        sectionId: Number(form.sectionId),
        previousPercentage: Number(form.previousPercentage) || null
      })
      toast.success('Student updated successfully!')
      setEditDialog(false)
      setEditId(null)
      setForm(INIT)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update student')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await admitStudent({ ...form, classId: Number(form.classId), sectionId: Number(form.sectionId), previousPercentage: Number(form.previousPercentage) || null })
      toast.success('Student admitted successfully!')
      setForm(INIT)
      setActiveStep(0)
      setTab(1)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Admission failed') }
    setLoading(false)
  }

  const stepContent = [
    // Step 0: Personal
    <Grid container spacing={2} key="personal">
      <Grid item xs={12} sm={6}><TextField fullWidth required label="Full Name" value={form.name} onChange={set('name')} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} value={form.dateOfBirth} onChange={set('dateOfBirth')} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth select label="Gender" value={form.gender} onChange={set('gender')}>{GENDERS.map(g=><MenuItem key={g} value={g}>{g}</MenuItem>)}</TextField></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth select label="Blood Group" value={form.bloodGroup} onChange={set('bloodGroup')}>{BLOOD_GROUPS.map(g=><MenuItem key={g} value={g}>{g}</MenuItem>)}</TextField></Grid>
    </Grid>,
    // Step 1: Parent & Address
    <Grid container spacing={2} key="parent">
      <Grid item xs={12} sm={6}><TextField fullWidth label="Father's Name" value={form.fatherName} onChange={set('fatherName')} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Mother's Name" value={form.motherName} onChange={set('motherName')} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Parent Contact" value={form.parentContact} onChange={set('parentContact')} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Parent Email" type="email" value={form.parentEmail} onChange={set('parentEmail')} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Occupation" value={form.parentOccupation} onChange={set('parentOccupation')} /></Grid>
      <Grid item xs={12}><TextField fullWidth label="Address" value={form.address} onChange={set('address')} /></Grid>
      <Grid item xs={12} sm={4}><TextField fullWidth label="City" value={form.city} onChange={set('city')} /></Grid>
      <Grid item xs={12} sm={4}><TextField fullWidth label="State" value={form.state} onChange={set('state')} /></Grid>
      <Grid item xs={12} sm={4}><TextField fullWidth label="Pincode" value={form.pincode} onChange={set('pincode')} /></Grid>
    </Grid>,
    // Step 2: Academic
    <Grid container spacing={2} key="academic">
      <Grid item xs={12} sm={6}>
        <TextField fullWidth select label="Class" value={form.classId} onChange={e=>handleClassChange(e.target.value)}>
          {Array.isArray(classes) ? classes.map(c=><MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>) : null}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth select label="Section" value={form.sectionId} onChange={set('sectionId')} disabled={!form.classId}>
          {Array.isArray(sections) ? sections.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>) : null}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Previous Class" value={form.previousClass} onChange={set('previousClass')} /></Grid>
      <Grid item xs={12} sm={6}><TextField fullWidth label="Previous School" value={form.previousSchool} onChange={set('previousSchool')} /></Grid>
      <Grid item xs={12} sm={4}><TextField fullWidth label="Previous %" type="number" value={form.previousPercentage} onChange={set('previousPercentage')} /></Grid>
      <Grid item xs={12} sm={4}><TextField fullWidth label="Previous Grade" value={form.previousGrade} onChange={set('previousGrade')} /></Grid>
      <Grid item xs={12} sm={4}><TextField fullWidth label="Admission Date" type="date" InputLabelProps={{ shrink: true }} value={form.admissionDate} onChange={set('admissionDate')} /></Grid>
    </Grid>,
    // Step 3: Review
    <Box key="review">
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Review Student Details</Typography>
      <Grid container spacing={1}>
        {Object.entries({ Name:form.name, DOB:form.dateOfBirth, Gender:form.gender, Father:form.fatherName, Mother:form.motherName, Contact:form.parentContact, Address:`${form.address}, ${form.city}`, 'Prev Class':form.previousClass, 'Prev %':form.previousPercentage }).map(([k,v])=>(
          <Grid item xs={6} key={k}><Typography variant="body2"><strong>{k}:</strong> {v || '—'}</Typography></Grid>
        ))}
      </Grid>
    </Box>
  ]

  if (listLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    )
  }

  const dialogContent = (
    <Dialog open={editDialog} onClose={() => { setEditDialog(false); setEditId(null); }} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Student Details</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <TextField fullWidth label="Full Name" value={form.name} onChange={set('name')} />
        <TextField fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} value={form.dateOfBirth} onChange={set('dateOfBirth')} />
        <TextField fullWidth select label="Gender" value={form.gender} onChange={set('gender')}>
          {GENDERS.map(g=><MenuItem key={g} value={g}>{g}</MenuItem>)}
        </TextField>
        <TextField fullWidth select label="Class" value={form.classId} onChange={e=>handleClassChange(e.target.value)}>
          {Array.isArray(classes) ? classes.map(c=><MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>) : null}
        </TextField>
        <TextField fullWidth select label="Section" value={form.sectionId} onChange={set('sectionId')} disabled={!form.classId}>
          {Array.isArray(sections) ? sections.map(s=><MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>) : null}
        </TextField>
        <TextField fullWidth label="Address" value={form.address} onChange={set('address')} />
        <TextField fullWidth label="City" value={form.city} onChange={set('city')} />
        <TextField fullWidth label="Father's Name" value={form.fatherName} onChange={set('fatherName')} />
        <TextField fullWidth label="Parent Contact" value={form.parentContact} onChange={set('parentContact')} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setEditDialog(false); setEditId(null); }}>Cancel</Button>
        <Button variant="contained" onClick={handleEditSubmit} disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Admission Module</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="New Admission" />
        <Tab label="Student List" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {STEPS.map(l => <Step key={l}><StepLabel>{l}</StepLabel></Step>)}
            </Stepper>
            {stepContent[activeStep]}
            <Box sx={{ display:'flex', justifyContent:'flex-end', gap:2, mt:3 }}>
              {activeStep > 0 && <Button onClick={() => setActiveStep(s=>s-1)}>Back</Button>}
              {activeStep < STEPS.length - 1 && (
                <Button variant="contained" onClick={() => setActiveStep(s=>s+1)} disabled={activeStep===0 && !form.name}>Next</Button>
              )}
              {activeStep === STEPS.length - 1 && (
                <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Admission'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {dialogContent}

      {tab === 1 && (
        <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
          {listLoading ? <Box p={4}><CircularProgress /></Box> : Array.isArray(students) && students.length > 0 ? (
            <Table>
              <TableHead sx={{ bgcolor:'#f5f6fa' }}>
                <TableRow>
                  {['Adm No','Name','Class','Section','Father','Contact','Date','Status','Actions'].map(h=>(
                    <TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map(s => (
                  <TableRow key={s.id} hover>
                    <TableCell>{s.admissionNumber}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.schoolClass?.className}</TableCell>
                    <TableCell>{s.section?.name}</TableCell>
                    <TableCell>{s.fatherName}</TableCell>
                    <TableCell>{s.parentContact}</TableCell>
                    <TableCell>{s.admissionDate}</TableCell>
                    <TableCell><Chip label={s.active?'Active':'Inactive'} color={s.active?'success':'default'} size="small" /></TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary" onClick={() => handleEdit(s)} title="Edit student">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(s.id)} title="Delete student">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Box p={4} sx={{ textAlign:'center', color:'text.secondary' }}>
              <Typography variant="body1">No students admitted yet</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

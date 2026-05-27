import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Table, TableHead, TableRow,
  TableCell, TableBody, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, CircularProgress, MenuItem, Grid, Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import { getClasses } from '../../api/classApi'
import { getSubjectsByClass, addSubject, updateSubject, deleteSubject } from '../../api/subjectApi'
import { toast } from 'react-toastify'

export default function SubjectManagement() {
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', classId: '' })
  const [error, setError] = useState(null)

  const loadClasses = async () => {
    try {
      const { data } = await getClasses()
      setClasses(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Load error:', err)
      setError('Failed to load classes')
    }
  }

  const loadSubjects = async (classId) => {
    if (!classId) {
      setSubjects([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data } = await getSubjectsByClass(classId)
      setSubjects(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Load error:', err)
      setError('Failed to load subjects for this class')
      toast.error('Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadClasses() }, [])

  const handleClassChange = (classId) => {
    setSelectedClass(classId)
    loadSubjects(classId)
  }

      const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (!form.name.trim()) {
        toast.error('Subject name is required')
        setSubmitting(false)
        return
      }
      if (!form.code.trim()) {
        toast.error('Subject code is required')
        setSubmitting(false)
        return
      }
      if (!selectedClass) {
        toast.error('Please select a class first')
        setSubmitting(false)
        return
      }
      
      const payload = {
        name: form.name,
        code: form.code,
        classId: Number(selectedClass)
      }
      editId 
        ? await updateSubject(editId, payload)
        : await addSubject(payload)
      
      toast.success(editId ? 'Subject updated successfully!' : 'Subject added successfully!')
      setForm({ name: '', code: '', classId: '' })
      setOpen(false)
      setEditId(null)
      if (selectedClass) loadSubjects(selectedClass)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save subject')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await deleteSubject(id)
        toast.success('Subject deleted successfully!')
        if (selectedClass) loadSubjects(selectedClass)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete subject')
      }
    }
  }

  const openDialog = (subjectData) => {
    if (subjectData) {
      setEditId(subjectData.id)
      setForm({ name: subjectData.name, code: subjectData.code, classId: selectedClass })
    } else {
      setEditId(null)
      setForm({ name: '', code: '', classId: selectedClass })
    }
    setOpen(true)
  }

  const selectedClassName = classes.find(c => c.id === Number(selectedClass))?.className || ''

  return (
    <Box sx={{ p: 0 }}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Subject Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create and manage subjects for classes
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Select Class (Optional)"
                value={selectedClass}
                onChange={e => handleClassChange(e.target.value)}
              >
                <MenuItem value="">All Classes</MenuItem>
                {Array.isArray(classes) && classes.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>
                ))}
              </TextField>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Filter subjects by class or view all
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => openDialog(null)}
                disabled={!selectedClass}
              >
                Add Subject
              </Button>
              {!selectedClass && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                  Select a class first
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {selectedClass || true ? (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : Array.isArray(subjects) && subjects.length > 0 ? (
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {selectedClass ? `Subjects for ${selectedClassName}` : 'All Subjects'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total subjects: {subjects.length}
                  </Typography>
                </Box>
              </Box>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f6fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Subject Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Class</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subjects.map(s => (
                    <TableRow key={s.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {s.name}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ bgcolor: '#e8f5e9', p: '4px 8px', borderRadius: 1, display: 'inline-block', fontFamily: 'monospace', fontWeight: 600, fontSize: '0.85rem' }}>
                          {s.code}
                        </Box>
                      </TableCell>
                      <TableCell>{selectedClassName || '—'}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => openDialog(s)}
                          color="primary"
                          title="Edit subject"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(s.id)}
                          title="Delete subject"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" gutterBottom>
                📭 No Subjects Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedClass ? `Add subjects for ${selectedClassName}` : 'Add your first subject'}
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => openDialog(null)}
              >
                Create First Subject
              </Button>
            </CardContent>
          </Card>
        )
      ) : null}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '18px' }}>
          {editId ? '✏️ Edit Subject' : '➕ Add New Subject'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Subject Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., English, Mathematics"
              autoFocus
            />
            <TextField
              fullWidth
              label="Subject Code"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="e.g., ENG, MATH"
              helperText="Unique identifier for the subject (auto-uppercase)"
            />
            {selectedClass && (
              <Typography variant="caption" color="text.secondary">
                Assigning to: <strong>{selectedClassName}</strong>
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting || !form.name.trim() || !form.code.trim()}>
              {submitting ? <CircularProgress size={20} color="inherit" /> : (editId ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

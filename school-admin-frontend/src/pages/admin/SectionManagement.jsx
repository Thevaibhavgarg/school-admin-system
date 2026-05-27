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
import { getSectionsByClass, addSection, updateSection, deleteSection } from '../../api/sectionApi'
import { toast } from 'react-toastify'

export default function SectionManagement() {
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', classId: '' })
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

  const loadSections = async (classId) => {
    if (!classId) {
      setSections([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data } = await getSectionsByClass(classId)
      setSections(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Load error:', err)
      setError('Failed to load sections for this class')
      toast.error('Failed to load sections')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadClasses() }, [])

  const handleClassChange = (classId) => {
    setSelectedClass(classId)
    loadSections(classId)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (!form.name.trim()) {
        toast.error('Section name is required')
        setSubmitting(false)
        return
      }
      
      const payload = { name: form.name, classId: Number(selectedClass) }
      editId 
        ? await updateSection(editId, payload)
        : await addSection(payload)
      
      toast.success(editId ? 'Section updated successfully!' : 'Section added successfully!')
      setForm({ name: '', classId: '' })
      setOpen(false)
      setEditId(null)
      loadSections(selectedClass)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save section')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteSection(id)
        toast.success('Section deleted successfully!')
        loadSections(selectedClass)
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete section')
      }
    }
  }

  const openDialog = (sectionData) => {
    if (sectionData) {
      setEditId(sectionData.id)
      setForm({ name: sectionData.name, classId: selectedClass })
    } else {
      setEditId(null)
      setForm({ name: '', classId: selectedClass })
    }
    setOpen(true)
  }

  const selectedClassName = classes.find(c => c.id === Number(selectedClass))?.className || ''

  return (
    <Box sx={{ p: 0 }}>
      <Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          🏛️ Section Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create and manage sections within each class
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Select Class"
                value={selectedClass}
                onChange={e => handleClassChange(e.target.value)}
              >
                <MenuItem value="">-- Select a class --</MenuItem>
                {Array.isArray(classes) && classes.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.className}</MenuItem>
                ))}
              </TextField>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                Select a class to view and manage its sections
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
                Add Section
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && selectedClass && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {selectedClass ? (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : Array.isArray(sections) && sections.length > 0 ? (
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Sections for {selectedClassName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total sections: {sections.length}
                  </Typography>
                </Box>
              </Box>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f6fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Section Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Class</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sections.map(s => (
                    <TableRow key={s.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ fontSize: '18px' }}>📝</span>
                          {s.name}
                        </Box>
                      </TableCell>
                      <TableCell>{s.schoolClass?.className}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => openDialog(s)}
                          color="primary"
                          title="Edit section"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDelete(s.id)}
                          title="Delete section"
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
                📭 No Sections Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add sections for {selectedClassName}
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => openDialog(null)}
              >
                Create First Section
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom>
              👆 Select a Class
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a class from the dropdown above to manage its sections
            </Typography>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '18px' }}>
          {editId ? '✏️ Edit Section' : '➕ Add New Section'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Section Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Section A, Section B"
              helperText={`Creating section for ${selectedClassName}`}
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting || !form.name.trim()}>
              {submitting ? <CircularProgress size={20} color="inherit" /> : (editId ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

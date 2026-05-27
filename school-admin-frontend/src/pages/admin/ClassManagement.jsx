import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Card, CardContent, Table, TableHead, TableRow,
  TableCell, TableBody, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, CircularProgress, Chip, Grid, Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'
import { getClasses, addClass, updateClass, deleteClass } from '../../api/classApi'
import { getSections } from '../../api/studentApi'
import { toast } from 'react-toastify'

export default function ClassManagement() {
  const [classes, setClasses] = useState([])
  const [sectionCounts, setSectionCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ className: '' })
  const [error, setError] = useState(null)

  const loadClasses = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getClasses()
      const classesArray = Array.isArray(data) ? data : []
      setClasses(classesArray)
      
      // Load section counts for each class
      const counts = {}
      for (const c of classesArray) {
        try {
          const { data: sections } = await getSections(c.id)
          counts[c.id] = Array.isArray(sections) ? sections.length : 0
        } catch {
          counts[c.id] = 0
        }
      }
      setSectionCounts(counts)
    } catch (err) {
      console.error('Load error:', err)
      setError('Failed to load classes. Please try again.')
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadClasses() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (!form.className.trim()) {
        toast.error('Class name is required')
        setSubmitting(false)
        return
      }
      
      editId 
        ? await updateClass(editId, { className: form.className })
        : await addClass({ className: form.className })
      
      toast.success(editId ? 'Class updated successfully!' : 'Class added successfully!')
      setForm({ className: '' })
      setOpen(false)
      setEditId(null)
      loadClasses()
    } catch (err) {
      console.error('Submit error:', err)
      toast.error(err.response?.data?.message || 'Failed to save class')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteClass(id)
        toast.success('Class deleted successfully!')
        loadClasses()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete class')
      }
    }
  }

  const openDialog = (classData) => {
    if (classData) {
      setEditId(classData.id)
      setForm({ className: classData.className })
    } else {
      setEditId(null)
      setForm({ className: '' })
    }
    setOpen(true)
  }

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Class Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage school classes and their details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<RefreshIcon />} 
            onClick={loadClasses}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => openDialog(null)}
          >
            Add New Class
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : Array.isArray(classes) && classes.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Total Classes: <Chip label={classes.length} color="primary" size="small" />
                  </Typography>
                </Box>
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f6fa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, width: '50%' }}>Class Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: '25%' }}>Sections</TableCell>
                      <TableCell sx={{ fontWeight: 700, width: '25%' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classes.map((c, idx) => (
                      <TableRow key={c.id} hover sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {c.className}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={`${sectionCounts[c.id] || 0} section${(sectionCounts[c.id] || 0) !== 1 ? 's' : ''}`}
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            onClick={() => openDialog(c)}
                            color="primary"
                            title="Edit class"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDelete(c.id)}
                            title="Delete class"
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
          </Grid>
        </Grid>
      ) : (
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom>
              📖 No Classes Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get started by creating your first class
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => openDialog(null)}
            >
              Create First Class
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '18px' }}>
          {editId ? '✏️ Edit Class' : '➕ Add New Class'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Class Name"
              value={form.className}
              onChange={e => setForm({ className: e.target.value })}
              placeholder="e.g., Class 1, Class 5, Class 10"
              helperText="Enter the class name (e.g., Class 1, Class 5)"
              autoFocus
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting || !form.className.trim()}>
              {submitting ? <CircularProgress size={20} color="inherit" /> : (editId ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

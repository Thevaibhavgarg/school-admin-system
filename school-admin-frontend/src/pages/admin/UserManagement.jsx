import { useEffect, useState } from 'react'
import {
  Box, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Chip, IconButton, CircularProgress
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import api from '../../api/axios'
import { toast } from 'react-toastify'

const ROLES = ['ADMIN', 'PRINCIPAL', 'TEACHER', 'CLERK', 'STUDENT']
const ROLE_COLOR = { ADMIN:'error', PRINCIPAL:'primary', TEACHER:'success', CLERK:'warning', STUDENT:'info' }

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ username:'', password:'', fullName:'', email:'', role:'TEACHER', studentId:'' })

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/auth/users')
      setUsers(data)
    } catch { toast.error('Failed to load users') }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      if (payload.role !== 'STUDENT') {
        delete payload.studentId
      } else if (!payload.studentId) {
        toast.error('Student ID is required for student role')
        return
      }
      await api.post('/auth/register', payload)
      toast.success('User created successfully')
      setOpen(false)
      setForm({ username:'', password:'', fullName:'', email:'', role:'TEACHER', studentId:'' })
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Error creating user') }
  }

  const toggleStatus = async (id) => {
    try {
      await api.put(`/auth/users/${id}/toggle`)
      toast.success('Status updated')
      load()
    } catch { toast.error('Error updating status') }
  }

  return (
    <Box>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h5" fontWeight={700}>User Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add User</Button>
      </Box>

      {loading ? <CircularProgress /> : (
        <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor:'#f5f6fa' }}>
              <TableRow>
                {['#','Username','Full Name','Email','Role','Status','Action'].map(h => (
                  <TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u, i) => (
                <TableRow key={u.id} hover>
                  <TableCell>{i+1}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.fullName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Chip label={u.role} color={ROLE_COLOR[u.role] || 'default'} size="small" /></TableCell>
                  <TableCell><Chip label={u.active ? 'Active':'Inactive'} color={u.active ? 'success':'default'} size="small" /></TableCell>
                  <TableCell>
                    <IconButton size="small" color={u.active ? 'error':'success'} onClick={() => toggleStatus(u.id)}>
                      <ToggleOnIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>➕ Add New User</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display:'flex', flexDirection:'column', gap:2 }}>
            <TextField label="Full Name" required value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} />
            <TextField label="Username" required value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
            <TextField label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
            <TextField label="Password" type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
            <TextField select label="Role" required value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
            </TextField>
            {form.role === 'STUDENT' && (
              <TextField label="Student ID" value={form.studentId} onChange={e=>setForm({...form,studentId:e.target.value})} helperText="Link this account to a student record" />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

import { useEffect, useState } from 'react'
import {
  Box, Typography, Grid, TextField, MenuItem, Button, Card, CardContent,
  Table, TableHead, TableRow, TableCell, TableBody, Chip, CircularProgress,
  Tabs, Tab, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import { processFee, getAllFees, getPendingFees, approveFee } from '../../api/feeApi'
import { getStudents } from '../../api/studentApi'
import { toast } from 'react-toastify'

const FEE_TYPES = ['Tuition Fee', 'Exam Fee', 'Library Fee', 'Sports Fee', 'Transport Fee', 'Miscellaneous']
const PAYMENT_MODES = ['Cash', 'Cheque', 'Online Transfer', 'UPI', 'DD']
const STATUS_OPTS = ['PAID', 'PENDING', 'PARTIAL']
const STATUS_COLOR = { PAID:'success', PENDING:'warning', PARTIAL:'info', WAIVED:'default' }

const INIT = { studentId:'', amount:'', feeType:'Tuition Fee', paymentDate: new Date().toISOString().split('T')[0], paymentMode:'Cash', status:'PAID', remarks:'', academicYear:'2024-2025' }

export default function FeePayment() {
  const [tab, setTab] = useState(0)
  const [form, setForm] = useState(INIT)
  const [students, setStudents] = useState([])
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  const [approveDialog, setApproveDialog] = useState({ open: false, feeId: null, studentName: '' })
  const [approving, setApproving] = useState(false)

  const loadFees = async () => {
    setListLoading(true)
    try {
      const [f, s] = await Promise.allSettled([getAllFees(), getStudents()])
      setFees(f.status === 'fulfilled' ? (f.value?.data || []) : [])
      setStudents(s.status === 'fulfilled' ? (s.value?.data || []) : [])
    } catch (err) { 
      console.error('Load error:', err)
      toast.error('Failed to load data')
    }
    setListLoading(false)
  }

  useEffect(() => { loadFees() }, [])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await processFee({ ...form, studentId: Number(form.studentId), amount: Number(form.amount) })
      toast.success(`Fee processed! Receipt: ${data.receiptNumber}`)
      setForm(INIT)
      loadFees()
    } catch (err) { toast.error(err.response?.data?.message || 'Payment failed') }
    setLoading(false)
  }

  const handleApproveClick = (fee) => {
    setApproveDialog({ open: true, feeId: fee.id, studentName: fee.student?.name })
  }

  const handleApproveConfirm = async () => {
    setApproving(true)
    try {
      await approveFee(approveDialog.feeId)
      toast.success(`Payment approved for ${approveDialog.studentName}`)
      setApproveDialog({ open: false, feeId: null, studentName: '' })
      loadFees()
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to approve payment') 
    }
    setApproving(false)
  }

  const handleApproveCancel = () => {
    setApproveDialog({ open: false, feeId: null, studentName: '' })
  }

  const totalCollected = fees.filter(f => f.status === 'PAID').reduce((s, f) => s + f.amount, 0)
  const totalPending = fees.filter(f => f.status === 'PENDING').reduce((s, f) => s + f.amount, 0)

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>Fee Payment</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[['Total Collected', `₹${totalCollected.toLocaleString()}`, 'success'],
          ['Total Pending', `₹${totalPending.toLocaleString()}`, 'warning'],
          ['Total Records', fees.length, 'primary']].map(([label, val, color]) => (
          <Grid item xs={12} sm={4} key={label}>
            <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="h5" fontWeight={700} color={`${color}.main`}>{val}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Process Payment" />
        <Tab label="Payment History" />
        <Tab label="Pending Payments" />
      </Tabs>

      {tab === 0 && (
        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>New Fee Payment</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth select required label="Student" value={form.studentId} onChange={set('studentId')}>
                    {Array.isArray(students) ? students.filter(s=>s.active).map(s=>(
                      <MenuItem key={s.id} value={s.id}>{s.name} ({s.admissionNumber})</MenuItem>
                    )) : null}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth select label="Fee Type" value={form.feeType} onChange={set('feeType')}>
                    {FEE_TYPES.map(t=><MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth required label="Amount (₹)" type="number" value={form.amount} onChange={set('amount')} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth select label="Payment Mode" value={form.paymentMode} onChange={set('paymentMode')}>
                    {PAYMENT_MODES.map(m=><MenuItem key={m} value={m}>{m}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth select label="Status" value={form.status} onChange={set('status')}>
                    {STATUS_OPTS.map(s=><MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Payment Date" type="date" InputLabelProps={{ shrink: true }} value={form.paymentDate} onChange={set('paymentDate')} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Academic Year" value={form.academicYear} onChange={set('academicYear')} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Remarks" value={form.remarks} onChange={set('remarks')} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" type="submit" startIcon={<ReceiptIcon />} disabled={loading} size="large">
                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Process Payment & Generate Receipt'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      {tab !== 0 && (
        <Box sx={{ bgcolor:'#fff', borderRadius:3, boxShadow:1, overflow:'auto' }}>
          {listLoading ? <Box p={4}><CircularProgress /></Box> : (
            <Table>
              <TableHead sx={{ bgcolor:'#f5f6fa' }}>
                <TableRow>
                  {['Receipt No','Student','Fee Type','Amount','Mode','Date','Status','Actions'].map(h=>(
                    <TableCell key={h} sx={{ fontWeight:700 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(Array.isArray(fees) ? (tab === 1 ? fees : fees.filter(f=>f.status==='PENDING')) : []).map(f => (
                  <TableRow key={f.id} hover>
                    <TableCell>{f.receiptNumber}</TableCell>
                    <TableCell>{f.student?.name}</TableCell>
                    <TableCell>{f.feeType}</TableCell>
                    <TableCell>₹{f.amount?.toLocaleString()}</TableCell>
                    <TableCell>{f.paymentMode}</TableCell>
                    <TableCell>{f.paymentDate}</TableCell>
                    <TableCell><Chip label={f.status} color={STATUS_COLOR[f.status]} size="small" /></TableCell>
                    <TableCell>
                      {f.status === 'PENDING' && (
                        <IconButton size="small" color="success" onClick={() => handleApproveClick(f)} title="Approve Payment">
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      )}

      <Dialog open={approveDialog.open} onClose={handleApproveCancel}>
        <DialogTitle>Approve Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography>Are you sure you want to approve the payment for <strong>{approveDialog.studentName}</strong>?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This will change the status from PENDING to PAID.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApproveCancel} disabled={approving}>Cancel</Button>
          <Button onClick={handleApproveConfirm} variant="contained" color="success" disabled={approving}>
            {approving ? <CircularProgress size={22} color="inherit" /> : 'Approve'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

import api from './axios'

export const processFee = (data) => api.post('/fees', data)
export const getAllFees = () => api.get('/fees')
export const getFeesByStudent = (studentId) => api.get(`/fees/student/${studentId}`)
export const getPendingFees = () => api.get('/fees/pending')
export const getFeeSummary = (academicYear) => api.get(`/fees/summary?academicYear=${academicYear}`)
export const approveFee = (feeId) => api.put(`/fees/${feeId}/approve`)

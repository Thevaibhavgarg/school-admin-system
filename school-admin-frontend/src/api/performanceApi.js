import api from './axios'

export const recordPerformance = (data) => api.post('/performance', data)
export const updatePerformance = (id, data) => api.put(`/performance/${id}`, data)
export const getPerformanceByStudent = (studentId) => api.get(`/performance/student/${studentId}`)
export const getPerformanceByStudentYear = (studentId, year) =>
  api.get(`/performance/student/${studentId}/year/${year}`)
export const getPerformanceByClass = (classId, year) =>
  api.get(`/performance/class/${classId}/year/${year}`)
export const deletePerformance = (id) => api.delete(`/performance/${id}`)
export const getMyPerformance = (year) => api.get(`/performance/student/me/year/${year}`)

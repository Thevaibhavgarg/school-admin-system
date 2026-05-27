import api from './axios'

export const markAttendance = (data) => api.post('/attendance', data)
export const getAttendanceByClassSectionDate = (classId, sectionId, date) =>
  api.get(`/attendance/class/${classId}/section/${sectionId}/date/${date}`)
export const getAttendanceByStudent = (studentId) => api.get(`/attendance/student/${studentId}`)
export const getAttendanceSummary = (studentId) => api.get(`/attendance/student/${studentId}/summary`)
export const getMyAttendance = () => api.get('/attendance/student/me')
export const getMyAttendanceSummary = () => api.get('/attendance/student/me/summary')
export const deleteAttendance = (id) => api.delete(`/attendance/${id}`)

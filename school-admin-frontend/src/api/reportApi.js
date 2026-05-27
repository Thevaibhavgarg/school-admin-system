import api from './axios'

export const getAdmissionReport = () => api.get('/reports/admissions')
export const getSyllabusReport = (classId, year) =>
  api.get(`/reports/syllabus/class/${classId}?academicYear=${year}`)
export const getClassStudentReport = () => api.get('/reports/classes')
export const getAttendanceReport = (classId) => api.get(`/reports/attendance/class/${classId}`)
export const getPerformanceReport = (classId, year) =>
  api.get(`/reports/performance/class/${classId}?academicYear=${year}`)

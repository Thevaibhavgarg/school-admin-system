import api from './axios'

export const getStudents = () => api.get('/students')
export const getStudentById = (id) => api.get(`/students/${id}`)
export const getMyProfile = () => api.get('/students/me')
export const admitStudent = (data) => api.post('/students', data)
export const updateStudent = (id, data) => api.put(`/students/${id}`, data)
export const deactivateStudent = (id) => api.delete(`/students/${id}`)
export const searchStudents = (query) => api.get(`/students/search?query=${query}`)
export const getStudentsByClass = (classId) => api.get(`/students/class/${classId}`)
export const getStudentsByClassSection = (classId, sectionId) =>
  api.get(`/students/class/${classId}/section/${sectionId}`)

export const getClasses = () => api.get('/students/classes')
export const getSections = (classId) => api.get(`/students/sections/class/${classId}`)
export const getSubjects = (classId) => api.get(`/students/subjects/class/${classId}`)

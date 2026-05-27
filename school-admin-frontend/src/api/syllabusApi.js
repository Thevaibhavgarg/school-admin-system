import api from './axios'

export const addSyllabus = (data) => api.post('/syllabus', data)
export const updateSyllabus = (id, data) => api.put(`/syllabus/${id}`, data)
export const getAllSyllabus = () => api.get('/syllabus')
export const getSyllabusByClassYear = (classId, year) =>
  api.get(`/syllabus/class/${classId}/year/${year}`)
export const deleteSyllabus = (id) => api.delete(`/syllabus/${id}`)

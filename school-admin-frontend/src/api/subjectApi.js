import api from './axios'

export const getSubjectsByClass = (classId) => api.get(`/students/subjects/class/${classId}`)
export const addSubject = (data) => api.post('/students/subjects', data)
export const updateSubject = (id, data) => api.put(`/students/subjects/${id}`, data)
export const deleteSubject = (id) => api.delete(`/students/subjects/${id}`)

import api from './axios'

export const getSectionsByClass = (classId) => api.get(`/students/sections/class/${classId}`)
export const addSection = (data) => api.post('/students/sections', data)
export const updateSection = (id, data) => api.put(`/students/sections/${id}`, data)
export const deleteSection = (id) => api.delete(`/students/sections/${id}`)

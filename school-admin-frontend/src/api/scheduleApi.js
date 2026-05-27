import api from './axios'

export const createSchedule = (data) => api.post('/schedules', data)
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data)
export const getAllSchedules = () => api.get('/schedules')
export const getScheduleByClassSection = (classId, sectionId) =>
  api.get(`/schedules/class/${classId}/section/${sectionId}`)
export const getScheduleByTeacher = (teacherId) => api.get(`/schedules/teacher/${teacherId}`)
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`)
export const getTeachers = () => api.get('/schedules/teachers')

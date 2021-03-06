import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const createReservation = payload => api.post(`/reservation`, payload)
export const getReservations = () => api.get(`/reservations`)
export const updateReservation = (id, payload) => api.put(`/reservation/${id}`, payload)
export const deleteReservation = id => api.delete(`/reservation/${id}`)
export const getReservationById = id => api.get(`/reservation/${id}`)

export const createRoom = payload => api.post(`/room`, payload)
export const getRooms = () => api.get(`/rooms`)
export const updateRoom = (id, payload) => api.put(`/room/${id}`, payload)
export const deleteRoom = id => api.delete(`/room/${id}`)
export const getRoomByDate = id => api.get(`/room/${id}`)

export const createPass = payload => api.post(`/pass`, payload)
export const getPasses = () => api.get(`/passes`)
export const updatePass = (id, payload) => api.put(`/pass/${id}`, payload)
export const deletePass = id => api.delete(`/pass/${id}`)
export const getPassByReservationId = id => api.get(`/pass/${id}`)

const apis = {
    createReservation,
    getReservations,
    updateReservation,
    deleteReservation,
    getReservationById,

    createRoom,
    getRooms,
    updateRoom,
    deleteRoom,
    getRoomByDate,

    createPass,
    getPasses,
    updatePass,
    deletePass,
    getPassByReservationId,
}

export default apis
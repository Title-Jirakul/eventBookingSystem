import axios from 'axios'

const api = axios.create({
    baseURL: 'https://make-friends-server.herokuapp.com/api',
    headers: {
        common: {
            'Content-Type': 'application/json'
        }
    }
})

api.interceptors.request.use(request => {
    console.log('[Request]', request.method?.toUpperCase(), request.url, request.data);
    return request;
});

api.interceptors.response.use(response => {
    console.log('[Response]', response.config.url, response.status, response.data);
    return response;
}, error => {
    console.log('[Response Error]', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
});

export const createReservation = payload => api.post(`/reservation`, payload)
export const getReservations = () => api.get(`/reservations`)
export const updateReservation = (id, payload) => api.put(`/reservation/${id}`, payload)
export const deleteReservation = id => api.delete(`/reservation/${id}`)
export const deleteReservationsByRoomID = id => api.delete(`/reservations/${id}`)
export const getReservationByReservationNo = id => api.get(`/reservations/${id}`)
export const getReservationById = id => api.get(`/reservation/${id}`)

export const createRoom = payload => api.post(`/room`, payload)
export const getRooms = () => api.get(`/rooms`)
export const updateRoom = (id, payload) => api.put(`/room/${id}`, payload)
export const updateRoomByOne = id => api.put(`/roomByOne/${id}`)
export const updateRoomByLess = id => api.put(`/roomByLess/${id}`)
export const updateVirtualRoomByOne = id => api.put(`/vroomByOne/${id}`)
export const updateVirtualRoomByLess = id => api.put(`/vroomByLess/${id}`)
export const deleteRoom = id => api.delete(`/room/${id}`)
export const getRoomByDate = id => api.get(`/room/${id}`)

export const createPass = payload => api.post(`/pass`, payload)
export const getPasses = () => api.get(`/passes`)
export const updatePass = (id, payload) => api.put(`/pass/${id}`, payload)
export const deletePass = id => api.delete(`/pass/${id}`)
export const getPassByReservationId = id => api.get(`/pass/${id}`)
export const getPassById = id => api.get(`/passes/${id}`)

export const createSinglePass = payload => api.post(`/singlePass`, payload)
export const deleteSinglePass = id => api.delete(`/singlePass/${id}`)
export const getSinglePass = id => api.get(`/singlePass/${id}`)
export const updateSinglePassUsed = id => api.put(`/singlePass/${id}`)

export const createDayPass = payload => api.post(`/dayPass`, payload)
export const deleteDayPass = id => api.delete(`/dayPass/${id}`)
export const getDayPass = id => api.get(`/dayPass/${id}`)
export const updateDayPassDate = (id, payload) => api.put(`/dayPass/${id}`, payload)

const apis = {
    createReservation,
    getReservations,
    updateReservation,
    deleteReservation,
    deleteReservationsByRoomID,
    getReservationByReservationNo,
    getReservationById,

    createRoom,
    getRooms,
    updateRoom,
    updateRoomByOne,
    updateRoomByLess,
    updateVirtualRoomByOne,
    updateVirtualRoomByLess,
    deleteRoom,
    getRoomByDate,

    createPass,
    getPasses,
    updatePass,
    deletePass,
    getPassByReservationId,
    getPassById,

    createSinglePass,
    deleteSinglePass,
    getSinglePass,
    updateSinglePassUsed,

    createDayPass,
    deleteDayPass,
    getDayPass,
    updateDayPassDate,
}

export default apis
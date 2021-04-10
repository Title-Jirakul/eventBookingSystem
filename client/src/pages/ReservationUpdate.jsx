import React, { Component } from 'react'
import api from '../api'
import { AdminNavBar } from '../components'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class ReservationUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            reservationNumber: '',
            name: '',
            lastName: '',
            phoneNo: '',
            roomNo: '',
            date: '',
            time: '',
            roomID: '',
            instructor: '',
        }
    }

    handleChangeInputReservationNo = async event => {
        const reservationNo = event.target.value
        this.setState({ reservationNo })
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputLastName = async event => {
        const lastName = event.target.value
        this.setState({ lastName })
    }

    handleChangeInputphoneNo = async event => {
        const phoneNo = event.target.value
        this.setState({ phoneNo })
    }

    handleUpdateReservation = async () => {
        const { id, reservationNo, name, lastName, phoneNo, roomNo, date, time, roomID, instructor} = this.state
        const payload = { reservationNo: reservationNo, 
            name: name, time: time, date: date, roomNo: roomNo, phoneNo: phoneNo,
        lastName: lastName, roomID: roomID, instructor: instructor }

        await api.updateReservation(id, payload).then(res => {
            window.alert(`Reservation updated Successfully`) ? window.location.reload() : window.location.reload()
        }).catch(res => {
            window.alert(`Reservation update failed`)
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const reservation = await api.getReservationById(id)
        this.setState({
            reservationNo: reservation.data.data.reservationNo,
            name: reservation.data.data.name,
            lastName: reservation.data.data.lastName,
            phoneNo: reservation.data.data.phoneNo,
            roomNo: reservation.data.data.roomNo,
            date: reservation.data.data.date,
            time: reservation.data.data.time,
            roomID: reservation.data.data.roomID,
            instructor: reservation.data.data.instructor,
        })
    }

    render() {
        const { reservationNo, name, lastName, phoneNo, roomSetting, date, time } = this.state
        return (
            <Wrapper>
            <AdminNavBar/>
                <Title>Update Reservation</Title>

                <Label>Ticket Number: </Label>
                <InputText
                    type="text"
                    value={reservationNo}
                />

                <Label>First Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Last Name: </Label>
                <InputText
                    type="text"
                    value={lastName}
                    onChange={this.handleChangeInputLastName}
                />

                <Label>Phone Number: </Label>
                <InputText
                    type="text"
                    value={phoneNo}
                    onChange={this.handleChangeInputPhoneNo}
                />

                <Label>Date: </Label>
                <InputText
                    type="text"
                    value={date}
                />

                <Label>Time: </Label>
                <InputText
                    type="text"
                    value={time}
                />

                <Label>Reserved Class: </Label>
                <InputText
                    type="text"
                    value={roomNo}
                />

                <Button onClick={this.handleUpdateReservation}>Update Reservation</Button>
                <CancelButton href={'/reservations/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default ReservationUpdate
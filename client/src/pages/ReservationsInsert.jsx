import React, { Component } from 'react'
import api from '../api'

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

class ReservationsInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            reservationNumber: '',
            roomSetting: '',
        }
    }

    handleChangeInputReservationNumber = async event => {
        const reservationNumber = event.target.value
        this.setState({ reservationNumber })
    }

    handleChangeInputRoomSetting = async event => {
        const roomSetting = event.target.value
        this.setState({ roomSetting })
    }

    handleCreateReservation = async () => {
        const { reservationNumber, roomSetting } = this.state
        const settingJSON = JSON.parse(roomSetting)
        const time = settingJSON.time
        const date = settingJSON.date
        const roomNumber = settingJSON.roomNo
        const payload = { reservationNumber, time, date, roomNumber }

        await api.createReservation(payload).then(res => {
            window.alert(`Reservation created successfully`)
            this.setState({
                reservationNumber: '',
                roomSetting: '',
            })
        })
    }

    render() {
        const { reservationNumber, roomSetting } = this.state
        return (
            <Wrapper>
                <Title>Create Reservation</Title>

                <Label>Reservation Number: </Label>
                <InputText
                    type="text"
                    value={reservationNumber}
                    onChange={this.handleChangeInputReservationNumber}
                />

                <Label>Avaliable Reserves: </Label>
                <InputText
                    type="text"
                    value={roomSetting}
                    onChange={this.handleChangeInputRoomSetting}
                />

                <Button onClick={this.handleCreateReservation}>Add Reservation</Button>
                <CancelButton href={'/reservations/create'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default ReservationsInsert
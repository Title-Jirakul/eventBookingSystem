import React, { Component } from 'react'
import api from '../api'

import Dropdown from 'react-bootstrap/Dropdown';

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
                <Title>Reservation</Title>

                <Label>Pass Number: </Label>
                <InputText
                    type="text"
                    value={reservationNumber}
                    onChange={this.handleChangeInputReservationNumber}
                />

                <Label>Avaliable Classes: </Label>
                <InputText
                    type="text"
                    value={roomSetting}
                    onChange={this.handleChangeInputRoomSetting}
                />

                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Available Classes
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Date: 25/01/2021, Class No: 1, Time: 10am, Capacity: 10, Max Capacity: 30</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Date: 25/01/2021, Class No: 2, Time: 10am, Capacity: 20, Max Capacity: 30</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Date: 25/01/2021, Class No: 3, Time: 10am, Capacity: 5, Max Capacity: 30</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Button onClick={this.handleCreateReservation}>Book</Button>
                <CancelButton href={'/reservations/create'}>Clear</CancelButton>
            </Wrapper>
        )
    }
}

export default ReservationsInsert
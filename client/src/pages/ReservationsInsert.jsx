import React, { Component } from 'react'
import api from '../api'

import Dropdown from 'react-bootstrap/Dropdown'

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
const InputSelect = styled.select.attrs({
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
            name: '',
            roomSetting: '',
            options: null,
        }
    }

    handleChangeInputReservationNumber = async event => {
        const reservationNumber = event.target.value
        this.setState({ reservationNumber })
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputRoomSetting = async event => {
        const roomSetting = event.target.value
        this.setState({ roomSetting })
    }

    handleCreateReservation = async () => {
        const { reservationNumber, name, roomSetting } = this.state
        const roomSettingJSON = JSON.parse(roomSetting)
        const time = roomSettingJSON.time
        const date = roomSettingJSON.date
        const roomNumber = roomSettingJSON.roomNo
        const payload = { reservationNo: reservationNumber, name: name, time: time, date: date, roomNo: roomNumber }

        await api.createReservation(payload).then(res => {
            api.updateRoomByOne(roomSettingJSON._id)
        }).then(res => {
            window.alert(`Reservation created successfully`)
            window.location.reload();
        }).catch(res => {
            window.alert(`Reservation created failed`)
            window.location.reload();
        })
    }

    getOptions = async () => {
       await api.getRooms().then(res => {
          let options = res.data.data.filter(data => data.capacity < data.maxCapacity)
          this.setState({options: options})
       })
    }

    componentDidMount = async () => {
      {this.getOptions()}
    }

    render() {
        const { reservationNumber, name, roomSetting, options } = this.state
        return (
            <Wrapper>
                <Title>Reservation</Title>

                <Label>Pass Number: </Label>
                <InputText
                    type="text"
                    value={reservationNumber}
                    onChange={this.handleChangeInputReservationNumber}
                />

                <Label>Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Available Classes: </Label>
                <InputSelect onChange={this.handleChangeInputRoomSetting} defaultvalue="">
                   <option hidden disabled selected value>-- Select an option --</option>
                   {this.state.options && this.state.options.map(object => {
                      return <option value={JSON.stringify(object)}>{
                      " Room: " + object.roomNo +
                      " ,Date: " + object.date + 
                      " ,Time: " + object.time + 
                      " ,Capacity: " + object.capacity + "/" + object.maxCapacity}</option>
                   })}
                </InputSelect>
                <Button onClick={this.handleCreateReservation}>Book</Button>
                <CancelButton href={'/reservations/create'}>Clear</CancelButton>
            </Wrapper>
        )
    }
}

export default ReservationsInsert
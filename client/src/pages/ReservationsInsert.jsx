import React, { Component } from 'react'
import api from '../api'
import styled from 'styled-components'
import { NavBar } from '../components'

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
            lastName: '',
            phoneNo: '',
            roomSetting: '',
            date: '',
            options: null,
            allOptions: null,
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

    handleChangeInputLastName = async event => {
        const lastName = event.target.value
        this.setState({ lastName })
    }

    handleChangeInputPhoneNo = async event => {
        const phoneNo = event.target.value
        this.setState({ phoneNo })
    }

    handleChangeInputRoomSetting = async event => {
        const roomSetting = event.target.value
        this.setState({ roomSetting })
    }

    handleChangeInputDate = async event => {
        const date = event.target.value
        this.getOptionsByDate(date);
        this.setState({ date })
    }

    handleCreateReservation = async () => {
        const { reservationNumber, name, roomSetting, phoneNo, lastName } = this.state
        const roomSettingJSON = JSON.parse(roomSetting)
        const time = roomSettingJSON.time
        const date = roomSettingJSON.date
        const roomNumber = roomSettingJSON.roomNo
        const roomID = roomSettingJSON._id
        const payload = { reservationNo: reservationNumber, 
            name: name, time: time, date: date, roomNo: roomNumber, phoneNo: phoneNo,
        lastName: lastName, roomID: roomID }

        await api.getPassByReservationId(reservationNumber).then(res => {
            console.log(res.data.data)
            if(!res.data.data.isActive){
               window.alert(`Pass is not active, please try a different pass`)
            } else {
               api.createReservation(payload).then(res => {
                  api.updateRoomByOne(roomSettingJSON._id)
               }).then(res => {
                  window.alert(`Reservation created successfully`)
                  window.location.reload();
               }).catch(res => {
                  window.alert(`Reservation creation failed`)
                  window.location.reload();
               })
            }
        }).catch(res => {
           window.alert(`Pass not exist, please try a different pass`)
        })
    }

    getOptions = async () => {
       await api.getRooms().then(res => {
          let allOptions = res.data.data.filter(data => data.capacity < data.maxCapacity)
          this.setState({allOptions: allOptions})
       })
    }

    getOptionsByDate = async (thisDate) => {
       const {allOptions} = this.state
       let options = allOptions.filter(data => data.capacity < data.maxCapacity && data.date == thisDate)
       this.setState({options: options})
    }

    componentDidMount = async () => {
      {this.getOptions()}
    }

    render() {
        const { reservationNumber, name, roomSetting, options, phoneNo, lastName, date } = this.state
        return (
            <Wrapper>
                <NavBar/>
                <Title>Reservation</Title>

                <Label>Ticket Number: </Label>
                <InputText
                    type="text"
                    value={reservationNumber}
                    onChange={this.handleChangeInputReservationNumber}
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
                    onChange={this.handleChangeInputDate}
                />

                <Label>Available Classes: </Label>
                <InputSelect onChange={this.handleChangeInputRoomSetting} defaultvalue="">
                   <option hidden disabled selected value>-- Select an option --</option>
                   {this.state.options && this.state.options.map(object => {
                      return <option value={JSON.stringify(object)}>{
                      " Room: " + object.roomNo +
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
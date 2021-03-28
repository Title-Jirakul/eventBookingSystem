
import React, { Component } from 'react'
import { useState } from 'react'
import { forwardRef } from 'react'
import api from '../api'
import { AdminNavBar } from '../components'
import DatePicker from 'react-datepicker'

import styled from 'styled-components'
import "react-datepicker/dist/react-datepicker.css"

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const LilWrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 5px;
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

const DatePick = ({parentCallback}) => {
  const [startDate, setStartDate] = useState(new Date());
  const ExampleCustomInput = forwardRef(
    ({ value, onClick }, ref) => (
      <button className="btn btn-outline-secondary" onClick={onClick} ref={ref}>
        Pick a date
      </button>
    ),
  )
  return (
    <DatePicker
      selected={startDate}
      onChange={date => {
         setStartDate(date)
         parentCallback(date)}}
         customInput={<ExampleCustomInput />}
    />
  )
}

class RoomsInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            roomNo: '',
            className: '',
            instructor: '',
            time: '',
            date: '',
            maxCapacity: 30,
        }
    }

    handleChangeInputName = async event => {
        const className = event.target.value
        this.setState({ className })
    }

    handleChangeInputInstructor = async event => {
        const instructor = event.target.value
        this.setState({ instructor })
    }

    handleChangeInputRoomNo = async event => {
        const roomNo = event.target.value
        this.setState({ roomNo })
    }

    handleChangeInputTime = async event => {
        const time = event.target.value
        this.setState({ time })
    }

    handleChangeInputDate = async event => {
        const date = event.target.value
        this.setState({ date })
    }

    handleChangeInputDatePicker = async (date) => {
        const str = date.toString().split(" ", 4)
        this.setState({ date: str[2] + " " + str[1].toUpperCase() + " " + str[3]})
    }

    handleChangeInputMaxCapacity = async event => {
        const maxCapacity = event.target.validity.valid
            ? event.target.value
            : this.state.maxCapacity
        this.setState({ maxCapacity })
    }

    handleCreateRoom = async () => {
        const { roomNo, time, date, maxCapacity, className, instructor} = this.state
        const capacity = 0
        const payload = { roomNo, time, date, capacity, maxCapacity, className, instructor}

        await api.createRoom(payload).then(res => {
            window.alert(`Class Created successfully`) ? window.location.reload() : window.location.reload()
        }).catch(res => {
            window.alert(`Class creation failed`)
        })
    }

    render() {
        const { roomNo, time, date, maxCapacity, className, instructor } = this.state
        return (
            <Wrapper>
                <AdminNavBar/>
                <Title>Add Class</Title>

                <Label>Class Number: </Label>
                <InputSelect onChange={this.handleChangeInputRoomNo} defaultvalue={roomNo}>
                    <option hidden disabled selected value>-- Select an option --</option>
                    <option value="roomNo 1">RoomNo 1</option>
                    <option value="roomNo 2">RoomNo 2</option>
                    <option value="roomNo 3">RoomNo 3</option>
                    <option value="roomNo 4">RoomNo 4</option>
                    <option value="roomNo 5">RoomNo 5</option>
                </InputSelect>

                <Label>Class Name: </Label>
                <InputText
                    type="text"
                    value={className}
                    onChange={this.handleChangeInputName}
                />

                <Label>Instructor: </Label>
                <InputText
                    type="text"
                    value={instructor}
                    onChange={this.handleChangeInputInstructor}
                />

                <Label>Date: </Label>
                <LilWrapper>
                    <DatePick parentCallback={this.handleChangeInputDatePicker}/>
                </LilWrapper>
                <InputText
                    type="text"
                    value={date}
                    onChange={this.handleChangeInputDate}
                />

                <Label>Time: </Label>
                <InputSelect onChange={this.handleChangeInputTime} defaultvalue={time}>
                    <option hidden disabled selected value>-- Select a time --</option>
                    <option value="09:00 - 10:30">09:00 - 10:30</option>
                    <option value="11:00 - 12:30">11:00 - 12:30</option>
                    <option value="11:00 - 13:00">11:00 - 13:00</option>
                    <option value="14:00 - 15:30">14:00 - 15:30</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:30 - 17:30">16:30 - 17:30</option>
                    <option value="16:30 - 18:00">16:30 - 18:00</option>
                    <option value="16:30 - 18:30">16:30 - 18:30</option>
                </InputSelect>

                <Label>Max Capacity: </Label>
                <InputText
                    type="number"
                    step="1"
                    lang="en-US"
                    min="1"
                    max="1000"
                    pattern="[1-1000]+([,\.][1-1000]+)?"
                    value={maxCapacity}
                    onChange={this.handleChangeInputMaxCapacity}
                />

                <Button onClick={this.handleCreateRoom}>Add Class</Button>
                <CancelButton href={'/rooms/create'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default RoomsInsert
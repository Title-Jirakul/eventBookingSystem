
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

const ErrorText = styled.p`
    color: #c62828;
    font-size: 0.9rem;
    margin: 0 5px 8px 5px;
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
            roomNos: [],
            roomNo: '',
            className: '',
            instructor: '',
            time: '',
            times: [],
            date: '',
            maxCapacity: 30,
            maxVirtualCapacity: 0,
            roomNoError: '',
            timeError: '',
        }
    }

    validateRoomNo = (value) => {
        if (!value) {
            return 'Please select a class number.'
        }

        if (!/^[A-Za-z0-9][A-Za-z0-9 /-]{0,29}$/.test(value)) {
            return 'The selected class number format is invalid.'
        }

        return ''
    }

    validateTime = (value) => {
        if (!value) {
            return 'Please select a time.'
        }

        const match = value.match(/^([01]\d|2[0-3]):([0-5]\d)\s-\s([01]\d|2[0-3]):([0-5]\d)$/)

        if (!match) {
            return 'The selected time format is invalid.'
        }

        const startMinutes = Number(match[1]) * 60 + Number(match[2])
        const endMinutes = Number(match[3]) * 60 + Number(match[4])

        if (endMinutes <= startMinutes) {
            return 'The selected time range is invalid.'
        }

        return ''
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
        this.setState({
            roomNo,
            roomNoError: this.validateRoomNo(roomNo),
        })
    }

    handleChangeInputTime = async event => {
        const time = event.target.value
        this.setState({
            time,
            timeError: this.validateTime(time),
        })
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

    handleChangeInputMaxVirtualCapacity = async event => {
        const maxVirtualCapacity = event.target.validity.valid
            ? event.target.value
            : this.state.maxVirtualCapacity
        this.setState({ maxVirtualCapacity })
    }

    handleCreateRoom = async () => {
        const { roomNo, time, date, maxCapacity, maxVirtualCapacity, className, instructor} = this.state
        const roomNoError = this.validateRoomNo(roomNo)
        const timeError = this.validateTime(time)

        if (roomNoError || timeError) {
            this.setState({ roomNoError, timeError })
            window.alert('Please fix the class number and time format before saving.')
            return
        }

        const capacity = 0
        const virtualCapacity = 0
        const payload = { roomNo, time, date, capacity, maxCapacity, virtualCapacity, maxVirtualCapacity, className, instructor}

        await api.createRoom(payload).then(res => {
            window.alert(`Class Created successfully`) ? window.location.reload() : window.location.reload()
        }).catch(res => {
            window.alert(`Class creation failed`)
        })
    }

    async componentDidMount() {
        try {
            const [roomRes, timeRes] = await Promise.all([
                api.getRoomNumbers(),
                api.getTimes(),
            ]);

            if (roomRes.data.success) {
                this.setState({ roomNos: roomRes.data.data });
            }

            if (timeRes.data.success) {
                this.setState({ times: timeRes.data.data });
            }
        } catch (err) {
            console.error('Failed to load data', err);
        }
    }


    render() {
        const { roomNo, time, date, maxCapacity, maxVirtualCapacity, className, instructor, roomNoError, timeError } = this.state
        return (
            <Wrapper>
                <AdminNavBar/>
                <Title>Add Class</Title>

                <Label>Class Number: </Label>
                <Label>Class Number: </Label>

            <InputSelect
                value={roomNo}
                onChange={this.handleChangeInputRoomNo}
            >
                <option value="" disabled>
                    -- Select an option --
                </option>

                {this.state.roomNos.map(room => (
                    <option key={room._id} value={room.roomNo}>
                        {room.roomNo}
                    </option>
                ))}
            </InputSelect>
            {roomNoError && <ErrorText>{roomNoError}</ErrorText>}

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

                <InputSelect
                    value={time}
                    onChange={this.handleChangeInputTime}
                >
                    <option value="" disabled>
                        -- Select a time --
                    </option>

                    {this.state.times.map(t => (
                        <option key={t._id} value={t.time}>
                            {t.time}
                        </option>
                    ))}
                </InputSelect>
                {timeError && <ErrorText>{timeError}</ErrorText>}

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

                <Label>Max Virtual Capacity: </Label>
                <InputText
                    type="number"
                    step="1"
                    lang="en-US"
                    min="0"
                    max="1000"
                    pattern="[0-1000]+([,\.][0-1000]+)?"
                    value={maxVirtualCapacity}
                    onChange={this.handleChangeInputMaxVirtualCapacity}
                />

                <Button onClick={this.handleCreateRoom}>Add Class</Button>
                <CancelButton href={'/rooms/create'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default RoomsInsert

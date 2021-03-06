
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

class RoomsInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            roomNo: '',
            time: '',
            date: '',
            maxCapacity: 30,
        }
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

    handleChangeInputMaxCapacity = async event => {
        const maxCapacity = event.target.validity.valid
            ? event.target.value
            : this.state.maxCapacity
        this.setState({ maxCapacity })
    }

    handleCreateRoom = async () => {
        const { roomNo, time, date, maxCapacity} = this.state
        const capacity = 0
        const payload = { roomNo, time, date, capacity, maxCapacity}

        await api.createRoom(payload).then(res => {
            window.alert(`Room Created successfully`)
            this.setState({
               roomNo: '',
               time: '',
               date: '',
               maxCapacity: 30,
            })
        }).catch(res => {
            window.alert(`Reservation created failed`)
            window.location.reload();
        })
    }

    render() {
        const { roomNo, time, date, maxCapacity } = this.state
        return (
            <Wrapper>
                <Title>Add Class</Title>

                <Label>Class Number: </Label>
                <InputSelect onChange={this.handleChangeInputRoomNo} defaultvalue={roomNo}>
                    <option hidden disabled selected value>-- Select an option --</option>
                    <option value="roomNo 1">RoomNo 1</option>
                </InputSelect>

                <Label>Time: </Label>
                <InputText
                    type="text"
                    value={time}
                    onChange={this.handleChangeInputTime}
                />

                <Label>Date: </Label>
                <InputText
                    type="text"
                    value={date}
                    onChange={this.handleChangeInputDate}
                />

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
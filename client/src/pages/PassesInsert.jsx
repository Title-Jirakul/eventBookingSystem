
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

class PassesInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            reservationNo: '',
            name: '',
            passType: '',
            dateIssued: '',
            isActive: true,
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

    handleChangeInputPassType = async event => {
        const passType = event.target.value
        this.setState({ passType })
    }

    handleChangeInputDateIssued = async event => {
        const dateIssued = event.target.value
        this.setState({ dateIssued })
    }

    handleChangeInputIsActive = async event => {
        const isActive = event.target.checked
        this.setState({ isActive })
    }

    handleCreatePass = async () => {
        const { reservationNo, name, passType, dateIssued, isActive } = this.state
        const payload = { reservationNo, name,  passType, dateIssued, isActive}

        await api.createPass(payload).then(res => {
            window.alert(`Pass Created Successfully`)
            this.setState({
               reservationNo: '',
               name: '',
               passType: '',
               dateIssued: '',
               isActive: true,
            })
        })
    }

    render() {
        const { reservationNo, name, passType, dateIssued, isActive } = this.state
        return (
            <Wrapper>
                <Title>Create Pass</Title>

                <Label>Reservation Number: </Label>
                <InputText
                    type="text"
                    value={reservationNo}
                    onChange={this.handleChangeInputReservationNo}
                />

                <Label>Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Pass Type: </Label>
                <InputText
                    type="text"
                    value={passType}
                    onChange={this.handleChangeInputPassType}
                />

                <Label>Date Issued: </Label>
                <InputText
                    type="text"
                    value={dateIssued}
                    onChange={this.handleChangeInputDateIssued}
                />

                <Label>Is Active: </Label>
                <input
                    type="checkbox"
                    checked = {this.state.isActive}
                    onChange={this.handleChangeInputIsActive}
                />

                <Button onClick={this.handleCreatePass}>Add Pass</Button>
                <CancelButton href={'/passes/create'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default PassesInsert
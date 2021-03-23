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

class PassUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            reservationNo: '',
            name: '',
            passType: '',
            phoneNo: '',
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

    handleChangeInputphoneNo = async event => {
        const phoneNo = event.target.value
        this.setState({ phoneNo })
    }

    handleChangeInputIsActive = async event => {
        const isActive = event.target.checked
        this.setState({ isActive })
    }

    handleUpdatePass = async () => {
        const { id, reservationNo, name, passType, phoneNo, isActive } = this.state
        const payload = { reservationNo, name,  passType, phoneNo, isActive}

        await api.updatePass(id, payload).then(res => {
            window.alert(`Ticket updated Successfully`)
            window.location.reload();
        }).catch(res => {
            window.alert(`Ticket update failed`)
            window.location.reload();
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const pass = await api.getPassById(id)
        console.log(pass)
        this.setState({
            reservationNo: pass.data.data.reservationNo,
            name: pass.data.data.name,
            passType: pass.data.data.passType,
            phoneNo: pass.data.data.phoneNo,
            isActive: pass.data.data.isActive,
        })
    }

    render() {
        const { reservationNo, name, passType, phoneNo, isActive } = this.state
        return (
            <Wrapper>
            <AdminNavBar/>
                <Title>Update Ticket</Title>

                <Label>Ticket Number: </Label>
                <InputText
                    type="text"
                    value={reservationNo}
                    onChange={this.handleChangeInputReservationNo}
                />

                <Label>Ticket Type: </Label>
                {/* Input select can be dynamic: admin can add passType in here */}
                <InputSelect onChange={this.handleChangeInputPassType} value={passType}>
                    <option value="one">1 Day</option>
                    <option value="three">3 Days</option>
                    <option value="class">Class</option>
                </InputSelect>

                <Label>Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Phone Number: </Label>
                <InputText
                    type="text"
                    value={phoneNo}
                    onChange={this.handleChangeInputphoneNo}
                />

                <div>
                <Label>Is Active: </Label>
                <input
                    type="checkbox"
                    checked = {this.state.isActive}
                    onChange={this.handleChangeInputIsActive}
                />
                </div>
                <Button onClick={this.handleUpdatePass}>Update Ticket</Button>
                <CancelButton href={'/passes/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default PassUpdate
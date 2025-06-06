
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

class PassesInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
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

    handleCreatePass = async () => {
        const { reservationNo, name, passType, phoneNo, isActive } = this.state
        const payload = { reservationNo, name,  passType, phoneNo, isActive}

        await api.createPass(payload).then(res => {
            switch (passType) {
               case 'class':
                  const singlePassPayload = { reservationID: res.data.id, isUsed: false}
                  api.createSinglePass(singlePassPayload).then(res => {
                     window.alert(`Single Use Ticket Created Successfully`) ? window.location.reload() : window.location.reload()
                  })
                  break
               case 'one':
                  const singleDayPassPayload = { reservationID: res.data.id, dateBooked: " "}
                  api.createDayPass(singleDayPassPayload).then(res => {
                     window.alert(`One day ticket Created Successfully`) ? window.location.reload() : window.location.reload()
                  })
                  break
               case 'three':
                    const threeDayPassPayload = { reservationID: res.data.id, dateBooked: " "}
                    api.createDayPass(threeDayPassPayload).then(res => {
                     window.alert(`Three day ticket Created Successfully`) ? window.location.reload() : window.location.reload()
                  })
                  break
               case 'two':
                  const twoDayPassPayload = { reservationID: res.data.id, dateBooked: " "}
                  api.createDayPass(twoDayPassPayload).then(res => {
                     window.alert(`Two day ticket Created Successfully`) ? window.location.reload() : window.location.reload()
                  })
                  break
                case 'seven':
                    const sevenDayPassPayload = { reservationID: res.data.id, dateBooked: " "}
                    api.createDayPass(sevenDayPassPayload).then(res => {
                     window.alert(`Seven day ticket Created Successfully`) ? window.location.reload() : window.location.reload()
                  })
                  break
               case 'vclass':
                  const virtualSinglePassPayload = { reservationID: res.data.id, isUsed: false}
                  api.createSinglePass(virtualSinglePassPayload).then(res => {
                     window.alert(`Virtual Single class Ticket Created Successfully`) ? window.location.reload() : window.location.reload()
                  })
                  break
               case 'vone':
                  const virtualOneDayPassPayload = { reservationID: res.data.id, dateBooked: " "}
                  api.createDayPass(virtualOneDayPassPayload).then(res => {
                     window.alert(`Virtual one day Ticket Created Successfully`) ? window.location.reload() : window.location.reload()
                  })
                  break
            }
        }).catch(res => {
            window.alert(`Ticket creation failed`)
            console.log(res.message)
        })
    }

    render() {
        const { reservationNo, name, passType, phoneNo, isActive } = this.state
        return (
            <Wrapper>
            <AdminNavBar/>
                <Title>Add Ticket</Title>

                <Label>Ticket Number: </Label>
                <InputText
                    type="text"
                    value={reservationNo}
                    onChange={this.handleChangeInputReservationNo}
                />

                <Label>Ticket Type: </Label>
                {/* Input select can be dynamic: admin can add passType in here */}
                <InputSelect onChange={this.handleChangeInputPassType} defaultvalue="">
                    <option hidden disabled selected value>-- Select an option --</option>
                    <option value="class">1 Class</option>
                    <option value="one">1 Day</option>
                    <option value="three">3 Days</option>
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
                <Button onClick={this.handleCreatePass}>Add Ticket</Button>
                <CancelButton href={'/passes/create'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default PassesInsert

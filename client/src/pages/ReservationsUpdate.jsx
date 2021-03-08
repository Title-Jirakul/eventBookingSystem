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

class ReservationsUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ticketNo: '',
        }
    }

    handleChangeInputTicketNo = async event => {
        const ticketNo = event.target.value
        this.setState({ ticketNo })
    }

    render() {
        const { roomNo, time, date, maxCapacity, className, instructor } = this.state
        return (
            <Wrapper>
                <Title>Your Reservations</Title>

                <Label>Ticket Number: </Label>
                <InputText
                    type="text"
                    value={time}
                    onChange={this.handleChangeInputTicketNo}
                />

                <Button onClick={this.handleGetReservations}>Get Reservations</Button>
                <CancelButton href={'/rooms/create'}>Clear</CancelButton>
            </Wrapper>
        )
    }
}

export default ReservationsUpdate
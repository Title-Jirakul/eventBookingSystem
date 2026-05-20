import React, { Component } from 'react'
// import ReactTable from 'react-table-v6'
import api from '../api'
import { NavBar } from '../components'

import styled from 'styled-components'
// import 'react-table-v6/react-table.css'

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

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`
const WrapperTable = styled.div`
    padding: 0 40px 40px 40px;
`

class DeleteReservation extends Component {
    deleteUser = async event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete this reservation permanently?`,
            )
        ) {
            await api.deleteReservation(this.props.id).then(res => {
                  api.getPassByReservationId(this.props.reservationNo).then(res => {
                     switch(res.data.data.passType) {
                        case 'class':
                           api.updateSinglePassUsed(res.data.data._id).then(res => {
                              api.updateRoomByLess(this.props.roomID).then(res => {
                                 window.location.reload()
                              })
                           })
                           break
                        case 'vclass':
                           api.updateSinglePassUsed(res.data.data._id).then(res => {
                              api.updateVirtualRoomByLess(this.props.roomID).then(res => {
                                 window.location.reload()
                              })
                           })
                           break
                        case 'one':
                           api.updateRoomByLess(this.props.roomID).then(res => {
                                 window.location.reload()
                           })
                           break
                        case 'three':
                           api.updateRoomByLess(this.props.roomID).then(res => {
                                 window.location.reload()
                           })
                           break
                        case 'two':
                           api.updateRoomByLess(this.props.roomID).then(res => {
                                 window.location.reload()
                           })
                           break
                        case 'vone':
                           api.updateVirtualRoomByLess(this.props.roomID).then(res => {
                                 window.location.reload()
                           })
                           break
                        default:
                            break
                     }
                  })
            })
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

class ReservationsUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ticketNo: '',
            reservations: [],
            columns: [],
            isLoading: false,
        }
    }

     filterMethod = (filter, row) => {
        const id = filter.pivotId || filter.id
        return row[id] !== undefined ? row[id].toLowerCase().startsWith(filter.value.toLowerCase()) : true
    }

    handleChangeInputTicketNo = async event => {
        const ticketNo = event.target.value
        this.setState({ ticketNo })
    }

    handleGetReservations = async () => {
        const { ticketNo } = this.state
        this.setState({ isLoading: true })

        await api.getReservationByReservationNo(ticketNo).then(res => {
            this.setState({
               reservations: res.data.data,
               isLoading: false,
            })
        }).catch(res => {
            this.setState({ isLoading: false })
            window.alert(`No reservation made for this ticket, please try again`)
        })
    }

    render() {
        const { ticketNo, reservations, isLoading } = this.state

        let showTable = true
        if (!reservations.length) {
            showTable = false
        }
        return (
            <Wrapper>
                <NavBar/>
                <Title>Your Reservations</Title>

                <Label>Ticket Number: </Label>
                <InputText
                    type="text"
                    value={ticketNo}
                    onChange={this.handleChangeInputTicketNo}
                />

                <Button onClick={this.handleGetReservations}>Get Reservations</Button>
                <CancelButton href={'/reservations/update'}>Clear</CancelButton>
            <WrapperTable>
                {isLoading && <div>Loading reservations...</div>}
                {showTable && (
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Room No</th>
                                <th>Instructor</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map(reservation => (
                                <tr key={reservation._id}>
                                    <td>{reservation.date}</td>
                                    <td>{reservation.time}</td>
                                    <td>{reservation.roomNo}</td>
                                    <td>{reservation.instructor}</td>
                                    <td>
                                        <DeleteReservation
                                            id={reservation._id}
                                            roomID={reservation.roomID}
                                            reservationNo={reservation.reservationNo}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </WrapperTable>
            </Wrapper>
        )
    }
}

export default ReservationsUpdate

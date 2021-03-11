import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import api from '../api'

import styled from 'styled-components'
import 'react-table-6/react-table.css'

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
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete this reservation permanently?`,
            )
        ) {
            api.deleteReservation(this.props.id)
            api.updateRoomByLess(this.props.roomID)
            window.location.reload()
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
            window.alert(`Ticket doesn't exist, please try again`)
        })
    }

    render() {
        const { ticketNo, reservations, isLoading } = this.state

        const columns = [
            {
                Header: 'Date',
                accessor: 'date',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Time',
                accessor: 'time',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Room No',
                accessor: 'roomNo',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteReservation id={props.original._id} roomID={props.original.roomID}/>
                        </span>
                    )
                },
            },
        ]

        let showTable = true
        if (!reservations.length) {
            showTable = false
        }
        return (
            <Wrapper>
                <Title>Your Reservations</Title>

                <Label>Ticket Number: </Label>
                <InputText
                    type="text"
                    value={ticketNo}
                    onChange={this.handleChangeInputTicketNo}
                />

                <Button onClick={this.handleGetReservations}>Get Reservations</Button>
                <CancelButton href={'/reservations/update'}>Clear</CancelButton>
            </Wrapper>
            <WrapperTable>
                {showTable && (
                    <ReactTable
                        data={reservations}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </WrapperTable>
        )
    }
}

export default ReservationsUpdate
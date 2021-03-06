import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import api from '../api'

import styled from 'styled-components'
import 'react-table-6/react-table.css'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

class DeleteReservation extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do tou want to delete the reservation ${this.props.reservationNo} permanently?`,
            )
        ) {
            api.deleteReservation(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

class ReservationsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reservations: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getReservations().then(reservations => {
            this.setState({
                reservations: reservations.data.data,
                isLoading: false,
            })
        })
    }

    render() {
        const { reservations, isLoading } = this.state
        console.log('TCL: reservationsList -> render -> reservations', reservations)

        const columns = [
            {
                Header: 'Reservation No',
                accessor: 'reservationNo',
                filterable: true,
            },
            {
                Header: 'Name',
                accessor: 'name',
                filterable: true,
            },
            {
                Header: 'Date',
                accessor: 'date',
                filterable: true,
            },
            {
                Header: 'Time',
                accessor: 'time',
                filterable: true,
            },
            {
                Header: 'Room No',
                accessor: 'roomNo',
                filterable: true,
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteReservation id={props.original._id} reservationNo={props.original.reservationNo}/>
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
            </Wrapper>
        )
    }
}

export default ReservationsList
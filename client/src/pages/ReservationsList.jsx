import React, { Component } from 'react'
import ReactTable from 'react-table-6'
import api from '../api'
import { AdminNavBar } from '../components'

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
    deleteUser = async event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete the reservation ${this.props.reservationNo} permanently?`,
            )
        ) {
            await api.deleteReservation(this.props.id).then(res => {
               api.updateRoomByLess(this.props.roomID).then(res => {
                  api.getPassByReservationId(this.props.reservationNo).then(res => {
                     switch(res.data.data.passType) {
                        case 'class':
                           api.updateSinglePassUsed(res.data.data._id).then(res => {
                              window.location.reload()
                           }).catch(() => {
                              window.location.reload()
                           })
                           break
                        case 'one':
                           window.location.reload()
                           break
                        case 'three':
                           window.location.reload()
                           break
                     }
                  })
               })
            })
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

    filterMethod = (filter, row) => {
        const id = filter.pivotId || filter.id
        return row[id] !== undefined ? row[id].toLowerCase().startsWith(filter.value.toLowerCase()) : true
    }

    render() {
        const { reservations, isLoading } = this.state
        console.log('TCL: reservationsList -> render -> reservations', reservations)

        const columns = [
            {
                Header: 'Ticket No',
                accessor: 'reservationNo',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'First Name',
                accessor: 'name',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Last Name',
                accessor: 'lastName',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Phone Number',
                accessor: 'phoneNo',
                filterable: true,
                filterMethod: this.filterMethod,
            },
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
                            <DeleteReservation id={props.original._id} reservationNo={props.original.reservationNo} roomID={props.original.roomID}/>
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
                <AdminNavBar/>
                {showTable && (
                    <ReactTable
                        data={reservations}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={reservations.length}
                        showPagination={false}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default ReservationsList
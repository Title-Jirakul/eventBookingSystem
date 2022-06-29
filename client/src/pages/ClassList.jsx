import React, { Component } from 'react'
import ReactTable from 'react-table-v6'
import api from '../api'
import { AdminNavBar } from '../components'

import styled from 'styled-components'
import 'react-table-v6/react-table.css'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

class DeleteClass extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do tou want to delete this class permanently?`,
            )
        ) {
            api.deleteRoom(this.props.id)
            api.deleteReservationsByRoomID(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

class ClassList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classes: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getRooms().then(classes => {
            this.setState({
                classes: classes.data.data,
                isLoading: false,
            })
        })
    }

    filterMethod = (filter, row) => {
        const id = filter.pivotId || filter.id
        return row[id] !== undefined ? row[id].toLowerCase().startsWith(filter.value.toLowerCase()) : true
    }

    render() {
        const { classes, isLoading } = this.state
        console.log('TCL: classesList -> render -> classes', classes)

        const columns = [
            {
                Header: 'Room No',
                accessor: 'roomNo',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Class Name',
                accessor: 'className',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Instructor',
                accessor: 'instructor',
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
                Header: 'Max Capacity',
                accessor: 'maxCapacity',
                filterable: true,
            },
            {
                Header: 'Capacity',
                accessor: 'capacity',
                filterable: true,
            },
            {
                Header: 'Max Virtual Capacity',
                accessor: 'maxVirtualCapacity',
                filterable: true,
            },
            {
                Header: 'Virtual Capacity',
                accessor: 'virtualCapacity',
                filterable: true,
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteClass id={props.original._id}/>
                        </span>
                    )
                },
            },
        ]

        let showTable = true
        if (!classes.length) {
            showTable = false
        }

        return (
            <Wrapper>
                <AdminNavBar/>
                {showTable && (
                    <ReactTable
                        data={classes}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={classes.length}
                        showPagination={false}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default ClassList
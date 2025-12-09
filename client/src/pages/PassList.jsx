import React, { Component } from 'react'
import api from '../api'
import { AdminNavBar } from '../components'

import { DataGrid } from '@mui/x-data-grid'
import styled from 'styled-components'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
`

class DeletePass extends Component {
    deleteUser = async event => {
        event.preventDefault()

        if (window.confirm(
            `Do you want to delete the ticket ${this.props.reservationNo} permanently?`
        )) {
            try {
                await api.deletePass(this.props.id)
                await api.deleteSinglePass(this.props.id)
                await api.deleteDayPass(this.props.id)
            } finally {
                window.location.reload()
            }
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

class UpdatePass extends Component {
    updateUser = event => {
        event.preventDefault()
        window.location.href = `/passes/update/${this.props.id}`
    }

    render() {
        return <Update onClick={this.updateUser}>Update</Update>
    }
}

class PassList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            passes: [],
            isLoading: false,
        }
    }

    async componentDidMount() {
        this.setState({ isLoading: true })

        const res = await api.getPasses()
        const passData = res.data.data.map((p) => ({
            id: p._id,                // MUI DataGrid requires "id"
            ...p,
            isActive: p.isActive ? "Yes" : "No",
        }))

        this.setState({
            passes: passData,
            isLoading: false,
        })
    }

    render() {
        const { passes, isLoading } = this.state

        const columns = [
            { field: 'reservationNo', headerName: 'Reservation No', flex: 1 },
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'passType', headerName: 'Ticket Type', flex: 1 },
            { field: 'phoneNo', headerName: 'Phone Number', flex: 1 },
            { field: 'isActive', headerName: 'Is Active', flex: 1 },

            {
                field: 'delete',
                headerName: '',
                width: 120,
                sortable: false,
                filterable: false,
                renderCell: (params) =>
                    <DeletePass id={params.row.id} reservationNo={params.row.reservationNo} />
            },

            {
                field: 'update',
                headerName: '',
                width: 120,
                sortable: false,
                filterable: false,
                renderCell: (params) =>
                    <UpdatePass id={params.row.id} />
            }
        ]

        return (
            <Wrapper>
                <AdminNavBar />
                <div style={{ height: passes.length * 85 + 150, width: '100%' }}>
                    <DataGrid
                        rows={passes}
                        columns={columns}
                        loading={isLoading}
                        disableRowSelectionOnClick
                        autoHeight
                        sx={{
                            backgroundColor: '#fff',
                            borderRadius: 2,
                        }}
                        pageSizeOptions={[passes.length]}
                    />
                </div>
            </Wrapper>
        )
    }
}

export default PassList

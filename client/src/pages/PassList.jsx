import React, { Component } from 'react'
import api from '../api'
import { AdminNavBar, BulkDeleteConfirmDialog } from '../components'

import { DataGrid } from '@mui/x-data-grid'
import styled from 'styled-components'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const ActionsBar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
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
            isBulkDeleteOpen: false,
            isBulkDeleting: false,
        }
    }

    async componentDidMount() {
        await this.loadPasses()
    }

    loadPasses = async () => {
        this.setState({ isLoading: true })

        try {
            const res = await api.getPasses()
            const passData = res.data.data.map((p) => ({
                id: p._id,
                ...p,
                isActive: p.isActive ? 'Yes' : 'No',
            }))

            this.setState({
                passes: passData,
                isLoading: false,
            })
        } catch (error) {
            this.setState({
                passes: [],
                isLoading: false,
            })
        }
    }

    openBulkDelete = () => {
        this.setState({ isBulkDeleteOpen: true })
    }

    closeBulkDelete = () => {
        if (this.state.isBulkDeleting) {
            return
        }

        this.setState({ isBulkDeleteOpen: false })
    }

    handleBulkDelete = async () => {
        this.setState({ isBulkDeleting: true })

        try {
            await api.deleteAllPasses()
            this.setState({
                passes: [],
                isBulkDeleteOpen: false,
            })
        } catch (error) {
            window.alert('Failed to delete all tickets.')
        } finally {
            this.setState({ isBulkDeleting: false })
        }
    }

    render() {
        const { passes, isLoading, isBulkDeleteOpen, isBulkDeleting } = this.state

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
                <ActionsBar>
                    <button type="button" className="btn btn-danger" onClick={this.openBulkDelete}>
                        Delete
                    </button>
                </ActionsBar>
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
                <BulkDeleteConfirmDialog
                    open={isBulkDeleteOpen}
                    title="Delete all tickets?"
                    description='This will permanently delete all ticket records, including related single-pass and day-pass data. Type DELETE to confirm.'
                    onClose={this.closeBulkDelete}
                    onConfirm={this.handleBulkDelete}
                    isSubmitting={isBulkDeleting}
                />
            </Wrapper>
        )
    }
}

export default PassList

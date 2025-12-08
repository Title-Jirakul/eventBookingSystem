import React, { Component } from 'react'
// import ReactTable from 'react-table-v6'
import api from '../api'
import { AdminNavBar } from '../components'

import styled from 'styled-components'
// import 'react-table-v6/react-table.css'

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

        if (
            window.confirm(
                `Do you want to delete the ticket ${this.props.reservationNo} permanently?`,
            )
        ) {
            await api.deletePass(this.props.id).then(() => {
               api.deleteSinglePass(this.props.id).then(() => {
                  window.location.reload()
               })
               api.deleteDayPass(this.props.id).then(() => {
                  window.location.reload()
               })
            }).catch(() => {
               window.location.reload()
            })
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
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getPasses().then(passes => {
            const passData = passes.data.data
            passData.map(data => {
               data.isActive = data.isActive ? "Yes" : "No"
            })
            this.setState({
                passes: passData,
                isLoading: false,
            })
        })
    }

    filterMethod = (filter, row) => {
        const id = filter.pivotId || filter.id
        return row[id] !== undefined ? row[id].toLowerCase().startsWith(filter.value.toLowerCase()) : true
    }

    // render() {
    //     const { passes, isLoading } = this.state

    //     const columns = [
    //         {
    //             Header: 'Reservation No',
    //             accessor: 'reservationNo',
    //             filterable: true,
    //             filterMethod: this.filterMethod,
    //         },
    //         {
    //             Header: 'Name',
    //             accessor: 'name',
    //             filterable: true,
    //             filterMethod: this.filterMethod,
    //         },
    //         {
    //             Header: 'Ticket Type',
    //             accessor: 'passType',
    //             filterable: true,
    //             filterMethod: this.filterMethod,
    //         },
    //         {
    //             Header: 'Phone Number',
    //             accessor: 'phoneNo',
    //             filterable: true,
    //             filterMethod: this.filterMethod,
    //         },
    //         {
    //             Header: 'Is Active',
    //             accessor: 'isActive',
    //             filterable: true,
    //             filterMethod: this.filterMethod,
    //         },
    //         {
    //             Header: '',
    //             accessor: '',
    //             Cell: function(props) {
    //                 return (
    //                     <span>
    //                         <DeletePass id={props.original._id} reservationNo={props.original.reservationNo}/>
    //                     </span>
    //                 )
    //             },
    //         },
    //         {
    //             Header: '',
    //             accessor: '',
    //             Cell: function(props) {
    //                 return (
    //                     <span>
    //                         <UpdatePass id={props.original._id} />
    //                     </span>
    //                 )
    //             },
    //         },
    //     ]

    //     let showTable = true
    //     if (!passes.length) {
    //         showTable = false
    //     }

    //     return (
    //         <Wrapper>
    //             <AdminNavBar/>
    //             {showTable && (
    //                 <ReactTable
    //                     data={passes}
    //                     columns={columns}
    //                     loading={isLoading}
    //                     defaultPageSize={passes.length}
    //                     showPagination={false}
    //                     minRows={0}
    //                 />
    //             )}
    //         </Wrapper>
    //     )
    // }
}

export default PassList
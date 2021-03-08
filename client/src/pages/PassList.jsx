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

class DeletePass extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do tou want to delete the pass ${this.props.reservationNo} permanently?`,
            )
        ) {
            api.deletePass(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
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

    render() {
        const { passes, isLoading } = this.state
        console.log('TCL: passesList -> render -> passes', passes)

        const columns = [
            {
                Header: 'Reservation No',
                accessor: 'reservationNo',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Name',
                accessor: 'name',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Pass Type',
                accessor: 'passType',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Phone No',
                accessor: 'phoneNo',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: 'Is Active',
                accessor: 'isActive',
                filterable: true,
                filterMethod: this.filterMethod,
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeletePass id={props.original._id} reservationNo={props.original.reservationNo}/>
                        </span>
                    )
                },
            },
        ]

        let showTable = true
        if (!passes.length) {
            showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={passes}
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

export default PassList
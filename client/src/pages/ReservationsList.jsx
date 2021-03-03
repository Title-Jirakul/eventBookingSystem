import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'

import styled from 'styled-components'

//import 'react-table/react-table.css' react-table 7 doesnt support react-table.css, maybe use react-table v6

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`


class ReservationsList extends Component {
    render() {
        return (
            <div>
                <p>In this page you'll see the list of Reservations</p>
            </div>
        )
    }
}

export default ReservationsList
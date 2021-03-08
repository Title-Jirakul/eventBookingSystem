
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

class Links extends Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/reservations/create" className="navbar-brand">
                    Booking System
                </Link>
                <Collapse>
                    <List>
                        <Item>
                            <Link to="/reservations/create" className="nav-link">
                                Make Reservation
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/reservations/update" className="nav-link">
                                Your Reservations
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/classes/list" className="nav-link">
                                All Classes
                            </Link>
                        </Item>
                        {/* Items below are only displayed to Admin */}
                        <Item>
                            <Link to="/classes/create" className="nav-link">
                                Add Class
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/passes/create" className="nav-link">
                                Add Ticket
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/reservations/list" className="nav-link">
                                All Reservations
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/passes/list" className="nav-link">
                                All Tickets
                            </Link>
                        </Item>
                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links
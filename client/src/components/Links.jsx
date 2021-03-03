
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
                    Reservation Booking System
                </Link>
                <Collapse>
                    <List>
                        <Item>
                            <Link to="/reservations/create" className="nav-link">
                                Create Reservation
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/rooms/create" className="nav-link">
                                Create Room
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/passes/create" className="nav-link">
                                Create Pass
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/reservations/list" className="nav-link">
                                Reservations
                            </Link>
                        </Item>
                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links
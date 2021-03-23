import React, { Component } from 'react'
import styled from 'styled-components'

import Logo from './Logo'
import AdminLinks from './AdminLinks'

const Container = styled.div.attrs({
    className: 'container',
})``

const Nav = styled.nav.attrs({
    className: 'navbar navbar-expand-lg navbar-dark bg-dark',
})`
    margin-bottom: 20 px;
`

class AdminNavBar extends Component {
    render() {
        return (
            <Container>
                <Nav>
                    <Logo />
                    <AdminLinks />
                </Nav>
            </Container>
        )
    }
}

export default AdminNavBar
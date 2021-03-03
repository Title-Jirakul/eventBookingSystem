import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { ReservationsList, ReservationsInsert, ReservationsUpdate, RoomsInsert, PassesInsert } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/reservations/list" exact component={ReservationsList} />
                <Route path="/reservations/create" exact component={ReservationsInsert} />
                <Route
                    path="/reservations/update/:id"
                    exact
                    component={ReservationsUpdate}
                />
                <Route path="/rooms/create" exact component={RoomsInsert} />
                <Route path="/passes/create" exact component={PassesInsert} />
            </Switch>
        </Router>
    )
}

export default App

import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { ReservationsList, ReservationsInsert, ReservationsUpdate, RoomsInsert, PassesInsert, ClassList } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/reservations/list" exact component={ReservationsList} />
                <Route path="/classes/list" exact component={ClassList} />
                <Route path="/reservations/create" exact component={ReservationsInsert} />
                <Route
                    path="/reservations/update/:id"
                    exact
                    component={ReservationsUpdate}
                />
                <Route path="/classes/create" exact component={RoomsInsert} />
                <Route path="/passes/create" exact component={PassesInsert} />
            </Switch>
        </Router>
    )
}

export default App

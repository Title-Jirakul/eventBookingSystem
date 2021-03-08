import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { ReservationsList, ReservationsInsert, ReservationsUpdate, RoomsInsert, PassesInsert, ClassList, PassList } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/reservations/list" exact component={ReservationsList} />
                <Route path="/classes/list" exact component={ClassList} />
                <Route path="/reservations/create" exact component={ReservationsInsert} />
                <Route path="/reservations/update" exact component={ReservationsUpdate} />
                <Route path="/classes/create" exact component={RoomsInsert} />
                <Route path="/passes/create" exact component={PassesInsert} />
                <Route path="/passes/list" exact component={PassList} />
            </Switch>
        </Router>
    )
}

export default App

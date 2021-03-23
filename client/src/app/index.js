import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import { ReservationsList, ReservationsInsert, ReservationsUpdate, RoomsInsert, PassesInsert, ClassList, PassList, Admin, PassUpdate } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/reservations/list" exact component={ReservationsList} />
                <Route path="/classes/list" exact component={ClassList} />
                <Route path="/reservations/create" exact component={ReservationsInsert} />
                <Route path="/reservations/update" exact component={ReservationsUpdate} />
                <Route path="/classes/create" exact component={RoomsInsert} />
                <Route path="/passes/create" exact component={PassesInsert} />
                <Route path="/passes/list" exact component={PassList} />
                <Route path="/admin" exact component={Admin} />
                <Route path="/passes/update/:id" exact component={PassUpdate} />
                <Redirect to="/reservations/create"/>
            </Switch>
        </Router>
    )
}

export default App

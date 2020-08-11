import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import  TrainingsPage  from '../TrainingsPage/TrainingsPage.jsx';
import  TrainingPage  from '../TrainingsPage/TrainingPage.jsx';
import  EditTrainingPage  from '../TrainingsPage/EditTrainingPage.jsx';
import  TrainingPlansPage  from '../TrainingPlansPage/TrainingPlansPage.jsx';
import  TrainingPlanPage  from '../TrainingPlansPage/TrainingPlanPage.jsx';
import  EditTrainingPlanPage  from '../TrainingPlansPage/EditTrainingPlanPage.jsx';
import { Navbar}  from '../Navbar/Navbar.jsx';

import './app.css';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            submitted: false,
            error: ''
        };
        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }
componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ error: 'ERRROROROROORORO !!' });
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error: true };
  }
    render() {
        const { alert } = this.props;
        return (
            <div className="jumbotron">
            {this.state.error}
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                        <Navbar  {...this.state}> </Navbar>
                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/home" component={HomePage} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                                <Route path="/trainings" component={TrainingsPage} />
                                <Route path="/trainings/:id" component={TrainingPage} />
                                <Route path="/trainings/:id/edit" component={EditTrainingPage} />
                                <Route path="/training_plans" component={TrainingPlansPage} />
                               < PrivateRoute exact path="/training_plans/:id" component={TrainingPlanPage} />
                                <Route path="/training_plans/:id/edit" component={EditTrainingPlanPage} />
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 
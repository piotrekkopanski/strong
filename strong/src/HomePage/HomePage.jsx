import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

class HomePage extends React.Component {
    componentDidMount() {
        // this.props.dispatch(userActions.getAll());
    }

    render() {
        const { user, users } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
              <h1>Hi {user.first_name}!</h1>
              <p>
                <Link to="/login">Logout</Link>
              </p>

<div class="row">
    <div class="col-sm-4"><span><a href="/trainings">Trainings</a></span></div>
    <div class="col-sm-4"><span><a href="/training_plans">Training Plan</a></span></div>
    <div class="col-sm-4"><span>Activities</span></div>
    <div class="col-sm-4"><span>Photos</span></div>
    <div class="col-sm-4"><span>Transformations</span></div>
    <div class="col-sm-4"><span>Calendar</span></div>

  </div>

            </div>
                //
                // <p>You're logged in with React & JWT!!</p>
                // <h3>Users from secure api end point:</h3>
                // {users.loading && <em>Loading users...</em>}
                // {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                // {users.items &&
                //     <ul>
                //         {users.items.map((user, index) =>
                //             <li key={user.id}>
                //                 {user.firstName + ' ' + user.lastName}
                //             </li>
                //         )}
                //     </ul>
                // }
                
            // </div>
        );
    }
}

function mapStateToProps(state) {

    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };
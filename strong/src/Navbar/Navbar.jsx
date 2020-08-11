import React from 'react';
import { userActions } from '../_actions';
import { connect } from 'react-redux';
import { history } from '../_helpers';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogout = (e) => {
  	e.preventDefault();
    const { dispatch } = this.props;
    dispatch(userActions.logout);
    history.push('/login');
    window.location.reload(false);
  }

  render() {
    const {
    	user
    } = this.props;
    return (

    	<nav className="navbar">
        <h4>Hi { user? user.first_name : ':) '}</h4>
        { user &&
          <a onClick={this.handleLogout}>Sign Out</a> }
      </nav>
    );
  }
};

function mapStateToProps(state) {
    const { authentication } = state;
    const { user } = authentication;
    return {
        user
    };
}

const connectedNavbar = connect(mapStateToProps)(Navbar);
export { connectedNavbar as Navbar };

// src/App.js
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Router, Switch, Route } from './routing';
import Home from './Home';
import Pokemon from './Pokemon';
import Signup from './Signup';
import Signin from './Signin';
import { combineReducers } from 'redux'
import { reduxTokenAuthReducer } from 'redux-token-auth'
import { generateRequireSignInWrapper } from 'redux-token-auth'

const requireSignIn = generateRequireSignInWrapper({
  redirectPathIfNotSignedIn: '/signin',
})
const rootReducer = combineReducers({
  reduxTokenAuth: reduxTokenAuthReducer,
})

class App extends Component {
  state = {
    selectedPokemon: null
  };
  selectPokemon = selectedPokemon => {
    this.setState({
      selectedPokemon
    });
  };
  render() {
    return (
      <View style={styles.container}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />


        <Router>
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Home {...props} selectPokemon={this.selectPokemon} />
              )}
            />


            <Route
              path="/pokemon"
              render={props => (
                <Pokemon
                  {...props}
                  selectedPokemon={this.state.selectedPokemon}
                />
              )}
            />

                 <Route
              path="/signup"
              render={props => (
                <Signup
                  {...props}
                  selectedPokemon={this.state.selectedPokemon}
                />
              )}
            />


                 <Route
              path="/signin"
              render={props => (
                <Signin
                  {...props}
                  selectedPokemon={this.state.selectedPokemon}
                />
              )}
            />

          </Switch>
        </Router>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 50
  }
});
export default App;
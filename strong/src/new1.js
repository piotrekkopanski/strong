// src/index.js

import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import { Provider } from 'react-redux'
import { createStore } from 'redux'



import { verifyCredentials } from './redux-token-auth-config' // <-- note this is YOUR file, not the redux-token-auth NPM module

import { applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger();

export const store = createStore(
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
verifyCredentials(store) // <-<-<-<-<- here's the important part <-<-<-<-<-

ReactDom.render(<App store={store}/>, document.getElementById("root"));
// store.ts

import { applyMiddleware, compose, createStore } from "redux";
import logger from "redux-logger";
import { rootReducer } from "./reducers";
import { initialState } from "./store/state";

const middlewares = [];

export const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middlewares)),
);

export default store;
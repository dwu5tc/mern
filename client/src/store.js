import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; // no need for reducers/index (why though???)

const initialState = {};

const middleware = [thunk];

// const store = createStore(
// 	rootReducer, 
// 	initialState, 
// 	compose( // what does compose do???
// 		applyMiddleware(...middleware),
// 		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// 	)
// );

// from redux-devtools-extension github
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	rootReducer, 
	initialState, 
	composeEnhancers(
		applyMiddleware(...middleware)
	));


export default store;
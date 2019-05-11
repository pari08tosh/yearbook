import { USER_LOGIN, USER_LOGOUT } from '../actions/types';

let initialState = {
    loggedIn: false,
    token: '',
    username: '',
    name: '',
    rollnumber: ''
};

const userData = JSON.parse(localStorage.getItem('user'));

if(userData) {
    initialState = {
        loggedIn: true,
        ...userData
    }
}

export default function(state = initialState, action) {
    switch(action.type) {
        case USER_LOGIN:
            return {
                ...state,
                loggedIn: true,
                ...action.payload
            };
        case USER_LOGOUT:
            return {
                loggedIn: false,
                token: '',
                username: '',
                name: ''
            };
        default:
            return state;
    }
}
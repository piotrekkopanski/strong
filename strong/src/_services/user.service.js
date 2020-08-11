import { config } from '../_constants';
import { authHeader } from '../_helpers';


export const userService = {
    login,
    logout,
    register,
    getAll
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        crossDomain: true,
       headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/api/v1/auth/sign_in',
        Accept: 'application/json'
      }
    };

    return fetch(`${config.apiUrl}/api/v1/auth/sign_in?email=${email}&password=${password}`, requestOptions)
    .then(response => {
    const headers = response.headers
    const statusCode = response.ok;
    const data = response.json();
    return Promise.all([statusCode, data, headers]);})
        .then(handleResponse)
        .then(data => {
            const user = data.user.data
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            user.token = data.token
            user.client = data.client
            console.log('tutaj jest user po zalogowaniu')
            console.log(JSON.stringify(user))
            localStorage.setItem('user_new_new',' JSON.stringify(user)');
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        crossDomain: true,
        headers: { 'Access-Control-Allow-Origin': 'http://localhost:3000/api/v1/auth','Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/api/v1/auth`, requestOptions)
    .then(response => {
    const headers = response.headers
    const statusCode = response.ok;
    const data = response.json();
    return Promise.all([statusCode, data, headers]);})
    .then(handleResponse)
     .then(data => {
            const user = data.user.data
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            user.token = data.token
            user.client = data.client
            localStorage.setItem('user', JSON.stringify(user));

            return  user;
        });
}


function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`http://localhost:3000/abc`, requestOptions).then(handleResponse);
};
        

function handleResponse([res, data, headers] ) {
  console.log(res)
  console.log(data)
    if (!res) {
          return Promise.reject(data.errors? get_errors(data.errors) : 'Invalid credentials');
        }

        return { user: data, token: headers.get('access-token'), client: headers.get('client')  }

      function get_errors(errors) {
        const result = Object.values(errors);
        const keys = Object.keys(errors);
        if (keys[0] == '0') {
          return result
        } else 
        {
          return keys.map((key, index) =>
            key + ' ' + result[index] + ' '
          )
       }
    };
      
    };
  // function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }

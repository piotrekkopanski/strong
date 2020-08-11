export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return {  Accept: 'application/json',
    'Content-Type': 'application/json', "access-token": user.token, "uid": user.uid, "client": user.client, "token-type": "Bearer" };
    } else {
        return {};
    }
}
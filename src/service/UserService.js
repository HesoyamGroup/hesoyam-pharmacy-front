import {client} from '@/client/axiosClient'

//Perform check if specific roles
export function isSysAdmin(){
    var userRole = getLoggedUserData().userRole;
    if(userRole != 'SYS_ADMIN'){
      return false;
    }

    return true;
}

export function clearUserData(){
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_token_expires');
}

export function isUserLoggedIn(){
    var userData = getLoggedUserData();
    //If user token present, user is logged.
    if(userData['userToken']) return true;

    return false;
}

export function getLoggedUserData(){
    return {
      userRole: _getUserRole(),
      userToken: _getUserToken(),
      userTokenExpiryDate: _getUserTokenExpiryDate()
    }
}

export function _getUserRole(){
  var userRole = localStorage.getItem('user_role');
  if(userRole != null){
      userRole = userRole.substring(userRole.indexOf('_') + 1);
  }

  return userRole;
}

export function _getUserToken(){
  return localStorage.getItem('user_token');
}

export function _getUserTokenExpiryDate(){
  return localStorage.getItem('user_token_expires');
}

export async function validateAuthentication() {
    return await client({
      method: 'GET',
      url: 'auth/validate-token'
    }).then( (response) => {
      return true;
    }, (error) => {
      return false;
    })
}
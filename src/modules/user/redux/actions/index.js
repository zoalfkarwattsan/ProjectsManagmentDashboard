import {API, API_WithSwal} from '../../utility/API'
import {_setAPIToken} from '../../utility/Utils'
import _ from "lodash"

//************************************//
export const _login = ({email, password}, callback, callbackErr) => {
    API.post('dashboard/login', {email, password})
        .then(function (res) {
            callback(res)
        })
        .catch(function (res) {
            callbackErr(res)
        })
}

//************************************//
export const _autoLogin = (dispatch, ability, callback) => {
  const storageUserToken = JSON.parse(localStorage.getItem('USER_TOKEN'))
  const sessionUserToken = JSON.parse(sessionStorage.getItem('USER_TOKEN'))
  let user = (sessionUserToken || false)
  if (user && user.token && user.user) {
    _setAPIToken(user.token)
    // dispatch({type:"USER_LOGIN", userData:user.user, token:user.token})
    // if (user.user.abilities) {
    //   ability.update(user.user.abilities)
    // }
    API.post('login-token', {email: user.email, token: user.token})
      .then(function (res) {
        if (res.data.token) {
          const {data} = res
          sessionStorage.setItem("USER_TOKEN", JSON.stringify({email: user.email, token: data.token, user: data.user}))
          _setAPIToken(data.token)
          dispatch({type: "USER_LOGIN", userData: data.user, token: data.token})
          if (data.user.abilities) {
            ability.update(data.user.abilities)
          }
        }
        callback()
      })
      .catch(function (res) {
        localStorage.removeItem('USER_TOKEN')
        sessionStorage.removeItem('USER_TOKEN')
        callback()
      })
  } else if (user = (storageUserToken || false)) {
    if (user && user.token && user.email) {
      _setAPIToken(user.token)
      API.post('login-token', {email: user.email, token: user.token})
        .then(function (res) {
          if (res.data.token) {
            const {data} = res
            sessionStorage.setItem("USER_TOKEN", JSON.stringify({email: user.email, token: data.token, user: data.user}))
            _setAPIToken(data.token)
            dispatch({type: "USER_LOGIN", userData: data.user, token: data.token})
            if (data.user.abilities) {
              ability.update(data.user.abilities)
            }
          }
          callback()
        })
        .catch(function (res) {
          localStorage.removeItem('USER_TOKEN')
          sessionStorage.removeItem('USER_TOKEN')
          callback()
        })
    }
  } else {
    callback()
  }
}

//***************** Admins *******************//

export const _addAdmin = (data, callback, callbackErr) => {
  API_WithSwal.post(`/admins`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editAdminInfo = (data, callback, callbackErr) => {
  API_WithSwal.put(`/admins/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteAdmin = (id, callback) => {
  API.delete(`/admins/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//***************** Responsibles *******************//

export const _getResponsible = (id, callback, callbackErr) => {
  API.get(`/responsibles/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
      // callbackErr(data.errors)
    })
}
//************************************//
export const _addResponsible = (data, callback, callbackErr) => {
  API_WithSwal.post(`/responsibles`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editResponsibleInfo = (data, callback, callbackErr) => {
  API_WithSwal.put(`/responsibles/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteResponsible = (id, callback) => {
  API.delete(`/responsibles/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _activateTeamMember = (id, callback) => {
  API.delete(`responsible/activateTeamMember/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _deactivateTeamMember = (id, callback) => {
  API.delete(`responsible/deActivateTeamMember/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _getAllProjectManagersWithQ = async (q = '') => {
  const {data} =  await API.get('projectmanagers/getAllProjectManagersWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.projectmanagers, (v, k) => {
    return {value: v.id, label: `${v.fname} ${v.mname} ${v.lname}`}
  })
}

//************************************//
export const _getAllProjectManagersForProjectWithQ = async (id, q = '') => {
  const {data} =  await API.get(`projectmanagers/getAllProjectManagersForProjectWithQ/${id}`, {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.projectmanagers, (v, k) => {
    return {value: v.id, label: `${v.fname} ${v.mname} ${v.lname}`}
  })
}

//************************************//
export const _getAllDelegatesWithQ = async (q = '') => {
  const {data} =  await API.get('delegates/getAllDelegatesWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.delegates, (v, k) => {
    return {value: v.id, label: `${v.fname} ${v.mname} ${v.lname}`}
  })
}

//************************************//
export const _getAllResponsiblesWithQ = async (q = '') => {
  const {data} =  await API.get('responsible/getAllResponsiblesWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.responsibles, (v, k) => {
    return {value: v.id, label: `${v.fname} ${v.mname} ${v.lname}`}
  })
}

//***************** Citizens *******************//

export const _getCitizen = (id, callback, callbackErr) => {
  API.get(`/users/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
      // callbackErr(data.errors)
    })
}

//************************************//
export const _addCitizen = (data, callback, callbackErr) => {
  API_WithSwal.post(`/users`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editCitizen = (data, callback, callbackErr) => {
  API_WithSwal.put(`/users/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteCitizen = (id, callback) => {
  API.delete(`/users/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _deleteTempUser = (id, callback) => {
  API.delete(`/user/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _immigrantUser = ({id, election_id}, callback) => {
  API.delete(`/user/immigrant/${id}/${election_id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _localizeCitizen = ({id, election_id}, callback) => {
  API.delete(`/user/localize/${id}/${election_id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

export const _getAllUsersWithQ = async (q = '') => {
  const {data} =  await API.get('user/getAllUsersWithQ', {
    params: {
      limit: 100,
      q
    }
  })
  return _.map(data.citizens, (v, k) => {
    return {label: `${v.fname} ${v.mname} ${v.lname}`, value: v.id}
  })
}

//***************** Citizens *******************//

export const _getAllNationalitiesWithQ = async (q = '') => {
  const {data} =  await API.get('user/getAllNationalitiesWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.nationalities, (v, k) => {
    return {value: v.id, label: v.name}
  })
}

export const _getAllPersonalReligionsWithQ = async (q = '') => {
  const {data} =  await API.get('user/getAllPersonalReligionsWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.personal_religions, (v, k) => {
    return {value: v, label: v}
  })
}
//************************************//
export const _getAllRecordReligionsWithQ = async (q = '') => {
  const {data} =  await API.get('user/getAllRecordReligionsWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.record_religions, (v, k) => {
    return {value: v, label: v}
  })
}
//************************************//
export const _getAllUsersMunicipalitiesWithQ = async (q = '') => {
  const {data} =  await API.get('user/getAllUsersMunicipalitiesWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.municipalities, (v, k) => {
    return {value: v.id, label: v.name}
  })
}

//***************** Projects & Tasks *******************//

//************************************//
export const _addProject = (data, callback, callbackErr) => {
  API_WithSwal.post(`/projects`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editProject = (data, callback, callbackErr) => {
    API_WithSwal.put(`/projects/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteProject = (id, callback) => {
  API.delete(`/projects/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _getProjectInfo = (id, callback) => {
  API.get(`/projects/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _getAllProjectTypesWithQ = async (q = '') => {
  const {data} =  await API.get('projecttypes/getAllProjectTypesWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.projecttypes, (v, k) => {
    return {value: v.id, label: v.name}
  })
}
//************************************//
export const _getAllStatusesWithQ = async (q = '') => {
  const {data} =  await API.get('statuses/getAllStatusesWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.statuses, (v, k) => {
    return {value: v.id, label: v.name}
  })
}
//************************************//
export const _addTask = (data, callback, callbackErr) => {
  API_WithSwal.post(`tasks/store`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editTask = (data, callback, callbackErr) => {
  API_WithSwal.put(`tasks/update/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteTask = (id, callback) => {
  API.delete(`tasks/destroy/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//***************** Notifications *******************//

export const _sendPushNotification = (data, callback, callbackErr) => {
  API_WithSwal.post(`/notifications`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _getAllAdminsWithQ = async (q = '') => {
  const {data} =  await API.get('admin/getAllAdminsWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.municipalities, (v, k) => {
    return {value: v.id, label: v.name}
  })
}

//***************** Elections *******************//

export const _addElection = (data, callback, callbackErr) => {
  API_WithSwal.post(`/elections`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editElection = (data, callback, callbackErr) => {
  API_WithSwal.put(`/elections/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _assignToResponsible = (data, callback, callbackErr) => {
  API_WithSwal.post(`election/${data.election_id}/assignToResponsible`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteElection = (id, callback) => {
  API.delete(`/elections/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _activateElection = (id, callback) => {
  API.delete(`/election/${id}/activate`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _deActivateElection = (id, callback) => {
  API.delete(`/election/${id}/deactivate`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}
//************************************//
export const _resetElection = (id, callback) => {
  API.delete(`/election/${id}/reset`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _getBoxInfo = (id, callback) => {
  API.get(`/boxes/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _activateBox = (id, callback) => {
  API.delete(`/box/${id}/open`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _closeBox = (id, callback) => {
  API.delete(`/box/${id}/close`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _resetBox = (id, callback) => {
  API.delete(`/box/${id}/reset`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _getElectionParties = (electionId, callback) => {
  API.get(`election/${electionId}/parties`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _reOrderParties = (ids, electionId, callback) => {
  API.post(`election/${electionId}/reorderElectionParties`, {ids})
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _deleteElectionParty = (partyId, electionId, callback) => {
  API.delete(`party/${partyId}/${electionId}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

export const _addCandidate = (data, callback, callbackErr) => {
  API_WithSwal.post(`candidates/store`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editCandidate = (data, callback, callbackErr) => {
  API_WithSwal.post(`/candidate/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}

//************************************//
export const _deleteCandidate = (id, callback) => {
  API.delete(`candidate/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _getActiveElectionLiveStream = (id, callback) => {
  API.get(`getActiveElectionLiveStream`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//***************** Settings *******************//

export const _addStatus = (data, callback, callbackErr) => {
  API_WithSwal.post(`/statuses`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editStatus = (data, callback, callbackErr) => {
  API_WithSwal.put(`/statuses/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteStatus = (id, callback) => {
  API.delete(`/statuses/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _addParty = (data, callback, callbackErr) => {
  API_WithSwal.post(`/parties`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editParty = (data, callback, callbackErr) => {
  API_WithSwal.put(`/parties/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteParty = (id, callback) => {
  API.delete(`/parties/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _addAnnouncement = (data, callback, callbackErr) => {
  API_WithSwal.post(`/announcements`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editAnnouncement = (data, callback, callbackErr) => {
  API_WithSwal.put(`/announcements/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteAnnouncement = (id, callback) => {
  API.delete(`/announcements/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _addProjectType = (data, callback, callbackErr) => {
  API_WithSwal.post(`/projectTypes`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editProjectType = (data, callback, callbackErr) => {
  API_WithSwal.put(`/projectTypes/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteProjectType = (id, callback) => {
  API.delete(`/projectTypes/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _addBox = (data, callback, callbackErr) => {
  API_WithSwal.post(`/boxes`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editBox = (data, callback, callbackErr) => {
  API_WithSwal.put(`/boxes/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteBox = (id, callback) => {
  API.delete(`/boxes/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}


//***************** Roles And Permissions *******************//

export const _getPermissions = (callback, callbackErr) => {
  API.get(`permissions`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _getRoles = (callback, callbackErr) => {
  API.get(`roles`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _addRole = (data, callback, callbackErr) => {
  API_WithSwal.post(`/roles`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _editRole = (data, callback, callbackErr) => {
  API_WithSwal.put(`/roles/${data.id}`, data)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (data) {
      callbackErr(data?.data?.errors)
    })
}
//************************************//
export const _deleteRole = (id, callback) => {
  API.delete(`/roles/${id}`)
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
    })
}

//************************************//
export const _getAllRolesWithQ = async (q = '') => {
  const {data} =  await API.get('getAllRolesWithQ', {
    params: {
      limit: 20,
      q
    }
  })
  return _.map(data.roles, (v, k) => {
    return {value: v.id, label: v.name.replace("_", " ")}
  })
}

//************************************//
//************************************//
//************************************//
//************************************//
//************************************//
//************************************//
//************************************//
//************************************//
//************************************//
//************************************//
//************************************//
//************************************//
export const _loginTwoFactor = ({email, code}, callback, callbackErr) => {
  API.post('/login-2fa', {email, code})
    .then(function (res) {
      callback(res)
    })
    .catch(function ({data}) {
      callbackErr(data)
    })
}
//************************************//
export const _register = ({firstName, lastName, email}, callback, callbackErr) => {
    API.post('/register', {first_name: firstName, last_name: lastName, email})
        .then(function ({data}) {
            callback(data)
        })
        .catch(function ({data}) {
            callbackErr(data.data)
        })
}
//************************************//
export const _forgetPassword = ({email}, callback, callbackErr) => {
    API.post('/forget-password', {email})
        .then(function ({data}) {
            callback(data)
        })
        .catch(function ({data}) {
            callbackErr(data.data)
        })
}
//************************************//
export const _resetPassword = ({email, currentPassword, newPassword}, callback, callbackErr) => {
    API.post('/reset-password', {email, current_password:currentPassword, new_password:newPassword})
        .then(function (res) {
            callback(res)
        })
        .catch(function ({data}) {
            callbackErr(data.data)
        })
}
//************************************//
export const _changePassword = (data, callback, callbackErr) => {
  API.post('/user/account/change-password', {...data})
    .then(function ({data}) {
      callback(data)
    })
    .catch(function ({data}) {
      callbackErr(data.data)
    })
}
//************************************//
export const _logout = () => {
    return dispatch => {
        // ** Remove user, accessToken & refreshToken from localStorage
        localStorage.removeItem('USER_TOKEN')
        sessionStorage.removeItem('USER_TOKEN')
        _setAPIToken('')
        dispatch({ type: 'USER_LOGOUT' })
    }
}
//************************************//
export const _getMyProfile = (dispatch) => {
    API.get('/user/account/my-profile')
        .then(function ({data}) {
            const userToken = JSON.parse(sessionStorage.getItem('USER_TOKEN'))
            userToken.user = {...userToken.user, ...data.basic_info}
            sessionStorage.setItem("USER_TOKEN", JSON.stringify(userToken))
            dispatch({type: 'USER_MY_PROFILE', data})
        })
        .catch(function (res) {})
}
//************************************//
export const _changeBasicInfo = (data, callback, callbackErr) => {
    return dispatch => {
        API.post('/user/account/change-basic-info', data)
          .then(function ({data}) {
              _getMyProfile(dispatch)
          })
          .catch(function ({data}) {
              callbackErr(data.data)
          })
    }

}
//************************************//
export const _changeGeneralInfo = (data, callback, callbackErr) => {
    return dispatch => {
        API.post('/user/account/change-general-info', {...data})
          .then(function ({data}) {
              _getMyProfile(dispatch)
          })
          .catch(function ({data}) {
              callbackErr(data.data)
          })
    }

}
//************************************//
export const _saveSupportEmail = (data, callback, callbackErr) => {
    API.post('support/store', {...data})
      .then(function ({data}) {
      })
      .catch(function ({data}) {
          callbackErr(data.data)
      })

}

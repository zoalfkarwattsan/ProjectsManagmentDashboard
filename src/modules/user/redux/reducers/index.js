// **  Initial State
const initialState = {
    userData: {},
    token: false,
    loading: false
}

export const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_LOGIN':
            return {
                ...state,
                userData: action.userData,
                token: action.token
            }
        case 'USER_LOGOUT':
            const obj = { ...action }
            return { ...state, userData: {}, token: false, ...obj }
        case 'USER_MY_PROFILE':
            const userData = {...state.userData}
            userData.first_name = action.data.basic_info.first_name
            userData.last_name = action.data.basic_info.last_name
            userData.full_name = action.data.basic_info.full_name
            userData.avatar = action.data.general_info.avatar
            userData.gender = action.data.general_info.gender
            userData.birth_date = action.data.general_info.birth_date
            return {
                ...state,
                userData
            }
        case 'USER_INFO_LOADING_START':
            return {
                ...state, loading: true
            }
        case 'USER_INFO_LOADING_END':
            return {
                ...state, loading: false
            }
        default:
            return state
    }
}

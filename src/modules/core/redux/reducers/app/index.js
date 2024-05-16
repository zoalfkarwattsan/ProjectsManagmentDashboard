// **  Initial State
const initialState = {
    settings: {
        app:{
            langs:['en', 'ar', 'tr']
        }
    },
    loading: false
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'APP_SETTINGS':
            return {
                ...state,
                settings: action.data
            }
        case 'APP_LOADING_START':
            return {
                ...state, loading: true
            }
        case 'APP_LOADING_END':
            return {
                ...state, loading: false
            }
        default:
            return state
    }
}

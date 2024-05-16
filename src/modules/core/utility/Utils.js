import axios from 'axios'
import {toast, Slide} from 'react-toastify'
import {Fragment, useContext} from "react"
import qs from 'qs'
import {Bell, Check, X, AlertTriangle, Info} from 'react-feather'
import {FormattedMessage} from 'react-intl'
import {createBrowserHistory} from 'history'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Avatar from '@components/avatar'
import {store} from '@fwsrc/redux/storeConfig/store'
const {_logout} = require(`@modules/${process.env.REACT_APP_AUTH_MODULE}`)

import _ from "lodash"

const global = []

export const trans = (id, values = {}) => (<FormattedMessage id={id} values={{...values}} defaultMessage={id}/>)

const MySwal = withReactContent(Swal)
export const _confirm = (opt = {}) => {
    return MySwal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Do it!',
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1'
        },
        buttonsStyling: false
    }).then(function (result) {
        if (result.value) {
            if (opt.callback) {
                opt.callback(() => {
                    MySwal.fire({
                        icon: 'success',
                        title: 'Done!',
                        text: '',
                        customClass: {
                            confirmButton: 'btn btn-success'
                        }
                    })
                })
            }

        }
    })
}

export const _successSwal = () => {
    return MySwal.fire({
      icon: 'success',
      title: 'Done!',
      text: '',
      customClass: {
        confirmButton: 'btn btn-success'
      }
    })
}

const ToastContent = ({type, text}) => {
    let color = type, title, Icon
    if (type === 'error') {

        color = 'danger'
        title = 'Error'
        Icon = X
    } else if (type === 'success') {
        title = 'Done'
        Icon = Check
    } else if (type === 'warning') {
        title = 'Done'
        Icon = AlertTriangle
    }
    return (
        <Fragment>
            <div className='toastify-header'>
                <div className='title-wrapper'>
                    <Avatar size='sm' color={color} icon={<Icon size={12}/>}/>
                    <h6 className='toast-title'>{type}</h6>
                </div>
            </div>
            <div className='toastify-body'>
                <span>{text}</span>
            </div>
        </Fragment>
    )
}

//************************************//
export function _toast(text, type = 'error', autoClose = 5000) {
    if (text === false) {
        toast.dismiss()
        return
    }
    const options = {transition: Slide, hideProgressBar: false, autoClose, type}
    toast(<ToastContent text={text} type={type}/>, options)
}

//************************************//
export function _isOnline() {
    return true
}

//************************************//
export function _setGlobal(key, val) {
    global[key] = val
}

//************************************//
export function _getGlobal(key) {
    return global[key]
}

//************************************//
export function _loading(start) {
    store.dispatch({type: start ? "APP_LOADING_START" : "APP_LOADING_END", payload: {}})
}

//************************************//
export function _historyPush(to) {
    createBrowserHistory().push(to)
}

//************************************//
function _handleError(code, config) {
    if (code === 'USR_UNAUTHENTICATED') {
        store.dispatch(_logout())
        _historyPush('/')
        window.location.reload()
    }
}

//************************************//
function _inProgressApiCount(action) {
    const k = 'inProgressApiCount'
    const c = _getGlobal(k) || 0
    let n = 0
    if (action === '+') {
        n = c + 1
    } else if (action === '-') {
        n = c - 1
        n = n > 0 ? n : 0
    }
    _setGlobal(k, n)
    return {c, n}
}

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
    headers: {dev: true}

})

API.interceptors.request.use(function (config) {
    if (!_isOnline()) {
        if (config.sync) {
            config.silent = true
            throw ({sync: config.sync, config})
        } else {
            throw ({offline: true})
        }
    }
    if (config.silent !== true) {
        if (_inProgressApiCount('+').c === 0) {
            _loading(true)
        }
        //_toast(false)
    }

    if (config.params) {
        config.paramsSerializer = p => {
            return qs.stringify(p)
        }
    }

    if (config.data && !config.noStringify) {
        //config.data = qs.stringify(config.data)
    }
    //console.log(config)
    return config
}, function (error) {
    // Do something with request error
    return Promise.reject(error)
})
API.interceptors.response.use(
    function (response) {
        if (response.config.silent !== true) {
            if (_inProgressApiCount('-').n === 0) {
                _loading(false)
            }
            if (response.data.message) {
                if (response.data.message !== '') {
                    _toast(response.data.message, 'success')
                }
            }
        }
        return response.data
    },
    function (error) {
        if (error.config.silent !== true) {
            if (_inProgressApiCount('-').n === 0) {
                _loading(false)
            }
        }
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            //console.log(error.response.data, error.response.status, error.response)
            if (error.config.silent !== true) {
                if (error.response.data.error !== '') {
                    console.log(error.response.data)
                    _handleError(error.response.data.error_code, error.config)
                    _toast(error.response.data.message, 'error')
                }
            } else {
                console.log(error)
            }

        } else if (error.request) {
            console.log(error.request)
            if (error.request._response) {
                // _toast(error.request._response,'error')
            }
        } else if (error.sync) {
            //_storeSyncRequest(error.config,error.sync)
        } else if (error.offline) {
            //_toast(t('desktop.NO_INTERNET'),'error')
        } else {
            console.log('Error', error.message)
        }
        return Promise.reject(error.response)
    })
export {API}

//************************************//
export function _setAPIToken(token) {
    API.defaults.headers['Authorization'] = `Bearer ${token}`
}

//************************************//
export function _setAPILang(lang) {
    API.defaults.headers['lang'] = lang
}

//************************************//
export const _getAppLang = (lang) => {
    return _getGlobal('APP_LANG')
}
//************************************//
export const _setAppLang = (lang) => {
    localStorage.setItem('APP_LANG', lang)
    _setGlobal('APP_LANG', lang)
    _setAPILang(lang)
}
//************************************//
export const _changeAppLang = (lang) => {
    localStorage.setItem('APP_LANG', lang)
    location.reload()
}
// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
    const today = new Date()
    return (
        /* eslint-disable operator-linebreak */
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
        /* eslint-enable */
    )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = {month: 'short', day: 'numeric', year: 'numeric'}) => {
    if (!value) return value
    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
    const date = new Date(value)
    let formatting = {month: 'short', day: 'numeric'}

    if (toTimeForCurrentDay && isToday(date)) {
        formatting = {hour: 'numeric', minute: 'numeric'}
    }

    return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary25: '#7367f01a', // for option hover bg-color
        primary: '#7367f0', // for selected option bg-color
        neutral10: '#7367f0', // for tags bg-color
        neutral20: '#ededed', // for input border-color
        neutral30: '#ededed' // for input hover border-color
    }
})

export const phpToMomentFormat = (str) => {
  const replacements = {
    d: "DD",
    D: "ddd",
    j: "D",
    l: "dddd",
    N: "E",
    S: "o",
    w: "e",
    z: "DDD",
    W: "W",
    F: "MMMM",
    m: "MM",
    M: "MMM",
    n: "M",
    t: "", // no equivalent
    L: "", // no equivalent
    o: "YYYY",
    Y: "YYYY",
    y: "YY",
    a: "a",
    A: "A",
    B: "", // no equivalent
    g: "h",
    G: "H",
    h: "hh",
    H: "HH",
    i: "mm",
    s: "ss",
    u: "SSS",
    e: "zz", // deprecated since Moment.js 1.6.0
    I: "", // no equivalent
    O: "", // no equivalent
    P: "", // no equivalent
    T: "", // no equivalent
    Z: "", // no equivalent
    c: "", // no equivalent
    r: "", // no equivalent
    U: "X"
  }
  return str.split('').map(chr => (chr in replacements ? replacements[chr] : chr)).join('')
}

//************************************//
export const _url = (uri) => {
  const imageDomain = API.defaults.baseURL
  return (uri && uri.length > 0) ? uri.indexOf('http') > -1 ? uri : `${imageDomain.slice(0, imageDomain.lastIndexOf('/api'))}/${uri}` : ''
}

//************************************//
export const _getRestrictions = (rules) => {
  return {
    // maxFileSize: rules.max_size ?? null,
    // minFileSize: null,
    // maxTotalFileSize: rules.max_size ?? null,
    // maxNumberOfFiles: 1,
    // minNumberOfFiles: 1,
    maxFileSize: null,
    minFileSize: null,
    maxTotalFileSize: null,
    maxNumberOfFiles: 20,
    minNumberOfFiles: 1,
    allowedFileTypes: rules.type && rules.type.length > 0 ? _.map(rules.type, x => `.${x}`) : []
  }
}

//************************************//
export const _getActiveTab = (defaultTab, tabsArr) => {
  const url = window.location.href
  const hash = url.slice(url.indexOf('#'))
  if (hash && hash.length > 1 && tabsArr.indexOf(hash.replace('#', '')) > -1) {
    return hash.replace('#', '')
  }
  return defaultTab
}


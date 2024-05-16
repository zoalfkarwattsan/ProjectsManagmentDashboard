import {API, phpToMomentFormat} from '@utils'
//************************************//
export const _getAppSettings = (callback) => {
    return (dispatch) => {
        API.get('setting/all')
            .then(function ({data}) {
              // data.app.date_format = phpToMomentFormat(data.app.date_format)
              // data.app.time_format = phpToMomentFormat(data.app.time_format)
              // data.app.datetime_format = phpToMomentFormat(data.app.datetime_format)
              dispatch({type: "APP_SETTINGS", data})
              callback()
            })
            .catch(function (res) {

            })
    }
}
//************************************//
export const _getList = ({limit, page, start, length, order, filter, columns, uri}, callback) => {
  API.get(uri, {
    params: {
      start,
      length,
      limit,
      page,
      order,
      filter,
      columns
    }
  })
    .then(function ({data}) {
      callback(data)
    })
    .catch(function (res) {})
}

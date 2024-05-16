import _, {map} from 'lodash'
// ** Imports createContext function
import { createContext } from 'react'
import * as yup from "yup"
import moment from "moment"
import {phpToMomentFormat} from "../Utils"
import {useSelector} from "react-redux"

// ** Create Context
const GlobalDefinitionsContext = createContext()


const GlobalDefinitionsProviderWrapper = ({ children }) => {
  const dateFormat = useSelector(state => _.get(state, 'app.settings.app.date_format'))

  yup.addMethod(yup.string, 'dateFormat', function () {
    return this.transform(function (value, originalValue) {
      return moment(value).format(phpToMomentFormat(dateFormat))
      // return isMoment(value) ? moment(value).format(format) : originalValue
    })
  })

  yup.addMethod(yup.string, 'select', function () {
    return this.transform(function (value, originalValue) {
      if (value.value) return value.value
    })
  })

  yup.addMethod(yup.string, 'isSelectValid', function () {
    return this.test(function (value, originalValue) {
      const { path, createError } = this
      console.log(value)
      if (!value) {
        return createError({path, message: "Gender Is Required"})
      } else {
        return true
      }
    })
  })

  return (
    <GlobalDefinitionsContext.Provider value={{}}>
    {children}
  </GlobalDefinitionsContext.Provider>
  )
}

export { GlobalDefinitionsProviderWrapper }

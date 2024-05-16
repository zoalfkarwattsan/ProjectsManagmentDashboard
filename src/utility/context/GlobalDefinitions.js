import _, {map} from 'lodash'
// ** Imports createContext function
import { createContext } from 'react'
import * as yup from "yup"
import moment from "moment"
import {phpToMomentFormat} from '@utils'
import {useSelector} from "react-redux"

// ** Create Context
const GlobalDefinitionsContext = createContext()


const GlobalDefinitionsProviderWrapper = ({ children }) => {
  return (
    <GlobalDefinitionsContext.Provider value={{}}>
    {children}
  </GlobalDefinitionsContext.Provider>
  )
}

export { GlobalDefinitionsProviderWrapper }

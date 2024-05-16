// ** React Imports
import {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import {Settings, Power, Globe} from 'react-feather'
import _ from "lodash"
import ReactCountryFlag from "react-country-flag"

// ** Default Avatar Image
import {FormattedMessage} from "react-intl"
import {IntlContext} from "@src/utility/context/Internationalization"
import {languages} from "@src/assets/data/constants"

const IntlDropdown = (props) => {
  // ** Store Vars
  const dispatch = useDispatch()

  const user = useSelector(store => _.get(store, `${process.env.REACT_APP_AUTH_MODULE}.userData`))

  //** Vars
    const {locale, switchLanguage} = useContext(IntlContext)
    const langs = useSelector(state => state.app.settings.app.langs)

  return (
      <UncontrolledDropdown tag='li' className='dropdown-language nav-item'>
          <DropdownToggle tag='a' className='nav-link'>
        <div className='user-nav d-sm-flex'>
          <span className='user-name font-weight-bold'>
              <ReactCountryFlag
                  className='country-flag flag-icon'
                  countryCode={languages[locale].flag}
                  svg
              />
          </span>
        </div>
      </DropdownToggle>
          <DropdownMenu className='mt-0' right>
          {_.map(langs, (a, index) => (languages[a] ? <DropdownItem key={index} tag='a' disabled={a === locale} onClick={() => switchLanguage(a) }>
                <ReactCountryFlag className='country-flag' countryCode={languages[a].flag} svg />
                <span className='ml-1'>{languages[a].name}</span>
              </DropdownItem> : null)
          )}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default IntlDropdown

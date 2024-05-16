// ** React Imports
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { _logout } from '@modules/user/'

// ** Third Party Components
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'
import { Settings, Power } from 'react-feather'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/portrait/small/avatar-s-11.jpg'
import {FormattedMessage} from "react-intl"

const UserDropdown = () => {
  // ** Store Vars
  const dispatch = useDispatch()

  const user = useSelector(state => state.user.userData)

  //** Vars
  const userAvatar = (user && user.avatar) || defaultAvatar

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name font-weight-bold'>{user.first_name}</span>
          <span className='user-status'>{(user && user.role) || ''}</span>
        </div>
        <Avatar imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu right>
        {/*<DropdownItem tag={Link} to='/user/account-settings'>*/}
        {/*  <Settings size={14} className='mr-75' />*/}
        {/*  <span className='align-middle'>*/}
        {/*      <FormattedMessage*/}
        {/*      id={`gen.actions.settings`} />*/}
        {/*  </span>*/}
        {/*</DropdownItem>*/}
        {
        <DropdownItem tag={Link} to='/' onClick={() => dispatch(_logout())}>
          <Power size={14} className='mr-75' />
          <span className='align-middle'>
              <FormattedMessage
                  id={`gen.actions.logout`} /></span>
        </DropdownItem>
        }
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown

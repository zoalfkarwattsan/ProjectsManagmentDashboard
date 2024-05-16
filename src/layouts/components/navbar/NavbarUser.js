// ** Dropdowns Imports
import React, {Fragment, useContext, useEffect, useState} from 'react'

import UserDropdown from './UserDropdown'

// ** Third Party Components
import {Sun, Moon, Menu, StopCircle} from 'react-feather'
import { NavItem, NavLink } from 'reactstrap'

import IntlDropdown from "./IntlDropdown"
import themeConfig from "@src/configs/themeConfig"

const NavbarUser = props => {
    // ** Props
    const { skin, setSkin, setMenuVisibility, setIsRtl, isRtl, windowWidth, setMenuCollapsed, menuCollapsed } = props

    return (
        <Fragment>
            <ul className='navbar-nav  d-flex align-items-center'>
                {windowWidth < 1200 ? <NavItem className='mobile-menu mr-auto'>
                    <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => setMenuVisibility(true)}>
                        <Menu className='ficon' />
                    </NavLink>
                </NavItem> : <NavItem className='mobile-menu mr-auto'>
                    <NavLink className='nav-menu-main menu-toggle hidden-xs is-active' onClick={() => setMenuCollapsed(!menuCollapsed)}>
                        <Menu className='ficon' />
                    </NavLink>
                </NavItem>}
            </ul>
            <div className='bookmark-wrapper d-flex align-items-center'>
                <NavItem className='d-none d-lg-block'>
                    <NavLink className='nav-link-style'>
                      {_.size(themeConfig.layout.skinOptions) > 1 && React.cloneElement(_.get(themeConfig.layout.skinOptions, skin).icon, {
                        onClick: () =>  setSkin(_.get(themeConfig.layout.skinOptions, skin).nextSkin)
                      })}
                    </NavLink>
                </NavItem>
            </div>
            <ul className='nav navbar-nav align-items-center ml-auto'>
                <IntlDropdown />
                <UserDropdown />
            </ul>
        </Fragment>
    )
}
export default NavbarUser

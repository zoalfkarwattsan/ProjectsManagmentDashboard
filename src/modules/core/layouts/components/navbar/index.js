// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import NavbarUser from './NavbarUser'

const ThemeNavbar = props => {
    return (
        <Fragment>
            <NavbarUser {...props} />
        </Fragment>
    )
}

export default ThemeNavbar

import { useState } from 'react'
import { AlignJustify, Rss, Info, Image, Users, Edit } from 'react-feather'
import { Card, CardImg, Collapse, Navbar, Nav, NavItem, NavLink, Button } from 'reactstrap'

import {_url} from '@utils'
import {FallBackImage} from '@src/components'

import ElectionTabs from "./ElectionTabs"

const ElectionHeader = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Navbar className='justify-content-end justify-content-md-between w-100' expand='md'>
      <Button color='' className='btn-icon navbar-toggler justify-content-center align-items-center' onClick={toggle}>
        <AlignJustify size={21} />
      </Button>
      <Collapse isOpen={isOpen} navbar>
        <ElectionTabs />
      </Collapse>
    </Navbar>
  )
}

export default ElectionHeader

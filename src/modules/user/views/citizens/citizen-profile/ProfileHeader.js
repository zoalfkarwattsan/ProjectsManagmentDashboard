import { useState } from 'react'
import { AlignJustify, Rss, Info, Image, Users, Edit } from 'react-feather'
import { Card, CardImg, Collapse, Navbar, Nav, NavItem, NavLink, Button } from 'reactstrap'

import {FallBackImage} from '@src/components'

import Tabs from "./Tabs"

const ProfileHeader = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <Card className='profile-header mb-2'>
      <CardImg src={require('../../../assets/images/citizens_banner.jpg').default} alt='User Profile Image' top />
      <div className='position-relative'>
        <div className='profile-img-container d-flex align-items-center'>
          <div className='profile-img'>
            <FallBackImage className='rounded img-fluid' src={''} alt='Profile image' />
          </div>
          <div className='profile-title ml-3'>
            <h2 className='text-default'>{data.fname} {data.mname} {data.lname}</h2>
          </div>
        </div>
      </div>
      <div className='profile-header-nav'>
        <Navbar className='justify-content-end justify-content-md-between w-100' expand='md' light>
          <Button color='' className='btn-icon navbar-toggler' onClick={toggle}>
            <AlignJustify size={21} />
          </Button>
          <Collapse isOpen={isOpen} navbar>
            <Tabs />
          </Collapse>
        </Navbar>
      </div>
    </Card>
  )
}

export default ProfileHeader

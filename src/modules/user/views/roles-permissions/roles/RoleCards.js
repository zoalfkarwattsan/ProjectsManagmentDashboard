// ** React Imports
import {Fragment, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Table,
  Modal,
  Button,
  CardBody,
  ModalBody,
  ModalHeader,
  FormFeedback,
  UncontrolledTooltip, CustomInput
} from 'reactstrap'

// ** Third Party Components
import { Copy, Info } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import _ from "lodash"

// ** Custom Components
import AvatarGroup from '@components/avatar-group'
import illustration from '@src/assets/images/illustration/faq-illustrations.svg'
import {_url, trans} from '@utils'

// ** FAQ Illustrations
import BasicInfoModal from "./BasicInfoModal"
import {_getPermissions, _getRoles} from "../../../redux/actions"
import CanCall from "../../../components/CanCall"


const RoleCards = () => {
  // ** States
  const [basicInfoModal, setBasicInfoModal] = useState({show:false, data:{}})
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])

  const _closeBasicInfoModal = () => {
    setBasicInfoModal({show:false, data:{}})
  }

  const getRoles = () => _getRoles(
    (data) => {
      setRoles(data.roles)
    },
    () => {}
  )

  const getPermissions = () => _getPermissions(
    (data) => {
      setPermissions(data.permissions)
    },
    () => {}
  )

  useEffect(() => {
    getRoles()
    getPermissions()
  }, [])

  return (
    <Fragment>
      <Row>
        {roles?.map((item, index) => {
          return (
            <Col key={index} xl={4} md={6}>
              <Card>
                <CardBody>
                  <div className='d-flex justify-content-between'>
                    <span>{`${_.size(item.admins)} `}{trans('user.users')}</span>
                    <AvatarGroup data={item.admins?.map(x => { return {size:'sm', title:x.name, img:_url('storage/avatar.png')} })} />
                  </div>
                  <div className='d-flex justify-content-between align-items-end mt-1 pt-25'>
                    <div className='role-heading'>
                      <h4 className='fw-bolder'>{item.name.replace("_", " ")}</h4>
                      <CanCall action='ROLES_EDIT_ROLE'>
                        <Link
                          to='/'
                          className='role-edit-modal'
                          onClick={e => {
                            e.preventDefault()
                            setBasicInfoModal({show:true, data:item})
                          }}
                        >
                          <small className='fw-bolder'>{trans('user.actions.editRole')}</small>
                        </Link>
                      </CanCall>
                    </div>
                    {/*<Link to='' className='text-body' onClick={e => e.preventDefault()}>*/}
                    {/*  <Copy className='font-medium-5' />*/}
                    {/*</Link>*/}
                  </div>
                </CardBody>
              </Card>
            </Col>
          )
        })}
        <CanCall action='ROLES_ADD_ROLE'>
          <Col xl={4} md={6}>
            <Card>
              <Row>
                <Col sm={5}>
                  <div className='d-flex align-items-end justify-content-center h-100'>
                    <img className='img-fluid mt-2' src={illustration} alt='Image' width={85} />
                  </div>
                </Col>
                <Col sm={7}>
                  <CardBody className='text-sm-end text-center ps-sm-0'>
                    <Button
                      color='primary'
                      className='text-nowrap mb-1'
                      onClick={() => {
                        setBasicInfoModal({show: true, data:{}})
                      }}
                    >
                      {trans('user.actions.addRole')}
                    </Button>
                    {/*<p className='mb-0'>Add a new role, if it does not exist</p>*/}
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </Col>
        </CanCall>
      </Row>
      {basicInfoModal.show && <BasicInfoModal permissions={permissions} successCallback={getRoles} data={basicInfoModal.data} onClose={_closeBasicInfoModal}/>}
    </Fragment>
  )
}

export default RoleCards

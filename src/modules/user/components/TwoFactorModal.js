import React, {Component} from "react"
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, FormGroup, Input } from 'reactstrap'

import {trans} from '@utils'
import {ButtonSpinner} from '@src/components'
import {_loginTwoFactor} from "../redux/actions"

class TwoFactorModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: props.email,
      code: '',
      method: props.data.sent_to_method,
      expired: props.data.expired_after,
      id: props.data.id,
      to: props.data.sent_to_method,
      open: true
    }
  }

  _close = () => {
    this.setState({open: false}, this.props.onClose)
  }

  _onSubmit = () => {
    _loginTwoFactor(
      {email: this.state.email, code: this.state.code},
      (res) => {
        this.props.successCallback(res)
      },
      () => {
      }
    )
  }

  render () {
    return (
      <Modal isOpen={this.state.open} toggle={this._close} unmountOnClose={true} className='modal-dialog-centered'>
        <ModalHeader toggle={this._close}>Two Factor Authentication</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='email'>Your verification code</Label>
            <Input
              type='text'
              placeholder='6-digit code'
              onChange={e => this.setState({code: e.target.value})}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter className='justify-content-center'>
          <Button.Ripple type='button'  color='primary' block disabled={(this.props.loading || this.state.code.length < 6)} onClick={this._onSubmit}>
            { this.props.loading ? <ButtonSpinner/> : null}
            <span>{trans('gen.actions.send')}</span>
          </Button.Ripple>

        </ModalFooter>
      </Modal>
    )
  }
}

//************************************//
const mapStateToProps = store => ({
  loading: store.app.loading
})

export default connect(mapStateToProps)(TwoFactorModal)


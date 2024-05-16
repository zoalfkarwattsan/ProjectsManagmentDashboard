import React from "react"
import {Can } from '@src/utility/context/Can'

const CanCall = (props) => {
  return (
    <Can I='call' a={props.action}>
      {props.children}
    </Can>
  )
}

export default CanCall
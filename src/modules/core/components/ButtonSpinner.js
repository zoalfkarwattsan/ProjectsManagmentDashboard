import React from "react"
import {Spinner} from "reactstrap"

export const ButtonSpinner = (props) => {
    return (
        <Spinner className='position-absolute' style={{left: 10}} color='white' size='sm' type='grow' />
    )
}
// Keep in mind that these are the styles from flatpickr package
// See troubleshooting section in case you have problems importing the styles

// import "flatpickr/dist/themes/material_green.css"

import React, {useState} from "react"
import {string} from "prop-types"
import {useSelector} from "react-redux"
import Cleave from "cleave.js/react"

const DatePicker = (props) => {
    const {handleChange, birthDate} = props
    const dateFormat = useSelector(state => state.app.settings.app.date_format)
    const options = { date: true, delimiter: '-', datePattern: dateFormat.split('-') }

    return (
        <Cleave className='form-control' placeholder='1980-01-01' options={options} id='date' value={birthDate} onChange={handleChange} />
    )
}
DatePicker.prototype = {
    defaultBirthDate : string,
    name : string
}
export default DatePicker

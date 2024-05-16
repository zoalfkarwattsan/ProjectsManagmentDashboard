//** React Imports
import React from 'react'

// ** Store & Actions
import {useIntl} from "react-intl"

export const useTrans = (id) => {
  return useIntl().formatMessage({ id })
}

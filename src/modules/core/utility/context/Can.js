import {map} from 'lodash'
// ** Imports createContext function
import { createContext } from 'react'

// ** Imports createContextualCan function
import { createContextualCan } from '@casl/react'

// ** Create Context
export const AbilityContext = createContext()

// ** Init Can Context
export const Can = createContextualCan(AbilityContext.Consumer)

export const _hasAnyAbility = (ability, actions = []) => {
  let has = false
  map(actions, (v, k) => {
    if (ability.can('call', v)) {
      has = true
      return false
    }
  })
  return has

}
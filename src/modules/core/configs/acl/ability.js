import { Ability } from '@casl/ability'
import { initialAbility } from './initialAbility'
const {getUserData} = require(`@modules/${process.env.REACT_APP_AUTH_MODULE}`)
//  Read ability from localStorage
// * Handles auto fetching previous abilities if already logged in user
// ? You can update this if you store user abilities to more secure place
// ! Anyone can update localStorage so be careful and please update this
const userData = getUserData()
const existingAbility = userData ? userData.abilities : null

export default new Ability(existingAbility || initialAbility)

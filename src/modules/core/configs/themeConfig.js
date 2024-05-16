// You can customize the template with the help of this file
import localConfigs from '@fwsrc/configs/themeConfigs'
import {Sun, Moon, Cloud} from 'react-feather'
import _ from "lodash"

//Template config options
const basicConfigs = {
  app: {
    appName: 'FrameWork',
    appLogoImage: require('@src/assets/images/logo/logo.png').default,
    images:{
      login:  require(`@modules/user/assets/images/login.svg`).default,
      loginDark:  require(`@modules/user/assets/images/login-dark.svg`).default,
      register:  require(`@modules/user/assets/images/register.svg`).default,
      registerDark:  require(`@modules/user/assets/images/register-dark.svg`).default,
      forgetPassword:  require(`@modules/user/assets/images/forgot-password.svg`).default,
      forgetPasswordDark:  require(`@modules/user/assets/images/forgot-password-dark.svg`).default
    },
    footerUrl:'#'
  },
  layout: {
    isRTL: false,
    skin: 'semi-dark', // light, dark, bordered, semi-dark
    skinOptions:{
      light:{nextSkin:'semi-dark', icon: <Sun className='ficon' />},
      "semi-dark":{nextSkin:'dark', icon: <Cloud className='ficon' />},
      dark:{nextSkin:'light', icon: <Moon className='ficon' />}
    },
    routerTransition: 'fadeIn', // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: 'vertical', // vertical, horizontal
    contentWidth: 'full', // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'floating', // static , sticky , floating, hidden
      backgroundColor: 'white' // BS color options [primary, success, etc]
    },
    footer: {
      type: 'sticky' // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true // Enable scroll to top button
  }
}

// const themeConfig = _.merge(basicConfigs, localConfigs)
const themeConfig = {...basicConfigs, ...localConfigs}

export default themeConfig

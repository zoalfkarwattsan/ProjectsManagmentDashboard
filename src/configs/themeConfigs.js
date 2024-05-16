import {Cloud, Moon, Sun} from "react-feather"

const localConfigs = {
	app: {
		appName: 'Projects managment',
		menuAppName: 'AUP',
		appLogoImage: require('@modules/user/assets/images/colored-logo.png').default,
		menuLogoImageDark: require('@modules/user/assets/images/colored-logo.png').default,
		menuLogoImageLight: require('@modules/user/assets/images/colored-logo.png').default,
		images:{
			login:  require(`@modules/user/assets/images/login.png`).default,
			loginDark:  require(`@modules/user/assets/images/login.png`).default,
			register:  require(`@modules/user/assets/images/register.svg`).default,
			registerDark:  require(`@modules/user/assets/images/register-dark.svg`).default,
			forgetPassword:  require(`@modules/user/assets/images/forgot-password.svg`).default,
			forgetPasswordDark:  require(`@modules/user/assets/images/forgot-password-dark.svg`).default
		},
		footerUrl:'#'
	},
	layout: {
		isRTL: false,
		skin: 'light', // light, dark, bordered, semi-dark
		skinOptions:{
			light:{nextSkin:'semi-dark', icon: <Sun className='ficon' />}
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
export default localConfigs

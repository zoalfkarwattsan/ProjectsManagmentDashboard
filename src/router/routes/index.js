import { lazy } from 'react'
import PluggedInModules from "../../configs/PluggedInModules"
import _ from "lodash"

// ** Document title
const TemplateTitle = '%s - FrameWork'

// ** Default Route
const DefaultRoute = '/dashboard'

// ** Login Route
const LoginRoute = '/login'

// ** Merge Routes
let FinalRoutes = []

// ** Merge Routes
_.forEach(PluggedInModules, (module, _i) => {
	if (module.path.Routes && module.enabled) {
		console.log(module.path.Routes)
		FinalRoutes = [...FinalRoutes, ...module.path.Routes]
	}
})

console.log(FinalRoutes)

export { DefaultRoute, TemplateTitle, FinalRoutes as Routes, LoginRoute }

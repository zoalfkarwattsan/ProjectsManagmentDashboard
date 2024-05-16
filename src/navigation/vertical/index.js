import PluggedInModules from "../../configs/PluggedInModules"
import _ from "lodash"

let FinalNavigation = []

// ** Merge Navigations
_.forEach(PluggedInModules, (module, _i) => {
	if (module.path.Navigation && module.enabled) {
		FinalNavigation = [...FinalNavigation, ...module.path.Navigation]
	}
})

export default FinalNavigation

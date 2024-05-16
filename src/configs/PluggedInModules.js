const PluggedInModules = {}

try {
    PluggedInModules['user'] = {path: require('@devModules/user'), enabled: true} // special user Module ()
    console.log(PluggedInModules['user'])
} catch (e) {
    console.error('no User Module', e)
}

export default PluggedInModules

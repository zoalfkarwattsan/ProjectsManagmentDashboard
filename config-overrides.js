const SassRuleRewire = require('react-app-rewire-sass-rule')
const path = require('path')
const rewireAliases = require('react-app-rewire-aliases')
const fs = require("fs")
const rewireBabelLoader = require("react-app-rewire-babel-loader")

module.exports = function override(config, env) {
  require('react-app-rewire-postcss')(config, {
    plugins: loader => [require('postcss-rtl')()]
  })
  const appDirectory = fs.realpathSync(process.cwd())
  const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
  config = rewireBabelLoader.include(
    config,
    resolveApp("node_modules/@cloudypro/modules/core"),
    resolveApp("node_modules/@cloudypro/modules/user")
  )

  config = rewireAliases.aliasesOptions({
    '@node_modules': path.resolve(__dirname, 'node_modules'),
    '@src': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}/core`),
    '@assets': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}/core/@core/assets`),
    '@components': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}/core/@core/components`),
    '@layouts': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}/core/@core/layouts`),
    '@styles': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}/core/@core/scss`),
    '@hooks': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}/core/utility/hooks`),
    '@configs': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}/core/configs`),
    '@utils': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}/core/utility/Utils`),
    '@store': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}/core/redux`),
    '@modules': path.resolve(__dirname, `${process.env.REACT_APP_MODULES}`),
    '@devModules': path.resolve(__dirname, `${process.env.REACT_APP_DEV_MODULES}`),
    '@fwsrc': path.resolve(__dirname, 'src')
  })(config, env)

  config = new SassRuleRewire()
    .withRuleOptions({
      test: /\.s[ac]ss$/i,
      use: [
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              includePaths: ['node_modules', 'src/assets']
            }
          }
        }
      ]
    })
    .rewire(config, env)
  return config
}

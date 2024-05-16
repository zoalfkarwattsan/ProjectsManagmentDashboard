// ** Logo
import themeConfig from '@configs/themeConfig'

const SpinnerComponent = () => {
  return (
    <div className='fallback-spinner vw-100 vh-100 d-flex justify-content-center align-items-center'>
      <img style={{maxWidth:300, maxHeight:300}} src={themeConfig.app.appLogoImage} alt='logo' />
      <div className='loading'>
        <div className='effect-1 effects'></div>
        <div className='effect-2 effects'></div>
        <div className='effect-3 effects'></div>
      </div>
    </div>
  )
}

export default SpinnerComponent

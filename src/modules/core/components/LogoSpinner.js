import React, { Component } from "react"
import {Progress} from "reactstrap"
import themeConfig from '@configs/themeConfig'
import {trans} from '@utils'
class LogoSpinner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0
        }
        this.interval = null
    }
    componentDidMount() {
        this.interval = setInterval(() => {
            const p = this.state.progress + 30
            if (p <= 90) {
                this.setState({progress: p})
            }
        }, 500)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return (
            <div className='d-flex flex-column justify-content-center align-items-center vh-100 w'>
                {/*<div>*/}
                    <img style={{maxWidth:300, maxHeight:300}} className='mb-4' src={themeConfig.app.appLogoImage}  alt={'asd'}/>
                {/*</div>*/}
                <Progress className='w-25' value={this.state.progress}/>
                <h3 className='my-3'>{trans('gen.loadingApp', {app: themeConfig.app.appName})}</h3>
            </div>
        )
    }
}

export default LogoSpinner

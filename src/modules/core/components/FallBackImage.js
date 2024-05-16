import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class FallBackImage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			src: props.src,
			errored: false,
			additionalProps:{}
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.src !== this.props.src) {
			this.setState({
				src: this.props.src,
				errored: false,
				additionalProps:{}
			})
		}
	}

	onError = () => {
		if (!this.state.errored) {
			this.setState({
				src: this.props.fallbackSrc ?? require('../assets/images/no-image.jpg').default,
				errored: true,
				additionalProps:{width:'100%', height:'100%'}
			})
		}
	}

	render() {
		const { src } = this.state
		const {
			src: _1,
			fallbackSrc: _2,
			...props
		} = this.props

		return (
			<img
				src={src}
				onError={this.onError}
				{...props}
				style={{...props.style, ...this.state.additionalProps}}
			/>
		)
	}
}

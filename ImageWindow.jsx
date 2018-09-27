import React, { Component } from 'react';

export default class ImageWindow extends Component {
	render() {
		const style = {
			backgroundImage: `url(${this.props.backgroundImage})`,
			height: 150,
			width: 150,
			backgroundPosition: 'cover'
		}

		return (
			<div style={style} />
		)
	}
}
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Footer extends Component {
	renderFilter(filter, name) {
		if (filter === this.props.filter) {
			return name;
		}

		return (
			<a href='' onClick={e => {
				e.preventDefault();
				this.props.onFilterChange(filter);
			}}>
				{name}
			</a>
		);
	};

	render() {
		return (
			<p>
				显示:
				{' '}
				{this.renderFilter('SHOW_ALL', '所有的')}
				{', '}
				{this.renderFilter('SHOW_COMPLETED', '已完成')}
				{', '}
				{this.renderFilter('SHOW_ACTIVE', '进行中')}
				.
			</p>
		);
	};
}

Footer.propTypes = {
	onFilterChange: PropTypes.func.isRequired,
	filter: PropTypes.oneOf([
		'SHOW_ALL',
		'SHOW_COMPLETED',
		'SHOW_ACTIVE'
	]).isRequired
};
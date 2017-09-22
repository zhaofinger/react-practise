import React from 'react';

require('normalize.css/normalize.css');
require('styles/Gallery.scss');


// 获取图片数据
const imageDatas = require('../data/image-data.json');
// 补全图片路径
imageDatas.map(item => {
	item.imageUrl = require('../images/' + item.fileName);
	return item;
});

class ImgFigure extends React.Component {
	static propTypes = {
		data: React.PropTypes.object.isRequired
	};
	render() {
		return (
			<figure className='img-figure'>
				<img src={this.props.data.imageUrl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className='img-title'>{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}

class GalleryComponent extends React.Component {
	render() {
		let controllerUtils = [];
		let imgFigures = [];

		imageDatas.forEach((item, index) => {
			imgFigures.push(<ImgFigure key={index} data={item} />);
		});

		return (
			<section className='stage'>
				<section className='image-sec'>
					{imgFigures}
				</section>
				<nav className='controller-nav'>1</nav>
			</section>
		);
	}
}

GalleryComponent.defaultProps = {
};

export default GalleryComponent;

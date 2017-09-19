import React from 'react';

require('normalize.css/normalize.css');
require('styles/Gallery.scss');


// 获取图片数据
const imageDatas = require('../data/image-data.json');
console.log(imageDatas);
imageDatas.map(item => {
	item.imageUrl = require('../images/' + item.fileName);
	return item;
});

class GalleryComponent extends React.Component {
	render() {
		return (
			<section className='stage'>
				<section className='image-sec'>1</section>
				<nav className='controller-nav'>1</nav>
			</section>
		);
	}
}

GalleryComponent.defaultProps = {
};

export default GalleryComponent;

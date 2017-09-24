import React from 'react';
import ReactDOM from 'react-dom';
import imageDatas from '../data/image-data.json';
import 'normalize.css/normalize.css';
import 'styles/Gallery.scss';

// 补全图片路径
imageDatas.map(item => {
	item.imageUrl = require('../images/' + item.fileName);
	return item;
});

/*
* 获取区间内的一个随机值
*/
const getRangeRandom = function(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
};

/*
* 获取 0~30° 之间的一个任意正负值
*/
const get30DegRandom = function() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
};

class ImgFigure extends React.Component {
	static propTypes = {
		data: React.PropTypes.object.isRequired,
		arrange: React.PropTypes.object.isRequired,
		center: React.PropTypes.func.isRequired
	};
	/**
	 * 获取图片的样式，包括
	 * 1. 设置position
	 * 2. 设置旋转角度transform:rotate
	 * 3. 设置z-index
	 */
	getImgeStyle() {
		let styleObj = {};

		/* 如果props属性中指定了这张图片的位置,则使用 */
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		/* 添加图片旋转角度样式 */
		if (this.props.arrange.rotate) {
			let prefixArr = ['MozTransform', 'MsTransform', 'WebkitTransform', 'transform'];
			prefixArr.forEach(value => {
				styleObj[value] = `rotate(${this.props.arrange.rotate}deg)`;
			});
		}

		/* 设置中心图片的z-index,保证中心图片始终在最上层 */
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}
		return styleObj;
	}

	render() {
		let styleObj = this.getImgeStyle();
		return (
			<figure className='img-figure' style={styleObj}>
				<img src={this.props.data.imageUrl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className='img-title'>{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
}

class GalleryComponent extends React.Component {
	constructor(props) {
		super(props);
		this.Constant = {
			centerPos: {	// 中心图片位置
				left: 0,
				top: 0
			},
			leftSection: {	// 左扇区，x和y临界值
				x: [0, 0],
				y: [0, 0]
			},
			rightSection: {	// 右扇区，x和y临界值
				x: [0, 0],
				y: [0, 0]
			},
			topSection: {	// 上扇区，x和y临界值
				x: [0, 0],
				y: [0, 0]
			}
		};
		this.state = {
			imgsArrangeArr: [
				// {
				// 	pos: {
				// 		left: 0,
				// 		top: 0
				// 	}
				// }
			]
		};
	}

	componentWillMount() {
		imageDatas.forEach((item, index) => {
			if (!this.state.imgsArrangeArr[index]) {
				let arr = this.state.imgsArrangeArr;
				arr[index] = {
					pos: {
						left: 0,
						right: 0
					}
				};
				this.setState({
					imgsArrangeArr: arr
				});
			}
		});
	}

	// 组件加载后计算图片位置
	componentDidMount() {
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
		let stageW = stageDOM.scrollWidth;
		let stageH = stageDOM.scrollHeight;
		let halfStageW = Math.ceil(stageW / 2);
		let halfStageH = Math.ceil(stageH / 2);

		// imgFigure size
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
		let imgW = imgFigureDOM.scrollWidth;
		let imgH = imgFigureDOM.scrollHeight;
		let halfImgW = Math.ceil(imgW / 2);
		let halfImgH = Math.ceil(imgH / 2);

		// 计算图片中心位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};

		/** 计算左扇区，x和y的临界值 */
		this.Constant.leftSection.x[0] = -halfImgW;                         // 左扇区最左值，这里设定最多超多舞台左边界图片宽度的一半
		this.Constant.leftSection.x[1] = halfStageW - halfImgW * 3;         // 左扇区最右值，注意这里绝对定位的left是指图片左边距离屏幕左边界的距离，所以这里是1.5倍图片宽度，临界情况是图片右边紧贴中心图片最左边
		this.Constant.leftSection.y[0] = -halfImgH;                         // 左扇区的最上，这里设定最多超多舞台上边界图片高度的一半
		this.Constant.leftSection.y[1] = stageH - halfImgH;                 // 左扇区的最下，这里设定高于舞台下边界图片高度的一半
		/** 计算右扇区，x和y的临界值*/
		this.Constant.rightSection.x[0] = halfStageW + halfImgW;            // 右扇区最左值，贴到中心图片的右边，距离中心线半个图片宽度
		this.Constant.rightSection.x[1] = stageW - halfImgW;                // 右扇区最右值，道理同左扇区最右值
		this.Constant.rightSection.y[0] = this.Constant.leftSection.y[0];  // 同左扇区最上
		this.Constant.rightSection.y[1] = this.Constant.leftSection.y[1];  // 同左扇区最下
		/** 计算上扇，x和y的临界值 */
		this.Constant.topSection.y[0] = -halfImgH;                          // 上扇区最上，同左右扇区最上
		this.Constant.topSection.y[1] = halfStageH - halfImgH * 3;          // 上扇区最下，道理同左扇区最右值
		this.Constant.topSection.x[0] = halfStageW - imgW;                  // 上扇区最左，中轴线往左一个图片宽度
		this.Constant.topSection.x[1] = halfStageW;                         // 上扇区最右，中轴线（注意left值是以左边为准）

		this.reArrange(0);
	}

	// 重新布局所有图片
	reArrange(centerIndex) {
		let { imgsArrangeArr } = this.state;
		let { centerPos, leftSection, rightSection, topSection } = this.Constant;

		/**
		 * 1. 根据传入的索引分离出居中图片
		 * 2. 设置居中图片的位置信息
		 * 3. 最后需要将分离出的居中图片插回imgsArrangeArr(保证索引和imageDatas中一一对应)
		 */
		let center = imgsArrangeArr.splice(centerIndex, 1);
		center[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		};

		/**
		 * 1. 获取需要布局上扇区的图片数量，0个或者1个，50%概率
		 * 2. 获取一个布局到上扇区图片的索引值（范围是0-14或者0-15）
		 * 3. 从imgsArrangeArr分离出该索引代表的对象，根据topImgNum是否为0, imgsArrangTopArr可能为空
		 * 4. 最后也是要插回imgsArrangeArr
		 **/
		let top = [];
		let topNum = Math.floor(Math.random() * 2); //取一个或者不取
		let topIndex = Math.floor(Math.random() * imgsArrangeArr.length);
		top = imgsArrangeArr.splice(topIndex, topNum);

		/** 设置布局位于上扇区的图片位置信息 */
		top.forEach((value, index) => {
			top[index] = {
				pos: {
					top: getRangeRandom(topSection.y[0], topSection.y[1]),
					left: getRangeRandom(topSection.x[0], topSection.x[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		});

		/** 布局左两扇区的图片 */
		for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			//前半部分布局左边,右边部分布局右边,y值左右扇区多一样，所以这里取左扇区的值
			let xRang = i < k ? leftSection.x : rightSection.x;
			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(leftSection.y[0], leftSection.y[1]),
					left: getRangeRandom(xRang[0], xRang[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		}

		/** 如果上扇区有图片，插回imgsArrangeArr */
		if (top && top[0]) {
			imgsArrangeArr.splice(topIndex, 0, top[0]);
		}
		/** 将中心图片插回imgsArrangeArr */
		imgsArrangeArr.splice(centerIndex, 0, center[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});
	}

	center(index) {
		return this.reArrange(index);
	}

	render() {
		let controllerUtils = [];
		let imgFigures = [];
		imageDatas.forEach((item, index) => {
			let commonProps = {
				key: index,
				arrange: this.state.imgsArrangeArr[index],
				// inverse: this.inverse.bind(this, index),
				center: this.center.bind(this, index)
			};
			imgFigures.push(<ImgFigure key={index} data={item} ref={'imgFigure' + index} {...commonProps}/>);
		});

		return (
			<section className='stage' ref='stage'>
				<section className='image-sec'>
					{imgFigures}
				</section>
				{/* <nav className='controller-nav'>1</nav> */}
			</section>
		);
	}
}


export default GalleryComponent;

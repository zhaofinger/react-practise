export default {
	/**
	 * 获取区间随机数
	 * @param {*} low 开始
	 * @param {*} hight 结束
	 */
	getRangeRandom(low, hight) {
		return Math.ceil(Math.random() * (hight - low) + low);
	}
};

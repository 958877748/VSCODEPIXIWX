namespace 主空间 {
	export class 事件处理器类 {
		private static 对象池: Array<事件处理器类> = []
		private static 全局编号: number = 0

		public static 创建(执行域, 处理方法, 参数, 是否执行一次) {
			(是否执行一次 === void 0) && (是否执行一次 = true)
			if (事件处理器类.对象池.length>0) {
				return 事件处理器类.对象池.pop().设置参数(执行域, 处理方法, 参数, 是否执行一次)
			}
			return new 事件处理器类(执行域, 处理方法, 参数, 是否执行一次)
		}

		public 执行域: any
		public 处理方法: Function
		public 参数: Array<any>
		public 是否执行一次: Boolean = false
		public 编号: number

		constructor(执行域 = null, 处理方法: Function = null, 参数: Array<any> = null, 是否执行一次: Boolean = false) {
			this.设置参数(执行域, 处理方法, 参数, 是否执行一次)
		}

		private 设置参数(执行域, 处理方法: Function, 参数: Array<any>, 是否执行一次: Boolean): 事件处理器类 {
			this.编号 = 事件处理器类.全局编号++
			this.执行域 = 执行域
			this.处理方法 = 处理方法
			this.参数 = 参数
			this.是否执行一次 = 是否执行一次
			return this
		}

		public 执行处理器(参数?): any {
			let 编号, 返回值
			if (参数 == null) {
				if (this.处理方法 == null) return
				编号 = this.编号
				返回值 = this.处理方法.apply(this.执行域, this.参数)
				this.编号 === 编号 && this.是否执行一次 && this.回收对象()
				return 返回值
			} else {
				if (this.处理方法 == null) return
				编号 = this.编号
				let 参数为数组 = Array.isArray(参数)
				if (!this.参数 && !参数为数组) {
					返回值 = this.处理方法.call(this.执行域, 参数)
				} else if (this.参数) {
					返回值 = this.处理方法.apply(this.执行域, this.参数.concat(参数));
				} else {
					返回值 = this.处理方法.apply(this.执行域, 参数)
				}
				this.编号 === 编号 && this.是否执行一次 && this.回收对象()
				return 返回值
			}
		}

		public 清理引用(): 事件处理器类 {
			this.执行域 = null
			this.处理方法 = null
			this.参数 = null
			return this
		}

		public 回收对象() {
			if (this.编号 > 0) {
				this.编号 = 0
				事件处理器类.对象池.push(this.清理引用())
			}
		}
	}
}
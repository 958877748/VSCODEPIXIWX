namespace 主空间 {
	export class 事件调度类 {
		private 所有事件侦听

		public 是否侦听(事件类型: string): Boolean {
			let 侦听器 = this.所有事件侦听 && this.所有事件侦听[事件类型]
			//2个叹号会将对象转为是否有这个对象
			return !!侦听器
		}

		public 派发事件(事件类型: string, 参数 = null): Boolean {
			if (!this.所有事件侦听 || !this.所有事件侦听[事件类型]) return false

			let 侦听器 = this.所有事件侦听[事件类型]
			if (!Array.isArray(侦听器)) {
				if (侦听器.once) delete this.所有事件侦听[事件类型]
				参数 != null ? 侦听器.runWith(参数) : 侦听器.run()
			} else {
				for (let i: number = 0, n: number = 侦听器.length; i < n; i++) {
					let 某侦听器 = 侦听器[i]
					if (某侦听器) 某侦听器.执行处理器(参数)
					if (!某侦听器 || 某侦听器.是否执行一次) {
						侦听器.splice(i, 1)
						i--
						n--
					}
				}
				if (侦听器.length === 0 && this.所有事件侦听) delete this.所有事件侦听[事件类型]
			}
			return true
		}

		public 侦听(事件类型: string, 执行域: any, 侦听函数: Function, 回调参数: [] = null): 事件调度类 {
			return this.创建侦听器(事件类型, 执行域, 侦听函数, 回调参数, false)
		}

		public 侦听一次(事件类型: string, 执行域: any, 侦听函数: Function, 回调参数: [] = null): 事件调度类 {
			return this.创建侦听器(事件类型, 执行域, 侦听函数, 回调参数, true)
		}

		private 创建侦听器(事件类型: string, 执行域, 侦听函数: Function, 回调参数: [], 执行一次: Boolean, 关闭之前的侦听: Boolean = true): 事件调度类 {
			关闭之前的侦听 && this.删除侦听器(事件类型)

			//使用对象池进行创建回收
			let 事件处理器 = 事件处理器类.创建(执行域 || this, 侦听函数, 回调参数, 执行一次)

			let 所有事件侦听 = this.所有事件侦听
			所有事件侦听 || (this.所有事件侦听 = {})
			
			//默认单个，每个对象只有多个侦听才用数组，节省一个数组的消耗
			let 某事件类型侦听:事件处理器类|Array<事件处理器类> = 所有事件侦听[事件类型]
			if (某事件类型侦听) {
				if (Array.isArray(某事件类型侦听)) {
					某事件类型侦听.push(事件处理器)
				} else {
					所有事件侦听[事件类型] = [所有事件侦听[事件类型], 事件处理器]
				}
			} else {
				所有事件侦听[事件类型] = 事件处理器
			}
			return this
		}

		// /**
		//  * 从 EventDispatcher 对象中删除侦听器。
		//  * @param type		事件的类型。
		//  * @param caller	事件侦听函数的执行域。
		//  * @param listener	事件侦听函数。
		//  * @param onceOnly	（可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
		//  * @return 此 EventDispatcher 对象。
		//  */
		// public 删除侦听器(事件类型: string, caller, listener: Function, onceOnly: Boolean = false): EventDispatcher {
		// 	if (!this.所有事件侦听 || !this.所有事件侦听[事件类型]) return this;

		// 	var listeners = this.所有事件侦听[事件类型];
		// 	if (listener != null) {
		// 		if (listeners.run) {
		// 			if ((!caller || listeners.caller === caller) && listeners.method === listener && (!onceOnly || listeners.once)) {
		// 				delete this.所有事件侦听[事件类型];
		// 				listeners.recover();
		// 			}
		// 		} else {
		// 			var count: number = 0;
		// 			for (var i: number = 0, n: number = listeners.length; i < n; i++) {
		// 				var item: Handler = listeners[i];
		// 				if (item && (!caller || item.caller === caller) && item.method === listener && (!onceOnly || item.once)) {
		// 					count++;
		// 					listeners[i] = null;
		// 					item.recover();
		// 				}
		// 			}
		// 			//如果全部移除，则删除索引
		// 			if (count === n) delete this.所有事件侦听[事件类型];
		// 		}
		// 	}
		// 	return this
		// }

		/**
		 * 传入事件类型,则删除改事件类型的所有侦听器,不传入事件类型,删除所有事件类型的侦听器
		 * @param 事件类型 
		 */
		public 删除侦听器(事件类型: string = null): 事件调度类 {
			let 所有事件侦听 = this.所有事件侦听
			if (!所有事件侦听) return this
			if (事件类型) {
				this.回收侦听器(所有事件侦听[事件类型])
				delete 所有事件侦听[事件类型]
			} else {
				for (const 某事件类型 in 所有事件侦听) {
					this.回收侦听器(所有事件侦听[某事件类型])
				}
				this.所有事件侦听 = null
			}
			return this
		}

		private 回收侦听器(侦听器:事件处理器类|Array<事件处理器类>) {
			// if (!侦听器) return
			if (Array.isArray(侦听器)) {
				for (let index = 0; index < 侦听器.length; index++) {
					侦听器[index].回收对象()
					侦听器[index] = null
				}
			} else {
				侦听器.回收对象()
			}
		}
	}
}
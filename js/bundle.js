var 主空间;
(function (主空间) {
    class 主应用 extends PIXI.Application {
        constructor(参数) {
            super(参数);
            this.设置 = new 主空间.设置类(参数);
            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
            主应用.单例 = this;
            this.开始运行();
        }
        开始运行() {
            this.游戏 = new 主空间.游戏(this.stage);
        }
    }
    主空间.主应用 = 主应用;
})(主空间 || (主空间 = {}));
window['主空间'] = 主空间;
var 主空间;
(function (主空间) {
    class 事件处理器类 {
        constructor(执行域 = null, 处理方法 = null, 参数 = null, 是否执行一次 = false) {
            this.是否执行一次 = false;
            this.设置参数(执行域, 处理方法, 参数, 是否执行一次);
        }
        static 创建(执行域, 处理方法, 参数, 是否执行一次) {
            (是否执行一次 === void 0) && (是否执行一次 = true);
            if (事件处理器类.对象池.length > 0) {
                return 事件处理器类.对象池.pop().设置参数(执行域, 处理方法, 参数, 是否执行一次);
            }
            return new 事件处理器类(执行域, 处理方法, 参数, 是否执行一次);
        }
        设置参数(执行域, 处理方法, 参数, 是否执行一次) {
            this.编号 = 事件处理器类.全局编号++;
            this.执行域 = 执行域;
            this.处理方法 = 处理方法;
            this.参数 = 参数;
            this.是否执行一次 = 是否执行一次;
            return this;
        }
        执行处理器(参数) {
            let 编号, 返回值;
            if (参数 == null) {
                if (this.处理方法 == null)
                    return;
                编号 = this.编号;
                返回值 = this.处理方法.apply(this.执行域, this.参数);
                this.编号 === 编号 && this.是否执行一次 && this.回收对象();
                return 返回值;
            }
            else {
                if (this.处理方法 == null)
                    return;
                编号 = this.编号;
                let 参数为数组 = Array.isArray(参数);
                if (!this.参数 && !参数为数组) {
                    返回值 = this.处理方法.call(this.执行域, 参数);
                }
                else if (this.参数) {
                    返回值 = this.处理方法.apply(this.执行域, this.参数.concat(参数));
                }
                else {
                    返回值 = this.处理方法.apply(this.执行域, 参数);
                }
                this.编号 === 编号 && this.是否执行一次 && this.回收对象();
                return 返回值;
            }
        }
        清理引用() {
            this.执行域 = null;
            this.处理方法 = null;
            this.参数 = null;
            return this;
        }
        回收对象() {
            if (this.编号 > 0) {
                this.编号 = 0;
                事件处理器类.对象池.push(this.清理引用());
            }
        }
    }
    事件处理器类.对象池 = [];
    事件处理器类.全局编号 = 0;
    主空间.事件处理器类 = 事件处理器类;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    class 事件调度类 {
        是否侦听(事件类型) {
            let 侦听器 = this.所有事件侦听 && this.所有事件侦听[事件类型];
            //2个叹号会将对象转为是否有这个对象
            return !!侦听器;
        }
        派发事件(事件类型, 参数 = null) {
            if (!this.所有事件侦听 || !this.所有事件侦听[事件类型])
                return false;
            let 侦听器 = this.所有事件侦听[事件类型];
            if (!Array.isArray(侦听器)) {
                if (侦听器.once)
                    delete this.所有事件侦听[事件类型];
                参数 != null ? 侦听器.runWith(参数) : 侦听器.run();
            }
            else {
                for (let i = 0, n = 侦听器.length; i < n; i++) {
                    let 某侦听器 = 侦听器[i];
                    if (某侦听器)
                        某侦听器.执行处理器(参数);
                    if (!某侦听器 || 某侦听器.是否执行一次) {
                        侦听器.splice(i, 1);
                        i--;
                        n--;
                    }
                }
                if (侦听器.length === 0 && this.所有事件侦听)
                    delete this.所有事件侦听[事件类型];
            }
            return true;
        }
        侦听(事件类型, 执行域, 侦听函数, 回调参数 = null) {
            return this.创建侦听器(事件类型, 执行域, 侦听函数, 回调参数, false);
        }
        侦听一次(事件类型, 执行域, 侦听函数, 回调参数 = null) {
            return this.创建侦听器(事件类型, 执行域, 侦听函数, 回调参数, true);
        }
        创建侦听器(事件类型, 执行域, 侦听函数, 回调参数, 执行一次, 关闭之前的侦听 = true) {
            关闭之前的侦听 && this.删除侦听器(事件类型);
            //使用对象池进行创建回收
            let 事件处理器 = 主空间.事件处理器类.创建(执行域 || this, 侦听函数, 回调参数, 执行一次);
            let 所有事件侦听 = this.所有事件侦听;
            所有事件侦听 || (this.所有事件侦听 = {});
            //默认单个，每个对象只有多个侦听才用数组，节省一个数组的消耗
            let 某事件类型侦听 = 所有事件侦听[事件类型];
            if (某事件类型侦听) {
                if (Array.isArray(某事件类型侦听)) {
                    某事件类型侦听.push(事件处理器);
                }
                else {
                    所有事件侦听[事件类型] = [所有事件侦听[事件类型], 事件处理器];
                }
            }
            else {
                所有事件侦听[事件类型] = 事件处理器;
            }
            return this;
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
        删除侦听器(事件类型 = null) {
            let 所有事件侦听 = this.所有事件侦听;
            if (!所有事件侦听)
                return this;
            if (事件类型) {
                this.回收侦听器(所有事件侦听[事件类型]);
                delete 所有事件侦听[事件类型];
            }
            else {
                for (const 某事件类型 in 所有事件侦听) {
                    this.回收侦听器(所有事件侦听[某事件类型]);
                }
                this.所有事件侦听 = null;
            }
            return this;
        }
        回收侦听器(侦听器) {
            // if (!侦听器) return
            if (Array.isArray(侦听器)) {
                for (let index = 0; index < 侦听器.length; index++) {
                    侦听器[index].回收对象();
                    侦听器[index] = null;
                }
            }
            else {
                侦听器.回收对象();
            }
        }
    }
    主空间.事件调度类 = 事件调度类;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    /** 文件主要分为两大类：

        代码包文件：代码包文件指的是在项目目录中添加的文件。

        本地文件：通过调用接口本地产生，或通过网络下载下来，存储到
        本地的文件。
        
        其中本地文件又分为三种：

        本地临时文件：临时产生，随时会被回收的文件。不限制存储大小。

        本地缓存文件：小程序通过接口把本地临时文件缓存后产生的文件，
        不能自定义目录和文件名。除非用户主动删除小程序，否则不会被
        删除。跟本地用户文件共计，普通小程序最多可存储 10MB，游戏
        类目的小程序最多可存储 50MB。

        本地用户文件：小程序通过接口把本地临时文件缓存后产生的文件，
        允许自定义目录和文件名。除非用户主动删除小程序，否则不会被
        删除。跟本地用户文件共计，普通小程序最多可存储 10MB，游戏
        类目的小程序最多可存储 50MB。

        -代码包文件

        由于代码包文件大小限制，代码包文件适用于放置首次加载时需要
        的文件，对于内容较大或需要动态替换的文件，不推荐用添加到代
        码包中，推荐在小游戏启动之后再用下载接口下载到本地。

        -访问代码包文件

        代码包文件的访问方式是从项目根目录开始写文件路径，不支持相
        对路径的写法。

        -修改代码包文件

        代码包内的文件无法在运行后动态修改或删除，修改代码包文件需
        要重新发布版本。

        -本地文件

        本地文件指的是小程序被用户添加到手机后，会有一块独立的文件
        存储区域，以用户维度隔离。即同一台手机，每个微信用户不能访
        问到其他登录用户的文件，同一个用户不同 appId 之间的文件也
        不能互相访问。

        -本地文件的文件路径均为以下格式：

        {{协议名}}://文件路径
        其中，协议名在 iOS/Android 客户端为 "wxfile"，在开发者工
        具上为 "http"，开发者无需关注这个差异，也不应在代码中去硬
        编码完整文件路径。

        -本地临时文件

        本地临时文件只能通过调用特定接口产生，不能直接写入内容。本
        地临时文件产生后，仅在当前生命周期内有效，重启之后即不可用。
        因此，不可把本地临时文件路径存储起来下次使用。如果需要下次
        在使用，可通过 FileSystemManager.saveFile() 或
        FileSystemManager.copyFile() 接口把本地临时文件转换成本
        地缓存文件或本地用户文件。

        -本地缓存文件

        本地缓存文件只能通过调用特定接口产生，不能直接写入内容。本
        地缓存文件产生后，重启之后仍可用。本地缓存文件只能通过
        FileSystemManager.saveFile() 接口将本地临时文件保存获得。

        -本地用户文件

        本地用户文件是从 1.7.0 版本开始新增的概念。我们提供了一个
        用户文件目录给开发者，开发者对这个目录有完全自由的读写权限。
        通过 wx.env.USER_DATA_PATH 可以获取到这个目录的路径。

        -读写权限

        接口、组件	    读	写
        代码包文件	    有	无
        本地临时文件	有	无
        本地缓存文件	有	无
        本地用户文件	有	有
     */
    class 文件管理类 {
        constructor() {
            if (文件管理类.wx文件管理器) {
                throw new Error('文件管理器已经初始化了,不必再调');
            }
            文件管理类.wx文件管理器 = wx.getFileSystemManager();
            PIXI.autoDetectRenderer;
        }
        static 判断文件或目录是否存在(路径, 作用域) {
            return new Promise((成功, 失败) => {
                let 参数 = {
                    path: 路径,
                    success: 成功.bind(作用域),
                    fail: 失败.bind(作用域)
                };
                this.wx文件管理器.access(参数);
            });
        }
        /**
         * 如果对应的上级目录已经存在，则不创建该上级目录。
         * 如 dirPath 为 a/b/c/d 且 recursive 为 true，
         * 将创建 a 目录，再在 a 目录下创建 b 目录，以此
         * 类推直至创建 a/b/c 目录下的 d 目录。
         * @param 目录路径
         * @param 作用域
         * @param 是否递归创建该目录的上级目录
         */
        static 创建目录(目录路径, 作用域, 是否递归创建该目录的上级目录 = false) {
            return new Promise((成功, 失败) => {
                let 参数 = {
                    dirPath: 目录路径,
                    recursive: 是否递归创建该目录的上级目录,
                    success: 成功.bind(作用域),
                    fail: 失败.bind(作用域)
                };
                this.wx文件管理器.mkdir(参数);
            });
        }
        static 删除目录() {
        }
        static 删除文件() {
        }
        static 复制文件() {
        }
        static 重命名文件() {
        }
        static 读取目录内文件列表() {
        }
        static 写文件() {
        }
    }
    主空间.文件管理类 = 文件管理类;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    class 游戏 {
        constructor(舞台) {
            this.主舞台 = 舞台;
            this.开始游戏();
        }
        开始游戏() {
            PIXI.loader
                .add('地图图集', 'json/dilao.json')
                .add('地图数据', 'json/untitled.json')
                .load(() => {
                let 地图图集 = PIXI.loader.resources['地图图集'].textures;
                let 地图数据 = PIXI.loader.resources['地图数据'].data;
                let 地图 = new 主空间.地图类(地图图集, 地图数据);
                this.主舞台.addChild(地图);
                地图.interactive = true;
                地图.on('touchstart', (eve) => {
                    let tx = parseInt(eve.data.global.x + '');
                    let ty = parseInt(eve.data.global.y + '');
                    let cx = tx - 地图.x;
                    let cy = ty - 地图.y;
                    地图.on('touchmove', (eve) => {
                        let x = parseInt(eve.data.global.x + '');
                        let y = parseInt(eve.data.global.y + '');
                        地图.x = x - cx;
                        地图.y = y - cy;
                        地图.移动矩形();
                    });
                    地图.once('touchend', (eve) => {
                        地图.off('touchmove');
                    });
                });
                // let sheet = PIXI.loader.resources['dilao']
                // let text = sheet.textures['tiles-9.png']
                // let sp = new PIXI.Sprite(text)
                // sp.x = 0
                // sp.y = 0
                // sp.interactive = true
                // sp.on('touchstart',()=>{
                //     let sjs = Math.random()*29 +''
                //     sp.texture = sheet.textures['tiles-'+parseInt(sjs)+'.png']
                // })
                // this.主舞台.addChild(sp)
                // let text2 = sheet.textures['tiles-1.png']
                // let sp2 = new PIXI.Sprite(text2)
                // sp2.x = 24
                // sp2.y = 0
                // sp2.interactive = true
                // sp2.on('click',()=>{
                //     let sjs = Math.random()*29 +''
                //     sp2.texture = sheet.textures['tiles-'+parseInt(sjs)+'.png']
                // })
                // this.主舞台.addChild(sp2)
            });
        }
    }
    主空间.游戏 = 游戏;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    class 网络连接类 {
        static 创建一个网络连接(开发者服务器wss接口地址, 作用域, HTTPHeader, 子协议数组) {
            return new Promise((成功, 失败) => {
                let 网络连接 = new 网络连接类();
                let 参数 = {
                    url: 开发者服务器wss接口地址,
                    success: 成功.bind(作用域, [网络连接]),
                    fail: 失败.bind(作用域)
                };
                网络连接.wx网络连接类 = window['wx'].connectSocket(参数);
            });
        }
        发送数据(数据, 作用域) {
            return new Promise((成功, 失败) => {
                let 参数 = {
                    data: 数据,
                    success: 成功.bind(作用域),
                    fail: 失败.bind(作用域)
                };
                this.wx网络连接类.send(参数);
            });
        }
        关闭连接(作用域) {
            return new Promise((成功, 失败) => {
                let 参数 = {
                    success: 成功.bind(作用域),
                    fail: 失败.bind(作用域)
                };
                this.wx网络连接类.close(参数);
            });
        }
        /**
         * @param 作用域
         * @param 事件函数(HTTP响应Header:object)
         */
        监听连接成功事件(作用域, 事件函数) {
            let 函数 = 事件函数.bind(作用域);
            this.wx网络连接类.onOpen(函数);
        }
        /**
         * @param 作用域
         * @param 事件函数 ()
         */
        监听连接关闭事件(作用域, 事件函数) {
            let 函数 = 事件函数.bind(作用域);
            this.wx网络连接类.onClose(函数);
        }
        /**
         * @param 作用域
         * @param 事件函数 (错误信息:string)
         */
        监听错误事件(作用域, 事件函数) {
            let 函数 = 事件函数.bind(作用域);
            this.wx网络连接类.onError(函数);
        }
        /**
         * @param 作用域
         * @param 事件函数 (服务器返回的消息:string|ArrayBuffer)
         */
        监听接受到服务器的消息事件(作用域, 事件函数) {
            let 函数 = 事件函数.bind(作用域);
            this.wx网络连接类.onMessage(函数);
        }
    }
    主空间.网络连接类 = 网络连接类;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    class 设置类 {
        constructor(参数) {
            this.舞台宽度 = 参数.width;
            this.舞台高度 = 参数.height;
            this.屏幕宽度 = 参数.width * 参数.resolution;
            this.屏幕高度 = 参数.height * 参数.resolution;
            this.缩放比例 = 参数.resolution;
        }
    }
    主空间.设置类 = 设置类;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    class 地图块池类 {
        constructor(纹理字典) {
            this.池 = [];
            this.纹理引用 = 纹理字典;
            let 地图块 = new 主空间.地图块类();
            this.空白纹理 = 地图块.texture;
            this.回收地图块(地图块);
        }
        获取地图块(数据) {
            let 纹理 = this.纹理引用['tiles-' + (数据 - 1) + '.png'];
            let 地图块;
            let 地图块池 = this.池;
            if (地图块池.length > 0) {
                地图块 = 地图块池.shift();
            }
            else {
                地图块 = new 主空间.地图块类();
            }
            if (纹理) {
                地图块.texture = 纹理;
            }
            return 地图块;
        }
        回收地图块(地图块) {
            地图块.texture = this.空白纹理;
            this.池.push(地图块);
        }
    }
    主空间.地图块池类 = 地图块池类;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    class 地图块类 extends PIXI.Sprite {
        constructor() {
            super();
            /**
             * 0:未使用,1:正在显示
             */
            this.显示标识 = 0;
            this.width = 24;
            this.height = 24;
        }
    }
    主空间.地图块类 = 地图块类;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    class 地图层类 extends PIXI.Container {
    }
    主空间.地图层类 = 地图层类;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    class 地图数据类 {
        constructor(地图json数据) {
            this.地图高度 = 地图json数据.height;
            this.所有地图层 = 地图json数据.layers;
            this.地图块高度 = 地图json数据.tileheight;
            this.所有地图纹理集 = 地图json数据.tilesets;
            this.地图块宽度 = 地图json数据.tilewidth;
            this.地图宽度 = 地图json数据.width;
            this.地图层数据 = this.所有地图层[0].data;
        }
        根据地图块坐标取地图块数据(坐标) {
            if (坐标.x >= this.地图宽度 || 坐标.y >= this.地图高度) {
                return -1;
            }
            if (坐标.x < 0 || 坐标.y < 0) {
                return -1;
            }
            //根据XY坐标算出数据下标
            let 下标 = 坐标.y * 30 + 坐标.x;
            //返回该下标的数据
            return this.地图层数据[下标];
        }
    }
    主空间.地图数据类 = 地图数据类;
})(主空间 || (主空间 = {}));
var 主空间;
(function (主空间) {
    class 地图类 extends PIXI.Container {
        constructor(地图图集, 地图数据) {
            super();
            this.正在显示的地图块池 = {};
            this.地图数据 = new 主空间.地图数据类(地图数据);
            this.地图块池 = new 主空间.地图块池类(地图图集);
            this.计算实际要显示的块多少();
            this.根据显示矩形显示所有地图块(this.显示矩形);
        }
        移动矩形() {
            //更新显示矩形
            this.显示矩形.x = -(this.x - this.左间隙);
            this.显示矩形.y = -(this.y - this.上间隙);
            //更新地图块
            this.根据显示矩形显示所有地图块(this.显示矩形);
        }
        根据显示矩形显示所有地图块(矩形) {
            //1.拿到矩形左上角顶点坐标
            let 左上角顶点 = { x: this.显示矩形.x, y: this.显示矩形.y };
            //2.根据左上角顶点计算需显示的地图块区域
            let 地图块区域 = this.根据左上角顶点计算地图块区域(左上角顶点);
            //3.循环所有块将显示标识设置为0
            let 所有块 = this.正在显示的地图块池;
            for (const 地图块标识 in 所有块) {
                if (所有块.hasOwnProperty(地图块标识)) {
                    const 地图块 = 所有块[地图块标识];
                    地图块.显示标识 = 0;
                }
            }
            //4.根据地图块区域显示所有地图块,并将显示标识设置为1
            for (let 下标x = 0; 下标x <= 地图块区域.width; 下标x++) {
                for (let 下标y = 0; 下标y <= 地图块区域.height; 下标y++) {
                    const 地图块 = this.根据地图块坐标显示地图块({ x: 地图块区域.x + 下标x, y: 地图块区域.y + 下标y });
                    地图块.显示标识 = 1;
                }
            }
            //5.循环所有地图块
            所有块 = this.正在显示的地图块池;
            for (const 地图块标识 in 所有块) {
                if (所有块.hasOwnProperty(地图块标识)) {
                    const 地图块 = 所有块[地图块标识];
                    //6.将标识为0的回收至池中
                    if (地图块.显示标识 == 0) {
                        delete 所有块[地图块标识];
                        this.地图块池.回收地图块(地图块);
                    }
                }
            }
        }
        根据地图块坐标显示地图块(坐标) {
            let 地图块, 地图块标识;
            //1.检查需要显示的图块显示了吗?
            地图块标识 = 坐标.x + '_' + 坐标.y;
            地图块 = this.正在显示的地图块池[地图块标识];
            if (地图块) {
                //2.如果显示了,不再处理
            }
            else {
                //3.如果没显示
                //4.取出该坐标对应的地图块数据
                let 地图块数据 = this.地图数据.根据地图块坐标取地图块数据(坐标);
                //5.很据地图块数据从池中拿出地图块对象
                地图块 = this.地图块池.获取地图块(地图块数据);
                //6.将地图块添加到地图上
                地图块.x = 坐标.x * 24;
                地图块.y = 坐标.y * 24;
                this.addChild(地图块);
                //7.将图块引用放入正在显示池中
                this.正在显示的地图块池[地图块标识] = 地图块;
            }
            return 地图块;
        }
        //计算坐标时,如果刚好在x分界线上,会被算为右边的地图块
        //计算坐标时,如果刚好在y分界线上,会被算为下边的地图块
        //计算坐标时,如果刚好在xy分界线上,会被算为右下的地图块
        //左上角顶点这样算刚好,但其他顶点就不行
        //右上角顶点,如果刚好在x分界线上,需被算为左边的地图块
        //左下角顶点,如果刚好在y分界线上,需被算为上边的地图块
        //右下角顶点,如果刚好在xy分界线上,需被算为左上的地图块
        根据左上角顶点计算地图块区域(顶点) {
            let 返回值 = new PIXI.Rectangle();
            let x除数 = 顶点.x / 24;
            let x余数 = 顶点.x % 24;
            let y除数 = 顶点.y / 24;
            let y余数 = 顶点.y % 24;
            返回值.x = x余数 == 0 ? x除数 : parseInt(x除数 + '');
            返回值.y = y余数 == 0 ? y除数 : parseInt(y除数 + '');
            返回值.width = x余数 == 0 ? 5 : 6;
            返回值.height = y余数 == 0 ? 10 : 11;
            return 返回值;
        }
        /**
         * 根据设备屏幕大小计算一次
         */
        计算实际要显示的块多少() {
            this.显示矩形 = new PIXI.Rectangle();
            let 舞台宽度 = 主空间.主应用.单例.设置.舞台宽度;
            let 舞台高度 = 主空间.主应用.单例.设置.舞台高度;
            let 图块宽度 = this.地图数据.地图块宽度;
            let 图块高度 = this.地图数据.地图块高度;
            let 水平多少图块 = parseInt(舞台宽度 / 图块宽度 + '');
            let 左右间隙 = 舞台宽度 % 图块宽度;
            let 左间隙, 右间隙;
            if ((左右间隙 % 2) == 0) {
                左间隙 = 左右间隙 / 2;
                右间隙 = 左间隙;
            }
            else {
                左间隙 = (左右间隙 - 1) / 2;
                右间隙 = 左间隙 + 1;
            }
            let 上间隙, 下间隙;
            let 垂直多少图块 = parseInt(舞台高度 / 图块高度 + '');
            let 上下间隙 = 舞台高度 % 图块高度;
            if ((上下间隙 % 2) == 0) {
                上间隙 = 上下间隙 / 2;
                下间隙 = 上间隙;
            }
            else {
                上间隙 = (上下间隙 - 1) / 2;
                下间隙 = 上间隙 + 1;
            }
            this.x = 左间隙;
            this.y = 上间隙;
            this.左间隙 = 左间隙;
            this.上间隙 = 上间隙;
            this.显示矩形.x = 0;
            this.显示矩形.y = 0;
            this.显示矩形.width = 水平多少图块 * 图块宽度;
            this.显示矩形.height = 垂直多少图块 * 图块高度;
            return 水平多少图块 * 垂直多少图块;
        }
    }
    主空间.地图类 = 地图类;
})(主空间 || (主空间 = {}));
//# sourceMappingURL=bundle.js.map
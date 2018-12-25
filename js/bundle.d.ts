declare namespace 主空间 {
    class 主应用 extends PIXI.Application {
        static 单例: 主应用;
        游戏: 游戏;
        设置: 设置类;
        constructor(参数: PIXI.ApplicationOptions);
        private 开始运行;
    }
}
declare namespace 主空间 {
    class 事件处理器类 {
        private static 对象池;
        private static 全局编号;
        static 创建(执行域: any, 处理方法: any, 参数: any, 是否执行一次: any): 事件处理器类;
        执行域: any;
        处理方法: Function;
        参数: Array<any>;
        是否执行一次: Boolean;
        编号: number;
        constructor(执行域?: any, 处理方法?: Function, 参数?: Array<any>, 是否执行一次?: Boolean);
        private 设置参数;
        执行处理器(参数?: any): any;
        清理引用(): 事件处理器类;
        回收对象(): void;
    }
}
declare namespace 主空间 {
    class 事件调度类 {
        private 所有事件侦听;
        是否侦听(事件类型: string): Boolean;
        派发事件(事件类型: string, 参数?: any): Boolean;
        侦听(事件类型: string, 执行域: any, 侦听函数: Function, 回调参数?: []): 事件调度类;
        侦听一次(事件类型: string, 执行域: any, 侦听函数: Function, 回调参数?: []): 事件调度类;
        private 创建侦听器;
        /**
         * 传入事件类型,则删除改事件类型的所有侦听器,不传入事件类型,删除所有事件类型的侦听器
         * @param 事件类型
         */
        删除侦听器(事件类型?: string): 事件调度类;
        private 回收侦听器;
    }
}
declare namespace 主空间 {
    class 地图块池类 {
        private 池;
        private 纹理引用;
        constructor(纹理字典: PIXI.loaders.TextureDictionary);
        获取地图块(数据: any): 地图块类;
        回收地图块(地图块: 地图块类): void;
    }
}
declare namespace 主空间 {
    class 地图块类 extends PIXI.Sprite {
        constructor();
    }
}
declare namespace 主空间 {
    class 地图层类 extends PIXI.Container {
    }
}
declare namespace 主空间 {
    class 地图数据类 {
        constructor(地图json数据: any);
        所有地图纹理集: any;
        所有地图层: any;
        /**
         * 单位:地图块
         */
        地图高度: any;
        /**
         * 单位:地图块
         */
        地图宽度: any;
        /**
         * 单位:像素
         */
        地图块高度: any;
        /**
         * 单位:像素
         */
        地图块宽度: any;
    }
}
declare namespace 主空间 {
    class 地图类 extends PIXI.Container {
        地图数据: 地图数据类;
        地图图集: PIXI.loaders.TextureDictionary;
        地图块池: 地图块池类;
        显示矩形: PIXI.Rectangle;
        constructor(地图图集: PIXI.loaders.TextureDictionary, 地图数据: any);
        private 根据地图块坐标显示地图块;
        private 根据地图块坐标取地图块数据;
        private 根据左上角顶点计算地图块区域;
        private 计算实际要显示的块多少;
    }
}
declare namespace 主空间 {
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
        private static wx文件管理器;
        constructor();
        static 判断文件或目录是否存在(路径: string, 作用域: any): Promise<{}>;
        /**
         * 如果对应的上级目录已经存在，则不创建该上级目录。
         * 如 dirPath 为 a/b/c/d 且 recursive 为 true，
         * 将创建 a 目录，再在 a 目录下创建 b 目录，以此
         * 类推直至创建 a/b/c 目录下的 d 目录。
         * @param 目录路径
         * @param 作用域
         * @param 是否递归创建该目录的上级目录
         */
        static 创建目录(目录路径: string, 作用域: any, 是否递归创建该目录的上级目录?: boolean): Promise<{}>;
        static 删除目录(): void;
        static 删除文件(): void;
        static 复制文件(): void;
        static 重命名文件(): void;
        static 读取目录内文件列表(): void;
        static 写文件(): void;
        在文件结尾追加内容: any;
        获取该小程序下的本地临时文件或本地缓存文件信息: any;
        获取该小程序下已保存的本地缓存文件列表: any;
        读取本地文件内容: any;
        删除该小程序下已保存的本地缓存文件: any;
        重命名文件: any;
        保存临时文件到本地: any;
        获取文件Stats对象: any;
        解压文件: any;
    }
}
declare namespace 主空间 {
    class 游戏 {
        主舞台: PIXI.Container;
        constructor(舞台: PIXI.Container);
        private 开始游戏;
    }
}
declare namespace 主空间 {
    class 网络连接类 {
        private wx网络连接类;
        static 创建一个网络连接(开发者服务器wss接口地址: string, 作用域: any, HTTPHeader?: Object, 子协议数组?: Array<string>): Promise<{}>;
        发送数据(数据: string | ArrayBuffer, 作用域: any): Promise<{}>;
        关闭连接(作用域: any): Promise<{}>;
        /**
         * @param 作用域
         * @param 事件函数(HTTP响应Header:object)
         */
        监听连接成功事件(作用域: any, 事件函数: Function): void;
        /**
         * @param 作用域
         * @param 事件函数 ()
         */
        监听连接关闭事件(作用域: any, 事件函数: Function): void;
        /**
         * @param 作用域
         * @param 事件函数 (错误信息:string)
         */
        监听错误事件(作用域: any, 事件函数: Function): void;
        /**
         * @param 作用域
         * @param 事件函数 (服务器返回的消息:string|ArrayBuffer)
         */
        监听接受到服务器的消息事件(作用域: any, 事件函数: Function): void;
    }
}
declare namespace 主空间 {
    class 设置类 {
        constructor(参数: any);
        /**
         * 物理像素数量
         */
        屏幕宽度: number;
        /**
         * 物理像素数量
         */
        屏幕高度: number;
        /**
         * 像素化下的宽
         */
        舞台宽度: number;
        /**
         * 像素化下的高
         */
        舞台高度: number;
        /**
         * 舞台宽度 X 缩放比例 = 屏幕宽度
         */
        缩放比例: number;
    }
}

namespace 主空间 {
	export class 网络连接类 {
        private wx网络连接类

        static 创建一个网络连接(开发者服务器wss接口地址:string,作用域,HTTPHeader?:Object,子协议数组?:Array<string>){
            return new Promise((成功, 失败) => {
                let 网络连接 = new 网络连接类()
                let 参数 = {
                    url: 开发者服务器wss接口地址,
                    success: 成功.bind(作用域,[网络连接]),
                    fail: 失败.bind(作用域)
                }
                网络连接.wx网络连接类 = window['wx'].connectSocket(参数)
            })
        }

        发送数据(数据:string|ArrayBuffer,作用域){
            return new Promise((成功, 失败) => {
                let 参数 = {
                    data: 数据,
                    success: 成功.bind(作用域),
                    fail: 失败.bind(作用域)
                }
                this.wx网络连接类.send(参数)
            })
        }

        关闭连接(作用域){
            return new Promise((成功, 失败) => {
                let 参数 = {
                    success: 成功.bind(作用域),
                    fail: 失败.bind(作用域)
                }
                this.wx网络连接类.close(参数)
            })
        }

        /**
         * @param 作用域 
         * @param 事件函数(HTTP响应Header:object)
         */
        监听连接成功事件(作用域,事件函数:Function){
            let 函数 = 事件函数.bind(作用域)
            this.wx网络连接类.onOpen(函数)
        }

        /**
         * @param 作用域 
         * @param 事件函数 ()
         */
        监听连接关闭事件(作用域,事件函数:Function){
            let 函数 = 事件函数.bind(作用域)
            this.wx网络连接类.onClose(函数)
        }

        /**
         * @param 作用域 
         * @param 事件函数 (错误信息:string)
         */
        监听错误事件(作用域,事件函数:Function){
            let 函数 = 事件函数.bind(作用域)
            this.wx网络连接类.onError(函数)
        }

        /**
         * @param 作用域 
         * @param 事件函数 (服务器返回的消息:string|ArrayBuffer)
         */
        监听接受到服务器的消息事件(作用域,事件函数:Function){
            let 函数 = 事件函数.bind(作用域)
            this.wx网络连接类.onMessage(函数)
        }
    }
}
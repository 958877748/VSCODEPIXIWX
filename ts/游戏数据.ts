/// <reference path="事件调度类.ts" />
namespace 主空间 {
	export class 游戏数据类 extends 事件调度类{
        /**
         * 所有数据的改变修改都必须通过此方法,以便对属性变化进行通知
         * @param 数据名 改变的数据名称字段
         * @param 新数据值 数据名称字段对应的新值
         */
        修改更新数据(改变的字段:string,字段的新值){
            let 当前数据值 = this
            if(改变的字段.indexOf('.')>-1){
                let 数组 = 改变的字段.split('.')
                let 属性名,对象
                while (数组.length > 0) {
                    对象 = 当前数据值
                    属性名 = 数组.shift()
                    当前数据值 = 对象[属性名]
                }
                if(当前数据值!=字段的新值){
                    对象[属性名] = 字段的新值
                    this.派发事件(改变的字段,字段的新值)
                }
            }else{
                当前数据值 = this[改变的字段]
                if(当前数据值!=字段的新值){
                    this[改变的字段] = 字段的新值
                    this.派发事件(改变的字段,字段的新值)
                }
            }
        }

        /**
         * 用户唯一标识(readonly属性可在构造函数中进行初始化赋值)
         */
        readonly openid:string
        /**
         * 本次登录的会话密钥
         */
        session_key:string
        userInfo:用户信息
    }

    class 用户信息{
        /**
         * 头像url
         */
        avatarUrl:string
        /**
         * 城市
         */
        city:string
        /**
         * 国家
         */
        country:string
        /**
         * 1男2女
         */
        gender:number
        /**
         * 语言
         */
        language:string
        /**
         * 名称
         */
        nickName:string
        /**
         * 省份
         */
        province:string
    }
}
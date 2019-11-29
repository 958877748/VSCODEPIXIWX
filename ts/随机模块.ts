namespace 主空间{
    export class 随机模块{
        static 范围随机(最小:number,最大:number){
            let 随机数 = Math.random()
            let 随机范围 = 最大 - 最小
            let 未取整的随机数 = 随机数 * 随机范围 + 最小
            return 未取整的随机数
        }
        static 范围随机整数(最小:number,最大:number){
            let 随机数 = Math.random()
            let 随机范围 = 最大 - 最小
            let 未取整的随机数 = 随机数 * 随机范围 + 最小
            let 取整的随机数 = parseInt(未取整的随机数+'')
            return 取整的随机数
        }
    }
}
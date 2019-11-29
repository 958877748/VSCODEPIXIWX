namespace 主空间{
    export class ArrayList<T> extends Array{
        constructor(){
            super()
        }

        /**
         * 获取最后一个元素,不改变数组
         */
        get last():T{
            return this[this.length-1]
        }

        /**
         * 判断一个list集合是否为空
         */
        get isEmpty():boolean{
            return this.length==0
        }

        /**
         * 判断一个list集合是否不为空
         */
        get isNotEmpty(){
            return !(this.length==0)
        }

        /**
         * 判断数组是否包含某元素
         */
        contains(item:T){
            return this.indexOf(item)>-1
        }

        /**
         * 添加一个元素
         * @param item 
         */
        add(item:T){
            this.push(item)
        }

        removeFirst(){

        }

        /**
         * 删除最后一个元素
         */
        removeLast(){
        }

        /**
         * 清空数组
         */
        clear(){
            this.length = 0
        }

        /**
         * 传入一个方法,调用此方法,传入每一个元素,返回true删除此元素,返回false,保留此元素
         * @param callback 
         */
        removeWhere(callback:(item:T)=>boolean){
            for (let index = 0; index < this.length; index++) {
                callback(this[index])
            }
        }

        /**
         * 从 ArrayList 中删除指定下标的元素
         * @param index 
         */
        removeAt(index:number){
            
        }

        /**
         * 所有元素随机排序。
         */
        shuffle(){

        }
    }
}
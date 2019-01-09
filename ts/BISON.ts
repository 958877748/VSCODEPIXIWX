namespace 主空间{
    /*
        Copyright (c) 2010-2011 Ivo Wetzel.

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
    */

    /**
     * fromCharCode() 可接受一个指定的 Unicode 值，然后返回一个字符串。
     * 这的循环只是先将 0-65535 的 Unicode 值对应的字符串存入 tok 数组
     * 作者这样做可能是为了节省一些性能
     */
    var chr = String.fromCharCode;
    var tok = new Array(65536);
    for (var i = 0; i < 65536; i++) {
        tok[i] = chr(i);
    }

    /**
     * 编码/解码
     */
    export class BISON{
        /**
         * 一个重复使用的返回值对象
         */
        private static enc = ''
        private static _encode(data, top) {
            //如果 data 的类型是 number
            if (typeof data === 'number') {
                
                // Floats
                var m = data | 0;
                if (m !== data) {
                    var add = 0, r = (data - m) * 100;
                    if (r < 0) {
                        add = (r + 1 | 0) - r;
                        r = (add >= 1.0 && add <= 1.5) ? r | 0 : r - 1 | 0;
    
                    } else {
                        add = r | 0;
                        r = r - add >= 0.5 ? r + 1 | 0 : add;
                    }
    
                    add = 0;
                    if (data < 0) {
                        m = 0 - m;
                        r = 0 - r;
                        add = 1;
                    }
    
                    if (m < 65536) {
                        if (m === 0) {
                            BISON.enc += tok[13 + add] + tok[r + 128];
    
                        } else {
                            BISON.enc += tok[13 + add] + tok[r] + tok[m];
                        }
    
                    } else {
                        BISON.enc += tok[15 + add] + tok[m >> 16 & 0xffff]
                                             + tok[m & 0xffff] + tok[r];
                    }
    
                // Fixed
                } else {
                    var add = 0;
                    if (data <= 0) {
                        data = 0 - data;
                        add = 1;
    
                    } else {
                        data--;
                    }
    
                    if (data < 116) {
                        BISON.enc += tok[17 + data + add * 116];
    
                    } else if (data < 65536) {
                        BISON.enc += tok[1 + add] + tok[data];
    
                    } else {
                        BISON.enc += tok[3 + add] + tok[data >> 16 & 0xffff] + tok[data & 0xffff];
                    }
                }
    
            // Strings
            } else if (typeof data === 'string') {
                var l = data.length;
                BISON.enc += tok[7];
                while (l >= 65535) {
                    l -= 65535;
                    BISON.enc += tok[65535];
                }
                BISON.enc += tok[l] + data;
    
            // Booleans
            } else if (data === true) {
                BISON.enc += tok[5];
    
            } else if (data === false) {
                BISON.enc += tok[6];
    
            // Null
            } else if (data === null) {
                BISON.enc += tok[0];
    
            // Arrays
            } else if (data instanceof Array) {
                BISON.enc += tok[8];
                for (var i = 0, l = data.length; i < l; i++) {
                    BISON._encode(data[i], false);
                }
                if (!top) {
                    BISON.enc += tok[9];
                }
    
            // Objects
            } else if (data instanceof Object) {
                BISON.enc += tok[10];
                for (var e in data) {
                    BISON.enc += tok[17 + e.length] + e;
                    BISON._encode(data[e], false);
                }
                if (!top) {
                    BISON.enc += tok[11];
                }
            }
        }
    
        /**
         * 编码
         * @param data 
         */
        static encode(data) {
            BISON.enc = '';
            BISON._encode(data, true);
            return BISON.enc;
        }
    
        /**
         * 解码
         * @param data 
         */
        static decode(data) {
            var p = 0, l = data.length;
            var stack = [], dec = undefined, f = null, t = 0, i = -1;
            var dict = false, set = false;
            var key = '', e = null, r = 0;
            while (p < l) {
                t = data.charCodeAt(p++);
                f = stack[i];
    
                // 密钥
                // Keys
                if (dict && set && t > 16) {
                    key = data.substring(p, p + t - 17);
                    p += t - 17;
                    set = false;
    
                // Array / Objects
                } else if (t === 8 || t === 10) {
                    e = t === 8 ? new Array() : new Object();
                    set = dict = t === 10;
                    dec !== undefined ? f instanceof Array ? f.push(e)
                                                           : f[key] = e : dec = e;
    
                    stack.push(e);
                    i++;
    
                } else if (t === 11 || t === 9) {
                    stack.pop();
                    set = dict = !(stack[--i] instanceof Array);
    
                // Fixed
                } else if (t > 16) {
                    t = t - 17;
                    t = t > 115 ? (0 - t + 116) : t + 1;
                    f instanceof Array ? f.push(t) : f[key] = t;
                    set = true;
    
                } else if (t > 0 && t < 5) {
                    if (((t - 1) / 2 | 0) === 0) {
                        e = data.charCodeAt(p);
                        p++;
    
                    } else {
                        e = (data.charCodeAt(p) << 16) + data.charCodeAt(p + 1);
                        p += 2;
                    }
                    e = t % 2 ? e + 1 : 0 - e;
                    f instanceof Array ? f.push(e) : f[key] = e;
                    set = true;
    
                // 浮点
                // Floats
                } else if (t > 12 && t < 17) {
                    if (((t - 13) / 2 | 0) === 0) {
                        r = data.charCodeAt(p);
                        if (r > 127) {
                            e = 0;
                            r -= 128;
                            p++;
    
                        } else {
                            e = data.charCodeAt(p + 1);
                            p += 2;
                        }
    
                    } else {
                        e = (data.charCodeAt(p) << 16) + data.charCodeAt(p + 1);
                        r = data.charCodeAt(p + 2);
                        p += 3;
                    }
    
                    e = t % 2 ? e + r * 0.01 : 0 - (e + r * 0.01);
                    f instanceof Array ? f.push(e) : f[key] = e;
                    set = true;
    
                // Booleans
                } else if (t > 4 && t < 7) {
                    f instanceof Array ? f.push(t === 5) : f[key] = t === 5;
                    set = true;
    
                // Null
                } else if (t === 0) {
                    f instanceof Array ? f.push(null) : f[key] = null;
                    set = true;
    
                // Strings
                } else if (t === 7) {
                    e = 0;
                    while (data.charCodeAt(p) === 65535) {
                        e += 65535;
                        p++;
                    }
                    e += data.charCodeAt(p++);
                    f instanceof Array ? f.push(data.substr(p, e)) : f[key] = data.substr(p, e);
    
                    p += e;
                    set = true;
                }
            }
            return dec;
        }
    }
}
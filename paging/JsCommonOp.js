
//定义公共操作
Function.prototype.delegate = function (context, params) {
    var func = this;
    return function () {
        if (params == null) {
            return func.apply(context);
        }
        return func.apply(context, params);
    };
};

var commonOp = {
    coverObject: function (obj1, obj2) {

        var o = this.cloneObject(obj1, false);
        var name;
        for (name in obj2) {
            if (obj2.hasOwnProperty(name)) {
                o[name] = obj2[name];
            }
        }
        return o;
    },

    cloneObject: function (obj, deep) {
        if (obj === null) {
            return null;
        }
        var con = new obj.constructor();
        var name;
        for (name in obj) {
            if (!deep) {
                con[name] = obj[name];
            } else {
                if (typeof (obj[name]) == "object") {
                    con[name] = commonOp.cloneObject(obj[name], deep);
                } else {
                    con[name] = obj[name];
                }
            }
        }
        return con;
    },

    ///说明：
    ///      创建委托
    delegate: function (func, context, params) {
        if ((typeof (eval(func)) == "function")) {
            return func.delegate(context, params);
        } else {
            return function () { };
        }
    },

    getParam: function (param) {
        if (typeof (param) == "undefined") {
            return "";
        } else {
            return param;
        }
    },

    //说明：
    //  判断元素是否存在某个属性   true：不包含   false:包含 
    boolHasAttr: function (id, attr) {

        if (typeof (document.getElementById(id).attributes[attr]) != "undefined") {
            return false;
        }
        return true;
    },

    IsNull: function (str) {
        if (str.trim() == "" || isNaN(str)) {
            return true;
        }
        return false;
    },

    //说明：
    //  是否存在指定函数 
    isExitsFunction: function (funcName) {
        try {
            if (typeof (eval(funcName)) == "function") {
                return true;
            }
        }
        catch (e) { }
        return false;
    },

    //说明：
    //  是否存在指定变量 
    isExitsVariable: function (variableName) {
        try {
            if (typeof (variableName) == "undefined") {
                return false;
            } else {
                return true;
            }
        } catch (e) { }
        return false;
    },

    //说明：
    //  判断输入框中输入的日期格式为yyyy-mm-dd和正确的日期   短日期，形如 (2008-07-22)
    IsDate: function (str) {
        var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) {
            return false;
        }
        var d = new Date(r[1], r[3] - 1, r[4]);
        return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
    },

    //判断样式是否存在
    hasClass: function (obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },

    //为指定的dom元素添加样式
    addClass: function (obj, cls) {
        if (!this.hasClass(obj, cls)) {
            obj.className += " " + cls;
        }
    },

    //删除指定dom元素的样式
    removeClass: function (obj, cls) {
        if (this.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    },

    //如果存在(不存在)，就删除(添加)一个样式
    toggleClass: function (obj, cls) {
        if (this.hasClass(obj, cls)) {
            this.removeClass(obj, cls);
        } else {
            this.addClass(obj, cls);
        }
    },

    // 判断是否是函数
    isFunc: function (func) {
        return (typeof (eval(func)) == "function");
    },

    //初始化xhr
    initRequest: function () {
        var request = false;
        if (window.XMLHttpRequest) {         //FireFox
            request = new XMLHttpRequest();
            if (request.overrideMimeType) {
                request.overrideMimeType('text/xml');
            }
        }
        else if (window.ActiveXObject) {    //IE
            try {
                request = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) { }
            }
        }
        if (!request) {
            window.alert("Create request error!");
            return false;
        }
        return request;
    },

    //js 发送ajax
    //参数说明：
    //  sendUrl      ：发送地址
    //  sendData     ：发送数据
    //  type         ：请求类型（post/get）
    //  isAsync      ：是否是一部
    //  callBackFunc ：回调函数
    sendAjax: function (sendUrl, sendData, type, isAsync, callBackFunc) {
        var httpRequest = commonOp.initRequest();
        if (!httpRequest) {
            return null;
        }

        httpRequest.onreadystatechange = function () {
            //readyState共有5中状态，0未初始化，1已初始化，2发送请求，3开始接收结果，4接收结果完毕。
            //status服务器响应状态码
            if (httpRequest.readyState == 4) {
                if (httpRequest.status == 200) {
                    var text = httpRequest.responseText;
                    if (commonOp.isFunc(callBackFunc)) {
                        callBackFunc(text); //指定请求返回时的回调函数
                    }
                }
                else if (httpRequest.status == 404) {
                    alert("请求资源不存在！");
                }
            }
        };

        //get
        if (type.toUpperCase() === "GET") {
            httpRequest.open("GET", sendUrl, isAsync);
            httpRequest.send(sendData);
        }
        //post
        if (type.toUpperCase() === "POST") {
            httpRequest.open("POST", sendUrl, isAsync);
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            httpRequest.send(sendData);
        }
        return null;
    },
    
    /*************************（验证信息begin）*******************************/
    
    //验证手机号码(简单验证)
    //验证规则：11位数字，以1开头。
    isMobile: function (str) {
        var re = /^1\d{10}$/;
        return re.test(str);
    },

    //验证电话号码
    //验证规则：区号+号码，区号以0开头，3位或4位
    //号码由7位或8位数字组成
    //区号与号码之间可以无连接符，也可以“-”连接
    //如01088888888,010-88888888,0955-7777777 
    isPhone: function (str) {
        var re = /^0\d{2,3}-?\d{7,8}$/;
        return re.test(str);
    },

    //验证邮箱
    isEmail: function (str) {
        return (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(str);
    },

    //正整数
    isPositiveInt: function (str) {
        var g = /^[1-9]*[1-9][0-9]*$/;
        return g.test(str);
    },
    
    //必需是整数
    isInteger: function (str) {
        var reg = /^(-|\+)?\d+$/;
        return reg.test(str);
    },
    
    //  16 位int
    isShortInt:function(str) {
        var ret = commonOp.isInteger(str) && parseInt(str) <= 32767 && parseInt(str) >= -32768;
        return ret;
    },
    
    //  32 位int
    isInt:function(str) {
        var ret = commonOp.isInteger(str) && parseInt(str) <= 2147483647 && parseInt(str) >= -2147483648 ;
        return ret;
    }

    /*************************（验证信息 end）*******************************/



};


//判断是否是图片类型
String.prototype.IsPic = function () {
    var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic";
    if (this.indexOf(".") > -1) {
        var p = this.lastIndexOf(".");
        var strPostfix = this.substring(p, this.length) + "|";
        strPostfix = strPostfix.toLowerCase();
        if (strFilter.indexOf(strPostfix) > -1) {
            return true;
        }
    }
    return false;
};
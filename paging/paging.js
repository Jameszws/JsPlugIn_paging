/*
*  instructions ：paging  
*  date : 2015-05-12
*  author : 张文书
*  Last Modified 
*  By 张文书
*/

(function () {

    var paging = function () {
        this.defaultParams = {
            id: "",
            url: "",
            sendData: "",   //请求参数
            pageSize: 10,   //页大小
            callback: function () { } //回调函数
        };
    };

    //定义id前缀
    var defineIdPrefix = {
        FirstPage: "firstPage_",
        PreviousPage: "previousPage_",
        PageCount: "pageCount_",
        PageNo: "pageNo_",
        NextPage: "nextPage_",
        LastPage: "lastPage_"
    };

    paging.prototype = {
        constructor: paging,

        init: function (params) {
            this.options = commonOp.coverObject(this.defaultParams, params);

            this._init();
        },

        _init: function () {
            if (!document.getElementById(defineIdPrefix.FirstPage + this.options.id)) {
                this.createPagingHtml();
            }

            //初始化时候主动发起请求，获取第一页的信息
            this.senAjaxRequest(1);

            //注册事件
            this._registerFirstPageClick();
            this._registerPreviousPageClick();
            this._registerNextPageClick();
            this._registerLastPageClick();
        },

        //创建分页html
        createPagingHtml: function () {
            var id = this.options.id;
            var pagingHtml = "";
            pagingHtml += "<div class='paging-opArea paging-enable' id='" + defineIdPrefix.FirstPage + id + "'>[首页]</div>";
            pagingHtml += "<div class='paging-opArea paging-enable' id='" + defineIdPrefix.PreviousPage + id + "'>上一页</div>";
            pagingHtml += "<div class='paging-pageInfo' attrCount='1' id='" + defineIdPrefix.PageCount + id + "'>共1页</div>";
            pagingHtml += "<div class='paging-pageInfo' attrNo='1' id='" + defineIdPrefix.PageNo + id + "'>第1页</div>";
            pagingHtml += "<div class='paging-opArea paging-enable' id='" + defineIdPrefix.NextPage + id + "'>下一页</div>";
            pagingHtml += "<div class='paging-opArea paging-enable' id='" + defineIdPrefix.LastPage + id + "'>[尾页]</div>";

            var divEl = document.createElement("div");
            divEl.className = "paging";
            divEl.id = "paging_" + id;
            divEl.innerHTML = pagingHtml;
            document.getElementById(id).appendChild(divEl);
        },

        /***********************************(注册事件 begin)***********************************/

        //注册首页事件
        _registerFirstPageClick: function () {
            var id = defineIdPrefix.FirstPage + this.options.id;
            var handleEvent = commonOp.delegate(this._handleFirstPageClick, this);
            document.getElementById(id).onclick = handleEvent;
        },

        //注册上一页事件
        _registerPreviousPageClick: function () {
            var id = defineIdPrefix.PreviousPage + this.options.id;
            var handleEvent = commonOp.delegate(this._handlerPreviousPageClick, this);
            document.getElementById(id).onclick = handleEvent;
        },

        //注册下一页页事件
        _registerNextPageClick: function () {
            var id = defineIdPrefix.NextPage + this.options.id;
            var handleEvent = commonOp.delegate(this._handleNextPageClick, this);
            document.getElementById(id).onclick = handleEvent;
        },

        //注册尾页事件
        _registerLastPageClick: function () {
            var id = defineIdPrefix.LastPage + this.options.id;
            var handleEvent = commonOp.delegate(this._handleLastPageClick, this);
            document.getElementById(id).onclick = handleEvent;

        },

        /***********************************(注册事件  end )***********************************/

        /***********************************(事件句柄 begin)***********************************/

        //注册首页事件
        _handleFirstPageClick: function () {
            var pageNo = 1;
            if (this.getPageNo() == pageNo) {
                alert("已经是第一页！");
                return;
            }
            this.senAjaxRequest(pageNo);
        },

        //注册上一页事件
        _handlerPreviousPageClick: function () {
            var value = this.getPageNo();
            var pageNo = value - 1;
            this.senAjaxRequest(pageNo);
        },

        //注册下一页页事件
        _handleNextPageClick: function () {
            var value = this.getPageNo();
            var pageNo = value + 1;
            this.senAjaxRequest(pageNo);
        },

        //注册尾页事件
        _handleLastPageClick: function () {
            var pageNo = this.getPageCount();
            if (this.getPageNo() == pageNo) {
                alert("已经是最后一页！");
                return;
            }
            this.senAjaxRequest(pageNo);
        },

        /***********************************(事件句柄  end )***********************************/

        //发送ajax请求，获取表格数据
        senAjaxRequest: function (pageNo) {
            if (!this.isPageNoValid(pageNo)) {
                return;
            }
            var options = this.options;
            var sendUrl = options.url;

            var sendData = "pageSize=" + options.pageSize + "&pageNo=" + pageNo;
            if (options.sendData != "") {
                sendData += "&" + options.sendData;
            }
            var type = "post";

            //发送ajax请求。注意作用域
            commonOp.sendAjax(sendUrl, sendData, type, true, function (ret) {
                var objRet = eval('(' + ret + ')');
                var gridData, pageCount;
                if (objRet == null || objRet == undefined || objRet == "null") {
                    gridData = null;
                    pageCount = null;
                }
                else {
                    gridData = objRet.Data;
                    pageCount = objRet.PageCount;
                }

                if (commonOp.isFunc(options.callback)) {
                    var callbackRet = options.callback(gridData);
                    if (callbackRet) {
                        //设置共几页和第几页
                        paging.prototype.setPageCountText(options, pageCount);
                        paging.prototype.setPageNoText(options, pageNo);
                    }
                }
            });
        },

        //判断页码是否有效
        isPageNoValid: function (pageNo) {
            if (parseInt(pageNo) < 1) {
                alert("已经是第一页！");
                return false;
            }
            if (parseInt(pageNo) > parseInt(this.getPageCount())) {
                alert("已经是最后一页！");
                return false;
            }
            return true;
        },

        //设置总页数
        setPageCountText: function (options, pageCount) {
            var id = defineIdPrefix.PageCount + options.id;
            var pageCountEl = document.getElementById(id);
            pageCountEl.innerHTML = "共" + pageCount + "页";
            pageCountEl.setAttribute("attrCount", pageCount);
        },

        //设置第几页
        setPageNoText: function (options, pageNo) {
            var id = defineIdPrefix.PageNo + options.id;
            var pageNoEl = document.getElementById(id);
            pageNoEl.innerHTML = "第" + pageNo + "页";
            pageNoEl.setAttribute("attrNo", pageNo);
        },

        //获取当前的页码
        getPageNo: function () {
            var id = defineIdPrefix.PageNo + this.options.id;
            var pageNoEl = document.getElementById(id);
            var value = parseInt(pageNoEl.getAttribute("attrNo"));
            return parseInt(value);
        },

        //获取当前的总页数
        getPageCount: function () {
            var id = defineIdPrefix.PageCount + this.options.id;
            var pageNoEl = document.getElementById(id);
            var value = parseInt(pageNoEl.getAttribute("attrCount"));
            return parseInt(value);
        }

    };

    window.paging = paging;
})();   
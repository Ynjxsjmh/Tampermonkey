// ==UserScript==
// @name 导出京东订单
// @namespace win.somereason.web.utils
// @version 2018.07.23.1
// @description 这个脚本帮助你导出京东的订单列表页中的订单,仅限本页.
// @author somereason
// @date 2019-04-29
// @match *://order.jd.com/center/list.action*
// @grant none
// ==/UserScript==

(function () {
    var today = new Date();
    var today_str = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    $($(".mt h3")[0]).html($($(".mt h3")[0]).html() + "&nbsp<button id='srBtnExport' style='background-color: #e2231a;color: white;border: 0px;border-radius: 4px;'>导出本页订单</button>");
    $("#srBtnExport").click(function (e) {
        var str = getOrderListStr();
        createAndDownloadFile("京东订单导出 " + $(".time-txt").text()  +".csv", str);
    });

    // 获取订单
     function getOrderListStr() {
        var str = "订单号`下单时间`订单状态`店铺名称`订单金额`商品名称`收货人`收货人信息\n";

        // 结构：订单 -> 子订单 -> 子订单明细.
        // 最终输出以子订单为主，每个子订单一行 (因为考虑订单可能也有用，所以订单也会体现为一行。不需要的话，手工删掉即可)
        // 订单明细会被拼接在一起，用，分割，放到子订单的 title 字段.
        $(".tr-th").each(function () {// 订单首行，就是有时间，订单号那行，订单和子订单都有
             // 获取时间订单号等.
            var ele = {
                time: $(this).find(".dealtime").text().trim(),
                billId: $(this).find(".number").text().trim().replace(/\s+/, ""),
                shop: $(this).find(".order-shop").text().trim(),
                amount: $(this).next().find(".amount span:first-child").text().replace("总额", "").trim(),
                status: $(this).next().find(".order-status").text().trim(),
                consignee: $(this).next().find(".txt").text().trim(),
                consigneeDetail: $(this).next().find(".pc").text().trim().replace(/\s\s+/g, ','),
            };
            // 子订单的明细，可能有多个商品
            var arr = $(this).nextAll();
            var str1 = "";
            // 把子订单中每个商品的商品名和商品数量拼接到一个字符串中，逗号分隔.
            for (var i = 0; i < arr.length; i++) {
                str1 += $(arr[i]).find(".p-name").text().trim();// 每个商品的商品名
                str1 += "(" + $(arr[i]).find(".goods-number").text().trim() + ")";// 每个商品的购买数量
                str1 += ",";
            }
            ele.title = str1;
            str += `"${ele.billId}"\`"${ele.time}"\`"${ele.status}"\`"${ele.shop}"\`"${ele.amount}"\`"${ele.title}"\`"${ele.consignee}"\`"${ele.consigneeDetail}"`;// 输出，只支持 ES6
            str += "\n";
        });

        return str;
    }

    // 生成文件并下载
    function createAndDownloadFile(fileName, content) {
        var aTag = document.createElement('a');
        // 前面加的那个 uFEFF 是 utf-8 BOM 的头，目的是把 utf-8 的文件变成 utf-8 BOM, 让 excel 打开后不会乱码.
        // 但是 utf-8 BOM 是 windows 独有的，至于苹果和 linux 用户会不会正常打开... 没试过...
        var blob = new Blob(['\uFEFF' + content],{type:"text/csv,charset=utf-8"});
        aTag.download = fileName;
        aTag.href = URL.createObjectURL(blob);
        // 兼容 firefox (firefox 要求，先插入到 document 然后删除)
        document.body.appendChild(aTag);
        aTag.click();
        setTimeout(function(){
            document.body.removeChild(aTag);
            URL.revokeObjectURL(blob);
        }, 100);
    }
})();

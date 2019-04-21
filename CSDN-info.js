// ==UserScript==
// @name         CSDN 直接点开 个人分类 展开
// @version      0.1
// @description  替你点 展开
// @author       Ynjxsjmh
// @match        http://blog.csdn.net/*
// @match        https://blog.csdn.net/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    //for(var t = Date.now();Date.now() - t <= 500;);  // 点完第一个过 0.5s 后再点第二个
    //$("#asideArchive .btn.btn-link-blue.flexible-btn").click();
    $("#asideCategory .btn.btn-link-blue.flexible-btn").click();
})();
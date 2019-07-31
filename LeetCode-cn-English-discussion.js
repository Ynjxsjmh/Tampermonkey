// ==UserScript==
// @name         leetcode-cn add English discussion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给 LeetCode 中文版的题目加上英文 Discussion 链接，使用滚轮访问
// @author       Ynjxsjmh
// @match        *://leetcode-cn.com/problems/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // window.onload = function () { mychange(); };
    window.addEventListener("load", function() {mychange();} );
    setTimeout(function(){ mychange(); }, 10000);

    function mychange() {
        var current_url = window.location.href;
        var pattern1 = new RegExp("(?<=https://leetcode-cn.com/problems/)[^/]+");
        var problem = pattern1.exec(current_url);
        var discuss_url = "https://leetcode.com/problems/" + problem + "/discuss/";

        var navbar = document.getElementsByClassName("css-1lexzqe-TabHeaderContainer");

        // 更改「题解」的 href
        navbar[0].childNodes[2].children[0].href = discuss_url;
        navbar[0].childNodes[2].children[0].target = "_blank";
    };
})();
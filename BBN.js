// ==UserScript==
// @name         Bypass Baidu Netdisk search tool
// @namespace    ynjxsjmh.web.utils
// @version      0.1
// @description  null
// @author       Ynjxsjmh
// @match        https://www.dalipan.com/detail/*
// @match        https://www.dashengpan.com/detail/*
// @match        https://www.luomapan.com/detail/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==



(function() {
    'use strict';

    let id = window.location.href.split('/').pop();
    let detailApi = window.location.protocol + '//' + window.location.host + '/api/detail?id=' + id;

    GM_xmlhttpRequest({
        method: 'GET',
        url: detailApi,
        headers: {
            'Accept': 'application/json'
        },
        onload: function (response) {
            console.log(response);
            if (response.status >= 200 && response.status < 400) {
                let detail = JSON.parse(response.responseText);
                let title = document.getElementById('info').getElementsByTagName('h1')[0];
                let titleContent = title.textContent;
                title.innerHTML = `<a href=${detail.url}>${titleContent}</a>`;
            }
        }
    });

})();

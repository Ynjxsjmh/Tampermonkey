// ==UserScript==
// @name         Bring back SO homepage button
// @namespace    ynjxsjmh.web.utils
// @version      0.1
// @description  Bring back SO homepage button
// @author       Ynjxsjmh
// @match        https://stackoverflow.com/
// @match        https://stackoverflow.com/?tab=*
// @match        https://*.stackexchange.com
// @match        https://*.stackexchange.com/?tab=*
// @match        https://superuser.com
// @match        https://superuser.com/?tab=*
// @icon         https://www.google.com/s2/favicons?domain=stackoverflow.com
// @grant        none
// ==/UserScript==

(function() {
    var btnGroup = document.getElementsByClassName('s-btn-group')[0];
    var btns = btnGroup.getElementsByTagName('a');

    for (var tab of btns) {
        const targetUrl = `https://${window.location.hostname}/?tab=${tab.getAttribute('data-value')}`;

        tab.onclick = function() {
            window.location = targetUrl;
            return false;
        };
    }
})();

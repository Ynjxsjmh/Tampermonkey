// ==UserScript==
// @name 把 google 搜索伪装成bing搜索
// @namespace win.somereason.web.utils
// @version 2018.12.10.2
// @description （百度一生黑） Honor to @somereason
// @author Ynjxsjmh
// @license MIT
// @date 2018-10-05
// @match *://www.google.com/search*
// @match *://www.google.com.hk/search*
// @match *://www.google.com.tw/search*
// @grant none
// ==/UserScript==
//


(function () {
	var logo = document.getElementById("logo");
    var logoArr;
	if (logo === null) {
		logoArr = document.getElementsByClassName("logo");
		if (logoArr.length > 0)
			logo = logoArr[0];
	}
	if (logo === null) {
		logoArr = document.getElementsByClassName("logocont");
		if (logoArr.length > 0)
			logo = logoArr[0];
	}
	if (logo === null) {
		console.log("oops,google又改样式了.请静待更新");
	} else {
        logo.innerHTML = '';

        var image_url = "https://raw.githubusercontent.com/Ynjxsjmh/Tampermonkey/master/image/bing-green-small.png";
        var img = new Image();
        img.src = image_url;

        var imgSize = getImgSize(logo);
        var percentage = imgSize.height/img.height;

        logo.innerHTML = '<a href="https://www.bing.com" data-hveid="7"><img src="https://raw.githubusercontent.com/Ynjxsjmh/Tampermonkey/master/image/bing-green-small.png" alt="Bing" height="'+imgSize.height+'px" width="'+img.width*percentage+'px" data-atf="3"></a>';
        document.title = document.title.replace(/Google\s/g, "必应");
        // Below method has a slight delay while changing the logo
        // document.getElementById("logo").getElementsByTagName('img')[0].src = image_url;

        if (document.getElementById("logo") !== null) {
            document.getElementById("logo").title = "Bing 首页";
        }

        // Don't use below line, or you cound't get your input while the cursor hovering onto the tab
        // document.head.getElementsByTagName("title")[0].text = "微软 Bing 搜索 - 国际版";

        // If you are using console and then type dot, you can get a prompot.
        // With focus on one choice, there will have a pre-output
        // I find `attributes`'s pre-output got that `aria-label`
        document.getElementsByTagName('button')[0].attributes[2].value = "Bing 搜索";

        document.getElementsByTagName('input')[1].title = "Bing 搜索";

        // change shortcut icon
        document.getElementsByTagName('meta')[0].content = "https://raw.githubusercontent.com/Ynjxsjmh/Tampermonkey/master/image/bing-icon.ico";
        var new_link = document.createElement("link");
        new_link.href = "https://raw.githubusercontent.com/Ynjxsjmh/Tampermonkey/master/image/bing-icon.ico";
        new_link.rel = "shortcut icon";
        document.head.appendChild(new_link);
	}

    function getImgSize(elLogo){
        var elImg=elLogo.querySelector("img");
        if(elImg===null){
            return {height:30,width:92}
        }else{
            return {height:elImg.height,width:elImg.width}
        }
    }

})();
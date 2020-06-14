// ==UserScript==
// @name Disguiser
// @namespace ynjxsjmh.web.utils
// @version 2019.12.22
// @description Honor to @somereason
// @author Ynjxsjmh
// @license MIT
// @date 2018-10-05
// @match *://www.google.com/search*
// @match *://www.google.com.hk/search*
// @match *://www.google.com.tw/search*
// @match *://www.youtube.com/*
// @match *://www.twitter.com/*
// @match *twitter.com/*
// @grant none
// ==/UserScript==
//

(function () {
  try{
    switch(window.location.hostname){
    case "www.google.com":
    case "www.google.com.hk":
    case "www.google.com.tw":
      google();
      break;
    case "www.youtube.com":
    case "youtube.com":
      youtube();
      break;
    case "www.twitter.com":
    case "twitter.com":
      twitter();
      break;
    case "instagram.com":
      instagram();
      break;
    default:
      throw TypeError;
    }
  } catch(e){
    console.log("unknown source");
  }

  function changeIcon(href) {
    var link = document.querySelector("link[rel*='shortcut icon']");
    link.href = href;
  }

  function twitter() {
    var contentSecurityPolicy = document.createElement('meta');
    contentSecurityPolicy.httpEquiv = "Content-Security-Policy";
    contentSecurityPolicy.content = "img-src data: 'self' blob: data: https://*.cdn.twitter.com https://ton.twitter.com https://*.twimg.com https://www.google-analytics.com https://www.periscope.tv https://www.pscp.tv https://media.riffsy.com https://*.giphy.com https://*.pscp.tv https://raw.githubusercontent.com";
    // <meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'" />
    document.getElementsByTagName('head')[0].prepend(contentSecurityPolicy);

    var headerA = document.getElementsByTagName("header")[0].getElementsByTagName("h1")[0].getElementsByTagName("a")[0];
    headerA.innerHTML = "";
    headerA.innerHTML = '<a href="https://www.twitter.com" data-hveid="7"><img src="https://raw.githubusercontent.com/Ynjxsjmh/Tampermonkey/master/image/weibo.png" alt="微博" data-atf="3"></a>';

    changeIcon("https://raw.githubusercontent.com/Ynjxsjmh/Tampermonkey/master/image/weibo-icon.ico");
  }

  function youtube() {
    /* Change Logo  */
    document.getElementById("logo").tooltipText = "Youku 优酷";
    var logo = document.getElementById("logo").firstElementChild;
    logo.title = "Youku 优酷";
    logo.innerHTML = "";
    logo.innerHTML = '<a href="https://www.youtube.com" data-hveid="7"><img src="https://raw.githubusercontent.com/Ynjxsjmh/Tampermonkey/master/image/youku.png" alt="Youku" data-atf="3"></a>';

    /* Change title */
    document.getElementsByTagName("title")[0].text = "优酷 - 这世界很酷";

    /* Change shortcut icon */
    /*
      <link rel="shortcut icon" href="https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico" type="image/x-icon" />
      <link rel="icon" href="https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png" sizes="32x32" />
      <link rel="icon" href="https://s.ytimg.com/yts/img/favicon_48-vflVjB_Qk.png" sizes="48x48" />
      <link rel="icon" href="https://s.ytimg.com/yts/img/favicon_96-vflW9Ec0w.png" sizes="96x96" />
      <link rel="icon" href="https://s.ytimg.com/yts/img/favicon_144-vfliLAfaB.png" sizes="144x144" />
    */
    for (var i = 0; i < 5; i++) {
      document.getElementsByTagName("link")[i].href = "https://raw.githubusercontent.com/Ynjxsjmh/Tampermonkey/master/image/youku-icon.png";
    }
  }

  function google() {
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
      console.log("oops, google又改样式了.请静待更新");
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
  }

  function getImgSize(elLogo){
    var elImg=elLogo.querySelector("img");
    if(elImg===null){
      return {height:30,width:92};
    }else{
      return {height:elImg.height,width:elImg.width};
    }
  }

})();
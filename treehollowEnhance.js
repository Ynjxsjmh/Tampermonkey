// ==UserScript==
// @name         抒发森林增强
// @namespace    https://github.com/rktccn/treehollowEnhance
// @supportURL   https://github.com/rktccn/treehollowEnhance
// @homepageURL  https://github.com/rktccn/treehollowEnhance
// @version      0.2.2
// @description  抒发森林增强,只看洞主，下载图片
// @author       RoIce
// @match        *://web.treehollow.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasespot.net
// @grant        GM_addStyle
// @grant        GM_notification
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";
  // Your code here...

  let css = `.active{
    background-color: rgb(243, 142, 4) !important;
  }`;
  GM_addStyle(css);

  // 原始数据
  let rawData = '';
  let originalreplyList = [];

  // 通知信息
  let noticeLength = 0; // 总通知数
  let newNoticeList = []; // 新通知
  let noticeList = []; // 临时储存通知

  // 回复内容
  let replyList = [];

  let replyNodes = [];

  // 设置
  let data = {
    onlyDZ: false,
  };

  // 检测屏幕大小，是否为移动端
  const isMobile = () => {
    return window.screen.width < 768;
  };

  // 拦截获取请求
  function addXMLRequestCallback(callback) {
    var oldSend, i;
    if (XMLHttpRequest.callbacks) {
      // we've already overridden send() so just add the callback
      XMLHttpRequest.callbacks.push(callback);
    } else {
      // create a callback queue
      XMLHttpRequest.callbacks = [callback];
      // store the native send()
      oldSend = XMLHttpRequest.prototype.send;
      // override the native send()
      XMLHttpRequest.prototype.send = function () {
        // process the callback queue
        // the xhr instance is passed into each callback but seems pretty useless
        // you can't tell what its destination is or call abort() without an error
        // so only really good for logging that a request has happened
        // I could be wrong, I hope so...
        // EDIT: I suppose you could override the onreadystatechange handler though
        for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
          XMLHttpRequest.callbacks[i](this);
        }
        // call the native send()
        oldSend.apply(this, arguments);
      };
    }
  }

  // 监听通知请求
  const listenNotification = () => {
    addXMLRequestCallback(function (xhr) {
      xhr.addEventListener("load", function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          if (xhr.responseURL.includes("user/notifications")) {
            //do something!

            // 去重，将新通知添加到通知列表
            let $notice = JSON.parse(xhr.response);
            newNoticeList = $notice.slice(0, $notice.length - noticeLength);
            noticeLength = $notice.length;
            console.log(newNoticeList);
            if (newNoticeList.length !== 0) {
              newNoticeList.forEach((item) => {
                if (item.type === "replyPost") {
                  noticeList.push({
                    pid: item.pid,
                    userName: item.name,
                    content: item.content,
                  });
                }
              });
            }
          }
        }
      });
    });
  };

  // 获取原数据
  function getOriginalData() {
    addXMLRequestCallback(function (xhr) {
      xhr.addEventListener("load", function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          if (xhr.responseURL.includes("holes/detail")) {
            //do something!

            rawData = xhr.response;
            originalreplyList = JSON.parse(xhr.response).replies;
            if (!originalreplyList?.length) {
              originalreplyList = [];
              throw new Error("获取源数据失败或没有回复");
            }
          }
        }
      });
    });
  }

  // 检测是否加载完成,异步调用
  const checkLoad = () =>
    new Promise((resolve, reject) => {
      let check = setInterval(() => {
        let targetNode = document.querySelector(
          "#root > div > div > div > div > div > div > div > div > div.css-1dbjc4n.r-13awgt0 > div > div.css-1dbjc4n.r-1p0dtai.r-1d2f490.r-12vffkv.r-u8s1d.r-zchlnj.r-ipm5af > div.css-1dbjc4n.r-13awgt0.r-12vffkv > div > div > div > div > div > div.css-1dbjc4n.r-1kihuf0.r-e7q0ms"
        );

        if (targetNode !== null) {
          clearInterval(check);
          resolve(true);
        }
      }, 200);
    });

  // 获取回复
  const getReply = () => {
    const targetNode = document.getElementsByClassName(
      "css-1dbjc4n r-1kihuf0 r-knv0ih r-e7q0ms"
    );
    replyList = [];

    if (!targetNode) {
      throw new Error("获取回复失败");
    }

    // 只看洞主
    if (data.onlyDZ) {
      if (replyNodes?.length === 0) return;
      for (let i = 0; i < targetNode.length; i++) {
        seeDZ(targetNode[i], data.onlyDZ);
      }
    }

    return targetNode;
  };

  // 监听楼层数量的变化
  const listenReplayCount = () => {
    let targetNode = document.querySelector(
      "#root > div > div > div > div > div > div > div > div > div.css-1dbjc4n.r-13awgt0 > div > div.css-1dbjc4n.r-1p0dtai.r-1d2f490.r-12vffkv.r-u8s1d.r-zchlnj.r-ipm5af > div.css-1dbjc4n.r-13awgt0.r-12vffkv > div > div > div > div > div > div.css-1dbjc4n.r-1kihuf0.r-13awgt0.r-knv0ih.r-13qz1uu > div > div > div:nth-child(2)"
    );

    const config = { childList: true };

    const callBack = (mutationsList, observer) => {
      replyNodes = getReply();
    };

    const observer = new MutationObserver(callBack);

    observer.observe(targetNode, config);
  };

  // 只看洞主,只显示name为 洞主 的回帖
  const seeDZ = (reply, hide) => {
    let userName =
      reply.getElementsByClassName(
        "css-901oao r-5rif8m r-ubezar r-13uqrnb r-majxgm r-oxtfae r-dhbnww r-13hce6t r-14gqq1x"
      )[0]?.innerText ||
      reply.getElementsByClassName("css-1dbjc4n r-dta0w2")[0]?.firstElementChild
        ?.innerText;

    if (!userName) {
      console.log(
        `element:${
          reply.getElementsByClassName(
            "css-901oao r-5rif8m r-ubezar r-13uqrnb r-majxgm r-oxtfae r-dhbnww r-13hce6t r-14gqq1x"
          ).inner ||
          reply.getElementsByClassName("css-1dbjc4n r-dta0w2")
            ?.firstElementChild
        }`
      );
      throw new Error("没有找到用户名");
    }

    if (hide) {
      if (userName.trim() !== "洞主") {
        reply.parentNode.style.display = "none";
      }
    } else {
      reply.parentNode.style.display = "";
    }
  };

  // 添加按钮
  const addButton = (text, callback) => {
    let pcCss = {
      container:
        "display: flex; justify-content: center; align-items: center; position: fixed; right: 20px; bottom: 50%;flex-direction: column;transform: translateY(30%);",
      button:
        "margin-bottom: 16px; background-color: #53A13C; border-radius: 5px;  cursor: pointer; display: inline-block; font-size: 17px; font-weight: 400;;;; width: 50px;line-height: 1.2; padding: 17px 14px; text-align: center; text-decoration: none; color: #fff;",
    };

    let mobileCss = {
      container:
        "display: flex; justify-content: center; align-items: center; position: fixed; right: 10px; bottom: 20%; flex-direction: column; transform: translateY(30%);",
      button:
        "margin-bottom: 16px; background-color: rgb(83, 161, 60); border-radius: 5px; cursor: pointer; display: inline-block;  font-weight: 400; width: 35px; line-height: 1.2; padding: 10px 9px; text-align: center; text-decoration: none; color: rgb(255, 255, 255);font-size: 12px;",
    };

    let container = document.getElementsByClassName("button-container")[0];
    if (container === undefined) {
      // 添加container
      container = document.createElement("div");
      container.className = "button-container";
      container.style.cssText = isMobile()
        ? mobileCss.container
        : pcCss.container;
      document.body.appendChild(container);
    }

    const element = document.createElement("div");
    element.innerText = text;
    element.className = "dz-button";
    element.style.cssText = isMobile() ? mobileCss.button : pcCss.button;
    if (text === "只看洞主" && data.onlyDZ) {
      element.classList.add("active");
    }

    element.addEventListener("click", callback);
    container.appendChild(element);
  };

  // 移除按钮
  const removeButton = () => {
    let container = document.getElementsByClassName("button-container")[0];
    if (container !== undefined) {
      container.remove();
    }
  };

  // 点击只看洞主
  const clickDZ = (e) => {
    if (originalreplyList?.length === 0) return;

    if (data.onlyDZ) {
      data.onlyDZ = false;

      if (replyNodes?.length === 0) return;

      // 显示内容
      for (let i = 0; i < replyNodes.length; i++) {
        const reply = replyNodes[i];
        e.target.classList.remove("active");
        seeDZ(reply, false);
      }
    } else {
      data.onlyDZ = true;
      e.target.classList.add("active");

      for (let i = 0; i < replyNodes.length; i++) {
        const reply = replyNodes[i];
        seeDZ(reply, true);
      }
    }
  };

  // 查看所有图片
  const getImg = () => {
    let imgList = [];
    // 提取图片
    originalreplyList.forEach((item) => {
      if (item?.image) {
        imgList.push(`https://img.treehollow.net/${item.image.src}`);
      }
    });

    return imgList;
  };

  // 新增图片显示窗口
  const addImgWindow = () => {
    let container = document.createElement("div");
    container.classList = "img-container";
    container.style.cssText =
      "position: fixed; inset: 0px; z-index: 9999; background-color: rgba(0, 0, 0, 0.6); overflow-y: scroll; display: grid; grid-template-columns: 1fr 1fr 1fr; width: 100vw; height: 100vh;gap: 16px;";

    document.body.appendChild(container);
    let imgList = getImg();
    for (let i = 0; i < imgList.length; i++) {
      const imgUrl = imgList[i];
      let img = document.createElement("img");
      img.src = imgUrl;
      img.style.cssText = "width: 100%;";
      container.appendChild(img);
    }

    let close = document.createElement("div");
    close.innerText = "关闭";
    close.style.cssText =
      " position: fixed; right: 20px; bottom: 50%; margin-bottom: 16px; background-color: #53A13C; border-radius: 5px;  cursor: pointer; display: inline-block; font-size: 17px; font-weight: 400;;;; width: 50px;line-height: 1.2; padding: 17px 14px; text-align: center; text-decoration: none; color: #fff;";
    close.addEventListener("click", () => {
      container.remove();
    });
    container.appendChild(close);
  };

  // 回到顶部
  const goTop = () => {
    let targetNode = document.getElementsByClassName(
      "css-1dbjc4n r-150rngu r-eqz5dr r-16y2uox r-1wbh5a2 r-11yh6sk r-1rnoaur r-2eszeu r-1sncvnh"
    );
    targetNode[0].scrollTo({ x: 5, y: 5, animated: true });
  };

  const download = () => {
    let blob = new Blob(["\ufeff" +rawData],{type: "application/json;charset=utf-8;"});
    let encodedUrl = URL.createObjectURL(blob);
    let url = document.createElement("a");
    url.setAttribute("href", encodedUrl);
    url.setAttribute("download", JSON.parse(rawData)["pid"] + ".json");
    document.body.appendChild(url);
    url.click();
  };

  // removeButton();
  // if (window.location.pathname == "/HoleDetail") {
  //   getOriginalData();
  //   checkLoad().then((res) => {
  //     replyNodes = getReply();
  //     listenReplayCount();
  //     removeButton();
  //     addButton("只看洞主", clickDZ);
  //     addButton("下载图片", addImgWindow);
  //     addButton("回到顶部", goTop);
  //   });
  // }

  /**
   * 重写history的pushState和replaceState
   * @param action pushState|replaceState
   * @return {function(): *}
   */
  function wrapState(action) {
    // 获取原始定义
    let raw = history[action];
    return function () {
      // 经过包装的pushState或replaceState
      let wrapper = raw.apply(this, arguments);

      // 定义名为action的事件
      let e = new Event(action);

      // 将调用pushState或replaceState时的参数作为stateInfo属性放到事件参数event上
      e.stateInfo = { ...arguments };
      // 调用pushState或replaceState时触发该事件
      window.dispatchEvent(e);
      return wrapper;
    };
  }

  //修改原始定义
  history.pushState = wrapState("pushState");
  history.replaceState = wrapState("replaceState");

  // 监听自定义的事件
  window.addEventListener("pushState", function (e) {
    removeButton();

    if (window.location.pathname == "/HoleDetail") {
      getOriginalData();

      checkLoad().then((res) => {
        replyNodes = getReply();
        listenReplayCount();
        removeButton();

        addButton("只看洞主", clickDZ);
        addButton("下载图片", addImgWindow);
        addButton("回到顶部", goTop);
        addButton("下载数据", download);
      });
    }
  });

  window.addEventListener("replaceState", function (e) {
    removeButton();
    if (window.location.pathname == "/HoleDetail") {
      getOriginalData();

      checkLoad().then((res) => {
        replyNodes = getReply();
        listenReplayCount();
        removeButton();
        addButton("只看洞主", clickDZ);
        addButton("下载图片", addImgWindow);
        addButton("回到顶部", goTop);
        addButton("下载数据", download);
      });
    }
  });
})();

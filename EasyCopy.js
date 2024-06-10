// ==UserScript==
// @name         Easy Copy
// @namespace    ynjxsjmh.web.utils
// @version      0.1
// @description  Add copy button to some sites
// @author       Ynjxsjmh
// @match        *.cool18.com/bbs4/*
// @match        *.sis001.com/forum/*
// @match        *.sexinsex.net/bbs/*
// @match        *.v2ex.com/t/*
// @match        *.douban.com/group/topic/*
// @match        *.zhihu.com/question/*
// @match        *.query.1234567.com.cn/Query/Detail*
// @match        *.*zhct.*/weixin/orderdetail/*
// @match        *.south-plus.org/read.php*
// @match        *.pixiv.net/novel/show.php?id=*
// @match        *.youzhiyouxing.cn/materials/*
// @match        *.jandan.net/bbs*
// @match        *.bilibili.com/*
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @grant        none
// ==/UserScript==

/********************************* Core *********************************/

const Buttons = Object.freeze({
    COPY:   Symbol("copy"),
    APPEND: Symbol("append"),
    CLEAR:  Symbol("clear")
});

var copiedTextArray = [];

function clearText(evt) {
  copiedTextArray = [];

  const btn = evt.currentTarget;
  btn.innerHTML = 'Cleared';
  setTimeout(function() { btn.innerHTML = 'Clear'; }, 3000);
}

function appendText(evt) {
  var text = getBtnText(evt);

  copiedTextArray.push(text);
  text = copiedTextArray.join('\n\n');

  writeClipboard(text);

  const btn = evt.currentTarget;
  btn.innerHTML = 'Appended';
  setTimeout(function() { btn.innerHTML = 'Append'; }, 3000);
}

function copyText(evt) {
  var text = getBtnText(evt);

  writeClipboard(text);

  const btn = evt.currentTarget;
  btn.innerHTML = 'Copied';
  setTimeout(function() { btn.innerHTML = 'Copy'; }, 3000);
}

function getBtnText(evt) {
  var text = evt.currentTarget.copiedText;
  if (text === null || text === undefined || text === '') {
    var copyTextFun = evt.currentTarget.copyTextFun;
    text = copyTextFun();
  }

  return text;
}

function writeClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyText(text)
      .then(() => console.log('Copying to clipboard was successful!'))
      .catch((err) => console.log('Could not copy text: ', err));
  } else {
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }
}

function fallbackCopyText(text) {
  // text area method
  let textArea = document.createElement("textarea");
  textArea.value = text;

  // make the textarea out of viewport
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  return new Promise((res, rej) => {
    document.execCommand('copy') ? res() : rej();
    textArea.remove();
  });
}

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
    https://stackoverflow.com/a/8283815/10315163
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey];
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

/********************************* Func *********************************/

class SiteProcessor {
  copy() { }

  append() { }

  clear() { }

  process() {
    this.copy();
    this.append();
    this.clear();
  }

  createButtonByType(btnId, btnType, btnEle) {
    var btn;

    switch(btnType) {
    case Buttons.COPY:
      btn = createBtn(btnId, btnEle);
      break;
    case Buttons.APPEND:
      btn = createAppendBtn(btnId, btnEle);
      break;
    case Buttons.CLEAR:
      btn = createClearBtn(btnId, btnEle);
      break;
    default:
      throw new Error('undefined button type');
    }

    return btn;
  }

  formatMeta () {
    const options = {
      weekday: 'short',
      year: 'numeric', month: 'numeric', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    };
    const today = new Date();

    const meta = `:PROPERTIES:
      :URL: ${window.location.href}
      :Time: <${today.toLocaleDateString('zh-CN', options)}>
      :PubTime:
    :END:`.replace(/ {4}/g, '');

    return meta;
  }

  formatPost () { }

  formatReply () { }

  addPostButton(btnId, area, anchorSelector, btnEle='button') {
    const btn = this.createButtonByType(btnId, Buttons.COPY, btnEle);
    btn.copiedText = this.formatPost(area);

    const anchor = area.querySelector(anchorSelector);
    if (anchor) {
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }
  }

  addReplyButtons(btnIdPrefix, btnType, anchors, anchorSelector,
                  isHoverable=true, isNextSibling=false, btnEle='button') {
    for (var i = 0; i < anchors.length; i++) {
      const btnId = `${btnIdPrefix}${i}`;
      const btn = this.createButtonByType(btnId, btnType, btnEle);

      const anchor = anchors[i].querySelector(anchorSelector);
      if (anchor) {
        if (btnType !== Buttons.CLEAR) {
          const formatText = this.formatReply(anchors[i]);
          btn.copiedText = formatText;
        }

        if (isNextSibling) {
          anchor.parentNode.insertBefore(btn, anchor.nextSibling);
        } else {
          anchor.parentNode.insertBefore(btn, anchor);
        }

        if (isHoverable) {
          hoverArea(anchors[i], btnId);
        }
      }
    }
  }

}


class BilibiliProcessor extends SiteProcessor {
  formatPost (area) {
    const title = area.querySelector('#viewbox_report .video-info-title-inner').innerText;
    const time = area.querySelector('#viewbox_report .video-info-meta .pubdate-ip-text').innerText;
    const author = area.querySelector('.up-info-container .up-detail-top .up-name').innerText.trim();
    const meta = this.formatMeta();
    return `${title}\n${meta}\n${author}\t${time}`;
  }


  formatReply (area) {
    const subReplyAuthor  = area.querySelector('.sub-user-info .sub-user-name').innerText;
    const subReplyContent = area.querySelector('.reply-content').innerText;
    const subReplyTime = area.querySelector('.sub-reply-info .sub-reply-time').innerText;
    const subReplyLike = area.querySelector('.sub-reply-info .sub-reply-like').innerText;

    return `${subReplyAuthor}\t${subReplyTime}\t⬆${subReplyLike}\n${subReplyContent}`;
  }

  copy () {
    const addBilibiliPostButton = () => {
      this.addPostButton('copyText', document, '#viewbox_report .video-info-meta .pubdate-ip', 'div');
    };

    const addButton = () => {
      const replies = document.querySelectorAll('#comment .reply-list .reply-item');

      for (var i = 0; i < replies.length; i++) {
        // Create btn for root-reply
        const anchor = replies[i].querySelector('.root-reply-container .reply-btn');
        if (anchor) {
          const btnId = `copyText${i}`;
          const replyBtn = createBtn(btnId);

          const replyAuthor  = replies[i].querySelector('.user-info .user-name').innerText;
          const replyContent = replies[i].querySelector('.reply-content').innerText;
          const replyTime = replies[i].querySelector('.reply-info .reply-time').innerText;
          const replyLike = replies[i].querySelector('.reply-info .reply-like').innerText;

          replyBtn.copiedText = `${replyAuthor}\t${replyTime}\t⬆${replyLike}\n${replyContent}`;
          anchor.parentNode.insertBefore(replyBtn, anchor.nextSibling);
          hoverArea(replies[i].querySelector('.root-reply-container'), btnId);
        }

        addSubButton();
      }
    };

    const addSubButton = () => {
      // Create btn for sub-reply-list
      const subReplies = document.querySelectorAll('.sub-reply-container .sub-reply-list .sub-reply-item');
      this.addReplyButtons('subCopyText', Buttons.COPY, subReplies, '.sub-reply-btn', true, true);
    };

    waitForKeyElements('#viewbox_report .copyright-icon', addBilibiliPostButton);
    addButton();
    waitForKeyElements('#comment .reply-list .reply-item', addButton);
    waitForKeyElements('#comment .sub-reply-list .sub-reply-item', addSubButton);
  }

};


class Cool18Processor extends SiteProcessor {
  formatPost (area) {
    return area.querySelector('pre').innerText;
  }

  copy() {
    this.addPostButton('copyText', document, 'button');
  }

};


class Sis001Processor extends SiteProcessor {
  formatReply (area) {
    return area.querySelector('.postcontent .noSelect').innerText;
  }

  copy() {
    const anchors = document.querySelectorAll('.mainbox.viewthread');
    this.addReplyButtons('copyText', Buttons.COPY, anchors, '.postcontent .postinfo a', false, true, 'a');
  }

};


class SexinsexProcessor extends SiteProcessor {
  copy () {
    const anchors = document.querySelectorAll('.mainbox.viewthread');

    for (var i = 0; i < anchors.length; i++){
      const anchor = anchors[i].querySelector('.postcontent .postinfo a');

      var btn = createBtn(`copyText${i}`, 'a');
      var post = anchors[i].querySelector('.postcontent .postmessage').cloneNode(true);
      post.querySelector("fieldset").remove();
      btn.copiedText = post.innerText.trim();

      if (anchor) {
        anchor.parentNode.insertBefore(btn, anchor.nextSibling);
      }
    }
  }

};


class V2exProcessor extends SiteProcessor {

  formatReply(area) {
    var author = area.querySelector('.dark').innerText;
    var date = area.querySelector('.ago').innerText;
    var like = area.querySelector('.small') ? ('❤' + area.querySelector('.small').innerText.trim()) : '';
    var floor = area.querySelector('.fr .no').innerText;
    var content = area.querySelector('.reply_content').innerText;

    return `${author}\t${date}\t${like}\t#${floor}\n${content}`;
  }

  formatPost(area) {
    var post = document.querySelector('#Main .box');
    var title = post.querySelector('h1').innerText;
    var author = post.querySelector('.gray a').innerText;
    var date = post.querySelector('.gray span').title;
    var topic_content = post.querySelector('.topic_content');
    var content = "[作者未添加正文]";
    if (topic_content !== null) {
      content = topic_content.innerText;
    }
    var meta = this.formatMeta();

    return `${title}\n${meta}\n${author}\t${date}\n${content}`;
  }

  copy() {
    // Handle post
    var post = document.querySelector('#Main .box');
    this.addPostButton('copyText', post, '.gray');

    // Handle reply
    const anchors = document.querySelectorAll('#Main .box .cell');
    this.addReplyButtons('copyText', Buttons.COPY, anchors, '.fr .no');
  }

  append() {
    // Handle reply
    const anchors = document.querySelectorAll('#Main .box .cell');
    this.addReplyButtons('appendText', Buttons.APPEND, anchors, '.fr .no');
  }

  clear() {
    // Handle reply
    const anchors = document.querySelectorAll('#Main .box .cell');
    this.addReplyButtons('clearText', Buttons.CLEAR, anchors, '.fr .no');
  }

}


class ZhctProcessor extends SiteProcessor {
  copy() {
    const anchor = document.getElementById('nutrient');

    const getText = () => {
      const restaurant = document.getElementById('store_name').innerText;
      var text = '';
      const transactions = document.querySelectorAll("#lines > div");
      for (let i = 0; i < transactions.length; i++) {
        var transaction = transactions[i].querySelector("div");
        var lines = transaction.childNodes;

        const time = lines[lines.length-1].innerText;
        const item = lines[0].innerText.split('\n').slice(0, 2).join(',');
        const price = lines[0].innerText.split('\n')[2];
        // 交易时间|商户名称|交易名称|交易金额
        text += `${time}\t${restaurant}\t${item}\t${price}\n`;
      }
      return text;
    };

    var btn = document.createElement('button');
    btn.innerHTML = 'Copy';
    btn.setAttribute('id', 'copyText');
    btn.addEventListener('click', copyText, false);
    btn.copyTextFun = getText;

    if (anchor) {
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }
  }

};


class DoubanProcessor extends SiteProcessor {
  formatReply (area, floor) {
    var info = area.querySelector('h4').cloneNode(true);
    if (info.querySelector('.easy-floor') !== null) {
      floor = info.querySelector('.easy-floor').innerText.replace(/[# ]/g, '');
      info.querySelector('.easy-floor').remove();
    }
    info = info.innerText.trim().replace(/(\r\n|\n|\r)/gm, '').replace(/ +/g, ' ');
    var like = area.querySelector('.comment-vote').innerText;
    var quote = area.querySelector('.reply-quote');
    var quoteContent = quote ? '> ' + quote.innerText : '';
    var content = area.querySelector('.reply-content').innerText;

    return `${info}\t${like}\t#${floor}\n${quoteContent}\n${content}`;
  }

  copy() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    var start = params.start ? Number(params.start) : 0;

    if (start < 100) {
      // Handle post
      var anchor = document.querySelector('.create-time');

      var btn = createBtn('copyText');
      btn.setAttribute('class', 'owner-icon');
      btn.copyTextFun = () => {
        const title = document.querySelector('.article h1').innerText.trim();
        const info = (Array.from(document.querySelectorAll('h3 span'))
                     .map(span => span.innerText).join('\t'));
        const content = document.querySelector('.rich-content').innerText.trim();
        const meta = this.formatMeta();
        return `${title}\n${meta}\n${info}\n\n${content}`;
      };

      if (anchor) {
        anchor.parentNode.insertBefore(btn, anchor.nextSibling);
      }
    }

    // Handle reply
    const comments = document.querySelectorAll('li[class*="comment-item"]');
    var floor = start + 1;

    for (var i = 0; i < comments.length; i++) {
      const comment = comments[i];

      const btnId = `copyText${i}`;
      btn = createBtn(btnId, 'a');

      btn.copiedText = this.formatReply(comment, floor);

      anchor = comment.querySelector('.lnk-reply');
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);

      hoverArea(comment, btnId);

      if (!comment.parentNode.id.includes('popular')) {
        comment.querySelector('h4').innerHTML += `<span class="easy-floor" style="float: right">#${floor}</span>`;
        floor += 1;
      }
    }
  }

  append () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    var start = params.start ? Number(params.start) : 0;
    var floor = start + 1;

    const comments = document.querySelectorAll('li[class*="comment-item"]');

    for (var i = 0; i < comments.length; i++) {
      const comment = comments[i];

      const btnId = `appendText${i}`;
      var btn = createAppendBtn(btnId, 'a');

      btn.copiedText = this.formatReply(comment, floor);

      var anchor = comment.querySelector('.lnk-reply');
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);

      hoverArea(comment, btnId);

      floor += 1;
    }
  }

  clear () {
    const comments = document.querySelectorAll('li[class*="comment-item"]');

    for (var i = 0; i < comments.length; i++) {
      const comment = comments[i];

      const btnId = `clearText${i}`;
      var btn = createClearBtn(btnId, 'a');

      var anchor = comment.querySelector('.lnk-reply');
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);

      hoverArea(comment, btnId);
    }
  }
};


class ZhihuQuestionProcessor extends SiteProcessor {
  formatReply (area) {
    var author = area.querySelector('.AuthorInfo-name').textContent;
    var date = area.querySelector('.ContentItem-time span').getAttribute('data-tooltip');
    var like = area.querySelector('.VoteButton--up').getAttribute('aria-label').trim();
    var link = area.querySelector('.ContentItem-time a').href;
    var content = area.querySelector('.RichContent-inner .RichText').innerText;
    return `${author}\t${date}\t${like}\n${content}\n\n原文链接: ${link}`;
  }

  copy() {
    const addButton = () => {
      const answers = document.querySelectorAll('#QuestionAnswers-answers .List-item');

      for (var i = 0; i < answers.length; i++) {
        if ( answers[i].querySelector(`#copyText${i}`) ) {
          continue;
        }

        const btnId = `copyText${i}`;
        var btn = createBtn(btnId);
        btn.setAttribute('class', 'Button Button--plain');

        btn.copiedText = this.formatReply(answers[i]);

        const anchor = answers[i].querySelector('.AnswerItem-authorInfo .AuthorInfo');
        anchor.parentNode.insertBefore(btn, anchor.nextSibling);

        hoverArea(answers[i], btnId);
      }
    };

    addButton();
    waitForKeyElements("#QuestionAnswers-answers .List-item", addButton);
  }

};


class EastMoneyProcessor extends SiteProcessor {
  copy() {
    const anchor = (Array.from(document.querySelectorAll('div.ui-confirm h3'))
                    .find(el => el.textContent === '确认信息'));

    var table = anchor.parentNode.querySelector('table');
    var rows = table.querySelectorAll('tbody tr');
    var cells = rows[0].querySelectorAll('td');

    // Extract the values from the cells
    var date = cells[0].textContent;
    var netValue = cells[4].textContent;
    var netCost = cells[5].textContent;
    var shares = cells[6].textContent;
    var fee = cells[7].textContent;

    var btn = createBtn('copyText');
    btn.copiedText = `${date},${netValue},${netCost},${shares},${fee}`;

    if (anchor) {
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }
  }

};


class SouthPlusProcessor extends SiteProcessor {
  formatReply (area) {
    const author = area.querySelector('th > div:nth-child(2) a').innerText;
    const date = area.querySelector('.tiptop .fl.gray').innerText;
    const floor = area.querySelector('.tiptop .fl .s3').innerText;
    const content = area.querySelector('.tpc_content').innerText.trim();
    var h1 = area.querySelector('.h1 .fl');
    if (h1) {
      h1 = h1.innerText;
    }

    if (floor === 'GF') {
      const meta = this.formatMeta();
      return `${h1}\n${meta}\n${author}\t${date}\t#${floor}\n${content}`;
    } else {
      return `${author}\t${date}\t#${floor}\n${h1}\n${content}`;
    }
  }

  copy() {
    const anchors = document.querySelectorAll('div.t5.t2 tr.tr1:not(.r_one)');
    this.addReplyButtons('copyText', Buttons.COPY, anchors, '.tiptop .fr a', true, false, 'a');
  }

  append() {
    const anchors = document.querySelectorAll('div.t5.t2 tr.tr1:not(.r_one)');
    this.addReplyButtons('appendText', Buttons.APPEND, anchors, '.tiptop .fr a', true, false, 'a');
  }

  clear() {
    const anchors = document.querySelectorAll('div.t5.t2 tr.tr1:not(.r_one)');
    this.addReplyButtons('clearText', Buttons.CLEAR, anchors, '.tiptop .fr a', true, false, 'a');
  }

};


class PixivProcessor extends SiteProcessor {
  formatPost(area) {
    var title = area.querySelector('div.charcoal-token main section h1').innerText;
    var content = area.querySelector('div.charcoal-token div.sc-cvdZrU.fQzCLp').innerText;
    return title + '\n\n' + content;
  }

  copy() {
    const addButton = () => {
      this.addPostButton('copyText', document, 'div.charcoal-token main section h1');
    };

    waitForKeyElements("div.charcoal-token main section h1", addButton);
  }

};


class YouzhiyouxingProcessor extends SiteProcessor {
  formatReply (area) {
    var author = area.querySelector('div span').innerText;
    var date = area.querySelector('div.tw-pl-9 div.tw-mt-4').innerText.replace('\n', '\t👍');
    var content = area.querySelector('div.tw-pl-9 p').textContent.trim();

    return `${author}\t${date}\n${content}`;
  }

  copy() {
    const commentArea = document.querySelector('ul.tw-space-y-10');
    const anchors = commentArea.querySelectorAll('li');

    this.addReplyButtons('copyText', Buttons.COPY, anchors, 'div.tw-pl-9 div.tw-mt-4 svg', true, false, 'a');
  }
};


class JandanBBSProcessor extends SiteProcessor {
  formatPost (area) {
    const title = area.querySelector('h1').innerText;
    const info = area.querySelector('.thread-info').innerText;
    const content = area.querySelector('.thread-content').innerText;
    const meta = this.formatMeta();
    return `${title}\n${meta}\n${info}\n${content}`;
  }

  formatReply (area) {
    const replyInfo = area.querySelector('.topic-author').innerText.replace('\n', '\t');
    const replyContent = area.querySelector('.topic-content').innerText;

    return `${replyInfo}\n${replyContent}`;
  }

  copy() {
    var self = this;

    const addButton = () => {
      // Handle topic
      const topic = document.querySelector('.topic-container');
      this.addPostButton('copyText', topic, '.thread-bottom span:last-child', 'span');

      // Handle reply
      // 分开写 append, clear 按钮加不进去
      const anchors = document.querySelectorAll('#replies .reply-container .reply');

      for (var i = 0; i < anchors.length; i++) {
        const copyBtnId = `copyText${i}`;
        const copyBtn = this.createButtonByType(copyBtnId, Buttons.COPY, 'span');

        const appendBtnId = `appendText${i}`;
        const appendBtn = this.createButtonByType(appendBtnId, Buttons.APPEND, 'span');

        const clearBtnId = `clearText${i}`;
        const clearBtn = this.createButtonByType(clearBtnId, Buttons.CLEAR, 'span');

        const anchor = anchors[i].querySelector('.topic-function span');
        if (anchor) {
          copyBtn.copyTextFun = (() => {
            const currentAnchor = anchors[i];
            return () => self.formatReply(currentAnchor);
          })();

          appendBtn.copyTextFun = (() => {
            const currentAnchor = anchors[i];
            return () => self.formatReply(currentAnchor);
          })();

          anchor.parentNode.insertBefore(copyBtn, anchor);
          anchor.parentNode.insertBefore(appendBtn, anchor);
          anchor.parentNode.insertBefore(clearBtn, anchor);

          hoverArea(anchors[i], copyBtnId);
          hoverArea(anchors[i], appendBtnId);
          hoverArea(anchors[i], clearBtnId);
        }
      }

    };

    waitForKeyElements(".reply-container", addButton);
  }

};


/********************************* Util *********************************/

function createBtn(id='copyText', ele='button') {
  var btn = document.createElement(ele);

  btn.innerHTML = 'Copy';
  btn.setAttribute('id', id);
  btn.addEventListener('click', copyText, false);

  return btn;
}

function createAppendBtn(id='appendText', ele='button') {
  var btn = document.createElement(ele);

  btn.innerHTML = 'Append';
  btn.setAttribute('id', id);
  btn.addEventListener('click', appendText, false);

  return btn;
}

function createClearBtn(id='clearText', ele='button') {
  var btn = document.createElement(ele);

  btn.innerHTML = 'Clear';
  btn.setAttribute('id', id);
  btn.addEventListener('click', clearText, false);

  return btn;
}

function hoverArea(area, id) {
  area.querySelector(`#${id}`).style.display = 'none';

  area.addEventListener('mouseover', function(id) {
    return function() {
      this.querySelector(`#${id}`).style.display = 'inline';
    };
  }(id));

  area.addEventListener('mouseout', function(id) {
    return function() {
      this.querySelector(`#${id}`).style.display = 'none';
    };
  }(id));
}

function addBtn() {
  var site = new SiteProcessor();

  try{
    switch(window.location.hostname){
    case "www.cool18.com":
    case "cool18.com":
      site = new Cool18Processor();
      break;
    case "www.sis001.com":
    case "sis001.com":
      site = new Sis001Processor();
      break;
    case "www.sexinsex.net":
    case "sexinsex.net":
      site = new SexinsexProcessor();
      break;
    case "www.v2ex.com":
    case "v2ex.com":
      site = new V2exProcessor();
      break;
    case "www.douban.com":
    case "douban.com":
      site = new DoubanProcessor();
      break;
    case "www.zhihu.com":
    case "zhihu.com":
      site = new ZhihuQuestionProcessor();
      break;
    case "query.1234567.com.cn":
      site = new EastMoneyProcessor();
      break;
    case "www.south-plus.org":
    case "south-plus.org":
      site = new SouthPlusProcessor();
      break;
    case "www.pixiv.net":
    case "pixiv.net":
      site = new PixivProcessor();
      break;
    case "www.youzhiyouxing.cn":
    case "youzhiyouxing.cn":
      site = new YouzhiyouxingProcessor();
      break;
    case "www.jandan.net":
    case "jandan.net":
      site = new JandanBBSProcessor();
      break;
    case "www.bilibili.com":
    case "bilibili.com":
      site = new BilibiliProcessor();
      break;
    default:
      throw new Error('undefined source');
    }

    site.process();
  } catch(e){
    console.error(e);
  }
}

addBtn();

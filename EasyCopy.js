// ==UserScript==
// @name         Easy Copy
// @namespace    ynjxsjmh.web.utils
// @version      0.1
// @description  Add copy button to some sites
// @author       Ynjxsjmh
// @match        *.cool18.com/bbs4/*
// @match        *.sis001.com/forum/*
// @match        *.v2ex.com/t/*
// @match        *.douban.com/group/topic/*
// @match        *.zhihu.com/question/*
// @match        *.query.1234567.com.cn/Query/Detail*
// @match        *.*zhct.*/weixin/orderdetail/*
// @match        *.south-plus.org/read.php*
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @grant        none
// ==/UserScript==


function copyText(evt) {
  var text = evt.currentTarget.copiedText;
  if (text === null || text === undefined || text === '') {
    var copyTextFun = evt.currentTarget.copyTextFun;
    text = copyTextFun();
  }

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

  const btn = evt.currentTarget;
  btn.innerHTML = 'Copied';
  setTimeout(function() { btn.innerHTML = 'Copy'; }, 3000);
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


function addCool18() {
  const anchor = document.querySelector('button');

  var btn = document.createElement('button');
  btn.innerHTML = 'Copy';
  btn.setAttribute('id', 'copyText');
  btn.addEventListener('click', copyText, false);
  btn.copiedText = document.querySelector('pre').innerText;

  if (anchor) {
    anchor.parentNode.insertBefore(btn, anchor.nextSibling);
  }
}

function addSis001() {
  const anchors = document.querySelectorAll('.mainbox.viewthread');

  for (var i = 0; i < anchors.length; i++){
    const anchor = anchors[i].querySelector('.postcontent .postinfo a');

    var btn = document.createElement('a');
    btn.innerHTML = 'Copy';
    btn.setAttribute('id', `copyText${i}`);
    btn.addEventListener('click', copyText, false);
    btn.copiedText = anchors[i].querySelector('.postcontent .noSelect').innerText;

    if (anchor) {
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }
  }
}

function addV2ex() {

  // Handle post
  var post = document.querySelector('#Main .box');
  var title = post.querySelector('h1').innerText;
  var author = post.querySelector('.gray a').innerText;
  var date = post.querySelector('.gray span').title;
  var topic_content = post.querySelector('.topic_content');
  var content = "[作者未添加正文]";
  if (topic_content !== null) {
    content = topic_content.innerText;
  }

  var btn = document.createElement('button');
  btn.innerHTML = 'Copy';
  btn.setAttribute('id', 'copyText');
  btn.addEventListener('click', copyText, false);
  btn.copiedText = `${title}\n${author}\t${date}\n${content}`;
  const anchor = post.querySelector('.gray');
  anchor.parentNode.insertBefore(btn, anchor.nextSibling);

  // Handle reply
  const anchors = document.querySelectorAll('#Main .box .cell');

  for (var i = 0; i < anchors.length; i++){
    const anchor = anchors[i].querySelector('.fr .no');

    var btn = document.createElement('button');
    btn.innerHTML = 'Copy';
    btn.setAttribute('id', `copyText${i}`);
    btn.addEventListener('click', copyText, false);
    btn.style.display = 'none';

    if (anchor) {
      var author = anchors[i].querySelector('.dark').innerText;
      var date = anchors[i].querySelector('.ago').innerText;
      var like = anchors[i].querySelector('.small') ? ('❤' + anchors[i].querySelector('.small').innerText.trim()) : '';
      var floor = anchors[i].querySelector('.fr .no').innerText;
      var content = anchors[i].querySelector('.reply_content').innerText;
      btn.copiedText = `${author}\t${date}\t${like}\t#${floor}\n${content}`;
      anchor.parentNode.insertBefore(btn, anchor);
    }

    anchors[i].onmouseover = function() {
      this.getElementsByTagName('button')[0].style.display = 'inline';
    };

    anchors[i].onmouseout = function() {
      this.getElementsByTagName('button')[0].style.display = 'none';
    };
  }
}

function addZhct() {
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

function addDouban () {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  var start = params.start ? Number(params.start) : 0;

  if (start < 100) {
    // Handle post
    var anchor = document.querySelector('.create-time');

    var btn = document.createElement('button');
    btn.innerHTML = 'Copy';
    btn.setAttribute('id', 'copyText');
    btn.setAttribute('class', 'owner-icon');
    btn.addEventListener('click', copyText, false);
    btn.copyTextFun = () => {
      var info = Array.from(document.querySelectorAll('h3 span')).map(span => span.innerText).join('\t');
      var content = document.querySelector('.rich-content').innerText.trim();
      return `${info}\n\n${content}`;
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

    btn = document.createElement('a');
    btn.innerHTML = 'Copy';
    btn.setAttribute('id', `copyText${i}`);
    btn.setAttribute('class', `copyText`);
    btn.addEventListener('click', copyText, false);
    btn.style.display = 'none';

    var info = comment.querySelector('h4').innerText;
    var like = comment.querySelector('.comment-vote').innerText;
    var quote = comment.querySelector('.reply-quote');
    var quoteContent = quote ? '> ' + quote.innerText : '';
    var content = comment.querySelector('.reply-content').innerText;

    btn.copiedText = `${info}\t${like}\t#${floor}\n${quoteContent}\n${content}`;

    anchor = comment.querySelector('.lnk-reply');
    anchor.parentNode.insertBefore(btn, anchor.nextSibling);

    comment.onmouseover = function() {
      this.querySelector('.copyText').style.display = 'block';
    };

    comment.onmouseout = function() {
      this.querySelector('.copyText').style.display = 'none';
    };

    if (!comment.parentNode.id.includes('popular')) {
      comment.querySelector('h4').innerHTML += `<span style="float: right">#${floor}</span>`;
      floor += 1;
    }
  }
}

function addZhihuQuestion() {
  const addButton = () => {
    const answers = document.querySelectorAll('#QuestionAnswers-answers .List-item');

    for (var i = 0; i < answers.length; i++) {
      if ( answers[i].querySelector(`#copyText${i}`) ) {
        continue;
      }

      var btn = document.createElement('button');
      btn.innerHTML = 'Copy';
      btn.setAttribute('id', `copyText${i}`);
      btn.setAttribute('class', 'Button Button--plain');
      btn.addEventListener('click', copyText, false);
      btn.style.display = 'none';

      answers[i].onmouseover = function() {
        this.getElementsByTagName('button')[0].style.display = 'inline';
      };

      answers[i].onmouseout = function() {
        this.getElementsByTagName('button')[0].style.display = 'none';
      };

      var author = answers[i].querySelector('.AuthorInfo-name').textContent;
      var date = answers[i].querySelector('.ContentItem-time span').getAttribute('data-tooltip');
      var like = answers[i].querySelector('.VoteButton--up').getAttribute('aria-label').trim();
      var link = answers[i].querySelector('.ContentItem-time a').href;
      var content = answers[i].querySelector('.RichContent-inner .RichText').innerText;
      btn.copiedText = `${author}\t${date}\t${like}\n${content}\n\n原文链接: ${link}`;

      const anchor = answers[i].querySelector('.AnswerItem-authorInfo .AuthorInfo');
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }
  };

  addButton();
  waitForKeyElements("#QuestionAnswers-answers .List-item", addButton);
}

function addEastMoney() {
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

  var btn = document.createElement('button');
  btn.innerHTML = 'Copy';
  btn.setAttribute('id', 'copyText');
  btn.addEventListener('click', copyText, false);
  btn.copiedText = `${date},${netValue},${netCost},${shares},${fee}`;

  if (anchor) {
    anchor.parentNode.insertBefore(btn, anchor.nextSibling);
  }
}

function addSouthPlus() {
  const anchors = document.querySelectorAll('div.t5.t2 tr.tr1:not(.r_one)');

  for (var i = 0; i < anchors.length; i++) {
    var btnId = `copyText${i}`;
    var btn = createBtn(btnId, 'a');

    const anchor = anchors[i].querySelector('.tiptop .fr a');

    if (anchor) {
      var author = anchors[i].querySelector('th > div:nth-child(2) a').innerText;
      var date = anchors[i].querySelector('.tiptop .fl.gray').innerText;
      var floor = anchors[i].querySelector('.tiptop .fl .s3').innerText;
      var content = anchors[i].querySelector('.tpc_content').innerText.trim();
      btn.copiedText = `${author}\t${date}\t#${floor}\n${content}`;
      anchor.parentNode.insertBefore(btn, anchor);
    }

    anchors[i].onmouseover = (function(id) {
      return function() {
        this.querySelector(`#${id}`).style.display = 'inline';
      };
    })(btnId);

    anchors[i].onmouseout = (function(id) {
      return function() {
        this.querySelector(`#${id}`).style.display = 'none';
      };
    })(btnId);
  }

}

function createBtn(id='copyText', ele='button') {
  var btn = document.createElement(ele);

  btn.innerHTML = 'Copy';
  btn.setAttribute('id', id);
  btn.addEventListener('click', copyText, false);
  btn.style.display = 'none';

  return btn;
}

function addBtn() {
  try{
    switch(window.location.hostname){
    case "www.cool18.com":
    case "cool18.com":
      addCool18();
      break;
    case "www.sis001.com":
    case "sis001.com":
      addSis001();
      break;
    case "www.v2ex.com":
    case "v2ex.com":
      addV2ex();
      break;
    case "www.douban.com":
    case "douban.com":
      addDouban();
      break;
    case "www.zhihu.com":
    case "zhihu.com":
      addZhihuQuestion();
      break;
    case "query.1234567.com.cn":
      addEastMoney();
      break;
    case "www.south-plus.org":
    case "south-plus.org":
      addSouthPlus();
      break;
    default:
      throw TypeError;
    }
  } catch(e){
    console.log(e);
    console.log("unknown source");
  }
}

addBtn();

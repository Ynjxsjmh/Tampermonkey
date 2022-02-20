// ==UserScript==
// @name         Easy Copy
// @namespace    ynjxsjmh.web.utils
// @version      0.1
// @description  Add copy button to some sites
// @author       Ynjxsjmh
// @match        *.cool18.com/bbs4/*
// @match        *.sis001.com/forum/*
// @match        *.v2ex.com/t/*
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

function cool18() {
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

function sis001() {
  const anchors = document.querySelectorAll('.mainbox.viewthread');

  for (var i = 0; i < anchors.length; i++){
    const anchor = anchors[i].querySelector('.postcontent .postinfo a');

    var btn = document.createElement('button');
    btn.innerHTML = 'Copy';
    btn.setAttribute('id', 'copyText');
    btn.addEventListener('click', copyText, false);
    btn.copiedText = document.querySelector('.postcontent .noSelect').innerText;

    if (anchor) {
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }
  }
}

function v2ex() {

  // Handle post
  var post = document.querySelector('#Main .box');
  var title = post.querySelector('h1').innerText;
  var author = post.querySelector('.gray a').innerText;
  var date = post.querySelector('.gray span').title;
  var content = post.querySelector('.topic_content').innerText;

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

    anchors[i].onmouseover = function() {
      this.getElementsByTagName('button')[0].style.display = 'block';
    };

    anchors[i].onmouseout = function() {
      this.getElementsByTagName('button')[0].style.display = 'none';
    };

    if (anchor) {
      var author = anchors[i].querySelector('.dark').innerText;
      var date = anchors[i].querySelector('.ago').innerText;
      var like = anchors[i].querySelector('.small') ? ('❤' + anchors[i].querySelector('.small').innerText.trim()) : '';
      var floor = anchors[i].querySelector('.fr .no').innerText;
      var content = anchors[i].querySelector('.reply_content').innerText;
      btn.copiedText = `${author}\t${date}\t${like}\t#${floor}\n${content}`;
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }
  }
}

function zhct() {
  const anchor = document.getElementById('nutrient');

  const getText = () => {
    const restaurant = document.getElementById('store_name').innerText;
    var text = '';
    const transactions = document.querySelectorAll("#lines > div");
    for (let i = 0; i < transactions.length; i++) {
      var transaction = transactions[i].querySelector("div");
      var lines = transaction.childNodes;

      const time = lines[lines.length-1].innerText;
      const item = lines[0].innerText.split('\n').slice(0, 2).join(' ');
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

function addBtn() {
  try{
    switch(window.location.hostname){
    case "www.cool18.com":
    case "cool18.com":
      cool18();
      break;
    case "www.sis001.com":
    case "sis001.com":
      sis001();
      break;
    case "www.v2ex.com":
    case "v2ex.com":
      v2ex();
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

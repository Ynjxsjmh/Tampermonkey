// ==UserScript==
// @name         Easy Copy
// @namespace    ynjxsjmh.web.utils
// @version      0.1
// @description  Add copy button to some sites
// @author       Ynjxsjmh
// @match        https://www.cool18.com/bbs4/*
// @match        https://www.sis001.com/forum/*
// @grant        none
// ==/UserScript==

function copyText(evt) {
  var val = document.querySelector(evt.currentTarget.selector);

  var aux = document.createElement("div");
  aux.setAttribute("contentEditable", true);
  aux.innerHTML = val.innerHTML;
  document.body.appendChild(aux);
  window.getSelection().selectAllChildren(aux);
  document.execCommand("copy");
  document.body.removeChild(aux);

  const btn = document.querySelector('#copyText');
  btn.innerHTML = 'Copied';
  setTimeout(function() { btn.innerHTML = 'Copy'; }, 3000);
}

function cool18() {
  const anchor = document.querySelector('button');

  var btn = document.createElement('button');
  btn.innerHTML = 'Copy';
  btn.setAttribute('id', 'copyText');
  btn.addEventListener('click', copyText, false);
  btn.selector = 'pre';

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
    btn.selector = '.postcontent .noSelect';

    if (anchor) {
      anchor.parentNode.insertBefore(btn, anchor.nextSibling);
    }
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
    default:
      throw TypeError;
    }
  } catch(e){
    console.log("unknown source");
  }
}

addBtn();

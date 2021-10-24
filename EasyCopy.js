// ==UserScript==
// @name         Easy Copy
// @namespace    ynjxsjmh.web.utils
// @version      0.1
// @description  Add copy button to some sites
// @author       Ynjxsjmh
// @match        https://www.cool18.com/bbs4/*
// @grant        none
// ==/UserScript==

function copyText(evt) {
  var val = document.querySelector(evt.currentTarget.selector);
  window.getSelection().selectAllChildren(val);
  document.execCommand('Copy');

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

function addBtn() {
  try{
    switch(window.location.hostname){
    case "www.cool18.com":
    case "cool18.com":
      cool18();
      break;
    default:
      throw TypeError;
    }
  } catch(e){
    console.log("unknown source");
  }
}

addBtn();

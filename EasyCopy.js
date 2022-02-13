// ==UserScript==
// @name         Easy Copy
// @namespace    ynjxsjmh.web.utils
// @version      0.1
// @description  Add copy button to some sites
// @author       Ynjxsjmh
// @match        *.cool18.com/bbs4/*
// @match        *.sis001.com/forum/*
// @grant        none
// ==/UserScript==


function copyText(evt) {
  var text = evt.currentTarget.copiedText;

  if (!navigator.clipboard) {
    fallbackCopyText(text);
    return;
  } else {
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  const btn = document.querySelector('#copyText');
  btn.innerHTML = 'Copied';
  setTimeout(function() { btn.innerHTML = 'Copy'; }, 3000);
}

function fallbackCopyText(text) {
  var aux = document.createElement("div");
  aux.setAttribute("contentEditable", true);
  aux.innerHTML = text;
  document.body.appendChild(aux);
  window.getSelection().selectAllChildren(aux);
  document.execCommand("copy");
  document.body.removeChild(aux);
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

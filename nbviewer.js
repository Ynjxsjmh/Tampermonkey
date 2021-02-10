
// ==UserScript==
// @name         Open in nbviewer
// @namespace    ynjxsjmh.web.utils
// @version      0.1
// @description  在 nbviewer 中打开
// @author       Ynjxsjmh
// @include      https://github.com/
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

(function() {
  var href = '';
  const url = location.href;
  const githubRepoRegex = /github.com\/([^/]+?)\/(.+)/;
  const githubBranchRegex = /github.com\/([^/]+?)\/([^/]+?)\/(tree)\/(.+)/;
  const githubContentRegex = /github.com\/([^/]+?)\/([^/]+?)\/(tree|blob)\/([^/]+?)\/(.+)/;

  if (url.match(githubContentRegex)) {
    const match = url.match(githubContentRegex);
    href = `https://nbviewer.jupyter.org/github/${match[1]}/${match[2]}/${match[3]}/${match[4]}/${match[5]}`;
  } else if (url.match(githubBranchRegex)) {
    const match = url.match(githubBranchRegex);
    href = `https://nbviewer.jupyter.org/github/${match[1]}/${match[2]}/${match[3]}/${match[4]}`;
  } else {
    const match = url.match(githubRepoRegex);
    href = `https://nbviewer.jupyter.org/github/${match[1]}/${match[2]}/tree/master`;
  }

  const anchor = document.querySelector('.btn.d-none.d-md-block');

  const btn =
    `<a class="${anchor.className}" style="background: rgb(221, 120, 64); color: #fff;" target="_blank" href="${href}">` +
    'Open in nbviewer' +
    '</a>';

  anchor.insertAdjacentHTML('beforeBegin', btn);
})();

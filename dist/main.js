/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/content.js":
/*!****************************!*\
  !*** ./scripts/content.js ***!
  \****************************/
/***/ (() => {

eval("// what do i want?\n// a list of url + title \n//          and desc eventually on hover like they do in wikipedia \n// i want this displayed in graph/tree format. three.js\n// save current url -> next url )\n\n\n// const desc = document.getElementsByClassName('shortdescription')[0].innerText;\n// console.log(\"desc:\", desc);\n\n// {\n//   nodes: [ {id: 'name', desc: 'something'} ],\n//   links: [ {source: 'name1', target: 'name2'} ]\n// }\n\n\n// Listen for link clicks or navigation events in the page\ndocument.addEventListener(\"click\", handleLinkClick);\n\nfunction handleLinkClick(event) {\n    // console.log(\"event:\", event);\n    if (event.target.tagName === \"A\") {\n        var currentPageUrl = window.location.href;\n        var targetUrl = event.target.href;\n        // console.log(\"current url:\", currentPageUrl);\n        // console.log(\"target url:\", targetUrl);\n\n        const title = document.getElementById('firstHeading').children[0].innerHTML;\n        // console.log(\"title:\", title);\n        \n        const desc = document.getElementsByClassName('shortdescription')[0].innerText;\n        // console.log(\"desc:\", desc);\n\n\n        // Send a message to the background script with the navigation information\n        chrome.runtime.sendMessage({ currentPageUrl, targetUrl, title, desc });\n    }\n}\n\n\n//# sourceURL=webpack:///./scripts/content.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./scripts/content.js"]();
/******/ 	
/******/ })()
;
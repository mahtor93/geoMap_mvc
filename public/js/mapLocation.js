/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapLocation.js":
/*!*******************************!*\
  !*** ./src/js/mapLocation.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    const lat = document.querySelector('#PRP_latitud').value || -36.8269900;\r\n    const lng = document.querySelector('#PRP_longitud').value || -73.0497700;\r\n    const mapLoc = L.map('mapLocation').setView([lat, lng ], 16);\r\n    let marker;\r\n\r\n    const geocodeService = L.esri.Geocoding.geocodeService();\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapLoc);\r\n\r\n    marker = new L.marker([lat,lng],{\r\n        draggable:true,\r\n        autoPan:true\r\n    }).addTo(mapLoc)\r\n    marker.on('moveend',function(evt){\r\n        marker = evt.target\r\n        const position = marker.getLatLng();\r\n        mapLoc.panTo(new L.LatLng(position.lat,position.lng));\r\n        geocodeService.reverse().latlng(position, 16).run(function(error,resultado){\r\n            marker.bindPopup(resultado.address.LongLabel)\r\n\r\n            document.querySelector('.calle').textContent = `Dirección: ${resultado?.address?.Address ?? ''}`;\r\n            document.querySelector('#PRP_direccion').value = resultado?.address?.Address ?? '';\r\n            document.querySelector('#PRP_latitud').value = resultado?.latlng?.lat ?? '';\r\n            document.querySelector('#PRP_longitud').value = resultado?.latlng?.lng ?? '';\r\n        })\r\n    })\r\n\r\n})()\n\n//# sourceURL=webpack://prybienesraices-mvc/./src/js/mapLocation.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapLocation.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;
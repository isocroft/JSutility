  /**************************************************************************
   *  Copyright © 2013 @abnlabs http://cproscodedev.com.ng                  *
   *  All Rights Reserved                                                   *
   *                                                                        *
   *  @package Polyfill Library                                             *
   *  @license GPL                                                          *
   *  @authors  Codedev Team                                                *
   *  @description  provides polyfill functionality for all browsers!!!     *
   *                                                                        *
   * ---------------------------------------------------------------------- *
   * File Name: JSutil-1.0-beta.js                                          *
   * Version: 1.0 (beta)                                                    *
   * Date Created: 21/03/2012                                               *
   * Date Released: 17/09/2013                                              *
   *                                                                        *
   * Redistribution and use in source and binary forms, with or without     *
   * modification are permitted under open source licensing terms without   *
   * the transfer of rights                                                 *        
   * ---------------------------------------------------------------------- *
   * THIS LIBRARY IS PROVIDED BY THE COPYRIGHT HOLDERS AND AUTHORS ON AN    *
   * "AS IS" BASIS HENCE ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING,      *
   * BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND      * 
   * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE *
   * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,    *
   * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES               *
   * ---------------------------------------------------------------------- *
   *                                                                        *
   **************************************************************************/
var hOwn = Object.prototype.hasOwnProperty, tStr = Object.prototype.toString, DomReady = false, _IE_Trident = document.documentMode,
    IE7 = _IE_Trident && document.documentMode == 7, IE_n8 = _IE_Trident && document.documentMode < 9, 
    Safari2 = (!navigator.taintEnabled && navigator.vendor == 'Apple Computer' && /gecko/g.test(navigator.userAgent.toLowerCase())), Opera5 = navigator.userAgent.indexOf("Opera 5") > -1;  // Opera & Safari UA detection...   

var eventlistener = new function(){
 this.NOT_ACTIVE = 0; // false
 this.ACTIVE = 1; // true
 this.ACTIVE_AND_CAPTURING = 2; // true
 this.ACTIVE_AND_BUBBLING = 3; // true
};

var globalEvent, EventList = new Array(), addEventStatus = eventlistener.NOT_ACTIVE;

function EventsObserver(){
var type, ev;
  if(addEventStatus){
      while(EventList.length != 0){
	     ev = EventList.pop()
	     type = ev.evttp;
	     processCapture(type, addEventStatus, ev);
	  }
	 //window.console.log("EventList has a capacity of "+EventList.length+" and the event type is: "+type); 
	 return true; 
  }else{
     // IE conditional comment
	 //window.console.log("addEventStatus has a value of "+addEventStatus);
	 if(/*@cc_on!@*/ false && IE_n8){ // make sure its IE (test for script condition comments)!!!
         if(document.readyState == "complete")
		     addEventStatus = eventlistener.ACTIVE;
			 
		 setTimeout(arguments.callee, 0);
		 return;
	  } 
     return false;		
  }
}

function processCapure(sknode, enums, evet){
    var prnt, objf, objh = new ObjectBuffer();
    if(sknode.evtfc.done){
       objh.load(getAllParents(sknode.evtob), enums);
	   globalEvent = document.createEventObject(evet.evt);
	   for(var t = 0; t < objh.getLength(); t++){
	       prnt = objh.getObject(t);
	       if(hOwn.call(prnt, 'listeners')){
		       objf = window.JSON.parse(prnt.getAttribute("listeners"));
		       prnt.attachEvent('onpropertychange', function(){
			         var rnt, ty = sknode.evttp;
				     switch(ty){
				        case "click":
						  rnt = setTimeout(function(){
						      clearTimeout(rnt);
				              prnt.click();
						  },50);	  
						break;   
				        default:
						 rnt = setTimeout(function(){
						     clearTimeout(rnt);
	                         prnt.fireEvent('on'+sknode.evttp, globalEvent);
					     },50);		 
				     }   
			   });
			      for(var r in objf){
			          if(r.toString() == "triggers")
					     objf['triggers'] = (objf[r])+1;					  
			      }
			   if(!objf['triggers']) objf['triggers'] = 1;	  
			   prnt.setAttribute("listeners", window.JSON.stringify(objf));
		   }else{ continue; }
	   }	 
	}
}

function ObjectBuffer(){
  var me = this;
  var objects = new Array();
  me.getLength = function(){ return objects.length; }
  me.getObject = function(radix){ return (objects.length > 0)? objects[radix] : null; }
  me.flush = function(){ objects.emptyArray(); return; }
  me.load = function(objs, flag){ me.flush(); (flag == eventlistener.ACTIVE_AND_CAPTURING)? objects.push(objs) : ((flag == eventlistener.ACTIVE_AND_BUBBLING)? objects.push(objs.reverse()) : null); }
  me.append = function(arr){ (me.getLength() <= 0)? objects.push(arr) : objects.concat(arr); return me.getLength(); }
}

function getCurrElementStyle(el,prop){
if(typeof(prop) == "undefined")return;
 var styl = null;
  if(document.all && document.documentMode != 9){  
styl = el.currentStyle[prop];
  }
  else{
styl = (window.getComputedStyle)? window.getComputedStyle(el,null)[prop] : document.defaultView.getComputedStyle(el,null)[prop]; 
   }
return styl;
}  

function uniqueObject(ar, type){
 var a, i, j;
 if(type=="Array"){
    a = []; 
    o: // label 'o'
    for (i = 0; i < ar.length; ++i) {
      for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
       a.push(ar[i]);
    }
  }else if(type=="Object"){
   a = {};
   u: // label 'u'
     for(i in ar){
	   if(ar[i] == a[i]){ continue u }
	      a[i] = ar[i];
	 }
  }else{ return; }	
    return a;
}

function getBasicCoords(elem) {
		var coords = { x: 0, y: 0 };
		while (elem) {
			coords.x += elem.offsetLeft;
			coords.y += elem.offsetTop;
			elem = elem.offsetParent;
		}
   return coords;
}

function recoilElements(arr, last){
          if(!(arr instanceof Array)) return; // check if [arr] is an array of DOM elements
	      var temp, base = (arr.length > 1) ? arr.shift() : null; // equate to the first element or null...
		  if(base === null) return;
		  while((temp = arr.shift()) != null){ //while the array still contains elements, shift topmost element and append... 
		       base = base.appendChild(temp);
		  }
	 base.appendChild(last); // finally, append the [last] element in the array
}

function placeStrRegExps(obj, revsolidus){
	   var output = "";
	   for(var t in obj){
	     output += revsolidus.source + obj[t].source + "|";
	   }	   
	   output += revsolidus.source + revsolidus.source;
	   return output;
}

function traverseDOMTreeByCallBack(node, callback, n_arr, root){
   root = root || document;
   if(n_arr.length > 0) n_arr = [];
   var children = root.childNodes;
   if(children !== null){
      var u = 0, child
      for(;child = children[u]; u++){
	     if(child.nodeType == 1){
	       if((root)? typeof(callback.call(child,node)) != "undefined" : null){
		       n_arr.push(child);
			   traverseDOMTreeByCallBack(node, callback, n_arr, child); 
		   }
		 }else{ continue; } // If current child is not an element node, move to the next child in the [children] array 
	  }
   }else{ 
          if(root.nodeType == 1){
             if(callback.call(root,node)){
			    return n_arr.push(root);
			 }
          }else{ return n_arr; } 
   }
}

function decToHex(num){
 if(!/\d{1,}/.test(num) || !/\d{1,}/.test(""+num)) return 'null';
 if(num) return Number(num).toString(16);
}

function getAllParents(obj){
   var node, d = [];
    function loadArrayWithParent(_obj, _d){
         if((node = _obj) !== null){
	          _d.push(node);
		      return loadArrayWithParent(_obj.parentNode, _d); // recursive call
	     }else{
	          return d; // base case scenario for inner recursive...
	     }
	}
	return loadArrayWithParent(obj.parentNode, d);
}

function createObjNameSpace(ns){
var o, a;			
a = ns.split(".");	
if(window && typeof(window) == 'object')		
o = window[a[0]] = window[a[0]] || {};	

  if(a.length > 1){		
     for(i=1; i < a.length; i++){
	      o = o[a[i]] = o[a[i]] || {};	
     }
   }	 
  return o;		
}

function stripTags(docObj){
 if(typeof(docObj) == 'string'){
var hold = docObj.replace(/<.*?>/ig, "").replace(/<\/.*>/ig,"");
return hold;
}else{
 return null;
 }
}

function mirrorObject(Obj1, Obj2) {
    for (var prop in Obj2){
	    if('hasOwnProperty' in Obj2){ 
           if (Obj2.hasOwnProperty(prop) && !(hOwn.call(Obj1, prop)))
                Obj1[prop] = Obj2[prop];  // copy the property or method from [Obj2] to [Obj1] if [Obj1] does not have it!            
           
		   if(Obj2.hasOwnProperty(prop) && hOwn.call(Obj1, prop))
		        Obj1[prop] = Obj2[prop]; // update [Obj1] using values from [Obj2] if [Obj1] does have it! 
		}else{ // since window [Obj1] object in IE 8 does not support 'hasOwnProperty' method!!!
		  if(hOwn.call(Obj2, prop) && !Obj1[prop])
		       Obj1[prop] = Obj2[prop]; 
		}
    }
	return Obj1;
}

function getAllIndexOf(str, c){
   var f = [-2]; // the start index is -2(since -2+1 gives us a good start index for 'indexOf' method!!)
   function loadArrayWithIndex(_str, _c, _f){
      var dice = _f.length - 1, index = _f[dice], radix = _str.indexOf(_c, index+1);
         if(radix > -1){ // check to see if we found [_c]
            _f.push(radix); // if true,  fill up the array with the index
		    return loadArrayWithIndex(_str, _c, _f); // recursive call
        }else{
	       return _f.splice(1,_f.length - 1); // base case scenario for inner recursive...
	    }
	}
  return loadArrayWithIndex(str, c, f);	// initiate recursive calls...
} 

function reverseString(initstr){
  if(typeof(initstr) == 'string'){
     var rev = '';
	 for(var s = (initstr.length - 1); s >= 0; s--){
	    rev += initstr.charAt(s);
	 }
	 return rev;
  }else{
    return;
  }
}

function Camelizr(str, delim){
var _inx, len = str.length, f = len - 1, str = str+delim, 
inx = str.indexOf(delim) + 1 , val = str.substr(0, inx - 1); 
  for(;inx < f; ++inx){
    _inx = inx;
    val += str.charAt(_inx).toUpperCase();
	inx = str.indexOf(delim, _inx);
	val += str.substring((_inx + 1), inx);
  }
  return val.replace(/\-$/,'');
}

function DeCamelizr(str, delim){
 var val = '', d = 0, sst = str;
  sst = sst.split('');
  for(; d < sst.length; d++){
     if(str.charAt(d).toLowerCase() != sst[d]){
		 val += (delim) ? delim + str.charAt(d).toLowerCase() : str.charAt(d).toLowerCase();
	 }else{ val += str.charAt(d); }	 
  }
  return val.replace(/\-$/,''); 
}

function convertStyleList(style){
  if(style == "") return null;
  var f = 0, aobj = {},st = style.split(';'),ast = new Array();
  for(; f < st.length;f++){
      ast[f] = st[f].split(':');
	  aobj[Camelizr(ast[f][0], "-")] = ast[f][1];
  }
  return aobj;
}
   
function isNode(node){
if(typeof(node) != "undefined"){
var doesInterfaceExist = (typeof(Node)=="object" || typeof(Node)=="function")? true: false;
 }
else{return;}

if(doesInterfaceExist){
return (node instanceof Node && typeof(node)=="object" && typeof(node.nodeType)=="number" && typeof(node.nodeName)=="string")? true: false;
  }
else{return null;}
}

function isElementNode(elemnode){
var z = isNode(elemnode)
return (z && elemnode.nodeType == 1 && elemnode.appendChild !== undefined)? true : false;
}

function isAttributeNode(attrnode){
var q = isNode(attrnode)
return (q && attrnode.nodeType == 2)? true : false;
}

function isTextNode(textnode){
var a = isNode(textnode)
return (a && textnode.nodeType == 3 && textnode.nodeValue !== undefined)? true : false;
}

function error(msg){
return (new Error(msg));
}   

function terror(tmsg){
return (new TypeError("TypeError: "+tmsg));
}

function serror(msg){
return (new Error("SyntaxError: "+msg));
}

function isEven(num){
if(isNaN(num)) return;
var mod = num % 2;
return (mod == 0)? true: false;
}

/*!
 * Global Custom Methods Defs
 */

var _handleQuery = function(aspect,url){
          if(typeof(url) == "undefined"){
              url = document.location.search
          }
            if(typeof(aspect) == "string"){
               var mode = url.replace(/^\?/,"");
               var q = mode.split("&");
                for(var k=0; k < q.length; k++){
                    if(q[k].indexOf(aspect) != -1){
                        return decodeURIComponenet(q[k].substring(q[k].indexOf("=")+1));
                    }
                }
            }else{return;}
} 

var _setCookie = function (name, value, expires, secure) {
                // the [expire] parameter should reflect the number of days for the cookie to be set
                if (typeof (expires) != "undefined") {
                    var exp, date = new Date();
                    if (typeof (expires) == 'number') {
                        date.setTime(date.getTime() + (1000 * 24 * 60 * 60 * expires));
                        exp = date.toGMTString();
                    } else {
                        exp = "";
                    }
                } else {
                    exp = "";
                }
                if (typeof (secure) == 'boolean') {
                    document.cookie = name + "=" + escape(value) + ";expires=" + exp + ";path=/;domain=" + document.domain + ";secure=" + secure;
                    return true;
                } else if (typeof (secure) == 'undefined') {
                    document.cookie = name + "=" + escape(value) + ";expires=" + exp + ";path=/;domain=" + document.domain;
                    return true;
                }
				return false; 
}

var _setStaticCookie = function (name, value, secure) {
                //set this cookie for 15 years from now
                var exp = 365 * 15;
                _setCookie(name, value, exp, secure);
}
  
var _readCookie = function (ckname) {
                var val = ckname + "=";
                var result = document.cookie.split(';');
                for (var i = 0; i < result.length; i++) {
                    var c = result[i];
                    while (c.charAt(0) == ' ')
                        c = c.substring(1, c.length);
                    if (c.indexOf(val) == 0)
                        return unescape(c.substring(val.length, c.length));
                }
                return false;
}

var _unsetCookie = function (name) {
                if (document.cookie != "") {
                    var isThere = (name === _readCookie(name));
                    if (isThere) {
                        _setCookie(name, "", -1);
                    }
                } else { return false; }
}
  
var _ajaxGET = function(url,callback,asXML,params,Asyn){
                        var req = false, ret = null, Asyn = Asyn || true, params = params || null;
                        try{
                           req = new XMLHttpRequest();
                        }catch(ez){
                           req = new ActiveXObject('Msxml2.XMLHTTP') || new ActiveXObject("Microsoft.XMLHTTP");
                        }
                    if(!req){
                             return;
                    }else{
                          if(typeof(callback) == 'function'){
                              if(url.indexOf("?") > -1)
                               req.open("GET",url,true);
							else
                               req.open("GET", url);
							   
                              req.onreadystatechange= (Asyn === true) ? function(){
                                 if(req.readyState==4 && req.status==200){
											     ret = (asXML == false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, status:req.statusText});
												 };
												return ret(); 
                                            }else{ req.abort(); return req.statusText; }
                              } : null;
                              req.send(null);
                          }
                    }
 } 
 
var _ajaxPOST = function (url, callback, asXML, params, Asyn) {
            var req = false, ret = null, params = params || null, Asyn = Asyn || true, modified = (d.all) ? "Sat, 1 Jan 2000 00:00:00 GMT" : new Date().toUTCString();
            try {
                req = new XMLHttpRequest();
            } catch (ez) {
                req = new ActiveXObject('Msxml2.XMLHTTP') || new ActiveXObject("Microsoft.XMLHTTP"); // IE 6 only
            }
            if (!req) {
                return;
            } else {
                if (typeof (params) === null && typeof (callback) == "function") {
                    req.open("POST", url);
                    req.onreadystatechange = (Asyn === true) ? function () {
                        if (req.readyState == 4 && req.status == 200) {
                            ret = (asXML == false) ? function () {
                                return callback({ done: true, text: req.responseText, status: req.statusText });
                            } : function () {
                                return callback({ done: true, text: req.responseXML, status: req.statusText });
                            };
                            return ret();
                        } else { callback.call({ done: false, text: null, status: req.statusText }); req.abort(); }
                    } : null;
                    req.send(null);
                } else if (typeof (params) == "string" && typeof (callback) == "function") {
                    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    req.setRequestHeader("If-Modified-Since", modified); // fixing IE caching problem!
                    req.setRequestHeader("Content-Length", params.length);
                    req.open("POST", url);
                    req.onreadystatechange = (Asyn === true) ? function () {
                        if (req.readyState == 4 && req.status == 200) {
                            ret = (asXML == false) ? function () {
                                return callback({ done: true, text: req.responseText, status: req.statusText });
                            } : function () {
                                return callback({ done: true, text: req.responseXML, status: req.statusText });
                            };
                            return ret();
                        } else { callback.call({ done: false, text: null, status: req.statusText }); req.abort(); }
                    } : null;
                    req.send(params);
                } else { }

            }
}
 
/*! 
 * Global Native Methods Defs
 */ 
 
var _doc_addEventListener = function (etype, ehandle, capture) {
            // based on Diego Perini's solution: [http://javascript.nwbox.com/IEContentLoaded/]
            etype = (etype == "DOMContentLoaded") ? "readystatechange" : etype;
            var iFrame, state = document.readyState, bod = document.getElementsByTagName("body")[0] || document.body, COMPL = "complete";
			    function doReady(){
	                    try {
	                        document.documentElement.doScroll("left");
							ready();
	                    } catch(e){   
	                        window.setTimeout(doReady, 0);
	                    }
	            }
					
			   try{
				     iFrame = (window.frameElement !== null);
				   }catch(er){}
			    
		    if(!iFrame){
	              doReady();		 
	        }else{
                document.attachEvent("on" + etype, function (e) {
                    //NOTE: (if [bod] is undefined) - IE's flag for "DOM not ready"		
                    if (state == COMPL) {
                       // document.detachEvent("on" + etype, arguments.callee); // now detach 'onreadystatechange' event to avoid duplicate calls    
                        if (!!~e) {
                            e = window.event; // update the event object...
                            e.stopPropagation = (e.stopPropagation) ? e.stopPropagation : function () { e.cancelBubble = true; }
                            e.preventDefault = (e.preventDefault) ? e.preventDefault : function () { e.returnValue = false; }
                            e.target = e.srcElement || ((document.documentMode && document.documentMode >= 8)? HTMLDocument : {});
                            e.root = e.target.ownerDocument || document;
                            e.relatedTarget = (e.type.indexOf("mouse") > -1 && e.fromElement === e.target) ? e.toElement : e.fromElement;
                            e.currentTarget = (arguments.callee) ? e.srcElement : this.parentNode;
                            e.timestamp = (new Date).getTime();
                            e.metaKey = (e.type.indexOf("key") > -1 && e.ctrlKey) ? e.ctrlKey : e.shiftKey;
                            e.which = (e.type == "click") ? e.button : (e.type.indexOf("key") > -1 && e.charCode !== null) ? e.charCode : e.keyCode;
                            e.pageX = e.clientX + (e.root.body.scrollLeft || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientLeft || e.root.documentElement.clientLeft || 0);
                            e.pageY = e.clientY + (e.root.body.scrollTop || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientTop || e.root.documentElement.clientTop || 0);
                        }
                      
                          ehandle.call(null, e); // [ehandle] is fired only by a call function...             
                    }
                });
            }
			
			if(Safari2){   // Deal with (Safari) browsers here
                if (DomReady) return;
				var set;
                if (!(/loaded|complete/).test(state)) {
                    set = setTimeout(arguments.callee, 0); // if [state] is 'interactive', call this function all over again!! 
                    return;
                }
				clearInterval(set);
                ready();
            }

            function ready() {
                  ehandle.call(null);
				  DomReady = true;	
            }
        
} 

var _doc_removeEventListener = function (type, func, capture) {
            // deal with capture...
            return document.detachEvent('on' + type, function (e) {
                if (!! ~e) {
                    e = window.event; // update the event object...
                    e.stopPropagation = (e.stopPropagation) ? e.stopPropagation : function () { e.cancelBubble = true; }
                    e.preventDefault = (e.preventDefault) ? e.preventDefault : function () { e.returnValue = false; }
                    e.target = e.srcElement || ((document.documentMode && document.documentMode >= 8)? HTMLDocument : {});
                    e.root = e.target.ownerDocument || document;
                    e.relatedTarget = (e.type.indexOf("mouse") > -1 && e.fromElement === e.target) ? e.toElement : e.fromElement;
                    e.timestamp = (new Date).getTime();
                    e.metaKey = (e.type.indexOf("key") > -1 && e.ctrlKey) ? e.ctrlKey : e.shiftKey;
                    e.which = (e.type == "click") ? e.button : (e.type.indexOf("key") > -1 && e.charCode !== null) ? e.charCode : e.keyCode;
                    e.pageX = e.clientX + (e.root.body.scrollLeft || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientLeft || e.root.documentElement.clientLeft || 0);
                    e.pageY = e.clientY + (e.root.body.scrollTop || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientTop || e.root.documentElement.clientTop || 0);
                }
                if (typeof (func) == "function") {
                    func.call(null, e); // "this" refers to the window object - so no need to worry
                }
            });
}

var _win_addEventListener = function (type, func, capture) {
            window.attachEvent('on' + type, function (e) {
                if (!! ~e) {
                    e = window.event; // update the event object...
                    e.stopPropagation = (e.stopPropagation) ? e.stopPropagation : function () { e.cancelBubble = true; }
                    e.preventDefault = (e.preventDefault) ? e.preventDefault : function () { e.returnValue = false; }
                    e.target = e.srcElement || ((document.documentMode && document.documentMode >= 8)? HTMLDocument : {});
                    e.root = e.target.ownerDocument || document;
                    e.relatedTarget = (e.type.indexOf("mouse") > -1 && e.fromElement === e.target) ? e.toElement : e.fromElement;
                    e.currentTarget = (arguments.callee) ? e.srcElement : this.parentNode;
                    e.timestamp = (new Date).getTime();
                    e.metaKey = (e.type.indexOf("key") > -1 && e.ctrlKey) ? e.ctrlKey : e.shiftKey;
                    e.which = (e.type == "click") ? e.button : (e.type.indexOf("key") > -1 && e.charCode !== null) ? e.charCode : e.keyCode;
                    e.pageX = e.clientX + (e.root.body.scrollLeft || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientLeft || e.root.documentElement.clientLeft || 0);
                    e.pageY = e.clientY + (e.root.body.scrollTop || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientTop || e.root.documentElement.clientTop || 0);
                }
                if (typeof (func) == "function"){
                    func.call(window, e);
                }
            });
}

var _win_removeEventListener = function (type, func, capture) {
            // deal with capture...
            return window.detachEvent('on' + type, function (e) {
                if (!! ~e) {
                    e = window.event; // update the event object...
                    e.stopPropagation = (e.stopPropagation) ? e.stopPropagation : function () { e.cancelBubble = true; }
                    e.preventDefault = (e.preventDefault) ? e.preventDefault : function () { e.returnValue = false; }
                    e.target = e.srcElement || ((document.documentMode && document.documentMode >= 8)? HTMLDocument : {});
                    e.root = e.target.ownerDocument || document;
                    e.relatedTarget = (e.type.indexOf("mouse") > -1 && e.fromElement === e.target) ? e.toElement : e.fromElement;
                    e.timestamp = (new Date).getTime();
                    e.metaKey = (e.type.indexOf("key") > -1 && e.ctrlKey) ? e.ctrlKey : e.shiftKey;
                    e.which = (e.type == "click") ? e.button : (e.type.indexOf("key") > -1 && e.charCode !== null) ? e.charCode : e.keyCode;
                    e.pageX = e.clientX + (e.root.body.scrollLeft || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientLeft || e.root.documentElement.clientLeft || 0);
                    e.pageY = e.clientY + (e.root.body.scrollTop || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientTop || e.root.documentElement.clientTop || 0);
                }
                if (typeof (func) == "function") {
                    func.call(this, e); // "this" refers to the window object - so no need to worry
                }
            });
}
 
var _getElemsByCls = function(cname){
             var retArr = [], ek = document.getElementsByTagName('*') || [];
             for(var t=0;t<ek.length;t++){
               if(ek[t].className.indexOf(" ")>=0){
                   var all = ek[t].className.split(" ");
                     for(var z=0;z<all.length;z++){
                       if(all[z]==cname){ retArr.push(ek[t])}
                     }   
                 }else if(ek[t].className==cname){ 
				    retArr.push(ek[t])
				 }else{}
             }
          return retArr;   
}

var _wrapElement = function (htmlStr, outer) {
                // Define vars...
                outer = outer || false;
                var parent = this.parentNode || this.nexSibling.parentNode, 
				_this = this.cloneNode(true),
				AttRe = /((\s*[\w]+\s*)\=(\s*(['"])[^'"]*\4\s*))/i, // uses numbered reference for parathesized pattern subexpression!!
				OWhiteSpRe = /^\s+|\s+$/,
				NdNameSplitRe = /^([\w]+)(?=\s{1})/,
				AttrSplitRe = /\s{1}(?=['"])/,
				RemoveQutRe = /(\u0027|\u0022)/g, // i.e. ' OR "
				HTMLInpRe = /\s*(<([^>]+)>){1,}\s*(<\/([^>]+)>){1,}\s*/ig,
				isValid = (typeof(htmlStr) == "string") ? HTMLInpRe.test(htmlStr) : false,
                IhtmlStr = htmlStr.substr(0, htmlStr.indexOf("/") - 1),
                allIndexLA = getAllIndexOf(IhtmlStr, "<"),
                allIndexRA = getAllIndexOf(IhtmlStr, ">"),
                arrRR = [],
 				attr_pp;
				
				parent.removeChild(this); // detach the node from the DOM!!

                if (isValid) {
                    var attr_pair_arrRR = [], node_arrRR = [], base_arrRR = [], attr_arrRR = [], sub_arrRR = [], y = (allIndexLA.length == allIndexRA.length) ? 0.0 : Math.min(allIndexLA.length, allIndexRA.length);
                   
                    if(y === 0.0){
					   for (var x = 0; x < allIndexRA.length; x++) {
                           arrRR[x] = htmlStr.substring(allIndexLA[x] + 1, allIndexRA[x]); // begin parsing htmlStr in tag format...
                       }
					}else{ 
                        if (allIndexLA.length == y) {
                            throw error("Missing '<' in HTML input");
                        } else if(allIndexRA.length == y){
                            throw error("Missing '>' in HTML input");
                        }else{}
					}   

                    for (var u = 0; u < arrRR.length; u++) {
                        if (arrRR[u].indexOf(" ") > -1) { // check for at least one whitespace charater...
                            arrRR[u] = arrRR[u].replace(OWhiteSpRe, "").replace(/\s{2,}/g, " ");
                            sub_arrRR[u] = (reverseString(arrRR[u]).split(AttrSplitRe)).reverse().map(function(arrP){ return reverseString(arrP); }); //  mimicing lookbehind capability as culled from [http://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript]
							node_arrRR[u] = sub_arrRR[u][0].split(" ", 1); // filter the node name first!!
                            sub_arrRR[u][0] = sub_arrRR[u][0].replace(OWhiteSpRe, "").replace(NdNameSplitRe,"");
                            attr_arrRR[u] = new Array(); // group all attributes for each tag into arrays...
                            for (var z = 0; z < sub_arrRR[u].length; z++) {
                                attr_arrRR[u][z] = sub_arrRR[u][z].replace(OWhiteSpRe, ""); // build multidimentional array...	
                            }
                        } else {
                            node_arrRR[u] = arrRR[u];
                        }
                    }

                    if (node_arrRR && node_arrRR.length > 0) {
                        for (var g = 0; g < node_arrRR.length; g++) {
                            base_arrRR[g] = document.createElement(node_arrRR[g]); // store node names for future...
                        } 

                        for (var f = 0; f < attr_arrRR.length; f++) {
						   
                            if (typeof (attr_arrRR[f]) != "undefined") { // process attribute list for each tags...
                                for (var o = 0; o < attr_arrRR[f].length; o++) {
                                    if (AttRe.test(attr_arrRR[f][o])){	// parse attribute list..
                                        attr_arrRR[f][o] = attr_arrRR[f][o].replace(OWhiteSpRe, "");
                                        attr_pair_arrRR[f] = attr_arrRR[f][o].split("=");
										
									  for(var p = 0; p < attr_pair_arrRR[f].length - 1; p++){	
                                                 attr_pp = (p+1) ? attr_pair_arrRR[f][p+1].replace(OWhiteSpRe, "").replace(RemoveQutRe, "") : '';
                                                if(IE7 && attr_pair_arrRR[f][p].trim().toLowerCase() == "class")
												    base_arrRR[f].className = attr_pp; 
													           
										        if(IE7 && attr_pair_arrRR[f][p].trim().toLowerCase() == "style")
												    base_arrRR[f].style.cssText = attr_pp 
																	
										        base_arrRR[f].setAttribute(attr_pair_arrRR[f][p], attr_pp);
									   }			
                                    } else { continue; }
                                }
                            }
                        }
                    } else { throw terror("Malformed HTML input"); }

                    var main = base_arrRR[0];  // copy out and hold the base element since the array will be emptied!! 
                    recoilElements(base_arrRR, _this);
                    parent.appendChild(main);

                } else {
                    throw serror("Cannot apply operation on HTML input");
                }


}

var _isParentTo = function (els) {
            var temp = this.getElementsByTagName('*');
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] === els) {
                    return true;
                } else {
                    continue;
                }
            }
            return false;
}

var _addCSSRules = function (rObj) {		  
            if (typeof (rObj) == "string") throw terror("argument should be of type {object}");
            if (rObj && tStr.call(rObj) == "[object Array]") {
                var i = 0, styler = "";
                while (i < rObj.length) {
                    styler += rObj[i] + ":" + rObj[i + 1] + "; "
                    i++;
                    if (!isEven(i))
                        ++i;
                }
                try {
                    this.style.cssText = styler;  // syntax used to calm complaints in FF3.0+
                } catch (ex) { (this).setAttribute("style", styler); } // IE6/IE7 will catch the error above and execute this line					
            } else if (rObj && tStr.call(rObj) == "[object Object]") {
                var n = [], i = 0, ste = convertStyleList((this.getAttribute("style") !== null) ? this.getAttribute("style") : "");
				if(ste){
				   window.console.log("Go low: "+ste);
				   rObj = mirrorObject(ste, uniqueObject(rObj, "Object"));
				}
                for (var j in rObj) {
                    n.push(DeCamelizr(j.toString(),"-"));
                    if (typeof (rObj[j]) != "function") {
                        n.push(typeof (rObj[j]) == "string" ? rObj[j] : '');
                    } else {
                        n.push(rObj[j](this));
                    }
                    ++i;
                }
                i = 0, styler = "";
                while (i < n.length) {
                    styler += n[i] + ":" + n[i + 1] + "; "
                    i++;
                    if (!isEven(i))
                        ++i;
                }
                try {
                    this.style.cssText = styler;  // syntax used to calm complaints in FF3.0+
                } catch (ex) { (this).setAttribute("style", styler); } // IE6/IE7 will catch the error above and execute this line
            } else { return; }

}

var _insertAfter = function (nel, cel) {
            if (typeof (cel) != "object" && typeof (cel.nodeType) != "number") {
                return;
            }
            if (typeof (nel) != "object" && typeof (nel.nodeType) != "number") {
                return;
            }
            if (this.childNodes.length > 0 && cel.parentNode === this) {
                this.insertBefore(nel, cel.nextSibling);
            } else { return null; }
}

var _previousElement = function (pe) {
                if (!isElementNode(pe)) return null;

                while (pe = pe.previousSibling) {
                    if (pe.nodeType == 1) return n;
                    if (pe.nodeType == 3) continue;
                    if (pe.nodeType == 9) return n.ownerDocument;
                }
}

var _isElementEmpty = function () {
            return (!(this.children.length == 0) || !(this.childNodes.length == 0)) ? false : true;
}

var _hasStyle = function (sty) {
            var esty = (document.getElementsByTagName("style")[0].innerHTML) ? document.getElementsByTagName("style")[0].innerHTML : document.getElementsByTagName("style")[0].innerText;
            var srt, obj = this, isTrue = false;
            var extSty = getCurrElementStyle(obj, sty);
            if (sty.indexOf("-") > -1) {
                srt = Camelizr(sty, "-");
            }
            return (obj.style.cssText.indexOf(sty) != -1 || extSty !== null || eval("obj.style." + srt) != "" || (esty.indexOf(obj.getAttribute("class") || obj.nodeName.toLowerCase() || obj.id) != -1)) ? true : false;
}

var _getSiblings = function () {
                var all = this.parentNode.children, sib = [];
                for (var k in all) {
                    if (k !== this)
                        sib.push(k);
                    else
                        continue;
                }
                return (sib.length > 0) ? sib : null;
}

var _nextElement = function (ne) {
                if (!isElementNode(ne)) return null;

                while (ne = ne.nextSibling) {
                    if (ne.nodeType == 1) return n;
                    if (ne.nodeType == 3) continue;
                }
}

var _getParents = function (par) {
            var _this, allPar = getAllParents(this); // get all parents in context...
            if (typeof (par) == "string") {
                _this = window._qwery(par);
            } else if (typeof (par) == "object") {
                _this = par;
            } else { return allPar; }

            if (!_this) { return null; }

            if (allPar instanceof Array) {
                if (_this instanceof Array || _this[0] !== undefined) { // capture NodeList object...
                    for (var t = 0; t < allPar.length; t++) {
                        for (var y = 0; y < _this.length; y++) {
                            if (_this[y] === allPar[t]) {
                                return _this[y];
                            } 
                        }
                    }
                } else {
                    for (var d = 0; d < allPar.length; d++) { // capture Node object..
                        if (allPar[d] === _this) {
                            return allPar[d];
                        } else {
                            continue;
                        }
                    }
                }
            } else { return; }
}

var _contains = function (objt) {
                if (typeof (objt) == "undefined") return;

                if (objt.nodeType == 3) { // attribute node
                    return (this === objt.parentNode);
                }
				else if(objt.nodeType == 9){ // document node
				   return ((this.ownerDocument || document) === objt.parentNode);
				}
                else if (objt.nodeType == 1) { // element node
                    return (this === objt.parentNode);
                }

                else if (this.compareDocumentPosition) {
                    var isK = (this.compareDocumentPosition(objt) & 16);
                    return (isK === 16);
                }
}

function _classList(obj){

    function ClassLister(domelement){
        // @ClassLister constructor 
        this.dom = domelement;
		this.setCls = function (attr) {
		   //this.dom.setAttribute('class', attr); // IE 6 / 7 somehow rejected this line...(donno why?!)
		   this.dom.className = attr;
        }
    }

    ClassLister.prototype = {
       
        add: function (input_tok){
            try {
                if (typeof (this.dom) != "object" || typeof (input_tok) != "string") {
                    throw terror('Invalid argument');
                }
            } catch (e) { 
			  try{ 
			    window.console.log("Error: 0x349219"); 
				}catch(ec){ return; } // IE6 does not support window.console.log function... 
			}

            var list;
            if (this.dom.className === null){
                this.dom.className = input_tok;
                list = '';
            } else if(this.dom.className.indexOf(" ") >= -1){
                list = this.dom.className.split(" ");
                if (list instanceof Array && this.dom.getAttribute("class") !== null) {
                    for (var i = 0; i < list.length; i++) {
                        if (this.dom.className.indexOf(input_tok) > -1){
                             return;
                        }
                    }
			      
                    this.setCls(this.dom.className + " " + input_tok);
                }
            } else{ }
        },
        item: function (i) {
            var spattr;
            if (this.dom.className === null && !(this.dom.getAttribute("class") !== null)){
                return null;
            } else {
                spattr = this.dom.className.split(/\s+/);
                for (var j = 0; j < spattr.length; j++) {
                    if (j == i)
                        return spattr[j];
                }
            }
        },
        remove: function (chosen_tok) {
            try {
                if (typeof (this.dom) !== "object" && typeof (chosen_tok) !== "string") {
                    throw terror('Invalid argument');
                }
            } catch (e) { 
			   try{ 
			     window.console.log("Error: 0x349219"); 
				 }catch(ec){ return; } // IE6 does not support window.console.log function...
			}
            var attr;
            if (this.dom.className === null) {
                return;
            } else if (this.dom.className && this.dom.className.indexOf(chosen_tok) > -1) {
                attr = this.dom.className.replace(chosen_tok, '');
                attr = attr.replace(/^\s+|\s+$/, '');
                this.setCls(attr);
            } else { }
        },
        contains: function (needle_tok) {
            if (typeof (this.dom) != "object" || typeof (needle_tok) != "string") {
                throw terror('Invalid argument');
            }
            return (this.dom.className.indexOf(needle_tok) > -1);
        },
        toggle: function (current_tok) {
            try {
                if (typeof (this.dom) != "object" || typeof (current_tok) != "string") {
                    throw terror('Invalid argument');
                }
            } catch (e) { 
			   try{ 
			     window.console.log("Error: 0x349219"); 
				 }catch(ec){ return; } // IE6 does not support window.console.log function...
			} 

            if (this.dom.className.indexOf(current_tok) > -1){
                this.remove(current_tok);
            } else {
                this.add(current_tok);
            }
        }
    }

    return new ClassLister(obj);
}

(function (w, d, undefined){

    //"use strict";

    /*!
    *  Code Function Init (CFI)
    *
    *  @process-> Method Injection Procedure
    *          -> {Element | Document} Faking Interface Replacement
    * 
    *  @notes  -> Since IE 5 / 6 / 7 do not have native support for DOM interfaces {Element | HTMLDocument | e.t.c},
    *          -> we try to mimic the functionality of extending these "hidden" interfaces by injecting
    *          -> the custom and fill methods directly into the currently loaded DOM for IE 5 / 6 / 7 / 8
    *          -> The 'injection' method uses the classic IE bug (DOM properties = DOM attributes) to make this possible
    *          -> Hence, the DOM [attributes] array and also the [getAttribute] method are affected by this in IE 5 / 6 / 7 / 8 only
    *          -> This problem is listed as a caveat of using JSutility, however, we hope to solve this issue permanently in a future version
    *          -> In addition, we implement several other non-native methods for IE 5 / 6 / 7 / 8 and W3C browsers
    */



    //IE only... [Error Handling]
    function handleError(errType, errURL, errLNum) {
        Debug.writeln("Error: " + errType + " on line " + errLNum + " at, " + errURL);
        return true; // control error reporting in IE
    }

    /*!@supermodule    Copyright © 2012
    * Qwery - Mini CSS Selector Engine
    * http://github.com/ded/qwery
    * Dustin Diaz
	* @note Using this temporarily, {Antor} CSS selector engine to replace this
    */

    w._qwery = (function () {
        var doc = d
                    , html = doc.documentElement
                    , byClass = 'getElementsByClassName'
                    , byTag = 'getElementsByTagName'
                    , qSA = 'querySelectorAll'
                    , useNativeQSA = 'useNativeQSA'
                    , tagName = 'tagName'
                    , nodeType = 'nodeType'
                    , select // main select() method, assign later
                    , id = /#([\w\-]+)/
                    , clas = /\.[\w\-]+/g
                    , idOnly = /^#([\w\-]+)$/
                    , classOnly = /^\.([\w\-]+)$/
                    , tagOnly = /^([\w\-]+)$/
                    , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
                    , splittable = /(^|,)\s*[>~+]/
                    , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
                    , splitters = /[\s\>\+\~]/
                    , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
                    , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
                    , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
                    , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/ //[dgg='&5%nns']
                    , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/ //:----('---') or :not('button')
                    , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
                    , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
                    , tokenizr = new RegExp(splitters.source + splittersMore.source)
                    , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')

        var walker = {
            ' ': function (node) {
                return node && node !== html && node.parentNode
            }
                        , '>': function (node, contestant) {
                            return node && node.parentNode == contestant.parentNode && node.parentNode
                        }
                        , '~': function (node) {
                            return node && node.previousSibling
                        }
                        , '+': function (node, contestant, p1, p2) {
                            if (!node) return false
                            return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
                        }
        }

        function cache() {
            this.c = {}
        }
        cache.prototype = {
            g: function (k) {
                return this.c[k] || undefined
            }
                    , s: function (k, v, r) {
                        v = r ? new RegExp(v) : v
                        return (this.c[k] = v)
                    }
        }

        var classCache = new cache()
                   , cleanCache = new cache()
                   , attrCache = new cache()
                   , tokenCache = new cache()

        function classRegex(c) {
            return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
        }

        // not quite as fast as inline loops in older browsers so don't use liberally
        function each(a, fn) {
            var i = 0, l = a.length
            for (; i < l; i++) fn(a[i])
        }

        function flatten(ar) {
            for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
            return r
        }

        function arrayify(ar) {
            var i = 0, l = ar.length, r = []
            for (; i < l; i++) r[i] = ar[i]
            return r;
        }

        function previous(n) {
            while (n = n.previousSibling) if (n[nodeType] == 1) break;
            return n
        }

        function q(query) {
            return query.match(chunker)
        }

        // called using `this` as element and arguments from regex group results.
        // given => div.hello[title="world"]:foo('bar')
        // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
        function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
            var i, m, k, o, classes
            if (this[nodeType] !== 1) return false
            if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
            if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
            if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
                for (i = classes.length; i--; ) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
            }
            if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
            if (wholeAttribute && !value) { // select is just for existance of attrib
                o = this.attributes
                for (k in o) {
                    if (hOwn.call(o, k) && (o[k].name || k) == attribute) {
                        return this
                    }
                }
            }
            if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
                // select is for attrib equality
                return false
            }
            return this
        }

        function clean(s) {
            return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
        }

        function checkAttr(qualify, actual, val) {
            switch (qualify) {
                case '=':
                    return actual == val
                case '^=':
                    return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
                case '$=':
                    return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
                case '*=':
                    return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
                case '~=':
                    return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
                case '|=':
                    return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
            }
            return 0
        }

        // given a selector, first check for simple cases then collect all base candidate matches and filter
        function _qwery(selector, _root) {
            var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
      , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
      , dividedTokens = selector.match(dividers)

            if (!tokens.length) return r

            token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
            if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
            if (!root) return r

            intr = q(token)
            // collect base candidates to filter
            els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
      function (r) {
          while (root = root.nextSibling) {
              root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
          }
          return r
      } ([]) :
      root[byTag](intr[1] || '*')
            // filter elements according to the right-most part of the selector
            for (i = 0, l = els.length; i < l; i++) {
                if (item = interpret.apply(els[i], intr)) r[r.length] = item
            }
            if (!tokens.length) return r

            // filter further according to the rest of the selector (the left side)
            each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
            return ret
        }

        // compare element to a selector
        function is(el, selector, root) {
            if (isNode(selector)) return el == selector
            if (arrayLike(selector)) return !! ~flatten(selector).indexOf(el) // if selector is an array, is el a member?

            var selectors = selector.split(','), tokens, dividedTokens
            while (selector = selectors.pop()) {
                tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
                dividedTokens = selector.match(dividers)
                tokens = tokens.slice(0) // copy array
                if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
                    return true
                }
            }
            return false
        }

        // given elements matching the right-most part of a selector, filter out any that don't match the rest
        function ancestorMatch(el, tokens, dividedTokens, root) {
            var cand
            // recursively work backwards through the tokens and up the dom, covering all options
            function crawl(e, i, p) {
                while (p = walker[dividedTokens[i]](p, e)) {
                    if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
                        if (i) {
                            if (cand = crawl(p, i - 1, p)) return cand
                        } else return p
                    }
                }
            }
            return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
        }

        function isNode(el, t) {
            return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
        }

        function uniq(ar) {
            var a = [], i, j;
            o:
            for (i = 0; i < ar.length; ++i) {
                for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
                a[a.length] = ar[i]
            }
            return a
        }

        function arrayLike(o) {
            return (typeof o === 'object' && isFinite(o.length))
        }

        function normalizeRoot(root) {
            if (!root) return doc
            if (typeof root == 'string') return qwery(root)[0]
            if (!root[nodeType] && arrayLike(root)) return root[0]
            return root
        }

        function byId(root, id, el) {
            // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
            return root[nodeType] === 9 ? root.getElementById(id) :
      root.ownerDocument &&
        (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
          (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
        }

        function qwery(selector) {
            var m, el, root = normalizeRoot(doc)

            // easy, fast cases that we can dispatch with simple DOM calls
            if (!root || !selector) return []
            if (selector === window || isNode(selector)) {
                return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
            }
            if (selector && arrayLike(selector)) return flatten(selector)
            if (m = selector.match(easy)) {
                if (m[1]) return (el = byId(root, m[1])) ? [el] : []
                if (m[2]) return arrayify(root[byTag](m[2]))
                if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
            }

            return select(selector, root)
        }

        // where the root is not document and a relationship selector is first we have to
        // do some awkward adjustments to get it to work, even with qSA
        function collectSelector(root, collector) {
            return function (s) {
                var oid, nid
                if (splittable.test(s)) {
                    if (root[nodeType] !== 9) {
                        // make sure the el has an id, rewrite the query, set root to doc and run it
                        if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
                        s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
                        collector(root.parentNode || root, s, true)
                        oid || root.removeAttribute('id')
                    }
                    return;
                }
                s.length && collector(root, s, false)
            }
        }

        var isAncestor = 'compareDocumentPosition' in html ?
    function (element, container) {
        return (container.compareDocumentPosition(element) & 16) == 16
    } : 'contains' in html ?
    function (element, container) {
        container = container[nodeType] === 9 || container == window ? html : container
        return container !== element && container.contains(element)
    } :
    function (element, container) {
        while (element = element.parentNode) if (element === container) return 1
        return 0
    }
  , getAttr = function () {
      // detect buggy IE src/href getAttribute() call
      var e = doc.createElement('p')
      return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
        function (e, a) {
            return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
            e.getAttribute(a, 2) : e.getAttribute(a)
        } :
        function (e, a) { return e.getAttribute(a) }
  } ()
  , selectQSA = function (selector, root) {
      var result = [], ss, e
      try {
          if (root[nodeType] === 9 || !splittable.test(selector)) {
              // most work is done right here, defer to qSA
              return arrayify(root[qSA](selector))
          }
          // special case where we need the services of `collectSelector()`
          each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
              e = ctx[qSA](s)
              if (e.length == 1) result[result.length] = e.item(0)
              else if (e.length) result = result.concat(arrayify(e))
          }))
          return ss.length > 1 && result.length > 1 ? uniq(result) : result
      } catch (ex) { }
      return selectNonNative(selector, root)
  }
        // no native selector support
  , selectNonNative = function (selector, root) {
      var result = [], items, m, i, l, r, ss
      selector = selector.replace(normalizr, '$1')
      if (m = selector.match(tagAndOrClass)) {
          r = classRegex(m[2])
          items = root[byTag](m[1] || '*')
          for (i = 0, l = items.length; i < l; i++) {
              if (r.test(items[i].className)) result[result.length] = items[i]
          }
          return result
      }
      // more complex selector, get `_qwery()` to do the work for us
      each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
          r = _qwery(s, ctx)
          for (i = 0, l = r.length; i < l; i++) {
              if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
          }
      }))
      return ss.length > 1 && result.length > 1 ? uniq(result) : result
  }
  , configure = function () {
      // configNativeQSA: use fully-internal selector or native qSA where present
      select = selectNonNative;

  }

        configure();

        qwery.configure = configure
        qwery.uniq = uniq
        qwery.is = is
        qwery.pseudos = {}

        return qwery;
    })();

    if (d.all) {

        w.onerror = handleError;

        var _addEventListener = function (on, fn, capture) {
            //setting up capture info trace
            var listeners;
            if (capture) {
                if ((this).getAttribute("listeners") === null) {
                    (this).setAttribute("listeners", '{"events":["' + on + '"], "handlers":["' + fn.toString() + '"]}');
                } else {
                    listeners = window.JSON.parse((this).getAttribute("listeners"));               
                    (this).setAttribute("listeners", '{"events":["' + listeners['events'] + "," + on + '"] , "handlers":["' + listeners['handlers'] + "," + fn.toString() + '"]}"');
                }
				
				 addEventStatus = eventlistener.ACTIVE_AND_CAPTURING;		
            }else{
			     addEventStatus = eventlistener.ACTIVE_AND_BUBBLING;
			}
            // setting up HTTP POST data storage
            var post = null, form = null;
            if (on == "submit") {
                post = createObjNameSpace("page.POST"); // [post] becomes window['page']['POST']...
                if (post)
                    post = { data: [] }; // evaluated to window['page']['POST'].data = []...				 
            }

            return (this).attachEvent('on' + on, function (e) {
                var _fn = (this)['ex' + on + (new Date).getTime()] = fn; // really ingineous logic by John Resig!!
                if (!! ~e) {
                    e = window.event;
                    e.preventDefault = e.preventDefault || function () { e.returnValue = false };
                    e.stopPropagation = e.stopPropagation || function () { e.cancelBubble = true };
                    e.target = e.srcElement || this;
                    e.timeStamp = (new Date).getTime();
                    e.which = e.button || e.keyCode;
                    e.relatedTarget = (e.type == "mouseout") ? e.fromElement : e.toElement;
                    e.charCode = (e.type == "keypress") ? e.keyCode : 0;
                    e.isChar = (e.charCodde && e.charCode > 0 && e.type.indexOf("key") > -1) ? true : false;
                    e.bubbles = ((e.type.indexOf("click") > -1 | e.type.indexOf("mouse") > -1) && (e.type.indexOf("key") > -1 && !!e.altKey)) ? true : false;
                    e.pageX = e.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
                    e.pageY = e.clientY + (document.body.scrollTop || document.documentElement.scrollTop);
                }

                if (post !== null) { // check to see if post was set on the submit event
                    if ((this).tagName != "FORM") {
                        var pp = getAllParents(this);
                        for (var k = 0; k < pp.length; k++) {
                            if (pp[k] === (this)) {
                                form = pp[k];
                                break;
                            }
                        }
                    } else {
                        form = this;
                    }

                    var elems = form.getElementsByTagName("input");
                    for (var v = 0; v < elems.length; v++) {
                        post.data[elems[v].attributes.getNamedItem("name").nodeName] = elems[v].value; // error on this line
                    }
                }

                   _fn.addProperty('done', false.valueOf());
				   _fn.call(this, e);
				   
                var evrun = setTimeout(function(){
				     clearTimeout(evrun);
				    _fn.addProperty('done', true.valueOf());
				    EventList.push({evtob:(this), evtfc:_fn, evttp:on});
				}, 10);
					
            });
        }

        var _removeEventListener = function (on, fn, capture) {
            //if(capture) this.setCapture();
            //if(capture) this.releasecapture();
			// onlosecapture
			var listeners;
			if (capture) {
                if ((this).getAttribute("listeners") !== null) {
                    listeners = (this).getAttribute("listeners");
					//code goes here...
                } else {}
			}
            return (this).detachEvent('on' + on, function (e) {
                var _fn = (this)['ex' + on + (new Date).getTime()] = fn; // really ingineous code logic by John Resig!!
                if (!! ~e) {
                    e = window.event; // update the event object...
                    e.stopPropagation = (e.stopPropagation) ? e.stopPropagation : function () { e.cancelBubble = true; }
                    e.preventDefault = (e.preventDefault) ? e.preventDefault : function () { e.returnValue = false; }
                    e.target = e.srcElement || HTMLDocument;
                    e.root = e.target.ownerDocument || document;
                    e.relatedTarget = (e.type.indexOf("mouse") > -1 && e.fromElement === e.target) ? e.toElement : e.fromElement;
                    e.currentTarget = (arguments.callee) ? e.srcElement : this.parentNode;
                    e.timestamp = (new Date).getTime();
                    e.metaKey = (e.type.indexOf("key") > -1 && e.ctrlKey) ? e.ctrlKey : e.shiftKey;
                    e.which = (e.type == "click") ? e.button : (e.type.indexOf("key") > -1 && e.charCode !== null) ? e.charCode : e.keyCode;
                    e.pageX = e.clientX + (e.root.body.scrollLeft || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientLeft || e.root.documentElement.clientLeft || 0);
                    e.pageY = e.clientY + (e.root.body.scrollTop || e.root.documentElement.scrollLeft || 0) - (e.root.body.clientTop || e.root.documentElement.clientTop || 0);
                }
                _fn.call(this, e);
            });
        }

        var _isSameNode = function (node1, node2) {
            if (isNode(node1) && isNode(node2)) {
                if (isElementNode(node1) === isElementNode(node2) || isAttributeNode(node1) === isAttributeNode(node2) || isTextNode(node1) === isTextNode(node2))
                    return true;
                else
                    return false;
            } else {
                return null;
            }
        }

        var _getElementText = function (kind) {
            if (typeof (kind) == "undefined") kind = 0;

            if (this.children.length == 0 || isTextNode(this)) {
                kind = null;
                return this.firstChild.data;
            } else if (isElementNode(this)) {
                var whichNode = this.children[kind];
                var div = document.createElement('div');
                var holder = (div.textContent !== undefined) ? "textContent" : "innerText";
                return (whichNode !== undefined) ? whichNode[holder] : null;
            } else { return; }
        }

        var _emptyElement = function () {
            if (this.children.length > 0) {
                var child = (isElementNode(this.firstChild.nextSibling)) ? this.firstChild.nextSibling : ((this.firstChild.nodeType == 3) ? this.firstChild : "nothing");
                if (child == "nothing") return;
                var i = 0;
                if (child) {
                    while ((child = this.children.item(0)) !== null) {
                        // as an alternative, try {"Array.prototype.pop.call(this.children)"}
                        this.children.item(0).parentNode.removeChild(child); // use {"this.removeChild(child)"}
                        i = i + 1;
                    }
                }
            } else { return; }

        }

        var _removeElement = function (findParent) {
            var parent = this.parentNode;
            if (typeof (findParent) == "undefined" || !findParent) {
                if (parent.removeChild) {
                    parent.removeChild(this);
                }
            } else if (typeof (findParent) == "boolean" && findParent) {
                if (parent != null) {
                    var clone = this.cloneNode(true);
                    parent.removeChild(this);
                    return clone;
                }
            }
        }

        var _setElementText = function (word, index) {
            if (typeof (index) == "undefined") index = 0;
            if (this.children.length != 0) {
                var div = document.createElement('div');
                div.appendChild(document.createTextNode(word));
                this.children[index].innerText = div.childNodes[0].nodeValue
            } else {
                var tnode = null, containsText = false;
                for (var g = 0; g < this.childNodes.length; g++) {
                    if (this.childNodes[g].nodeType < 3) { // exclude attribute and element nodes...
                        continue;
                    } else {
                        containsText = true;
                        break;
                    }
                }
                if (containsText) {
                    this.normalise();
                    this.innerText = word;
                }
            }
        }

        var getAttrib = function (ob) {
            var customs = ['addEventListener','getElementText','hasStyle','classList','isElementEmpty',
			'isSameNode','emptyElement','addCSSRules','getSiblings','contains','removeEventListener',
			'getParents','isParentTo','insertAfter','removeElement','nextElement','previousElement',
			'setElementText'];
        
			function filterAttr(el, al){
			    for(var r=0; r < customs.length;r++){
				   if(al == customs[r]){
				       if(!hOwn.call(el, al))
					      return el.getAttribute(al);
					   else
                          return null;					   
				   }  
				}
			}
			
			return function (a) {
                return a === 'class' ? ob.className : (a === 'href' || a === 'src') ?
                ob.getAttribute(a, 2) : (a === "style") ? ob.style.cssText.toLowerCase() : filterAttr(ob, a);
            }
			
       };

        function updateDOMAttrObj(objc){
		   var attr = (!(hOwn.call(objc,'attributes'))) ? objc['attributes'] : undefined;
		   if(attr){
		       attr = Attributes(attr);
			   return attr;
		   }else{
		       return attr;
		   }
		   
		   function Attributes(at){
		        var attributes = new Array();
			    for(var i = 0; i < at.length; i++){
				    if(at[i].specified && ('nodeValue' in at[i]))
                        attributes.push(at[i]);					
				}
				
				attributes.getNamedItem = function(attnm){
				  var len = this.attributes.length;
				   if(len > 0){
				      for(var k=0; k < len;k++){
					     if(this.attributes[k].nodeName == attnm && this.attributes[k].specified)
						      return att[k];
					  }
					}
                    return null;					
				};
				return attributes;
		   }
		}
		
		

        function addMethods(obj) {
            obj.addEventListener = obj['addEventListener'] || _addEventListener;
            obj.isElementEmpty = obj['isElementEmpty'] || _isElementEmpty;
            obj.addCSSRules = obj['addCSSRules'] || _addCSSRules;
			obj.getSiblings = obj['getSiblings'] || _getSiblings;
			obj.wrapElement = obj['wrapElement'] || _wrapElement;
			obj.nextElement = obj['nextElement'] || _nextElement;
			obj.contains = obj['contains'] || _contains;
			obj.previousElement = obj['previousElement'] || _previousElement;
            obj.removeElement = obj['removeElement'] || _removeElement;
            obj.isParentTo = obj['isParentTo'] || _isParentTo;
            obj.getElementText = obj['getElementText'] || _getElementText;
            obj.emptyElement = obj['emptyElement'] || _emptyElement;
            obj.insertAfter = obj['insertAfter'] || _insertAfter;
            obj.hasStyle = obj['hasStyle'] || _hasStyle;
            obj.setElementText = obj['setElementText'] || _setElementText;
            obj.classList = obj['classList'] || _classList(obj);
            obj.isSameNode = obj['isSameNode'] || _isSameNode;
            obj.getParents = obj['getParents'] || _getParents;
			//obj.attributes = obj['attributes'] || updateDOMAttrObj(obj); // bridging the anomaly in the DOM [attribtes] array... (overriding using prototype chaining technique)
            obj.removeEventListener = obj['removeEventListener'] || _removeEventListener;
            return obj;
        }

        function addMethodsToDOM(obje) {
            if ((obje.length !== null) && (typeof (obje) == "object" || typeof (obje['item']) == "function")) {
                for (c in obje) {  // loop through the current DOM elements...
                    addMethods(obje[c]);
                    obje[c].getAttribute = getAttrib(obje[c]); // bridging the anomaly in the DOM [getAttribute] method... 
				}
            }
        }

        // good job by Eirick Backer [https://] - just borrowing your code's logic by the way...
        function docHijack(p) { var old = window.document[p]; return function (v) { return addMethods(old(v)); } } // Hijacking native 'createElement' method... 

        //shadow function for injection...	
        function enhanceDOMNodes() {
            if (d.readyState == "complete") { // make sure the DOM is fully ready!!! 
                addMethodsToDOM(d.all); // inject all patch methods to the body element
                if (typeof (Document) == "undefined") {
                    window.document.createElement = docHijack('createElement'); // hack into document.createElement in order that the DOM is updated accordingly
                } else {
                    addMethods(Element.prototype); // hacking native methods directly produces errors in IE 9+, so we try this different approach!! 
                }
            }
        }

        document.onreadystatechange = enhanceDOMNodes;
    }

    // list of conditions to check while targeting the numerous "shanky" browsers out there
    var cond0 = (typeof (Element) == "undefined").valueOf(); // include IE 5 / 6 / 7
    var cond1 = (typeof (Element) == "function").valueOf(); // include W3C only
    var cond2 = (typeof (Element) == "object").valueOf(); // include IE 8 only
    var cond3 = (d.documentMode != 9).valueOf(); // exclude IE 9 / include W3C

    if ((typeof (Element) == 'undefined' || typeof (HTMLElement) == 'undefined') && (typeof (Document) == 'undefined' || typeof (HTMLDocument) == 'undefined')) {

        // POLYFILLS FOR IE  
        if (d.all && (d.documentMode == 7 || d.documentMode === undefined)) { // IE 5 / 6 / 7 only!

            /* @submodule
            * document.hasSmoothing
            * Notes: {Zoltan Hawryluk- http://www.useragentman.com/}
            */

            document.hasSmoothing = function () {
                if (typeof (screen.fontSmoothingEnabled) != "undefined") { // IE only
                    return screen.fontSmoothingEnabled;
                }
            }
			
			/* @submodule
			 * document.addEventListener
			 */
			 
			 document.addEventListener = _doc_addEventListener;
			 
			/* @submodule
             * document.removeEventListener
             */
			 
			 document.removeEventListener = _doc_removeEventListener;

            /* @submodule
            * document.filterElements
            */

            document.filterElements = function (knode, assignFunc, rootNode) {
                var arr = [];
                if (typeof (knode) == "string")
                    knode = document.createElement(knode);
                
                return (typeof (rootNode) != "undefined") ? traverseDOMTreeByCallBack(knode, assignFunc, arr, rootNode) : traverseDOMTreeByCallBack(knode, assignFunc, arr);
                
            }

            /* @submodule
            * document.cancelContextMenu
            */

            document.cancelContextMenu = function () {
                var st = document.readyState;
                document.onreadystatechange = function () {
                    if (st == "complete") {
                        (document.body).oncontextmenu = function (oe) {
                            if (/*@cc_on!@*/false) {
                                oe = window.event;
                                oe.returnValue = false;
                            } else {
                                oe.preventDefault();
                            }
                        }
                    } else {
                        window.setTimeout(arguments.callee, 0); // call [cancelContextMenu] again...
                    }
                }
            }

            /* @submodule
            * document.setCookie
            */

            document.setCookie = _setCookie;

            /* @submodule
            * document.setStaticCookie
            */

            document.setStaticCookie = _setStaticCookie;

            /* @submodule
            * document.readCookie
            */


            document.readCookie = _readCookie;

            /* @submodule
            * document.unsetCookie
            */

            document.unsetCookie = _unsetCookie;


           /* @submodule
            * document.ajaxPOST
            */

            document.ajaxPOST = _ajaxPOST;

           /* @submodule
            * document.handleQuery
            * custom definition
            */

            document.handleQuery = _handleQuery;

           /* @submodule
            * document.ajaxGET
            * custom definition
            */

            document.ajaxGET = _ajaxGET;

            /*
            * @submodule
            * document.getElementsByClassName... (no native support By IE 5 / 6 / 7)
            * patch definition.
            */

            document.getElementsByClassName = _getElemsByCls;


            /*
            * @submodule
            * document.querySelectorAll... (no native support By IE 5 / 6 / 7)
            * patch definition.
            */
            document.querySelectorAll = w._qwery;

        }


        if (Safari2) {
            HTMLElement = function () { };
            HTMLElement.prototype = window["[[DOMElement.prototype]]"]; // Safari 2 Hack!
        }


    }




    /**
    Function: [HTMLDocument.prototype]>  getElementsByClassName
 
  
    Arguments: String:cname

 
    Notes: returns HTML collections having a class name of [cname]

    Example: var block = document.getElementsByClassName("messages");
 
    */

    if (!d.getElementsByClassName && cond2) { // IE 8 only version
        HTMLDocument.prototype.getElementsByClassName = _getElemsByCls;
    }

    /**
    Function:  [HTMLDocument]> handleQuery
  
  
  
    Arguments: String: aspect
    String: url (optional)
  
    Notes: extracts the value of a querystring parameter
  
    Example: var data = document.handleQuery("comp", document.location.href);
    */

    if (cond3 && !d.handleQuery) {
        HTMLDocument.prototype.handleQuery = _handleQuery;
    }


    /**
    Function:  [Document]> handleQuery
  
  
  
    Arguments: String: aspect
    String: url (optional)
  
    Notes: extracts the value of a querystring parameter
  
    Example: var data = document.handleQuery("comp", document.location.href);
    */

    if (!cond3 && !d.handleQuery) {  // W3C only version (Except Chrome!!)
        Document.prototype.handleQuery = _handleQuery;
    }

    if (!cond3 && !document.unsetCookie) {  // W3C only version (Except Chrome!!)
        Document.prototype.unsetCookie = _unsetCookie;
    }

    if (!cond3 && !document.addEventListener) {  // W3C only version (Except Chrome!!)
        Document.prototype.addEventListener = _doc_addEventListener;
    }


    /**
    Function: [HTMLDocument.prototype]>  ajaxGET
 
  
    Arguments: String:url
    Function: callback
    Boolean: asXML
 
    Notes: performs asynchronous get requests... 
    the parameter "data" must always be passed to the callback!!

    Example: document.ajaxGET("http://opentypefoundry.otf", function(data, stats){
    if(data)
    document.getElementById("wp-keyset").innerHTML = data;
    else
    document.getElementById("wp-keyset").innerHTML = "Oops! an error ocurred " + stats.status;
    }, false);
          
    */

    if (cond3 && !document.ajaxGET) {  // IE 8 & Chrome 2+ version 
        HTMLDocument.prototype.ajaxGET = _ajaxGET;
    }

    /**
    Function: [Document.prototype]>  ajaxGET
 
    Arguments: String:url
    Function: callback
    Boolean: asXML
    Object: params (optional)
    Boolean: Asyn (optional)
	
    Notes: performs asynchronous get requests... 
    the parameter "data" must always be passed to the callback!!

    Example: var get = document.ajaxGET("http://opentypefoundry.otf/fontrules.txt", function(data){
    if(data)
    document.getElementById("wp-keyset").innerHTML = data.text;
    else
    document.getElementById("wp-keyset").innerHTML = "Oops! an error ocurred!";
    }, false, null, false);
          
    */

    if (!cond3 && !document.ajaxGET) { // W3C only version (Except Chrome!!)...  
        Document.prototype.ajaxGET = _ajaxGET;
    }

    /**
    Function: [HTMLDocument.prototype]>  addEventListener
 
  
    Arguments: String:etype
    Function: ehandle
    Boolean: capture
			
    Notes: adds an event listener to the document object to fire when DOM is loaded

    Example:  document.addEventListener("DOMContentLoaded", function(e){ 
    window.console.log("dom is ready...");          
    }, false);
 
    */

    if (!document.addEventListener && cond2) { // IE 8 version & Safari only
        HTMLDocument.prototype.addEventListener = _doc_addEventListener;
    }
	
    /**
    Function: [Document.prototype]> removeEventListener
 
    Arguments:
 
    Notes:
 
    Example:
    */

    if (!d.removeEventListener && cond2) { // IE 8
        HTMLDocument.prototype.removeEventListener = _doc_removeEventListener
    }

    /**
    Function: [Document.prototype]>  querySelectorAll
 
  
    Arguments: String:selector

 
    Notes: returns HTML collections targeted by [selector]

    Example: var allSpan = document.querySelectorAll("div#pointers span"), elem = null;
    for(var x in allSpan){
    if(allSpan[x].id == "dropdown-box") elem = allSpan[x];
    } 
    */

    if (cond1 && !document.querySelectorAll) { // W3C only version
        Document.prototype.querySelectorAll = window._qwery;
    }

    /**
    Function: [HTMLDocument.prototype] readCookie
 
 
    Arguments: String: ckname
 
    Notes: retrieves the cookie value for [ckname]
    */

    if (cond3 && !document.readCookie) {  // IE 8 & Chrome 2.0+ version
        HTMLDocument.prototype.readCookie = _readCookie;
    }

    /**
    Function: [HTMLDocument.prototype]> setCookie
 
    Arguments: String: name, value, expires, domain, secure 
 
    Notes: sets the cookie on the browser
	
	Example: if(document.setCookie("_visited", "set", 35, true)) body.calssName += " cookielized";
    */

    if (cond3 && !document.setCookie) { // IE 8 & Chrome2+ version
        HTMLDocument.prototype.setCookie = _setCookie;
    }

    /**
    Function: [HTMLDocument.prototype] unsetCookie
  
    Arguments:  String: name
  
    Notes: unsets the cookie value for [name]
    */

    if (cond3 && !document.unsetCookie) { // IE 8 & Chrome2+ version
        HTMLDocument.prototype.unsetCookie = _unsetCookie;
    }

    /**
    Function: [Document.prototype]> readCookie
 
 
    Arguments: String: ckname
 
    Notes: retrieves the cookie value for [ckname]
    */

    if (!cond3 && !document.readCookie) {  // W3C only version...
        Document.prototype.readCookie = _readCookie;
    }

    /**
    Function: [HTMLDocument.prototype]>  ajaxPOST
 
  
    Arguments: String:url
    Function: callback
    Boolean: asXML
    Object: params (optional)
    Boolean: Asyn (optional)
	
    Notes: performs asynchronous post requests... 
    the parameters "data" and "stats" must always be passed to the callback!!

    Example: document.ajaxPOST("http://opentypefoundry.otf", function(data){
    if(data)
    document.getElementById("wp-keyset").innerHTML = data.text;
    else
    document.getElementById("wp-keyset").innerHTML = "Oops! an error ocurred " + data.status;
    }, false, null, false);
          
    */

    if (cond3 && !document.ajaxPOST) { // IE 8 & Chrome version
        HTMLDocument.prototype.ajaxPOST = _ajaxPOST;
    }

    /**
    Function: [Document.prototype]>  ajaxPOST
 
  
    Arguments: String:url
    Function: callback
    Boolean: asXML
    Object: params (optional)
 
    Notes: performs asynchronous post requests... 
    the parameters "data" and "stats" must always be passed to the callback!!

    Example: document.ajaxPOST("http://opentypefoundry.otf", function(data, stats){
    if(data)
    document.getElementById("wp-keyset").innerHTML = data;
    else
    document.getElementById("wp-keyset").innerHTML = "Oops! an error ocurred " + stats.status;
    }, false);
          
    */

    if (!cond3 && !document.ajaxPOST) { // W3C only version
        Document.prototype.ajaxPOST = _ajaxPOST;
    }

    /**
    Function: [Window.prototype]> addEventListener
 
  
    Arguments: String:type
    Function:func
    Boolean:capture

    Notes: registers event handlers on the window object and 
    processes them accordingly

    Example:  window.addEventListener("unload", cleanUp, false);

    function cleanUp(){
    //code goes here..
    }
    */

    if (cond2 && !(window.constructor.prototype.addEventListener)) {  // IE 8 only version
        window.constructor.prototype.addEventListener = _win_addEventListener;
    }

    if (cond0 && typeof (window['addEventListener']) == "undefined" && window.attachEvent) { // IE 6 / 7 only version
        window['addEventListener'] = _win_addEventListener;
    }


    /**
    Function: [Window.prototype]> removeEventListener
 
  
    Arguments: String:type
    Function:func
    Boolean:capture

    Notes: deregisters event handlers on the window object 

    Example:  window.removeEventListener("click", removeHooks, false);

    function removeHooks(){
    //code goes here..
    }

    */

    if (cond2 && !(window.constructor.prototype.removeEventListener)) { // IE 8 only version
        window.constructor.prototype.removeEventListener = _win_removeEventListener;
    }

    if (cond0 && typeof (window['removeEventListener']) == "undefined" && window.detachEvent) { // IE 6 / 7 only version
        window['removeEventListener'] = _win_removeEventListener;
    }

    /**
    Function: [Window.prototype]> showModalDialog
 
  
    Arguments: None

 
    Notes: displays a modal type window on the screen

    */

    if (window.opera && !(window.constructor.prototype.showModalDialog)) { // Opera only version
        if (window && typeof (window.dialogArguments) == "undefined") window.dialogArguments = {};

        (window.constructor.prototype).showModalDialog = function (hrefstring, diagObj, options) {
            var optstr = "dialogWidth,dialogHeight,dialogLeft,dialogTop,scroll,resizable";
            optstr = optstr.split(",");

            if (typeof (options) == "string" && typeof (hrefstring) == "string") {
                options = options.replace(/^\s+|\s+$/ig, "");
                if (options.indexOf(":") == -1) return null;

                options = options.replace(":", "=");
                options = options.replace(";", ",");
                var opts = options.split(","), terms, vals, __ter = [];
                var winopts = '';
                for (var t = 0; t < opts.length; t++) {
                    if (opts[t].indexOf("=") > -1)
                        terms = opts[t].substring(0, opts[t].indexOf("=") - 1);
                    vals = opts[t].substring(opts[t].indexOf("=") + 1);
                    // do a linear search to determine if the parameter list is valid  
                    for (var f = 0; f < optstr.length; f++) {
                        if (terms == optstr[f])
                            __ter[optstr[f]] = vals;  // create an associative array to hold mapped values 
                        else
                            continue; // jump and move to the next			  
                    }
                }
                if (__ter.length == 0) return null;
                winopts = 'height=' + __ter["dialogHeight"] + ',width=' + __ter["dialogWidth"] + ',top=' + __ter["dialogTop"] + ',left=' + __ter["dialogLeft"] + ',scrollbars=' + __ter["scroll"] + ',directories=no,resizable=' + __ter["resizable"];
                win = window.open(hrefstring, '_top', winopts);
                if (typeof (diagObj) == "object" && !win.window.closed) { win.window.focus(); }
                return typeof (win);
            }
        }
    }


    /**
    Function: [Window.prototype]> getSelectionText
 
  
    Arguments: None

 
    Notes: returns the text wrapped by a single selection

    */


    if (cond2 && !(window.constructor.prototype.getSelectionText)) { // IE only 8 version
        (window.constructor.prototype).getSelectionText = function () {
            var doc;
            return (doc = document.selection) ? doc.createRange().text : "";
        }
    }


    if (cond1 && !(window.constructor.prototype).getSelectionText) { // W3C only version
        (window.constructor.prototype).getSelectionText = function () {
            var sel;
            return (sel = window.getSelection()) ? sel.toString() : "";
        }
    }


    if (cond0 && typeof (window['getSelectionText']) == "undefined" && window.attachEvent) { // IE 5 / 6 / 7 only version
        window['getSelectionText'] = function () {
            var doc;
            return (doc = document.selection) ? doc.createRange().text : "";
        }
    }

    /**
    Function: [Window.protoype]> find
 
  
    Arguments: String:finder
    Boolean:mcase
    Boolean:forwardsrch			

 
    Notes: 
 
    Example:  var str = "component";       
    if(window.find("component", true, true)){
    document.searcher = str; // custom property
    document.location.href = "http://www.eagerman.com/query/search.php?q="+ str;
    }		   

    */

    if ((cond2 || window.opera) && !(window.constructor.prototype.find)) { // IE8 and Opera only version
        (window.constructor.prototype).find = function (finder, mcase, forwardsrch) {
            var strholder;
            if (document.all) {
                if (mcase == true && forwardsrch == true) mcase = 4; forwardsrch = 0;
                if (mcase == false && forwardsrch == true) mcase = 2; forwardsrch = 0;
                strholder = document.body.createTextRange();
                strholder.moveStart("word");
                strholder.moveEnd("word");
                strholder.select();
                return strholder.findText(finder, forwardsrch, mcase);
            }
            if (window.opera && !('OBackgroundSize' in document.body.style)) {
                strholder = document.createRange();
                return findText(finder, mcase);
            } else if (window.opera && ('OBackgroundSize' in document.body.style)) {
                return findText(finder, mcase);
            }
            function findText(ftext, usecase) {
                if (typeof (ftext) != "string") return;
                var bod = (document.body) ? document.body : document.getElementsByTagName("body")[0];

                var bodstr = bod.innerHTML

                bodstr = bodstr.replace(/<.*?>/ig, "").replace(/<\/.*>/ig, "");

                if (!usecase) {
                    if (bodstr.search(ftext) > -1) {
                        return true;
                    }
                } else {
                    var arrtext = [];

                    for (var f = 0; f < arrtext.length; f++) {
                        arrtext[f] = ftext.charCodeAt(f);
                    }
                }
                return false;
            }
        }
    }


    if (cond0 && typeof (window['find']) == "undefined" && window.attachEvent) {  // IE 6 / 7 version
        window['find'] = function (finder, mcase, forwardsrch) {
            var strholder;
            if (document.all) {
                if (mcase == true && forwardsrch == true) mcase = 4; forwardsrch = 0;
                if (mcase == false && forwardsrch == true) mcase = 2; forwardsrch = 0;
                strholder = document.body.createTextRange();
                strholder.moveStart("word");
                strholder.moveEnd("word");
                strholder.select();
                return strholder.findText(finder, forwardsrch, mcase);
            }
        }
    }

    /**
    Function: [Array.prototype]> setIndex


    Argumnets: Any Data Type: arrVal
    Number: index
  
    Notes:  arrVal > the value that must be contained in the array
    index  > the new index of [arrVal]
    */

    Array.prototype.setIndex = function (arrVal, index) {
        if (typeof (this[index]) == "undefined" || index > this.length - 1) {
            index = this.length - 1;
        }
        for (var i = 0; i < this.length; i++) {
            if ((this[i] == arrVal || this[i] === arrVal) && this[index] != arrVal) {
                this[i] = this[index];
                this[index] = arrVal;
            }
        }
    }

    /**
    Function: [Array.prototype]> reduce


    Argumnets: Function: fun
  
  
    Notes: 
  
    Example:
  
    */

    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (fun) {
            var len = this.length;
            if (typeof fun != "function" && len == 0 && arguments.length == 1) {
                return;
            }
            var i = 0;
            if (arguments.length >= 2) {
                var rv = arguments[1];
            }
            else {
                do {
                    if (i in this) {
                        rv = this[i++];
                        break;
                    }
                    if (++i >= len) break;
                } while (true);
            }
            for (; i < len; i++) {
                if (i in this) {
                    rv = fun.call(null, rv, this[i], i, this);
                }
            }
            return rv;
        }
    }

    /**
    Function: [String.prototype]> trimLeft


    Arguments: None
  
  
    Notes: for removing whitespace at the left end of a string
  
    */

    if (!String.prototype.trimLeft) {
        String.prototype.trimLeft = function () {
            return this.replace(/^\s+/, "");
        }
    }

    /**
    Function: [Array.prototype]> indexOf


    Argumnets: String: arrElem 
             
  
    Notes:  arrElem > 
		   
    */

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (arrElem) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == arrElem) return i;
            }
            return -1;
        }
    }

    /**
    Function: [Array.prototype]> Truncate


    Argumnets: None
  
  
    Notes:
  
    */

    Array.prototype.Truncate = function (radix) {
        if (typeof (radix) == 'undefined') radix = 1;
        this.length = this.length - radix;
        return this;
    }

    /**
    Function: [Array.prototype]> filter


    Argumnets: Function: q
    Conttrol: x
  
    Notes:  adapted from (StxMax.js)
    q > number to indicate the where to begin copy
    x > how many array pockets to copy
    */

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (q, x) {
            if (typeof (q) != 'function') { return; }

            var j, k, l = this.length, m = [];

            for (j = 0; j < l; ++j) {
                if (j in this) {
                    k = this[j];
                }
                if (q.call(x, k, j, this)) {
                    m.push(k);
                }
            }
            return m;
        }
    }


    /**
    Function: [String.prototype]> Capitalize


    Argumnets: None
     
  
    Notes: use > to capitalize a word or series of words in a string
    */

    String.prototype.Capitalize = function () {
        this.replace(/\s+\b/, "");
        this.replace(/\s{2,}/g, " ");
        var temp = (this.indexOf(" ")) ? this.split(" ") : this;
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].substring(1);
        }
        return temp.join(" ");
    }

    /**
    Function: [Array.prototype]> forEach


    Argumnets: Function: f
    Object : i
  
    Notes: use > use to loop over each item of an array and execute the function passed with the
    item as an argument.
			
    Example: [1,1,1].slice(1).forEach(function(x){ return (x > 0 && x < 2) });			
  
    */

    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (f, i) {
            return (Array.prototype.map.call(this, f, i));
        }
    }


    /**
    Function: [Array.prototype]> isContained


    Argumnets: String: arrElem
  
  
    Notes: use > for checking the existence of a term in the array
  
    */

    if (!Array.prototype.isContained) {
        Array.prototype.isContained = function (arrElem) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == arrElem) { return true }
            }
            return false;
        }
    }


    if (!Array.prototype.Highest) {
        Array.prototype.Highest = function () {
            var high = this[0];
            for (var i = 0; i < this.length; i++) {
                high = (this[i] > high) ? this[i] : high;
            }
            return high;
        }
    }


    /**
    Function: [String.prototype]> insertStr


    Argumnets: Number: pos 
    String: str
  
    Notes:  pos > position to begin insertion of [str]
    str > string to be inserted into original string
    */

    if (!String.prototype.insertStr) {
        String.prototype.insertStr = function (pos, str) {
            str = str.replace(/\s+\b/, "");
            var ss = this.replace(/\s{2,}/gi, " ");
            var len = this.length - 1;
            if (pos > len) pos = len;
            return (str.search(/\s{2,}/gi) == -1) ? this.substr(0, pos) + str + this.substr(pos + 1, this.length) : ss.substr(0, pos) + " " + str + " " + ss.substr(pos + 1, this.length);
        }
    }

    /**
    Function: [Array.prototype]> emptyArray
 
  
    Arguments: Boolean: withNulls

 
    Notes: empties an array completely or simply inserts empty strings at each pocket

    Example:
    */

    if (!Array.prototype.emptyArray) {
        Array.prototype.emptyArray = function (withNulls) {
            var len = this.length;
            if (typeof (withNulls) == "undefined") {
                for (var x = 0; x < len; x++) {
                    if (this[x] != "") {
                        delete this[x];
                    }
                }
                (this).length = 0;
                return this;
            }
            else if (typeof (withNulls) == "boolean" && withNulls) {
                for (var a = 0; a < len; a++) {
                    if (this[a]) {
                        try {
                            this[a] = null;
                        }
                        catch (ex) {
                            this[a] = "";
                        }
                    }
                }
                return this;
            }
        }
    }

    /**
    Function: [Array.prototype]> every


    Argumnets: None
  
  
    Notes:
  
  
    Example:
  
    */

    if (!Array.prototype.every) {
        Array.prototype.every = function (h, i) {
            if (typeof (h) != 'function') {
                return;
            }
            var j = new Object(this), k = j.length;

            for (var l = 0; l < k; l++) {
                if (l in j) {
                    if (!h.call(i, j[l], l, j)) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    /**
    Function: [String.prototype]> trim


    Argumnets:
  
  
    Notes:
  
    Example:
  
    */

if (!String.prototype.trim) {
String.prototype.trim = function () {
var str = this, len = this.length;
    if(len > 6000){
        str = str.replace(' ', function(b){
                while(str.charAt(--len) == b){
                   str = str.slice(0, len+1);
		           len = str.length;
		           reverseString(str);
                }
                return str;	
               }); 
}else{
return this.replace(/\s+\b/, "");
}
        }
    }

    /**
    Function: [Function.prototype]> addMethod


    Argumnets: String: name
    Function: func
  
    Notes:
  
    */

    Function.prototype.addMethod = function (name, func) {
        if (!this.constructor.prototype[name] && !Object.prototype.hasOwnProperty.call(this, name) && typeof (func) == "function") {
            this.constructor.prototype[name] = func;
        }
    }

    /**
    Function: [Function.prototype]> addProperty


    Argumnets:  String: title
    String: prop
  
    Notes:
  
    */

    Function.prototype.addProperty = function (title, prop) {
        if ((!(this.constructor.prototype[title]) || !(hOwn.call(this, title))) && (typeof (prop) == "boolean" || typeof (prop) == "string")) {
            this.constructor.prototype[title] = prop;
        }else{
		  this[title] = prop;
		}
    }

    /**
    Function: [Array.prototype]> map


    Argumnets: 
  
  
    Notes:
  
    */

    if (!Array.prototype.map) {
        Array.prototype.map = function (h, i) {
            if (typeof h != 'function') {
                return;
            }

            var j, k = this.length, l = new Array(k);

            for (j = 0; j < k; ++j) {

                if (j in this) {
                    l[j] = h.call(i, this[j], j, this);
                }
            }
            return l;
        }
    }

    /**
    Function: [Array.prototype]> some


    Argumnets: Function: h 
    Control: i
  
    Notes: 
  
    */

    if (!Array.prototype.some) {
        Array.prototype.some = function (h, i) {
            if (typeof (h) != 'function') {
                return;
            }

            var j = new Object(this), k = j.length;

            for (var l = 0; l < k; l++) {

                if (l in j) {

                    if (h.call(i, j[l], l, j)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    /**
    Function: [Array.prototype]> copy


    Argumnets: Number: init
    Number: length
  
    Notes:  adapted from [MooTools.js]
    init > number to indicate the where to begin copy
    length > how many array pockets to copy
    */

    if (!Array.prototype.copy) {
        Array.prototype.copy = function (init, length) {
            init = (init === undefined) ? init : 0;
            if (init < 0) init = this.length + init;
            length = length || (this.length - init);
            var newArray = [];
            for (var i = 0; i < length; i++) newArray[i] = this[init++];
            return newArray;
        }
    }

    /**
    Function: [String.prototype]> trimRight


    Argumnets: None
  
  
    Notes: trims off whitespace at the right end of a string
  
    Example: var str = new String("   Hello World!!  ");
    var str1 = "Just saying" + str.trimRight();
    */

    if (!String.prototype.trimRight) {
        String.prototype.trimRight = function () {
            return this.replace(/\s+$/, "");
        }
    }

    /**
    Function: [Array.prototype]> reduceRight
 
  
    Arguments:
      
 
    Notes: 

    */

    if (!Array.prototype.reduceRight) {
        Array.prototype.reduceRight = function (fun) {
            var len = this.length;
            if (typeof fun != "function" && len == 0 && arguments.length == 1) {
                return;
            }
            var i = len - 1;
            if (arguments.length >= 2) {
                var rv = arguments[1];
            }
            else {
                do {
                    if (i in this) {
                        rv = this[i--];
                        break;
                    }
                    if (--i < 0) return;
                }
                while (true);
            }
            for (; i >= 0; i--) {
                if (i in this) {
                    rv = fun.call(null, rv, this[i], i, this);
                }
            }
            return rv;
        }
    }

    /**
    Function: [Array.prototype]> lastIndexOf


    Arguments: String:arlm
  
  
    Notes: returns the index of the last ocurrence of [arlm] in an array
  
    Example: var counter = new Array('one','two','three','two');
    var pointer = counter.lastIndexOf('two');
             
    window.console.log(pointer);  // logger outputs 3 
    */

    if (!Array.prototype.lastIndexOf) {
        Array.prototype.lastIndexOf = function (arlm) {
            for (var u = this.length - 1; u > -1; u--) {
                if (this[u] == arlm) {
                    return u;
                }
                else { return -1; }
            }
        }
    }


    /**
    Function: [Array.prototype]> assoc
 
  
    Arguments: Array:arrKeys
      
 
    Notes: returns an asscociated array with the argument array as the key

    */

    if (!Array.prototype.assoc) {
        Array.prototype.assoc = function (arrKeys) {
            if (!(arrKeys instanceof Array)) return;
            var obj = [], len = (this.length == arrKeys.length) ? this.length : arrKeys.length;
            for (var i = 0; i < len; i++) obj[arrKeys[i]] = this[i];
            return obj;
        }
    }

    /**
    Function: [HTMLElement.prototype]> contains
 
  
    Arguments: DOM Element:objt
      
 
    Notes: returns true if [objt] is contained in the element

    */

    if (!d.all) {
        if (!(HTMLElement.prototype).contains) {
            (HTMLElement.prototype).contains = _contains;
        }



        /**
        Function: [HTMLElement.prototype]> removeElement
 
  
        Arguments: Boolean:findParent

 
        Notes: if [findParent] is true, the removed element is cloned and returned 
        else the element is removed altogether along with its parent
 
        Example:  var jscomponent = document.getElementById('pager');
        var temp_obj = jscomponent.removeElement(true);
		   
        document.getElementById('badge').appendChild(temp_obj);

        */

        if (!(HTMLElement.prototype).removeElement) {
            (HTMLElement.prototype).removeElement = function (findParent) {
                var parent = this.parentNode;
                if (typeof (findParent) == "undefined" || !findParent) {
                    if (parent.removeChild) {
                        parent.removeChild(this);
                    }
                }
                else if (typeof (findParent) == "boolean" && findParent) {
                    if (this.parentNode != null) {
                        var clone = this.cloneNode(true);
                        parent.removeChild(this);
                        return clone;
                    }
                }
            }
        }
    }

    /**
    Function: [Window.prototype.JSON]> parse

    Argumnets: String:str
  
    Notes: used in parsing a JSON string
  
    Example: var objt = window.JSON.parse('{ "name":"Paul Audu", "age":23, "hobbies":["eating","reading","sleeping"] }');
  
    */
    if (window && (window.JSON === undefined)) {
        window.JSON = {};
        //GLOBAL FUNCS
        var spaces = function (val) {
            var sp = (!val) ? '' : ' ';
            while (val != 0) {
                sp += sp;
                --val;
            }
            return sp;
        },
        type = function (objt) { // function that returns the exact type of the argument passed!

            // based on Lea Verou's solution [http://lea.verou.me]
            var regz = /\[object\s{1}(\w+)\]/;
            return tStr.call(objt).match(regz)[1];
        },
		loop = function (objt, objtyp) { // recursive function to loop through complex json data structure!
		    var ret = '', typ;
		    if (objtyp == 'Array') {
		        for (var k = 0; k < objt.length; k++) {
		            typ = type(objt[k]);
		            if (typ == 'Array') {
		                ret += '[' + loop(objt[k], 'Array') + ']' + ",";
		            } else if (typ == 'Object') {
		                ret += '{' + loop(objt[k], 'Object') + '}' + ",";
		            } else {
		                if (typ == 'String')
		                    ret += '"' + objt[k] + '"' + ",";
		                else
		                    ret += objt[k].toString() + ",";
		            }
		        }
		    } else if (objtyp == 'Object') {
		        for (var u in objt) {
		            typ = type(objt[u]);
		            if (typ == 'Array') {
		                ret += '"' + u.toString() + '"' + ':[' + loop(objt[u], typ) + ']' + ",";
		            } else if (typ == 'Object') {
		                ret += '"' + u.toString() + '"' + ':{' + loop(objt[u], typ) + '' + ",";
		            } else {
		                if (typ == 'String')
		                    ret += '"' + u.toString() + '":' + '"' + objt[u] + '"' + ",";
		                else
		                    ret += '"' + u.toString() + '":' + String(objt[u]) + ",";
		            }
		        }
		    } else { return } // if first argument is neither an 'Array' or 'Object' then we are done here, just return control back to the calling code!! 
		    return ret.replace(/\,$/g, ''); //clear the comma char at the tail end of the last entry in an 'Array' or 'Object'!!!
		},
		value = function (objk) { // wrapper for recursive function 'loop'
		    var retu, typ = type(objk);
		    switch (typ) {
		        case 'Array':
		            retu = '[' + loop(objk, typ) + ']';
		            break;
		        case 'Object':
		            retu = '{' + loop(objk, typ) + '}';
		            break;
		        default:
		            if (typ == 'String')
		                retu = '"' + objk + '"';
		            else
		                retu = String(objk);
		    }
		    return retu;
		};

        // ++++++++ NOTES and ACRONYMS +++++++++++++
        // PEATP => means => [Possible Exception At This Point] {showing that an exception is more likely to be thrown at such a point or code line}
        // END-PARSE => means => a sentinel or marker which truly signifies the end of the parsable entity - [str]
        // POSITIVE-LOOKAHEAD => means =>
        // for string types in JSON.parse, disallowed characters are as follows - single quotes, reverse solidus and all control characters. - [str_disallowables]
        // for string types in JSON.parse, allowed characters are as follows - double quotes, solidus, reverse solidus, backspace, tab, formfeed, carriagereturn, linefeed(\n) and unicodeencodedcharacters(\u) - [str_allowables]  

        // This code {window.JSON.parse} is based on Douglas Crockford's [json_parse.js]
       
        window.JSON.parse = window.JSON.parse || function (str, reviver) {
            var rev = reviver || null;
            // HELPER VARS
            var str_allowables = { '"': /\u0022/, '/': /\u002F/, '\\': /\u005C/, b: /\u0008/, t: /\u0009/, f: /\u000C/, r: /\u000D/, n: /\u000A/ },
	    str_disallowables = { "'": /\u0027/, "": /\u005C/, "": /\u0000/, "": /\u0001/, "": /\u0002/, "": /\u0003/, "": /\u0004/,
	        "": /\u0005/, "": /\u0006/, "": /\u0007/, "": /\u000B/, "": /\u000E/, "": /\u000F/, "": /\u0010/, "": /\u0011/, "": /\u0012/,
	        "": /\u0013/, "": /\u0014/, "": /\u0015/, "": /\u0016/, "": /\u0017/, "": /\u0018/, "": /\u0019/, "": /\u001A/, "": /\u001B/,
	        "": /\u001C/, "": /\u0001D/, "": /\u001E/, "": /\u001F/
	    },
		regexInt = /^(-?(0|[1-9]+)?((\.)?\d+)?(([eE]?(?:[+-]?))([\d]+))?)$/.source,
		regexStr = /^(["]([^"]*)["])$/.source,
		regexBol = /true|false/.source,
		regexNul = /null/.source,
            //regexVal = /regexInt|regexBol|regexStr|regexNul/.source,
            //regexArr = new RegExp("^(\\[(" + regexVal + ")\\s*(\\,\\s*(" + regexVal + "))*\\])$"), // "\u005D" => ], "\u005B" => [ 
            //regexObj = new RegExp("^(\\{" + regexStr + "\\:" +  + "\\})$"),  // "\\u007B" => { , "\\u007D" => }
		unicode = function (unic) {
		    return String.fromCharCode(unic);
		},
		regex = function (rsrc) {
		    return (new RegExp(rsrc));
		},
		at = 0,
		text = str.replace(/^\s+|\s+$/, ""), // trim the ends...
		tlen = text.length,
		tlast = tlen - 1,
		chr = text.charAt(at); // end initialisation of helper vars...

            function consumeAhead(ichr, num) {
                while (ichr == ' ') { // check for occurence of whitespace  
                    num += 1; //  move the fake pointer (if whitespace occurs at such positions			 
                    ichr = text.charAt(num); // consume ahead next char
                }
                return ichr;
            }

            function consumeChars(cur) {
                if (chr) { // if chr exists...
                    if (at == (tlast + 1) || at == tlast) { chr = '\0'; return chr; } // check if [text] is an empty string or if all chars from [text] have been consumed - if so, return END-PARSE sentinel
                    at += 1; // move the pointer a step forward
                    chr = text.charAt(at);
                    while (chr == ' ') { // check for whitespace
                        at += 1; // continously move the pointer (if whitespace occurs [at] such positions)			 
                        chr = text.charAt(at); // lexemize the next char - (lexemization)
                    }

                    if (typeof cur == "undefined") {
                        return chr; // if we are not expecting a particular char next, just return the damn thing!!	
                    } else {
                        if (cur !== chr) { // where the next char consumed is expected to be a particular char [cur] and it is not
                            if (cur == '') { // check if [cur] is an empty char string (an alias for 'NO-LOOKAHEAD' instruction)
                                return chr;
                            } else {
                                // move the pointer a step back						
                                throw serror("Was expecting '" + cur + "' but found '" + chr + "'"); // throw the exception!!!
                            }
                        } else { // where the next char consumed is expected to be [cur] and it is 
                            return chr; // finally, return the result of a 'POSITIVE-LOOKAHEAD' of 1 char
                        }
                    }
                } else { // if [chr] is no longer set...
                    if (at == tlast) { // it may be that the pointer has reach the end of the parsable entity - so check this!!
                        if (cur || !cur) { // whether there is an expected char to be consumed or not
                            chr = '\0'; // set [chr] again...
                            return chr; // return 'END-PARSE' sentinel 
                        }
                    }
                }
            }

            function ifNext() {
                var dip = at + 1;
                return (/[0-9]|\.|e|E/.test(consumeAhead(text.charAt(dip), dip)))
            }

            var TOKENIZER = {
                parseObject: function () {
                    var object = {}, key, obj;
                    obj = chr; // update obj...
                    if (chr == '{') { // check if the previously consumed char is '{'
                        consumeChars(); // consume next char
                        if (chr == '}') {  // check if the next consumed char is '}'
                            obj += chr; // update obj..   
                            return object;
                        }
                        while (chr != '\0') { // while we have not reached the end of the parsable entity
                            key = TOKENIZER.parseString(); // [PEATP]
                            consumeChars(':'); // [PEATP] LOOKAHEAD for ':' only if no exception is thrown above
                            obj += '"' + key + '"' + ':'; // update obj...
                            if (hOwn.call(object, key)) {
                                throw serror('Duplicate key "' + key + '" found');
                            }
                            consumeChars('') // consume next char with NO-LOOKAHEAD instruction
                            object[key] = TOKENIZER.parseValue(); // [PEATP]
                            obj += value(object[key], type(object[key])); // if no exception is thrown above, it is safe to update obj again...								    
                            consumeChars();
                            if (chr == '}') {
                                obj += chr;
                                //if(regex(regexObj).test(obj)){
                                return object;
                                //}
                            } else if (chr == ',') {
                                obj += chr;
                                consumeChars();
                            } else {
                                throw serror("Was expecting '}' or ',' but found '" + chr + "'");
                            }
                        }
                    } else {
                        throw serror("Unexpected char '" + chr + "' found!"); // finally, throw an exception if we got a char that isn't '{'	 
                    }
                },
                parseInteger: function () {
                    var num, number;
                    num = chr;
                    consumeChars(); // consume the next char		  
                    while (chr >= '0' && chr <= '9') {
                        num += chr; // update num...	  
                        if (ifNext())// check if next char is a digit to conditionally consume the next char
                            consumeChars();
                        else
                            break;
                    }
                    if (chr == '.') {
                        num += chr;
                        while (chr != '\0') { // again keep consuming chars with no LOOKAHEAD - watch out for Unexpected END-PARSE...
                            if (ifNext()) {
                                consumeChars('');
                                if (chr >= '0' && chr <= '9')
                                    num += chr;
                            } else { break; }
                        }
                        if (chr == '\0') {
                            throw serror("Unexpected END-PARSE at" + at);
                        }
                    }
                    if (chr == 'E' || chr == 'e') {
                        num += chr; // again update [num]..
                        consumeChars(); // consume next char
                        if (chr == '-' || chr == '+') {
                            num += chr;
                        }
                        while (chr != '\0') { // again keep consuming chars with no LOOKAHEAD - watch out for Unexpected END-PARSE
                            if (ifNext()) {
                                if (chr >= '0' && chr <= '9')
                                    num += chr;
                            } else { break; }
                        }
                        if (chr == '\0') {
                            throw serror("Unexpected END-PARSE at " + at);
                        }
                    }
                    number = (regex(regexInt).test(num)) ? +num : (-1 / 0); // implicit conversion to number data type only if [num] is a valid JSON number 
                    if (!isFinite(number))
                        throw serror("Invalid number found '" + num + "'");
                    else
                        return number;
                },
                parseArray: function () {
                    var arr, pos, array = [];
                    arr = chr; // update arr...
                    if (arr == '[') { //check if previously consumed char is '['
                        consumeChars(); // consume next char..
                        if (chr == ']') { // check if the next consumed char is ']'
                            arr += chr;
                            return array; // return an empty array...
                        }
                        while (chr != '\0') { // keep consume the subsequent chars
                            pos = TOKENIZER.parseValue(); // [PEATP]			   
                            array.push(pos); // if no exception is thrown above, it is safe to update [array]
                            arr += value(pos, type(pos)); // update [arr] as well...
                            consumeChars(''); // consume the next char with NO-LOOKAHEAD instruction
                            if (chr == ']') {
                                arr += chr; // update [arr]
                                // if(regex(regexArr).test(arr)){
                                return array; // return the array so far...
                                //}
                            } else if (chr == ',') {
                                arr += chr; // update [arr]
                                consumeChars();
                            } else {
                                throw serror("Was expecting ']' or ',' but found '" + chr + "'");
                            }
                        }
                        if (chr == '\0') { throw serror("Unexpected END-PARSE at " + at); }
                    } else {
                        throw serror("Unexpected char '" + chr + "' found");
                    }
                },
                parseBoolean: function () {
                    var bool;
                    bool = text.charAt(at - 1) + chr; // trying to form token 'true' or 'false' from chars 'tr' OR 'fa' already consumed!!
                    if (bool == 'tr' || bool == 'fa') {
                        consumeChars(); // consume the next char
                        if (chr == 'u' || chr == 'l') { // trying to form token 'true' from the first three chars - 'tr'+'u' OR 'fa'+'l'
                            bool += chr; // update bool
                            consumeChars();
                            if (chr == 'e') {
                                bool += chr; // update bool
                                if (regex(regexBol).test(bool)) {
                                    return true;
                                } else { throw serror("Badly formed Boolean '" + bool + "'"); }
                            } else if (chr == 's') {
                                bool += chr; // update bool
                                consumeChars('e'); // [PEATP] LOOKAHEAD for 'e' while trying to form token - 'fals'+'e'
                                bool += chr // update bool
                                if (regex(regexBol).test(bool)) { // test to see if [bool] equals 'false'
                                    return false;
                                } else { throw serror("Badly formed Boolean '" + bool + "'"); }
                            } else {
                                throw serror("Unexpected char " + chr + " found!");
                            }
                        }
                    } else {
                        throw serror("Unexpected chr " + chr + " found!");
                    }
                },
                parseString: function () {
                    var str, uffff, hex, uChar, string = "";
                    str = chr;
                    if (str = '"') { // make sure the string begins with double quotes
                        consumeChars(); // consume next char
                        while (chr != '\0') { // watch out for Unexpected END-PARSE
                            if (chr == '"') {
                                return string;
                            } else if (chr == "\\") {
                                consumeChars();
                                uChar = str_allowables[chr].source; // get string form of regex for allowed chars...
                                if (chr == "u") { // check if we have an ocurrence of unicode encoded chars
                                    uffff = 0;
                                    for (i = 0; i < 4; i += 1) { // convert the next 4 chars to hexadecimal encoded form with a NO-LOOKAHEAD instruction
                                        hex = parseInt(consumeChars(''), 16);
                                        if (!isFinite(hex)) {
                                            break;
                                        }
                                        uffff = uffff * 16 + hex;
                                    }
                                    string += unicode(uffff); // get the original char form its unicode equivalent...
                                    str += unicode(uffff); // update str...
                                } else if (typeof (uChar) == "string") {
                                    Int = parseInt(uChar.replace(/^\\u00/, ''), 16);
                                    string += unicode(Int);
                                    str += unicode(Int);
                                } else {
                                    break;
                                }
                            } else {
                                string += chr;
                                str += chr;
                            }
                            consumeChars(); // consume the next char and update [chr] for the next "while" iteration...
                        }
                        if (chr == '\0') throw serror("Unexpected END-PARSE found");
                        if (regex(regexStr).test(str)) {
                            return string;
                        }
                    }
                    throw serror("Unexpected char " + str + " found!");
                },
                parseNull: function () {
                    var nul;
                    nul = text.charAt(at - 1) + chr; // trying to form the token 'null' from 'nu' chars already consumed!!
                    if (nul == 'nu') {
                        consumeChars(); // consume the next char
                        if (chr == 'l') {
                            nul += chr; // trying to form the token 'nul'
                            consumeChars('l'); // [PEATP] LOOKAHEAD for 'l' to form 'null'
                            nul += chr;
                            if (regex(regexNul).test(nul)) { // check to see if 'null' token was formed
                                return null;
                            } else { throw serror("Badly formed word '" + nul + "' found!") }
                        } else {
                            throw serror("Unexpected char '" + chr + "' found!");
                        }
                    }
                    throw serror("Unexpected char '" + chr + "' found!");
                },
                parseValue: function () {
                    var ichr = chr;
                    switch (ichr) {
                        case '[':
                            return TOKENIZER.parseArray(); // [PEATP] begin call for type 'Array'
                            break;
                        case '{':
                            return TOKENIZER.parseObject(); // [PEATP] begin call for type 'Object'					 
                            break;
                        case '"':
                            return TOKENIZER.parseString(); // [PEATP] begin call for type 'String'
                            break;
                        case 't':
                            consumeChars('r'); // LOOKAHEAD for 'r'
                            return TOKENIZER.parseBoolean(); // [PEATP] begin call for type 'Boolean'
                            break;
                        case 'f':
                            consumeChars('a'); // LOOKAHEAD for 'a'
                            return TOKENIZER.parseBoolean(); // [PEATP] begin call for type 'Boolean'
                            break;
                        case 'n':
                            consumeChars('u'); //  LOOKAHEAD for 'u'
                            return TOKENIZER.parseNull(); // [PEATP] begin call for 'null'
                            break;
                        case '-':
                            consumeChars((ifNext()) ? text.charAt(at + 1) : '0'); // [PEATP] LOOKAHEAD for '0' or next char
                            return TOKENIZER.parseInteger(); // [PEATP] if no exception is thrown above, it is then safe to check for the presence of an 'Integer'
                            break;
                        default:
                            return (chr >= '0' && chr <= '9') ? TOKENIZER.parseInteger() : TOKENIZER.parseValue();  // if possible, still seek for the presence of an 'Integer' or recursively call [TOKENIZER.parseValue]							 
                    }
                }
            };


            // SHADOW FUNCS
            function objTokenizer() {
                try {
                    var fin = TOKENIZER.parseObject();
                } catch (eq) {
                    throw error(eq.message);  // rethrow the exception (#3 - exeception propagation);
                }
                return fin;
            }

            function arrTokenizer() {
                try {
                    var fin = TOKENIZER.parseArray();
                } catch (ex) {
                    throw error(ex.message);  // rethrow the exception (#3 - exeception propagation);
                }
                return fin;
            }

            function beginPARSE() {
                var json, sure = (rev && type(rev) == "Function");
                if (typeof (str) != "string") throw serror("Error: Illegal argument type: " + type(str));
                if (text === "") return null;
                if (text && at == 0) { // check if we are at the beginning of the parsable entity - index zero
                    switch (chr) {
                        case '{':
                            try {
                                json = objTokenizer(); // [PEATP] call the shadow function
                            } catch (ed) {
                                throw error(ed.message);  // modify and rethrow the exception again to the top the method call stack!!! 
                            }
                            break;
                        case '[':
                            try {
                                json = arrTokenizer(); // [PEATP] call the shadow function
                            } catch (es) {
                                throw error(es.message);  // modify and rethrow the exception again to the top the method call stack!!!
                            }
                            break;
                        default:
                            throw serror("Invalid argument type");
                            breakl
                    }
 
                    // if a [reviver] function was passed or not...					
                    return (sure) ? (function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (hOwn.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }({'': json}, '')) : json;
                } else { return; }
            }

            return beginPARSE(); // call the entry point for window.JSON.parse


        };


        window.JSON.stringify = window.JSON.stringify || function (obj, replacer, spacer) {
            var rpc = replacer || null;
            var spc = spacer || 0;

            if (typeof (obj) == 'undefined') return;
            var sure = (obj && obj.constructor), to = (sure) ? type(obj) : '', replace = (rpc && type(rpc) == 'Function') ? rpc : rpc,
	indent = (spc && type(spc) == 'Number') ? spaces(spc) : spc, o, delimVals = false;
            if (indent !== null) delimVals = true;

            if (to == 'Object') {
                obj = uniqueObject(obj, to);
                o = "{";
                for (var r in obj) {
                    if (type(r) == "String") {
                        o += '"' + r + '"' + ':';
                        if (obj[r]) {
                            o += value(obj[r]);
                            o += ',';
                        } else { throw serror("Invalid JSON Object"); }
                    } else {
                        throw serror("Could not stringify argument");
                    }
                }
                o = o.replace(/\,$/g, '');
                o += '}';
            } else if (to == 'Array') {
                obj = uniqueObject(obj, to);
                o = '[';
                for (var j = 0, l; l = obj[j]; j++) {
                    // if(!l) throw serror("Invalid JSON Object"); 
                    o += value(l);
                    o += ',';
                }
                o = o.replace(/\,$/g, '');
                o += ']';
            } else {
                if (typ == 'String')
                    o = '"' + obj + '"';
                else
                    o = obj.toString();
            }
            return o;
        }

    }

    if (window && (window.EventSource === undefined)) {
        window.EventSource = function () {
            // code goes here...
        };
    }

    /**
    Function: [Function.prototype]> bind


    Argumnets: Object:{variable argument}
  
  
    Notes: used in binding a function to an object in context
  
    Example:
  
    */

    if (!Function.prototype.bind) {
        Function.prototype.bind = function () {
            var fn = this,
            args = [].slice.call(arguments),
            object = args.shift();
            return fn.apply(object, args.concat([].slice.call(arguments)));
        }
    }

    /**
    Function: [HTMLElement.prototype]> classList


    Argumnets: None
  
  
    Notes: dynamically modifies the class attribute on a DOM element
  
    Example:     //this implementation is very different from
    //the native implementation for HTML5 browsers
    //therefore, while coding, use the snippet below
			   
    var elem = document.getElementById('widget');
               
    try{
    elem.classList().remove('ip-sanitize'); // custom implementation...
    }catch(e){
    elem.classList.remove('ip-sanitize'); // ECMA-Script implementation...
    }
    */


    if (!d.all) {
        if (!window.crypto && !(HTMLElement.prototype).classList) { // W3C only version
            HTMLElement.prototype.classList = _classList(HTMLElement.prototype);
        }

        /**
        Function: [HTMLElement.prototype] setElementText
 
  
        Arguments: String:word - replacement text 
        Number:index - index of the child element in the stack
      
 
        Notes: sets the innnerText property of the child element to [word]

        */

        if (!(HTMLElement.prototype).setElementText) {
            (HTMLElement.prototype).setElementText = function (word, index) {
                if (typeof (index) == "undefined") index = 0;
                if (this.children.length != 0) {
                    var div = document.createElement('div');
                    div.appendChild(document.createTextNode(word));
                    if ('innerText' in this.children) { // webkit browsers...
                        this.children[index].innerText = div.childNodes[0].nodeValue
                    }
                    else { this.children[index].textContent = div.childNodes[0].nodeValue } // gecko browsers...
                }
                else {
                    var tnode = null, containsText = false;
                    for (var g = 0; g < this.childNodes.length; g++) {
                        if (this.childNodes[g].nodeType < 3) { // exclude attribute and element nodes...
                            continue;
                        }
                        else {
                            containsText = true;
                            break;
                        }
                    }
                    if (containsText) {
                        this.normalise();
                        this.firstChild.data = word;
                    }
                }
            }
        }
        /**
        Function: [Element.prototype] insertAdjacentText


        Argumnets: String: fwhich
        String: textblock
  
  
        Notes: fwhich > selector token that can take any of these values ; 'afterBegin'; 'beforeEnd'; 'afterEnd'; 'beforBegin'; 
        textblock > string which is to be inserted as a text node 
        use > inserts a HTML DOM text node relatively to the element
		 
        Example: document.getElementsByTagName('p')[0].insertAdjacentHTML('afterEnd','<img src="pic-011.png" alt="" />');
  
        */

        if (window.crypto && !(HTMLElement.prototype).insertAdjacentText) {
            (HTMLElement.prototype).insertAdjacentText = function (fwhich, textblock) {
                if (typeof (fwhich) != "string" || typeof (textblock) != "string") throw new Error("Invalid arguments for this operation");

                var isFound = true, b = 0, selectors = ["afterBegin", "beforeEnd", "beforeEnd", "afterEnd"],
                textblock = textblock.replace(/^\s+|\s+$/, '');

                //begin looping through all selectors to find a match for [fwhich]
                for (; fwhich != selectors[b]; b++) {
                    if (b == selectors.length - 1) {
                        isFound = false;
                    }
                }
                var selected = (isFound && fwhich == selectors[b]), tnode = document.createTextNode(textblock);

                if (selected) {

                    switch (fwhich) {
                        case 'afterBegin':
                            this.insertBefore(tnode, this.firstChild);
                            break;

                        case 'afterEnd':
                            if (this.parentNode && this.nextSibling) {
                                this.parentNode.insertBefore(tnode, this.nextSibling);
                            }
                            break;

                        case 'beforeEnd':
                            this.appendChild(tnode);
                            break;

                        case 'beforeBegin':
                            if (this.parentNode) {
                                this.parentNode.insertBefore(tnode, this);
                            }
                            break;
                    }
                } else { return; }
            }
        }
        /**
        Function: [Element.prototype] insertAdjacentHTML


        Argumnets: String: fwhich
        String: markup
  
  
        Notes: fwhich > selector token that can take any of these values ; 'afterBegin'; 'beforeEnd'; 'afterEnd'; 'beforeBegin'; 
        markup > string which is to be inserted as html   
        use > inserts a HTML DOM element node relatively to the element
		 
        Example: document.getElementsByTagName('p')[0].insertAdjacentHTML('afterEnd','<img src="pic-011.png" alt="" />');
  
        */

        if (!(HTMLElement.prototype).insertAdjacentHTML) {
            (HTMLElement.prototype).insertAdjacentHTML = function (fwhich, markup) {
                if (typeof (fwhich) != "string" || typeof (markup) != "string") throw new Error("Invalid arguments for this operation");
                if (markup.indexOf("'") > -1) throw new Error("Invalid HTML source for this operation");

                var elem, startIndex, endIndex, tagname, inner;
                var isFound = true, b = 0, selectors = ['afterBegin', 'beforeEnd', 'afterEnd', 'beforeBegin'];

                //begin looping through all selectors to find a match for [fwhich]
                for (; fwhich != selectors[b]; b++) {
                    if (b == selectors.length - 1) {
                        isFound = false;
                    }
                }
                var selected = (isFound && fwhich == selectors[b]);

                inner = markup.replace(/<.*?>/, "").replace(/(<\/\w+>(?!\<))/, "");
                startIndex = markup.indexOf("<") + 1;
                endIndex = (markup.indexOf(">") - 1 == '/') ? markup.indexOf(">") - 1 : markup.indexOf(">");

                if (markup.indexOf("=") == -1) { // check for the presence of HTML attributes...

                    tagname = markup.substring(startIndex, endIndex + 1);
                    elem = document.createElement(tagname);

                } else {

                    tagname = markup.substring(startIndex, markup.indexOf(" "));
                    header = markup.substring(startIndex, endIndex);
                    elem = document.createElement(tagname);

                    var attrObj = { id: "id", style: "style", "title": "title", name: "name", type: "type", tabindex: "tabindex", value: "value", cellpadding: "cellpadding", cellspacing: "cellspacing", align: "align",
                        size: "size", "class": "class", dir: "dir", src: "src", href: "href", method: "method", action: "action", onclick: "onclick", onmouseover: "onmouseover", placeholder: "placeholder", onerror: "onerror", language: "language", vspace: "vspace", hspace: "hspace", alt: "alt",
                        onfocus: "onfocus", onchange: "onchange", onmouseout: "onmouseout", onmousedown: "onmousedown", onmouseup: "onmouseup", target: "target", autocomplete: "autocomplete", spellcheck: "spellcheck", onkeypress: "onkeypress", onkeydown: "onkeydown", onblur: "blur", longdesc: "longdesc"
                    }
                    var attrArr = [], i = 0, prev, next;

                    for (var o in attrObj) {
                        prev = header.indexOf(attrObj[o]);
                        if (prev > 0) {
                            next = header.indexOf('"', prev) + 1
                            attrArr[i] = [attrObj[o], header.substring(next, header.indexOf('"', next)).replace('"', '')]
                            i++;
                        }
                    }

                    for (var n = 0; n < attrArr.length; n++) {
                        if (!(attrArr[n])) continue; // just in case...
                        elem.setAttribute(attrArr[n][0], attrArr[n][1]);
                    }

                }

                /* SETUP newly created [elem] */

                if (inner.indexOf("<") > -1) {
                    elem.innerHTML = inner;
                } else {
                    elem.appendChild(document.createTextNode(inner));
                }

                /* APPLY BY the value of [fwhich'] */

                if (selected) {

                    switch (fwhich) {
                        case 'afterBegin':
                            this.insertBefore(elem, this.children.item(0));
                            break;

                        case 'afterEnd':
                            if (this.parentNode && this.nodeType == 1) {
                                this.parentNode.insertAfter(elem, this);
                            }
                            break;

                        case 'beforeEnd':
                            this.appendChild(elem);
                            break;

                        case 'beforeBegin':
                            if (this.parentNode) {
                                this.parentNode.insertBefore(elem, this.parentNode.children.item(0));
                            }
                            break;
                    }
                } else { return; }

            }
        }


        /**
        Function: [Element.prototype]> isParentTo


        Argumnets: Object:els
  
  
        Notes: for checking if the DOM element is a parent to [els]
  
        Example:  var docBadge = document.getElementById('block');
        var contents = docBadge.children, length = docBadge.children.length, i = 0;
		
        for(;i < length;i++){
        if(docBadge.isParentTo(content[i])) 
        window.setTimeout(eval('rotateChild(' + content[i] + ')'), 2100);
        }
        */

        if (!(HTMLElement.prototype).isParentTo) {
            (HTMLElement.prototype).isParentTo = _isParentTo;
        }

        // patch definition for Mozilla Firefox - [innerText]
        if (window.crypto) {
            if (Element.prototype) {
                Object.defineProperty(Element.prototype, "innerText", { get: function () { return this.innerHTML.replace(/<\w>/g, "").replace(/<\/\w>/g, "") }, set: function (str) { this.innerHTML = this.innerHTML.replace(this.firstChild.nodeValue, str) }, configurable: true, enumerable: true });
            }
        }


        /**
        Function: [Element.prototype]> emptyElement


        Argumnets: None
  
  
        Notes: removes all child node of the DOM element
  
        Example:
  
        */
        if (!(HTMLElement.prototype).emptyElement) {
            (HTMLElement.prototype).emptyElement = function () {
                if (this.children.length != 0) {
                    var child = (isElementNode(this.firstChild.nextSibling)) ? this.firstChild.nextSibling : ((this.firstChild.nodeType != 2) ? this.firstChild : "nothing");

                    if (child == "nothing") return;
                    var i = 0;
                    if (child) {
                        while ((child = this.children.item(0)) != null) {
                            this.children.item(0).parentNode.removeChild(child);
                            i = i + 1;
                        }
                    }
                }
            }
        }
        /**
        Function: [Element.prototype]> hasStyle


        Argumnets: String:sty
  
  
        Notes:checks the existence of a value for any style property on a DOM element
  
        Example: var color_style = document.forms[0].keygen.hasStyle('border-color');
                                   if(!color_style){
                                         return false;
                                   }
        */

        if (!(HTMLElement.prototype).hasStyle) {
            (HTMLElement.prototype).hasStyle = _hasStyle;
        }
		
		/**
    Function: [HTMLElement.prototype]> getElementText
 
  
    Arguments: Number:kind
 
    Notes: kind > index for child element

	Example: var text = document.getElementsByClassName("saver")[0].getElementText(0);
    */

        if (!(HTMLElement.prototype).getElementText) {
            (HTMLElement.prototype).getElementText = function (kind) {
                if (typeof (kind) == "undefined") kind = 0;

                if (this.children.length == 0 || isTextNode(this)) {
                    kind = null;
                    return this.firstChild.data;
                }

                else if (isElementNode(this)) {
                    var whichNode = this.children[kind];
                    var div = document.createElement('div');
                    holder = (div.textContent != null) ? "textContent" : "innerText";
                    return (whichNode !== undefined) ? whichNode[holder] : "null";
                }
                else { return "" };
            }
        }


        /**
        Function: [Element.prototype]> isElementEmpty


        Argumnets: None
  
  
        Notes:checks whether the element has any child nodes
  
        */
        if (!(HTMLElement.prototype).isElementEmpty) {
            (HTMLElement.prototype).isElementEmpty = _isElementEmpty
        }
    }
    /***********************************************************************
    *  @section Generic Functions                                          *
    *                                                                      *
    *  @source http://robertnyman.com/  - JavaScript v 1.8 Generic Methods *   
    *                                                                      *
    ************************************************************************/

    if (!(Object.defineProperty)) {
        if (Object.prototype.__defineGetter__) {
            Object.defineProperty = function (DOMObj, property, propDesc) {
                if (typeof (DOMObj) == "object" && typeof (property) == "string" && typeof (propDesc) == "object") {
                    for (var a in getorset) {
                        switch (a) {
                            case "get":
                                DOMObj.__defineGetter__(property, propDesc[a]);
                                break;
                            case "set":
                                DOMObj.__defineSetter__(property, propDesc[a]);
                                break;
                            default:
                        }
                    }
                }
            }
        } else {
            Object.defineProperty = function (DOMObj, property, propDesc) {
                //var isEnum = Object.prototype.; 
                if ((tStr.call(DOMObj) == "[object Object]") && typeof (property) == "string" && (tStr.call(propDesc) == "[object Object]")) {
                    document.expando = true
                    var options = { value: null, enumerable: false, configurable: false, get: function () { }, set: function () { } };
                    for (var a in propDesc) {
                        switch (a) {
                            case "value":
                                if (!(hOwn.call(DOMObj, property))) {
                                    options.value = propDesc[a];
                                    DOMObj[property] = options.value;
                                }
                                break;
                            case "get":
                                if (!(hOwn.call(DOMObj, property))) {
                                    options.get = propDesc[a];
                                    if (typeof (__proto__) != "undefined") DOMObj.__proto__ = options; // i don't even know what i did on this line...
                                    DOMObj[property] = DOMObj[property] || options.get();
                                }
                                break;
                            case "set":
                                options.set = propDesc[a];
                                if (typeof (__proto__) != "undefined") DOMObj.__proto__ = options; // i don't even know what i did on this line...
                                DOMObj[property] = DOMObj[property] || options.set();
                                break;

                            case "enumerable":
                                options.enumerable = a;
                                //if(options.enumerable){} 
                                break;

                            case "configurable":
                                options.configurable = a;
                                //if(options.configurable){}
                                break;
                            default:
                                break;
                        }
                    }

                }
            }
        }
    }

    if (!Object.create) {
        Object.create = function (fi) {

            if (typeof (fi) != 'object' && typeof (fi) != 'function') {
                return;
            }

            var j = new Function();

            j.prototype = fi;

            return (new j());

        }
    }

    if (!Object.keys) {
        Object.keys = function (fuc) {
            if (typeof (fuc) != 'object' && typeof (fuc) != 'function' || fuc === null) {
                return;
            }
            var j = [];
            for (var k in fuc) {

                if (Object.prototype.hasOwnProperty.call(fuc, k)) {
                    j.push(k)
                }
            }
            var l = !Object.prototype.propertyIsEnumerable('toString'), m = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'prototypeIsEnumerable', 'constructor'];

            if (l) {
                for (var n = 0; n < m.length; n++) {
                    var o = m[n];
                    if (Object.prototype.hasOwnProperty.call(fuc, o)) {
                        j.push(o);
                    }
                }
            }
            return j;
        }
    }


    if (!Array.filter) {
        Array.filter = function (str, func, i) {
            if (typeof (str) != 'string' && typeof (func) != 'function') { return; }
            var f, x = str.split(""), n = [];
            for (d = 0; d < x.length; ++d) {

                f = x[d];

                if (func.call(i, f, d, x)) {
                    n.push(f);
                }
            }
            return n;
        }
    }


    if (!String.replace) {
        String.replace = function (a, RE, out) {
            if (typeof (this) == 'function') {
                this.apply(Object.prototype, new Array(arguments));
            }
            if (typeof (a) != 'object') { return; }
            var Comp = [];
            for (var i = 0; i < a.length; i++) {
                Comp[i] = a[i].replace(RE, out);
            }
            if (Comp) { return Comp; }
            return null;
        }
    }

    if (!Array.isArray) {
        Array.isArray = function (arr) {
            return (arr instanceof Array) ? true : false;
        }
    }

    /********************** End Generic Methods ****************************************/
    /***********************************************************************************/


    /**
    Function: [HTMLElement.prototype]> insertAfter


    Argumnets: DOM Node Object:new_elem
    DOM Node Object:ch_elem
  
    Notes:  inserts a DOM element after the element to form the next sibling 
    new_elem > 
    ch_elem  > 
    Example: var bb = document.getElementById("nana");
    var nn = document.getElementById("case").cloneNode(true);
    document.getElementById("canvas").insertAfter(nn, bb);		  
    */

    if (w.getComputedStyle && !(HTMLElement.prototype).insertAfter) {
        (HTMLElement.prototype).insertAfter = _insertAfter;
    }


    /**
    Function: [HTMLElement.prototype]> addCSSRules


    Argumnets: Array:rObj
  
    Notes:  rObj > an array of rule sets in succesion
    or an object literal which contains string type properties
		 
    Examples: var container = document.getElementById("fc-trigger"); 
    container.addCSSRules(['color','#ffeeee','border','none','display','inline-block']); 
    OR
    container.addCSSRules({color:"#ffeeee", border:"none",display:"inline-block"});			 
    */

    if (!d.all) {
	
        if (!(HTMLElement.prototype).addCSSRules) {
            (HTMLElement.prototype).addCSSRules = _addCSSRules;
        }
    
    /**
     Function: [HTMLElement.prototype]> getParents

     Arguments: String/Object: par 

     Notes: par > a DOM node object or selector string

     Examples: var allParents = document.getElementsByName("poll")[0].getParents("form");
     */ 	 

        if (!(HTMLElement.prototype).getParents) {
            (HTMLElement.prototype).getParents = _getParents;
        }

        /**
        Function: [HTMLElement.prototype]> previousElement
   
        Arguments: Object: pe
			
        Notes:
        */

        if (!(HTMLElement.prototype).previousElement) {
            (HTMLElement.prototype).previousElement = _previousElement;
        }

        /**
        Function: [HTMLElement.prototype] nextElement
   
        Arguments: Object: ne
			
        Notes:
		
		Example: var next = document.getElementById("fader").nextElement();
        */

        if (!(HTMLElement.prototype).nextElement) {
            (HTMLElement.prototype).nextElement = _nextElement;
        }

        /**
        Function: [HTMLElement.prototype] getSiblings
   
        Arguments: None:
			
        Notes:
		
		Example: var allSibs = document.forms[0].elements.getSiblings();
        */

        if (!(HTMLElement.prototype).getSiblings) {
            (HTMLElement.prototype).getSiblings = _getSiblings;
        }

        /**
        Function: [HTMLElement.prototype] wrapElement
   
        Arguments: String: htmlStr
        Boolean: outer
			
        Notes: htmlStr > html string that denotes the elements that would do the "wrapping"
		       outer > if true, the element is wrapped on the outside else it is wrapped inside (inner wrap)  
		
		Example: document.getElementById("joker").wrapElement("<div id='blob'><span class='base'></span></div>", true);
        */

        if (!(HTMLElement.prototype).wrapElement) {
            (HTMLElement.prototype).wrapElement = _wrapElement;
        }
	}	
})(window, document);    // end library

if (/*@cc_on!@*/false){
  window.attachEvent('onreadystatechange', EventsObserver);
}

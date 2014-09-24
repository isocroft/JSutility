  /**************************************************************************
   *  Copyright © 2013-2014 @abnlabs http://cproscodedev.com.ng             *
   *  All Rights Reserved                                                   *
   *  -----Codedev™ Team                                                    *
   *  @package Polyfill Library                                             *
   *  @license GPL                                                          *
   *  @authors  Codedev Team                                                *
   *  @desc The Plus-Side Polyfill/Utility Library for JavaScript           *
   *                                                                        *
   * ---------------------------------------------------------------------- *
   * File Name: JSutil-1.5-beta.js                                          *
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




/*== DEFINE BASIC JS/DOM ACCESS PATCHES  ==*/ 


if(!String.prototype.trim){
String.prototype.trim = function(){
    var str = this;  
    // The first method is faster on long strings than the second and 
    // vice-versa.
    if (this.length > 6000) {
        str = this.replace(/^\s\s*/, '');
        var i = str.length;
        while (/\s/.test(str.charAt(--i))) 
            ;
        return str.slice(0, i + 1);
    } else {
        return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
 }    
};

String.capitalize = function(){ 
    return this[0].toUpperCase + this.substr(1);
};

String.indexOF = String.prototype.indexOf; // cache required functions
String.lastIndexOF = String.prototype.lastIndexOf;

String.prototype.indexOf = function(regexOrStr, indexTo){
     indexTo = parseInt(indexTo); // variable hoisting
     // NaN values won't honour ifs
     if(indexTo < 0) indexTo = 0;
     if(indexTo > this.length) indexTo = this.length;

     if(regexOrStr instanceof RegExp){
        if(!indexTo || typeof indexTo === "undefined")  // check "null" or "undefined"
           return regexOrStr.exec(this || "").index; // get the first occurence
         else
        return regexOrStr.exec((this || "").substring(indexTo !== indexTo && 0 || indexTo)).index; // get the first occurence from "indexFrom" in {this}
     }else if(regexOrStr instanceof String){
        return String.indexOF.apply(this, [].slice.call(arguments)); // back to the normal indexOf call
     }
}

String.prototype.lastIndexOf = function(regexOrStr, indexFrom){
    indexFrom = parseInt(indexFrom); // variable hoisting
    // NaN values won't honour ifs
     if(indexFrom < 0) indexFrom = 0;
     if(indexFrom > this.length) indexFrom = this.length;
     if(regexOrStr instanceof RegExp){
        if(!indexFrom || typeof indexFrom === "undefined")  // check "null" or "undefined"
           return regexOrStr.exec(this || "").lastIndex; // get the first occurence
         else
        return regexOrStr.exec((this || "").substring(0, indexFrom !== indexFrom && 0 || indexFrom)).lastIndex; // get the first occurence from "indexFrom" in {this}
     }else if(regexOrStr instanceof String){
        return String.indexOF.apply(this, [].slice.call(arguments)); // back to the normal indexOf call
     }
}


String.sprintf = function(fstring){
        var pad = function(str, ch, len){
            var ps = '';
            for (var i = 0; i < Math.abs(len); i++) 
                ps += ch;
            return len > 0 ? str + ps : ps + str;
        }
        var processFlags = function(flags, width, rs, arg){
            var pn = function(flags, arg, rs){
                if (arg >= 0) {
                    if (flags.indexOf(' ') >= 0) 
                        rs = ' ' + rs;
                    else if (flags.indexOf('+') >= 0) 
                        rs = '+' + rs;
                } else 
                    rs = '-' + rs;
                return rs;
            }
            var iWidth = parseInt(width, 10);
            if (width.charAt(0) == '0') {
                var ec = 0;
                if (flags.indexOf(' ') >= 0 || flags.indexOf('+') >= 0) 
                    ec++;
                if (rs.length < (iWidth - ec)) 
                    rs = pad(rs, '0', rs.length - (iWidth - ec));
                return pn(flags, arg, rs);
            }
            rs = pn(flags, arg, rs);
            if (rs.length < iWidth) {
                if (flags.indexOf('-') < 0) 
                    rs = pad(rs, ' ', rs.length - iWidth);
                else 
                    rs = pad(rs, ' ', iWidth - rs.length);
            }
            return rs;
        }
        var converters = new Array();
        converters['c'] = function(flags, width, precision, arg){
            if (typeof(arg) == 'number') 
                return String.fromCharCode(arg);
            if (typeof(arg) == 'string') 
                return arg.charAt(0);
            return '';
        }
        converters['d'] = function(flags, width, precision, arg){
            return converters['i'](flags, width, precision, arg);
        }
        converters['u'] = function(flags, width, precision, arg){
            return converters['i'](flags, width, precision, Math.abs(arg));
        }
        converters['i'] = function(flags, width, precision, arg){
            var iPrecision = parseInt(precision);
            var rs = ((Math.abs(arg)).toString().split('.'))[0];
            if (rs.length < iPrecision) 
                rs = pad(rs, ' ', iPrecision - rs.length);
            return processFlags(flags, width, rs, arg);
        }
        converters['E'] = function(flags, width, precision, arg){
            return (converters['e'](flags, width, precision, arg)).toUpperCase();
        }
        converters['e'] = function(flags, width, precision, arg){
            iPrecision = parseInt(precision);
            if (isNaN(iPrecision)) 
                iPrecision = 6;
            rs = (Math.abs(arg)).toExponential(iPrecision);
            if (rs.indexOf('.') < 0 && flags.indexOf('#') >= 0) 
                rs = rs.replace(/^(.*)(e.*)$/, '$1.$2');
            return processFlags(flags, width, rs, arg);
        }
        converters['f'] = function(flags, width, precision, arg){
            iPrecision = parseInt(precision);
            if (isNaN(iPrecision)) 
                iPrecision = 6;
            rs = (Math.abs(arg)).toFixed(iPrecision);
            if (rs.indexOf('.') < 0 && flags.indexOf('#') >= 0) 
                rs = rs + '.';
            return processFlags(flags, width, rs, arg);
        }
        converters['G'] = function(flags, width, precision, arg){
            return (converters['g'](flags, width, precision, arg)).toUpperCase();
        }
        converters['g'] = function(flags, width, precision, arg){
            iPrecision = parseInt(precision);
            absArg = Math.abs(arg);
            rse = absArg.toExponential();
            rsf = absArg.toFixed(6);
            if (!isNaN(iPrecision)) {
                rsep = absArg.toExponential(iPrecision);
                rse = rsep.length < rse.length ? rsep : rse;
                rsfp = absArg.toFixed(iPrecision);
                rsf = rsfp.length < rsf.length ? rsfp : rsf;
            }
            if (rse.indexOf('.') < 0 && flags.indexOf('#') >= 0) 
                rse = rse.replace(/^(.*)(e.*)$/, '$1.$2');
            if (rsf.indexOf('.') < 0 && flags.indexOf('#') >= 0) 
                rsf = rsf + '.';
            rs = rse.length < rsf.length ? rse : rsf;
            return processFlags(flags, width, rs, arg);
        }
        converters['o'] = function(flags, width, precision, arg){
            var iPrecision = parseInt(precision);
            var rs = Math.round(Math.abs(arg)).toString(8);
            if (rs.length < iPrecision) 
                rs = pad(rs, ' ', iPrecision - rs.length);
            if (flags.indexOf('#') >= 0) 
                rs = '0' + rs;
            return processFlags(flags, width, rs, arg);
        }
        converters['X'] = function(flags, width, precision, arg){
            return (converters['x'](flags, width, precision, arg)).toUpperCase();
        }
        converters['x'] = function(flags, width, precision, arg){
            var iPrecision = parseInt(precision);
            arg = Math.abs(arg);
            var rs = Math.round(arg).toString(16);
            if (rs.length < iPrecision) 
                rs = pad(rs, ' ', iPrecision - rs.length);
            if (flags.indexOf('#') >= 0) 
                rs = '0x' + rs;
            return processFlags(flags, width, rs, arg);
        }
        converters['s'] = function(flags, width, precision, arg){
            var iPrecision = parseInt(precision);
            var rs = arg;
            if (rs.length > iPrecision) 
                rs = rs.substring(0, iPrecision);
            return processFlags(flags, width, rs, 0);
        }
        farr = fstring.split('%');
        retstr = farr[0];
        fpRE = /^([-+ #]*)(\d*)\.?(\d*)([cdieEfFgGosuxX])(.*)$/;
        for (var i = 1; i < farr.length; i++) {
            fps = fpRE.exec(farr[i]);
            if (!fps) 
                continue;
            if (arguments[i] != null) 
                retstr += converters[fps[4]](fps[1], fps[2], fps[3], arguments[i]);
            retstr += fps[5];
        }
        return retstr;
};

if (!Array.prototype.map) {
        Array.prototype.map = function (h, i) {
            if (typeof h != 'function') {
                throw TypeError();
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

if (!Array.prototype.every) {
        Array.prototype.every = function (h, i) {
            if (typeof (h) != 'function') {
                 throw TypeError();
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

if(!Array.prototype.forEach){
    Array.prototype.forEach = function(fun /*, thisp */) {
                "use strict";
                
                if (this === void 0 || this === null) {
                        throw new TypeError();
                }
                
                var t = Object(this), len = t.length >>> 0;

                if (typeof fun !== "function") {
                        throw new TypeError();
                }
                
                var thisp = arguments[1];
                
                for (var i = 0; i < len; i++) {
                        if (i in t) {
                                fun.call(thisp, t[i], i, t);
                        }
                }
    };
}

if(!Array.prototype.indexOf){
   Array.prototype.indexOf = function (arrElem) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == arrElem) return i;
            }
            return -1;
    }
}

if(!Function.prototype.bind){
    Function.prototype.bind = function(obj) {
                var slice = [].slice,
                 args = slice.call(arguments, 1),
                 self = this,
                 nop = function () {},
                 bound = function () {
                         return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
                 };
                
                nop.prototype = self.prototype;
                
                bound.prototype = new nop();
                
                return bound;
    };
}
/*== DECLARE NOTE2 FUTURES (Deferred) routine (will be moved to cdvTools)==*/

var cdvTools={};

cdvTools.normalizeEventObject = function(e){
var html = document.documentElement, body = document.body || document.getElementsByTagName("body"),
     e = (e==null)? window.event : e, immediatePropagation=true, isMouse = e.type.indexOf("mouse") > -1; 
     e.target = e.srcElement || e.target;
     if(e.type){
        // e.pageX AND e.pageY FIXTURE
          if (e.pageX === undefined && e.clientX && isMouse) {
              e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0)
              e.pageX -= html.clientLeft || 0
              e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0)
              e.pageY -= html.clientTop || 0
          }
        // e.offsetX AND e.offsetY FIXTURE
        if(e.clientX !== null && e.clientY  && isMouse){
            var borderLeftWidth = parseInt(cdvTools.getCSSProperty(e.target, 'borderLeftWidth'), 10),
            borderTopWidth = parseInt(cdvTools.getCSSProperty(e.target, 'borderTopWidth'), 10),
            rect = cdvTools.getCurrElementPos(e.target, "bypage"); // similar to "getBoundingClientRect"
            e.offsetX = (e.offsetX && document.all)? e.offsetX : (e.clientX - borderLeftWidth) - rect.left;
            e.offsetY = (e.offsetY && document.all)? e.offsetY : (e.clientY - borderTopWidth) - rect.top;
        }
        // e.which FIXTURE
        if (!e.which && e.button) {
           if(e.type.indexOf('key') > -1){
              e.which = (e.charCode !== null) ? e.charCode : e.keyCode;
           }else if(e.type == 'click'){
              if (e.button & 1) e.which = 1      // Left
              else if (e.button & 4) e.which = 2 // Middle
              else if (e.button & 2) e.which = 3 // Right
           }
            
        }
        
        e.currentTarget = e.currentTarget || e.target;
        e.preventDefault = function () { e.returnValue = false };
        e.relatedTarget = e.fromElement || e.toElement;
        e.metaKey = (e.type.indexOf("key") > -1 && e.ctrlKey) ? e.ctrlKey : e.shiftKey;
        e.stopImmediatePropagation = function () { immediatePropagation = false; e.cancelBubble = true };
        e.stopPropagation = function () { e.cancelBubble = true };
        e.keyCode = e.keyCode || e.charCode;
        e.timeStamp = +new Date;

     }
    return e;    
};

cdvTools.normalizeEventType = function(type){
   
};

cdvTools.isNode = function(el){
   return (el && typeof el === 'object' && 'appendChild' in el);
};

cdvTools.importCSSFile = function(cfile){
var url = document.location.href,
    prtc = (document.location.protocol == "https:"),
    indx = prtc ? 7 : 6,
    baseURL = url.substring(0 , url.indexOf('/', indx+1));
if(document.createStyleSheet) {
    document.createStyleSheet(baseURL+cfile);
}
else {
  var styles = "@import url('"+ baseURL+cfile +"');";
  var newSS=document.createElement('link');
  newSS.rel='stylesheet';
  newSS.href='data:text/css,'+escape(styles);
  document.getElementsByTagName("head")[0].appendChild(newSS);
}
};

cdvTools.getAllIndexOf = function(str, c){
   var f = [-2]; // the start index is -2(since -2+1 should give us a good start index for 'indexOf' method!!)
   function loadArrayWithIndex(_str, _c, _f){
      var dice = _f.length - 1, index = _f[dice], radix = _str.indexOf(_c, index+1);
         if(radix > -1){ // check to see if we found [_c]
            _f.push(radix); // if true,  fill up the array with the index at which [_c] was found
            return loadArrayWithIndex(_str, _c, _f); // recurse again...
        }else{
           return _f.splice(1,_f.length - 1); // base case scenario for recursive calls...
        }
    }
  return loadArrayWithIndex(str, c, f); // begin recursive calls...
}

cdvTools.getCSSProperty = function(sel, prp, unt){
  var res;
  unt = unt || "px";
  switch(prp){
      case "float":
          prp = (document.all)? "styleFloat" : "cssFloat";
      break;
      case "margin": // These property declarations all return an empty string {{""}}
      case "background":
      case "padding":
      case "border":
      case "borderTop":
      case "borderBottom":
      case "borderLeft":
      case "borderRight":
        prp = null;
      break;
  };
  if(!prp) return;
  switch(Object.prototype.toString.call(sel).substring(8, 11)){  
       case "Str":
            for(var j = 0; j < document.styleSheets.length; j++){
                  var cssRls = document.styleSheets[j].cssRules;
                  if(!cssRls) cssRls = document.styleSheets[j].rules;
                       for(var i = 0; i < cssRls.length; i++){
                            if(cssRls[i].selectorText == sel){
                                try{
                                   res = cssRls[i].style.getPropertyValue(prp);      
                                }catch(e){
                                   res = cssRls[i].style.getAttribute(cdvTools.Decamelize(prp, '-'));           
                                } 
                            }
                       }
            } 
     break;
     case "HTM":
     case "Obj":
          if(sel.style[prp]){
               res = sel.style[prp];
          }else{
               
               res = (window.getComputedStyle) ?  window.getComputedStyle(sel, null)[prp] : ((sel.currentStyle)? (unt=="px"? getCurrentPixelStyle(sel, prp) : sel.currentStyle[prp]) : 
                document.defaultView.getComputedStyle(sel,null).getPropertyValue(Decamelizr(prp, '-')));
          }
     break;
     default:
        throw "invalid object "+sel+" found!";
     break;
  }  
  
  return ((res).indexOf('#') > -1)? cdvTools.toRgba(res) : res;
}

cdvTools.toRgba = function(hexcolor, opac){

       var regex = /^\#([a-fA-F0-9]+)$/,
       toHex = function(bi){
               return Math.max(0, Math.min(parseInt(bi, 16), 255));
           },
           match = hexcolor.match(regex),
           rgba = "";

       if(!match) return;

       match = cdvTools.splitStr(match[1], "", null, 2);

       rgba = ((opac)? "rgba(" : "rgb(") + 
               toHex(match[0]) + "," + 
               toHex(match[1]) + "," + 
               toHex(match[2]) + ((opac)? ","+opac : '') +
               ")";

       return rgba; 
};


cdvTools.isElementNode = function(elemnode){
return (cdvTools.isNode(elemnode) && elemnode['nodeType']==1);
};

cdvTools.getBasicCoords = function(elem) {
        var coords = { x: 0, y: 0 };
        while (elem) {
            coords.x += elem.offsetLeft;
            coords.y += elem.offsetTop;
            elem = elem.offsetParent;
        }
   return coords;
};

cdvTools.endsWith = function(hStr, nStr){  // hStr - haystack string, nStr - needle string
    return hStr.indexOf(b, hStr.length - nStr.length) !== -1;
}

cdvTools.parseURL = function(){

};

cdvTools.isURL = function(url, ext){  
          var rgx = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
              match = rgx.exec(url || "");
          return (ext && typeof ext == "string")? match && cdvTools.endsWith(match[11], "."+ext) : match[0] === url;
};

cdvTools.addDOMProperty = function(obj, obj2, name, onGet, onSet) {

     if(!('appendChild' in obj)) return; // Must be a DOM Node (This is a caution point as IE8 throws exception if Object.defineProprty is used on a non-DOM object)
     
    // wrapper functions
    var
        oldValue = obj[name], // {{oldValue}} may be null...
        getFn = function () {
            var k = this; //this will definitely be {{obj}}
            return onGet.apply(obj2, [oldValue]);
        },
        setFn = function (newValue) {
            var k=this;  //this will definitely be {{obj}}
            return oldValue = onSet.apply(obj2, [newValue]);
        };

    // Modern browsers, IE9+, and IE8 (must be a DOM object),
    if (Object.defineProperty) {

        Object.defineProperty(obj, name, {
            get: getFn,
            set: setFn,
            configurable:true,
            enumerable:false
        });

    // Older Mozilla
    } else if (obj.__defineGetter__) {

        obj.__defineGetter__(name, getFn);
        obj.__defineSetter__(name, setFn);

    // IE6-7
    // must be a real DOM object (to have attachEvent) and must be attached to document (for onpropertychange to fire)
    } else {

        var onPropertyChange = function (e) {

            if (event.propertyName == name) {
                // temporarily remove the event so it doesn't fire again and create a loop
                obj.detachEvent("onpropertychange", onPropertyChange);

                // get the changed value, run it through the set function
                var newValue = setFn(obj[name]);

                // restore the get function
                obj[name] = getFn;
                obj[name].toString = getFn;

                // restore the event
                obj.attachEvent("onpropertychange", onPropertyChange);
            }
        };  

        obj[name] = getFn;
        obj[name].toString = getFn;

        obj.attachEvent("onpropertychange", onPropertyChange);

    }
    return oldValue;
};

cdvTools.getRandom = function(useText, len, range){
           if(typeof(useText) != "boolean") return null;

            range = range || 10;
            range = (range > 10)? 10 : range;
            len   = (len > 10)? 10 : len; // TODO: repetition is introduced for length greater than "10" so deal with this later...
          var rand = function(num) { return (num) ? (Math.ceil(Math.random() * range) + num) : Math.round(Math.random() * range); },
            uni = function(){  return String.fromCharCode((rand(65) + rand(91)) / 2); },
            randList = [rand()],
            num = 0,x;

         jump:
            for(x = 1; randList.length < len; x++){    
                  num = Math.floor(Math.random() * range);
                 if(cdvTools.inArray(randList, num))
                      continue jump;
                 else
                     randList.push(num);              
            }

            if(useText){
                   var list = randList.map(function(n){ return n.toString(); });
                   for(var t=0; t < list.length; t++)
                      if(isEven(t)) list.splice(t, 1, uni()); 
     
                       return list.reverse().join('');
            }   

            return (randList.reverse().join('')).substring(0, len);
};
    
cdvTools.setIndex = function(arr, aVal, indx){
            if(typeof arr[indx] == "undefined") indx = arr.length - 1;
               for(var i =0; i < arr.length; i++){
                    if(arr[indx] != aVal){
                       if(arr[i] === aVal){    
                           arr[i] = arr[indx];
                       }
                       arr[indx] = aVal;
                    }
                }
};

cdvTools.clsCounter = function(val){
   var counter = val;
   return function(nm){
        if(nm){ 
          counter = null;
          return;
        }
        return ++counter;
   }
};

cdvTools.atBodySet = function(/* args */){
    var params, fnc, args = arguments, ln = args.length;
    if(ln > 0){
       fnc = args[0];
       params = [].splice.call(args, 1, ln-1);
    }
 
    var cnt = cdvTools.clsCounter(0),
        fnc =  fnc.call && fnc,
        timer, maxtick = 50, body;

    (function check(){
        body = document.getElementsByTagName("body")[0];
            
        if(!body){
            //if(maxtick === cnt()){ cnt(true); !!timer && clearTimeout(timer); }
            timer = setTimeout(check, 1);
        }else{
           if(fnc){
              fnc.apply(body, params);
              !!timer && clearTimeout(timer);
           }
           return;
        }
    }());
    
};
    
cdvTools.inArray  = function(arr, tgt){
         var i;
            for(i in arr){
                 if(tgt === arr[i]) return true;
            }
        return false;
 };

cdvTools.getCurrElementPos = function(obj, rwhich){

var context = ['bypage','byclient'], o;
var curXScr = curYScr = curLeft = curWidth = curHeight = curTop = 0; rwhich = rwhich || context[1];

  if(document.all){
       curYScr = document.documentElement.scrollTop - Math.max(0, (document.documentElement.clientTop || document.body.clientTop));
       curXScr = document.documentElement.scrollLeft - Math.max(0, (document.documentElement.clientLeft || document.body.clientLeft));    
  }else{  
        curYScr = window.pageYOffset;
        curXScr = window.pageXOffset;    
  }

  if(obj.getBoundingClientRect){  // simple object detection
          o = obj.getBoundingClientRect();
          curLeft = (rwhich == context[1]) ? o.left : o.left + curXScr;
          curWidth = (o.width)? o.width : o.right - o.left;
          curHeight = (o.height)? o.height: o.bottom - o.top;
          curTop = (rwhich == context[1]) ? o.top : o.top + curYScr;
  }else{ 
          o = getBasicCoords(obj);
          curLeft = crds.x;
          curTop  = crds.y;
          curWidth = obj.offsetWidth;
          curHeight = obj.offsetHeight;
  
        if(rwhich == context[1]){
            curTop += curYScr;
            curLeft += curXScr;
        }  
  }
var allChoords = {};

allChoords['left'] = curLeft;
allChoords['width'] = curWidth;
allChoords['top'] = curTop;
allChoords['height'] = curHeight;

 return allChoords;
};

Object.length = function(obj){
   var len = 0;
   if(typeof(obj) == "object"){
       switch(obj.constructor){
          case 'Array':
             len = obj.length;
          break;
          case 'Object':
             for(var t in obj)
                 ++len;
          break;
          
       }
   }
   return len;
};

cdvTools.isNodeDisconnected = function(obj){
   return (obj && cdvTools.isNode(obj) && obj.offsetParent === null); 
} 

cdvTools.Camelize = function(str, delim){
    var rx = new RegExp(delim+"(.)","g");
    return s.replace(rx, function (m, m1){
      return m1.toUpperCase()
    });
};

cdvTools.Decamelize = function(str, delim){
   return str.replace(/([A-Z])/g, delim+"$1").toLowerCase();
};

cdvTools.Futures = (function(){

       var error = function(o){ throw o; }
       ,fulFilling = function(which, func){ // to execute the "done" or "fail" callbacks' at the right time!!!
           var _this = this, o = setTimeout(function task(){
                  if(_this.hasFulfilled === false){ 
                        if(_this.state < 2) _this.state = _futureStates.AWAITING; // now update state (if it has not been updated) - {while we wait... you can even relax with a hot wrap of OKPA self!!}
                       return (o = setTimeout(task, 0));  // recursing infinitely at zero-time intervals {event loop really busy here - no jokes!}                 
                  }else{ 
                       if(_this.state < 3) _this.state = _futureStates.COMPLETE;
                       (typeof func == "function" && (_this._which == which || (_this._which && which == "always")) && func.apply(_this, _this.cllbkObj)); //  complete the wait for all dependencies with "Futures" and short circuit the callbacks' call...         
                       clearTimeout(o); // clean up {stack memory resources}  
                       if(_this._promise) _this._promise = null; // yet more clean up ...   
                       return;
                  }
                }, 0);
    }
    ,_futureStates = { // to keep track of the internal state of the "Futures" object
        STARTED:1,
        AWAITING:2,
        COMPLETE:3
    };
  
function Futures(){
    // {constructor}
    Futures.START = _futureStates.STARTED;
    Futures.WAIT = _futureStates.AWAITING;
    Futures.DONE = _futureStates.COMPLETE;
    
    this.notifyHandlers = [],
    this._which = null;
    this.hasFulfilled = false,
    this.cllbkObj = null,
    this.state = _futureStates.STARTED,
    this.hasNotified = false;
    this.xContext = null;
    return this;
}

Futures.prototype.whenBroken = function(fc){
    fulFilling.call(this, "fail", fc); // the "this" object is either the "Futures" or its promise
    return this;
}

Futures.prototype.whenFulfilled = function(fc){
   var _temp = this.xContext || this;
       fulFilling.call(_temp, "done", fc);
  return this;   
}

Futures.prototype.always = function(fc){
    fulFilling.call(this, "always", fc);
    return this;
}

Futures.prototype.getState = function(){
    return (this.promiseCreated)? this._promise.state : this.state;
}

Futures.prototype.fulfillWith = function(){
  var args = [].slice.call(arguments);
  var context = [].splice.call(args, 1, args.length);
  this.xContext = (typeof args == "object" && args);
  this.fullfilled.apply(this, context);
}

Futures.prototype.breakWith = function(){
// still without a clue on this one (need help here)
}

Futures.prototype.broken = function(){
    if(this._which === null){
       var _temp = this._promise || this;
           _temp._which = "fail"; 
           _temp.hasNotified = false;
           _temp.cllbkObj = [].slice.call(arguments);
           _temp.hasFulfilled = true;
    }
}

Futures.prototype.notify = function(obj){
    if(this.isFulfilled()) throw 'FUTURES_ERROR:: cannot nofity upon Futures any longer';
    var _temp = this._promise || this;
    _temp.hasNotified  = true;
    for(var i = 0; i < _temp.notifyHandlers.length; i++){
       if(_temp.hasNotified === true){ // still check for each iteration if the handlers can still be notified...
         if(_temp.notifyHandlers[i].call(null, obj)){
               _temp.hasNotified = false;
               break;
         } 
       }         
    }
    return;
}

Futures.prototype.whenNotified = function(){
        var args = [].slice.call(arguments);    
        if(this.hasNotified === false){     
            this.notifyHandlers = this.notifyHandlers.concat(args);
        }       
        return;
}

Futures.prototype.isFulfilled = function(){
  return this.hasFulfilled;
}

Futures.prototype.fulfilled = function(){
     if(this._which === null){   
         var _temp = this._promise || this;
           _temp._which = "done";
           _temp.hasNotified = false;
           _temp.cllbkObj = [].slice.call(arguments);
           _temp.hasFulfilled = true;
    }
}


Futures.prototype.promise = function(obj){
   this._promise = (typeof obj === "object" && obj) || {}; // dynamically created promise object (immutable too - meaning that no external code can change its internal state abruptly and all its 'etters are cut off and outside entity is provided as a clone)!!
   this.promiseCreated = true;
   for(var t in this){ //temporary workaround - clone this "Futures" object but do not reference it!
      if(t != "promise" || t != "fulfilled" || t != "broken")
             this._promise[t] = this[t];
   } 
   //var __promise = this._promise;
   return this._promise;
}


return function(){
  var _instance = new Futures();
  
  // the object literal structure below [command module] will hide etters and protect pertinent data members from being abused by client code 
  // making the "Futures" object truly immutable to provide only needed AP interface!!
  return{
      isFulfilled:function(){ return _instance.isFulfilled(); },
      fulfilled:function(args){  return _instance.fulfilled(args); },
      promise:function(w){ return _instance.promise(w); },
      whenBroken:function(ac){  return _instance.whenBroken(ac) },
      whenFulfilled:function(gc){  return _instance.whenFulfilled(gc); },
      getState:function(){ return _instance.getState(); },
      always:function(s){  return _instance.always(s); },
      breakWith:function(){ return _instance.breakWith(); },
      fulfillWith:function(){ return _instance.fulfillWith(); },
      notify:function(x){ return _instance.notify(x); },
      broken:function(args){ var _this=this; return _instance.broken(args); }     
  };
  
};
}());

/*== DECLARE NOTE2 GLOBAL => window.js ==*/ 

window.js = (function(w, d, undefined){ 
            'use strict'; 
            
             /* begin */
            function getAttributeByName(obj, attrName) {
    
            var attributes = obj.attributes;
            
            try {
                return attributes.getNamedItem(attrName);
                
            } 
            catch (ex) {
                var i;
                
                for (i = 0; i < attributes.length; i++) {
                    var attr = attributes[i]
                    if (attr.nodeName == attrName && attr.specified) {
                        return attr;
                    }
                }
                return null;
            }
            
             }
        
             function insertAfter(prnt, nel, cel){ if (!(cdvTools.isElementNode(cel) && cdvTools.isElementNode(nel))) { return; } if (prnt.childNodes.length > 0 && cel.parentNode === prnt) { var nxt = cel.nextSibling; while(nxt.nodeType != 1 && nxt.parentNode===prnt) nxt = nxt.nextSibling; prnt.insertBefore(nel, nxt); }  };
             function checkArgs(args){ var actual = args.length; var expected = args.callee.length; if(actual != expected) throw 'error!!'; }
             function getAttrib(ob, a, isXML){ if(isXML){ var attr = getAttributeByName(ob, a);
            
               if (attr != null) {
                    return attr.nodeValue;
               } else {
                    return obj[a];
               } 
            } 

            return (a === 'class') ? ob.className : (a === 'href' || a === 'src') ? ob.getAttribute(a, 2) : (a === "style") ? ob.style.cssText.toLowerCase() : (a === "for")? ob.htmlFor : ob.getAttribute(a); }
             function setAttrib(ob, a, vl, isXML){ 
                if(isXML){ 
                   var attr = getAttributeByName(ob, a);
            
            if (attr !== null) {
                attr.nodeValue = vl;
            } else {
                attr = d.createAttribute(a);
                attr.value = vl;
                ob.setAttributeNode(attr);
            }
              return;
             } (a === 'class')? ob.className = vl : (a === 'href')? ob.href = vl : a === "style" ? ob.style.cssText += ''+vl : ob.setAttribute(a, vl);

              }
             function classReg(cx){ return '(^|\\s+)' + cx + '(\\s+|$)'; }
             
             if(/*@cc_on !@*/false){ /* IE specific workaround code */ }
             
             var p="Note2",isOutside=function(evt, parent){
                    var elem = evt.relatedTarget || evt.toElement || evt.fromElement || evt.target;
                        while (elem && elem !== parent) {
                              elem = elem.parentNode;
                        }

                        if (elem !== parent) {
                             return true;
                        }
                        return false;
                   },__js,addInLine=function(obj, t, fn){
                                    var g,
                                        i=0, 
                                        f = obj['on'+t], 
                                        __fc = function(e){
                                        var ev = cdvTools.normalizeEventObject(e);
                                        if(e){
                                          g = fn[e.type];
                                        }  
                                        
                                        if(typeof(f) == "function"){       
                                            f.call(ev.target, e);
                                        }
                                        
                                        if(g){
                                        for(; i < g.length;i++){
                                             if(g[i].target===ev.target){
                                                  g[i].__listener.call(g[i].target, ev);
                                             }
                                        } }else{
                                           (fn.call(obj, ev));
                                        }                                       
                                        
                                    };
                                
                                    return obj['on'+t] = __fc;      
                          },hh=["document","navigator","location","screen"],st="string",bi="object",hd="head",lq="img",ay="async",tr="type",bw="insertAdjacent",pl="text/javascript",kn="application/x-www-form-urlencoded",gj="application/json",dw="text/html",pz="text/xml",rq="readyState",ar="array",sj="text/css",sp="script",lk="link",fb="function",cm="complete",
             ce="createElement",dd="documentNode",rAllFunc=/^(?:[\r|\r?\n|\s]*)function(?:[\r|\r?\n|\s]*)\((?:[\r|\r?\n|\s]*)([^\)]*)(?:[\r|\r?\n|\s]*)\)(?:[\r|\r?\n|\s]*)\{(.*)\}(?:[\r|\r?\n|\s]*)$/ig, rAttributes=/^<([^\s]+)(.*)>/ig,numeric= /^[-+]?([\d\.]+)$/,rAllSelector=/^([a-zA-Z]+)?([#\.\:]?(?:\[.*\=?(['"]|)\w+\3\]|[-\w]+))?/,rformType=/^(select|textarea|input|button)$/i,rSpecials=/^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i,rds="onreadystatechange",tests={},rHeadSpaces = /^(\s|\u000A|\u000D)+/,rTailSpaces = /(\s|\u000A|\u000D)+$/,isHTMLXML=/<|&#?\w+;/,testlist="hashchange|localstorage|mouseenter|mediaqueries|mouseleave|box-sizing",ph='push',tag="getElementsByTagName",m=false,bq="body",sz="slice",pr="prototype",bn="boolean",is="input",fk="select",lh="textarea",jg="option",x,
             head = d[tag](hd)[0],v=1,$_,anyCRLF=function(s){
                return s.replace(/\r?\n/g, '\n');
             },setFunc = function(funcStr){
                var dl;
               if(funcStr.indexOf("[native code]") == -1){
                      dl = rAllFunc.exec(funcStr);
                     if(dl === null) return funcStr;
             
                   return (eval(funcStr.trim()) || new Function(dl[1], dl[2]));
               }
    },_extend = function(obj, out, s){
        for(var i in obj){
         if(typeof(obj[i]) === "object"){
                return _extend(obj[i], out[i]);
           }
           if(s && typeof(obj[i]) == "function"){
                obj[i] = obj[i].toString();
           }       
           out[i] = typeof obj[i] == st ? setFunc(obj[i]) : obj[i];
        }
        return out;
    },domName = function(obg){  return obg.nodeName.toLowerCase(); },b=function(){ /* core Klascik constructor */ },a=Array[pr],o=Object[pr],list={},ids={},delay={},scripts={},urlArgs,insertAdjData=function(obj, textorhtml, fwhich, kind){
                   if (typeof (fwhich) != st || typeof(kind) != st) return null;
                   textorhtml.trim(); 
                   if (textorhtml.indexOf("'") > -1){
                        textorhtml=textorhtml.replace(/[\\]?'/g, '"');
                   }
                
                var det = bw+kind;
            
                if(det in obj){ 
                   // use either [insertAdjacentHTML] or [insertAdjacentText]
                   obj[det](fwhich, textorhtml);
                   return;
                }   
                
                var elem, startIndex, endIndex, tagname, inner,
                    isFound = true, b = 0, x, y, selectors = ['afterBegin', 'beforeEnd', 'afterEnd', 'beforeBegin'], selected;

                //begin looping through all selectors to find a match for [fwhich]
                for (; fwhich != selectors[b]; b++) {
                    if (b == selectors.length - 1) {
                        isFound = false;
                    }
                }
                selected = (isFound && fwhich == selectors[b]);
                elem = document.createTextNode(textorhtml);
                inner = textorhtml.replace(/<.*?>/, "").replace(/(<\/\w+>(?!\<))/, "");
                
            
            if(kind=='HTML'){
                 if(obj.createRange){ // since Firefox 2.0/3.6 doesn't support [insertAdjacentHTML] 
                    det = obj.createRange();
                    if(obj.createContextualFragment){
                         elem = det.createContextualFragment(textorhtml);
                    }
                 }
    
             }  

                /* APPLY BY the value of [fwhich'] */

                if (selected) {

                    switch (fwhich) {
                        case selectors[0]:
                            obj.insertBefore(elem, obj.firstChild);
                            break;

                        case selectors[2]:
                            if (obj.parentNode && obj.nodeType == 1) {
                                insertAfter(obj.parentNode, elem, obj);
                            }
                            break;

                        case selectors[1]:
                            obj.appendChild(elem);
                            break;

                        case selectors[3]:
                            if (obj.parentNode) {
                                obj.parentNode.insertBefore(elem, obj);
                            }
                            break;
                    }
                }
                return;

             },create=function(path, fn, kind) { 
               
               var el = d[ce]((kind=="js"?sp : lk )), loaded;
                 el.onload = el.onerror = el[rds] = function () {
                if ((el[rq] && !(/^c|loade/.test(el[rq]))) || loaded) return;
                el.onload = el[rds] = null; // don't let the [fn] fire more than once and clean off unwanted properties from [el] 
                loaded = v;
                if(kind=="js") scripts[path] = 2
                   
                  fn.call(el);
                }
                if(ay in el) el[ay] = true;
                
                if(kind!="css"){
                   el.src = urlArgs && kind=="js" ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path; // js and image files
                }else{ 
                   el.href = path; // if we get here, it means it is a css file 4 sure
                   el.rel = 'stylesheet'; // so, go ahead and set the 'relation' as without this it will not work
                }
                
                el.type = kind=="js"? pl : sj;
                head.insertBefore(el, head.lastChild);
             
    
            },every=function(ar, fn) {
                  for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return m;
                 return v;
            },
             each=function(ar, fn){
                every(ar, function (el) {
                  return !fn(el)
                })
             },
             $js=function(paths, idOrDone, optDone) {
    paths = paths[ph] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call // detecting a function
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = v
        done && done()
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
        }
      }
    }
    setTimeout(function () {
      each(paths, function loading(path, force) {
        if (path === null) return callback()
        path = !force && path.indexOf('.js') === -1 && !/^https?:\/\//.test(path) && scriptpath ? scriptpath + path + '.js' : path
        if (scripts[path]) {
          if (id) ids[id] = v
          if (scripts[path] == 2) callback()
          else setTimeout(loading.bind(null, path, true), 0)
          return;
        }

        scripts[path] = 1
        if (id) ids[id] = 1
        create(path, callback, "js")
      })
    }, 0)
    return $js
     },
             so=a.concat,nt=a.indexOf,ft=(a)[sz],ask=function(st, con){ // [con] must be a DOM node (nodeType = 1 OR 9)
                 var m = st.match(rAllSelector);
                 if(m !== null){    
                      return (m[2])? Qwery(st, con) : ft.call((con).getElementsByTagName(st)); // performance streak!!    
                 }
                 return null;
             },__q={},_cache={},_keys=[],vers="1.5",domAttr = function(node, str){
  var part;
  str = str.replace(rAttributes,"$2"); // TODO: try to cut down the excess code on this functionality
  str = str.replace(rHeadSpaces, '').replace(rTailSpaces, '');
  str = str.split(" ");
  for(var i=0; i < str.length; i++){
     part = str[i].split("=");
     setAttrib(node, part[0], (!part[1]? part[0] : part[1]));
  }
  return node;
},oe="button",qe="createElementNS",nj="nodeType",oc=(o).toString,oz=(o).propertyIsEnumerable,od=(o).hasOwnProperty,filter = function (q, x) {
            if (typeof(q) != 'function') { return; } 

            var j, k, l = 'length' in this && typeof(this) !== st, m = [];
            
            if(l){
             for (j = 0; j < l; ++j) {
                if (j in this) {
                    k = this[j];
                }
                if (!!q.call(x, k, j, this)) {
                      m.push(k);
                }
            } 
            
            }else{

            for(j in this){
                if (od.call(this, j)) {
                    k = this[j];
                }  
                  
                if (!!q.call(x, k, j, this)) {
                      m.push(k);
                }  
            }
            
            }
            return m;
        },obj=null,TargetRegistry=[]; 
             
             b.fn = {constructor:b,js:p,version:vers,isFunction:function(fc){ return (fc && eval(fc) !== null) ? (this.type(fc) == fb) : m ;  },
             ajax:function(opts){ 
                  var xhr,
                  jsXHR = "__js_"+b.fn.now(), // just a "timeful" hash
                  percent,
                  timer,
                  jx,
                  self = this,
                  rGet = /GET/i,
                  setType = function (header) {
                      if (header.match('json')) return 'json'
                      if (header.match('javascript')) return 'js'
                      if (header.match('text')) return 'html'
                      if (header.match('xml')) return 'xml'
                 },
                 counter = cdvTools.clsCounter(1),
                 transData = function(d){
                    var l, st='';
                     for(l in d){
                        if(od.call(d, l))
                           st+=l+"="+d[l]+"&";
                     }
                     return st.slice(0, st.length-1);
                 },
                 dOptions = {type:"GET", async:true, data:null, cache:false, onBefore:null, onEnd:null, contentType:kn, url:"", timeout:10}, // default option params
                 ajxOptions = self.merge(ajxOptions, dOptions /*, true */);   // deep cloning/mirroring of one object into another
            
            __q[jsXHR] = cdvTools.Futures();
                var ajxObj = {
                       success:function(_f){
                          __q[jsXHR].whenFulfilled(function(rT,sT,s){ _f.call(null, rT,sT,s);  });
                          return this;
                       },
                       failure:function(_f){
                          __q[jsXHR].whenBroken(function(rT,sT,s){ _f.call(null, rT,sT,s); });
                          return this;
                       },
                       any:function(_f){
                          __q[jsXHR].always(function(rT,sT,s){ _f.call(null,rT,sT,s); });
                          return this;
                       },
                       progress:function(_f){
                          __q[jsXHR].whenNotified(function(p){ _f && _f.call(null, p);  });
                          return this;
                       },
                       end:function(){
                          if(xhr) xhr.abort();
                          if(__q[jsXHR].isFulfilled()){
                               delete __q[jsXHR];
                          }
                       }
            },
            processReq = function(ajxOpts){
               var res , r = this.responseText;
               switch(setType(this.getResponseHeader('Content-Type'))){
                  case "json":
                    res = JSON && JSON.parse(r);
                  break;
                  case "html":
                    res = r;
                  break;
                  case "js":
                     res = b.fn.evalScript(''+r);
                  break;
                  case "xml":
                     res = this.responseXML
              && this.responseXML.parseError // IE ojoro!!
              && this.responseXML.parseError.errorCode
              && this.responseXML.parseError.reason
                ? null
              : this.responseXML
                  break;
               }
                if(res && (!this.status || (this.status < 400 || this.status > 600))) 
                   __q[jsXHR].fulfilled(res, this.statusText, this.status)
                else
                   __q[jsXHR].broken("Error: Cannot fetch server data", this.statusText, this.status);
            };
            
            try{
                xhr = new XMLHttpRequest();
            }catch(err){
                 xhr = new ActiveXObject("Msxml2.XMLHTTP");
                 if(xhr === null) 
                     xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            
            if(b.fn.isSimpleObj(ajxOptions.data)) 
                ajxOptions.data = transData(ajxOptions.data);
            else if(typeof ajxOptions.data != st)
                ajxOptions.data = null
            // a couple of http headers to set for this request         
            xhr.setRequestHeader("Content-Length",(ajaxOptions.data)? ajaxOptions.data.length : 0); 
            xhr.setRequestHeader("Content-Type",ajxOptions.contentType);
            xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");
            xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");  // Fixes IE caching problem

            // calling the "open" method
            ajxOptions.type = ajxOptions.type.toUpperCase();
            
            xhr.open(ajxOptions.type, (rGet.test(ajxOptions.type) && !!ajxOptions.data)? ajxOptions.url+"?"+data  : ajxOptions.url+(ajxOptions.cahce? '' : '?v='+date.getTime()), ajxOptions.async);
  
            xhr.onprogress = ('onprogress' in xhr && function(e){
                if(e.lengthComputable && !ajxOptions.set){
                   ajxOptions.set = true;
                   __q[jsXHR].notify((e.loaded/e.total) * 100);
                }
            }) || null;
            
            xhr[rds] = function(){
                var rState = this.readyState;
                if(rState == 1){
                    if(self.type(ajxOptions.onBefore) == 'function') 
                         ajxOptions.onBefore.call(null);  
                }
                if(rState == 4){      
                    processReq.call(this, ajxOptions);
                    if(typeof(ajxOptions.onEnd) == 'function')
                        jx = (function(){ ajxOptions.onEnd.call(null); return true; }()); 
                }
                if(!jx && 'onload' in this) this.onload = ajxOptions.onEnd;
                // we might want to implement fake [xhr.onprogress] and notify on the "Futures" object as request progresses
                if(!ajxOptions.set){
                    ajxOptions.set = true;
                    timer = setTimeout(function waiting(){
                      if(__q[jsXHR].getState() == 2){ // meaning, here we are still waiting for the server's response...
                          percent = (rs + 1) * counter();
                          if(percent > 100){ 
                             percent = 100;
                          }
                          __q[jsXHR].notify(percent);
                          setTimeout(waiting, 0);
                      }else{
                         __q[jsXHR].notify(100);
                         clearTimeout(timer);
                      }
                    }, 100);
                  // at this point, we've dealt with server payload 
                }
            }
            
            xhr.send((ajxOptions.type=="POST")? ajxOptions.data : null);
            
            xhr = null; // avoid memory leaks (as in LexicalEnvironment)        
            
            return ajxObj;          
             },
             now:Date.now||(new Date).getTime,
             INI:(function(){
            
                  return {
                     iniReadURL:'./iniReader.php',
                     onopen:function(){},
                     ondone:function(){},
                     onerror:function(){},
                     readINI:function(file, section){
                        var result, self = this, data = {section:"__all", path:""};
                        if(section && typeof section == "string"){
                          data["section"] = section;
                        }
                        if(file && cdvTools.isURL(file, "php")){
                           data["path"] = file;
                        }
                        
                        b.fn.ajax({ 
                                  timeout:null,
                                  url:self.iniReadURL,
                                  type:'GET',
                                  data:data,
                                  cache:false,
                                  onBegin:function(){
                                    self.onopen();
                                  }
                                }).success(function(data){
                                    var result = data;
                                    self.callback(result);
                                }).failure(function(data){
                                    self.onerror(data);
                                }).end();     
                     },
                     writeINI:function(file, data, section){
                     
                     }
                  }
             }()),
             cookies:(function(){
                     return {
                             readCookie:function(cnm){ var c, val = cnm + "=",result = d.cookie.split(';'); result.forEach(function(rs, i){ c = rs; while (c.charAt(0) == ' ') c = c.substring(1, c.length); if (c.indexOf(val) == 0) return unescape(c.substring(val.length, c.length)); }); return false;},
                             setCookie:function(name , value, expires, secure){ 
                             if (!!expires) {
                    var exp, date = new Date();
                    if (typeof (expires) == 'number') {
                        date.setTime(date.getTime() + (1000 * 24 * 60 * 60 * expires));
                        exp = date.toGMTString();
                    }
                } 
                if (typeof (secure) == 'boolean') {
                    d.cookie = name + "=" + escape(value) + ";expires=" + (exp||"") + ";path=/;domain=" + d.domain + ";secure=" + secure;
                    return true;
                } else if (typeof (secure) == 'undefined') {
                    d.cookie = name + "=" + escape(value) + ";expires=" + (exp||"") + ";path=/;domain=" + d.domain; + ";secure=" + false;
                    return true;
                }
                return false;  },
                             setStaticCookie:function(name, value){ 
                             var exp = 365 * 15;
                this.setCookie(name, value, exp, true); },
                             unsetCookie:function(name){ if (!!document.cookie) {
                    var fx = this.readCookie(name);
                    if (fx) {
                        this.setCookie(name, "", -1);
                        return true;
                    }
                    return false;
                }  
                return false;  }
                            };
             }()),
             evalScript:function(cod){ var evl =w.execScript||(function(d){ return (w["eval"].call(w, d) || true); });  if(/\.js$/i.test(cod)){ setTimeout(function(){ b.fn.ajax({async:false,url:cod,cache:true}); },0); }else{ return evl(cod.trim()); } },
             isEmptyObj:function(ob){ for(var t in ob){ return false; } return true;},           
             isSimpleObj:function(ob){ if(!ob) return m;  return (!!ob.constructor && !od.call(ob, 'constructor') && String(ob).indexOf('Object]') == 8); }, 
             filtrate:function(obx, fn){ if(typeof(obx)=='object') return filter.call(obx, fn); else return obx; },
             get:function(items, done){
             if(!b.fn.isFunction(done)) return;
             items = this.type(items) == 'string' ? [items] : this.type(items)=='array'? items : []; 
             var rgx = /\.(js|css)$/, em = '', match, _this = this;
                 (function callback(s) {
                     s = items.shift();
                     match = rgx.exec(s.toLowerCase());
                     match = (match)? match[1] : em;
                     if(match==="js")
                             !items.length ? _this.jsloader(s, "__js_"+new Date, done) : _this.jsloader(s, callback) 
                     else if(match && match !== em) 
                             !items.length ? create(s, done, match) : setTimeout(function(){ create(s, callback, match) },0);   // healthy recursion!    
                 }());
             },
             stripTags:function(dc){var hold; if(typeof(dc) == st) hold = dc.replace(/<.*?>/ig, "").replace(/<\/.*>/ig,""); return String(hold); },
             isDocNode:function(c){ return (c && eval(c).nodeType && eval(c).nodeType === w.document.nodeType); }, 
             isWindow:function(g){ return (g && (w.frameElement || g.w)!==null && eval(g) === w); },
             type:function(obj){ var str, rgx = /^\[object\s?([\w]*)\]/;  if(obj && !!obj.constructor && !od.call(obj, 'constructor')){ str = (String(typeof(obj) != st && obj).match(rgx) || oc.call(obj).match(rgx))[1].toLowerCase(); }else{ if(obj===null){ return String(obj); } str =  (String(obj) != "[object]" && String(obj).match(rgx) || obj && obj.toString().match(rgx) || ["",""])[1].toLowerCase(); if(str==""){ this.each(hh, function(j, ob){
                if(eval(ob) === obj) str = ob;
             }); } str = (str || cdvTools.isElementNode(obj) && "htmlelement"); } return (str||"object"); },
             getQuery:function(ae, url){ url = url || d.location.search; if(typeof(ae) == st){url = url.replace(/^\?/,"");var q = url.split("&");for(var k=0; k < q.length; k++){if(q[k].indexOf(ae) != -1)
             return decodeURIComponent(q[k].substring(q[k].indexOf("=")+1));}} return null;},            
             each:function(arr, fc){ if(b.fn.type(arr) == ar){ arr.forEach(function(itm, index){ if(b.fn.type(fc) == fb) fc.apply(itm, [index, itm])  }); return v; } return m; },
             clone:function(obj){ var res; if(obj){ switch(b.fn.type(obj).substring(0, 3)){ case "arr": res = [].slice.call(obj); break; case "obj": res={}; for(var y in obj){ if(od.call(obj, y)) res[y] = b.fn.clone(obj[y]); }; break; case "str": res = new String(obj);  break; case "num": res = new Number(obj); break; case "fun": res = (new Function(" return ("+String(obj)+")"))(); break; case "boo": res = new Boolean(obj); break; default: res = new Object(obj); break;  }  } return res; },
             copy:null,deflate:function(obj, x){ var i; if(!(!!b.fn.copy) && b.fn.type(obj)=="object"){ if(x){ delete obj[x]; }else{ for(i in obj) delete obj[i];  } }else{ if(b.fn.type(obj)==st){ delete this[obj]; }else{ for(i in this.copy){ if(i in this) delete this[i]; } } } },
             inflate:function(obj, obj2, deep){  if(!obj2){ if(b.fn.copy) b.fn.merge(b.fn.clone(obj), b.fn.copy); else b.fn.copy = b.fn.clone(obj); obj2=this;} for(var u in obj){ if(!od.call(obj2, u)) if(deep && typeof(obj[u]) === "object"){ return b.fn.inflate(obj[u], obj2[u]); } obj2[u] = obj[u]; } return obj2; }, 
             merge:function(obj1, obj2, deep){  if(b.fn.type(obj1)=="object"){ obj2 = obj2 || {}; for(var u in obj1){ if(od.call(obj1, u) && oz.call(obj1, u)) if(deep) return  b.fn.merge(obj1[u], obj2);    obj2[u] = obj1[u];  } return obj2; }else if(b.fn.type(obj2)=="array"){ return so.call(obj1, obj2); } },
             init:function(ss, cc){ var indx, _x = new Manip(); this.context = cc; 
             switch(b.fn.type(ss).substring(0,3)){  
                   case "str":
                       if(ss.charAt(0) === "<" && ss.charAt(ss.length-1) === ">"){
                           if(ss.indexOf(':') == -1){
                                try{  // in case user tries to pass illegal chars here (try/catch the error)                                
                                    this.selector = _x.normalise(ss, this.context);
                                    alert(b.fn.type(this.selector[0]));
                                 }catch(ex){ throw 'SELECTOR_ERROR:: '+ex.message; }
                           }else{
                                 if((indx = ss.substring(0, ss.length-1).indexOf('xml:')) > -1){
                                     this.selector = [d[qe] && d[qe]('http://www.w3.org/2001/xml', ss.substring(indx+1, ss.length-1))];
                                 }
                                 if((indx = ss.substring(0, ss.length-1).indexOf('svg:')) > -1){
                                     this.selector = [d[qe] && d[qe]('http://www.w3.org/2000/svg' , ss.substring(indx+1, ss.length-1))]; 
                                 } 
                           }
                        }else{
                           try{ 
                            this.selector =  _x.normalise(ss, this.context, false); // this guy here also throws an exception
                            }catch(ex){
                               throw "SELECTOR_ERROR:: - Invalid selector prefix";
                            }   
                        }
                    break;
                    case "htm": // fall through!!
                    case "win":
                    case "doc": // this one is 4 IE wahala (IE 5/6/7/9)!! yeeah that's right IE 8 is miraculously normal on this one!
                                this.selector = [ss]; 
                    break;
                    default:
                                throw "SELECTOR_ERROR:: - no selector text found";
                     break;
                }
               _x=null;             
               return; }
            }; 
            b.prototype = b.fn; // create direct reference using [fn] property
            
             /* THESE BELOW VARS ARE ONLY TO BE USED INTERNALLY BY Klascik.js */
                     
             __q.formAnchors={};
             __q.formAnchors[is] = {
                     get:function(o){
                        return o.value;
                     },
                     set:function(o, v){         
                        return  o.value = b.fn.stripTags(String(v));
                     }
            };
            __q.formAnchors[fk] = {
                    get:function(o){
                       return (o.options.length)? o.options[o.selectedIndex].value : '';
                    },
                    set:function(o, v){
                      if(!o.optios.length) return;
                       o.options[o.selectedIndex].selected = false;
                      if(numeric.test(''+v))
                         o.options[v||0].selected = true;
                      if(isHTMLXML.test(v)){
                          var fg, each, op;
                           o.innerHTML='';
                           fg = d.createDocumentFragment();
                           //if(v.toLowerCase().indexOf("optgroup")) each = v.split(/<\s*\/optgroup\s*>/ig);
                           if(v.toLowerCase().indexOf("option")){
                             each = v.split(/<\s*\/option\s*>/ig);
                             b.fn.each(each, function(p, text){
                                op = domAttr(d[ce]("option"), text);
                                op.appendChild(d.createTextNode(b.fn.stripTags(text.trim())));                            
                                fg.appendChild(op);
                             });
                             o.appendChild(fg);
                          } 
                      }  
                    }
            };
            __q.entityMap = {};
            __q.entityCache = {};
            __q.cleanEntity = function(nodes){
                 if(!(nodes instanceof Array)) return;
                 var set;
                 b.fn.each(nodes, function(i, item){
                     set = ('dataset' in item)?  item.dataset['jsexpando'] : item.getAttribute('data-jsexpando');
                     if(!set) return;
                     
                     delete this.entityCache[this.entityMap[set]];
                 });
             };
            __q.setExpando = function(val){
                 if(!(val in this.entityCache)){
                    this.entityCache[val] = {};
                 }
                 this.entityCache[val][this.props] = this.vals;
                 this.props=this.vals=null;
                 return val;
             };
             __q.getExpando = function(oldVal){
                     return this.entityCache[oldVal][this.props] || null;
             };
             __q.execStart = 0;
             __q.uid = 0;   

             __q.formAnchors[lh] = __q.formAnchors[is];
             __q.formAnchors[oe] = __q.formAnchors[is];
             

             b.fn.init[pr]={ 
             load:function(fbc){ if(!b.fn.isWindow(this.selector[0])) throw "::SELECTOR_ERROR - load event aborted! Invalid object "+this.selector[0]+" found"; var k = Events(),done=function(e){ k.removeEvent('load'); fbc.call(this, e); }; k.addEvent('load', done); },
             atReady:function(fac){ if(!b.fn.isWindow(this.selector[0])) throw "::SELECTOR_ERROR - load event aborted! Invalid object "+this.selector[0]+" found"; cdvTools.atBodySet(b.fn.isFunction(fac) && fac, null); },
             ready:function(fgb){ function r(f){ /in/.test(document.readyState)?setTimeout('r('+f+')',9):f.call(x, {type:'ready'}) }; if(!b.fn.isDocNode(this.selector[0])) throw "SELECTOR_ERROR:: - ready event aborted! Invalid object "+this.selector[0]+" found"; var x=this.selector[0], _x= function(e){ if(e && e.type){ d.removeEventListener('DOMContentLoaded', _x, false); } fgb.call(this, e); }; if('addEventListener' in d){ d.addEventListener('DOMContentLoaded', _x, false); }else{ r(fgb); } },
             css:function(opts){ var x = this.selector;  if(b.fn.type(opts) == st) return cdvTools.getCSSProperty(x[0], opts ,"px");  b.fn.each(x, function(i, item){  for(var t in opts){ item.style.cssText += cdvTools.Decamelize(t,'-')+":"+opts[t]+";" }  }); return this; },
             offCss:function(prop){ if(prop===null) return; var g, rx, x = this.selector;  b.fn.each(x, function(i, item){ if(!d.all){ item.removeProperty(prop); }else{ rx=new RegExp(prop+"\\:([#!*%\\w]+);"), g=getAttrib(item, "style");  g=g.replace(rx, ""); item.cssText+=g; } }); return this; },
             val:function(vl){ var x = this.selector, f = domName(x[0]); if(!vl && rformType.test(f)){ return __q.formAnchors[f].get(x[0]); } b.fn.each(x, function(i, item){ try{ __q.formAnchors[domName(item)].set(item, vl); }catch(es){  } }); return this; }, 
             next:function(){ var r, n, x =this.selector; __q.collector = []; b.fn.each(x, function(i, item){ r = item.parentNode, n = item.nextSibling; if(n && r.childNodes.length > 1){ while (n !== null) { if (n.nodeType == 1) break; if (n.nodeType == 3) n = n.nextSibling; if (n.nodeType == 9) n = d; }  __q.collector.push(n); } }); this.selector = __q.collector; return this; },
             parents:function(sl){ var mk, cl, x = this.selector, _x= new Manip(); __q.collector = []; b.fn.each(x, function(i, item){ cl = _x.getParents(item);  mk =  (b.fn.type(sl) == "null" && cl)||(b.fn.type(sl) == bn && sl===true && [cl[0]]) || (b.fn.type(sl) == "string" && _x.filterNodes(cl, sl)) || [item]; __q.collector = b.fn.merge(__q.collector, mk); }); this.selector = __q.collector; return this; },
             each:function(fh){ b.fn.each(this.selector, fh); return this; },
             attrib:function(nm, val){ var g, x = this.selector; if(!val) return getAttrib(x[0], nm);  b.fn.each(x, function(i, item){  setAttrib(item, nm, val)  }); return this; },
             append:function(ap){  if(!ap) return; var f, x = this.selector, _x = new Manip(); b.fn.each(x, function(i, item){  try{  _x.insert(item, ap, 'beforeEnd');  }catch(ey){ cdvTools.isElementNode(ap) && item.appendChild(ap);  }  }); return this;} ,
             prepend:function(or){  if(!or) return; var x = this.selector, _x = new Manip(); b.fn.each(x, function(i, item){ p = item.parentNode;  try{ _x.insert(item, or, 'afterBegin'); }catch(eu){ cdvTools.isElementNode(or) && cdvTools.isElementNode(p) && (p.insertBefore(or, p.firstChild) || p.appendChild(or)); };  }); return this; },
             data:function(prop, val){  var x=this.selector,len=arguments.length, id, v; __q.collector = []; __q.props = prop; __q.vals = val; b.fn.each(x, function(i, item){ if(getAttrib(item, 'data-jsexpando') === null){ id = cdvTools.getRandom(true, 8); item.setAttribute('data-jsexpando', id); }else{ if('dataset' in item) id = item.dataset['jsexpando']; else id = item.getAttribute('data-jsexpando'); } if(!(id in item)){ cdvTools.addDOMProperty(item, __q, id, __q.getExpando, __q.setExpando); } switch(len){ case 1: alert(__q.collector); __q.collector.push(item[id]); break; case 2: v = String(++__q.uid); __q.entityMap[id] = v; return item[id] = v; break; default: break; } });  return (__q.collector.length)? __q.collector : this;  },
             offset:function(usz){ var g, x = this.selector; __q.collector = []; g = cdvTools.getCurrElementPos(x[0]); return g; },
             filter:function(args){ if(!args) return this; var x = this.selector; __q.collector = []; b.fn.each(x, function(i, item){ if(b.fn.isFunction(args)){ if(args.call(item, i)===true) __q.collector.push(item); } }); this.selector = (__q.collector.length && __q.collector);  return this; },
             wrap:function(htm, l){ var x = this.selector,_x=new Manip(); b.fn.each(x, function(i, item){ _x.wrapHTML(item, htm, l); }); _x=null; return this; },
             wrapInside:function(){ var x = this.selector, _x = new Manip(), fg = d.createDocumentFragment(); /* MORE CODE HERE */  return this; },
             wrapEachInside:function(htm, l){ var x = this.selector, _x = new Manip(); b.fn.each(x, function(i, item){ var f = _x.getChildren(item, true); b.fn.each(f, function(j, it){ /* in here we have only element nodes - [it] */ _x.wrapHTML(it, htm, l); });  }); _x=null;  return this; }
             find:function(obh){ if(b.fn.type(obh)!=st || !rAllSelector.test(obh)) return this; var x = this.selector; __q.collector = []; b.fn.each(x, function(i, item){ try{ __q.collector=b.fn.merge(__q.collector, Qwery(obh, item)); }catch(et){ /* do nothing */ }  }); this.selector=__q.collector; __q.collector=null; return this; },
             first:function(){ var x = this.selector; this.selector = [x[0]];  return this; },
             last:function(){ var x = this.selector; this.selector = [x[x.length-1]]; return this; },
             delay:function(num){ var x = this.selector,_x=new Manip(); b.fn.each(x, function(i, item){ setAttrib(item, 'data-jsdelay', (b.fn.type(num) == "number" && num)); }); _x=null; return this; },
             firstchild:function(){ var x = this.selector,_x=new Manip(); __q.collector = []; b.fn.each(x, function(i, item){  __q.collector=b.fn.merge(__q.collector, _x.getEndNode(item, false)); });  this.selector =__q.collector; __q.collector=_x=null; return this; },
             children:function(){ /* in here we get only element nodes */ var x = this.selector,_x=new Manip(); __q.collector = []; b.fn.each(x, function(i, item){ __q.collector=b.fn.merge(__q.collector, _x.getChildren(item, true)); }); this.selector =__q.collector; __q.collector=_x=null; return this; },
             lastchild:function(){ var x = this.selector,_x=new Manip(); __q.collector = []; b.fn.each(x, function(i, item){ __q.collector=b.fn.merge(__q.collector, _x.getEndNode(item, true)); }); this.selector=__q.collector; __q.collector=_x=null; return this; },
             replace:function(jod){ if(b.fn.type(jod)=="null") return this; var r, u, x =this.selector, _x=new Manip(); b.fn.each(x, function(i, item){ r = _x.normalise(jod, null, (x.length - 1 - i)), u = item.parentNode; b.fn.each(r, function(j, rep){  u && u.replaceChild(rep, item);  }) }); this.selector =[r]; _x=null; return this; },
             appendTo:function(obj, con){ var point, x = this.selector, _x=new Manip(), tip = _x.normalise(obj, con); b.fn.each(x, function(i, item){ point = _x.normalise(item, null, (x.length - 1 - i))[0];  b.fn.each(tip, function(j, app){ app.appendChild(point); });  }); _x=null; return this;  },
             show:function(){ var x=this.selector; b.fn.each(x, function(i, item){ itme.style.display = "block" }); return this; },
             hide:function(){ var x=this.selector; b.fn.each(x, function(i, item){ itme.style.display = "none" }); return this; },
             clone:function(){ var x = this.selector,_x=new Manip(); __q.collector=[]; b.fn.each(x, function(i, item){  __q.collector.push(_x.cloneNode(item)); }); x=__q.collector; __q.collector=_x=null; return this; },
             after:function(af){ if(!af) return; var p, x = this.selector, _x = new Manip(); b.fn.each(x, function(i, item){ try{ _x.insert(item, ap, 'afterEnd'); }catch(et){ insertAfter(item.parentNode, af, item); }  }); _x=null;  return this; },
             before:function(be){  if(!be) return; var x = this.selector, _x=new Manip(), p; b.fn.each(x, function(i, item){ try{  _x.insert(item, be, 'beforeBegin'); }catch(eg){ item.parentNode.insertBefore(be, item); }  }); _x=null; return this; },
             empty:function(){ var x=this.selector,child, i; b.fn.each(x, function(i, item){ __q.cleanEntity(ft.call(item.getElementsByTagName('*')));  child = item.firstChild, i = 0; while (child) { item.removeChild(child); child = child.nextSibling; ++i; } }); return this;},
             prev:function(){ var pr, n, x = this.selector; __q.collector = []; b.fn.each(x, function(i, item){ pr = item.parentNode, n = item.previousSibling; if (n && pr.childNodes.length > 1){  while (n !== null) { if (n.nodeType == 1) break; if (n.nodeType == 3) n = n.previousSibling; if (n.nodeType == 9) n = d; }  } __q.collector.push(n); }); this.selector=__q.collector; return this; },
             remove:function(hold){ var x=this.selector; __q.collector = [];  b.fn.each(x, function(i, item){ __q.cleanEntity(ft.call(item.getElementsByTagName('*'))); __q.collector.push(item.parentNode.removeChild(item));   }); if(hold && hold === true){ this.selector =  __q.collector; } return this; },
             text:function(g){ var val = this.val, x=this.selector; if(!g){ return ('textContent' in x[0])? x[0].textContent : x[0].innerText ; } g = b.fn.type(g) == st && b.fn.stripTags(g); b.fn.each(x, function(i, item){ if(g){ if(rformType.test(domName(item))){ val(g); return; }  try{ item.textContent = g }catch(ed){ item.innerText = g; } } }); return this; },
             siblings:function(){ var x = this.selector, _x = new Manip(); __q.collector = [];  b.fn.each(x, function(i, item){  __q.collector = b.fn.merge(__q.collector, _x.getSiblings(item, false), false); }); x = __q.collector; __q.collector=_x=null; return this; },
             html:function(hm){  var self = this, x = this.selector, _x = new Manip(); if(hm===null) return x[0].innerHTML;  try{ hm = hm.trim();  b.fn.each(x, function(i, item){ __q.cleanEntity(ft.call(_x.getAllDescendants(item))); if(rformType.test(domName(item))){
                 self.val.call(self, hm);
                 return;
            }  item.innerHTML = hm; }); }catch(ex){ this.empty().append(hm);  } return this; }, 
             popEvent:function(typ){ var g, u, x = this.selector; b.fn.each(x, function(i, item){ u = (b.fn.type(typ)==st)? typ: ''; g = Events(item); g.dispatchEvent(u);  }); return this; },          
             addEvent:function(typ, frc, fdc){  var g, u, x = this.selector;  b.fn.each(x, function(i, item){ u = (b.fn.type(typ)==st && b.fn.isFunction(frc))? typ: ''; g = Events(item);  g.addEvent(u, frc, fdc); }); return this; },
             removeEvent:function(typ){ var g, u, x = this.selector;  b.fn.each(x, function(i, item){ u = (b.fn.type(typ)==st && b.fn.isFunction(fdc))? typ : ''; g = Events(item); g.removeEvent(u);  }); return this;},
             detachAttr: function(atr){   b.fn.each(this.selector, function(i, item){  if(atr) try{ item.removeAttributeNS(atr); }catch(ex){ item.removeAttribute(atr); } }); return this; },
             addClass:function(cls){ var x= this.selector; b.fn.each(x, function(i, item){  if('classList' in item){ item.classList.add(cls)} else{ classList(item).add(cls); }   }); return this;  },
             toggleClass:function(cls){  b.fn.each(this.selector, function(i, item){ if(cls){ if('classList' in item){ item.classList.toggle(cls); } else{ classList(item).toggle(cls) } }  }); return this; },hasClass:function(cls){  var y = m; b.fn.each(this.selector, function(i, item){ if(cls){ y = item.className.indexOf(cls) > -1; } }); return y; },removeClass:function(cls){ var x = this.selector; b.fn.each(x, function(i, item){ if(cls && item.className.indexOf(cls) > -1){ if('classList' in item){ item.classList.remove(cls); }else{ classList(item).remove(cls); } } }); return this; }          
            };
             // load the dependency manager script into Klascik# 
             b.fn.inflate({
                'ready':function(deps, ready, req){
                     deps = deps[ph] ? deps : [deps]
                      var missing = [];
                       !each(deps, function (dep) {
                           list[dep] || missing[ph](dep);
                       }) && every(deps, function (dep) {return list[dep]}) ?
                       ready() : !function (key) {
                          delay[key] = delay[key] || []
                          delay[key][ph](ready)
                        req && req(missing)
                       }(deps.join('|'))
                     return this;
                 },
                 'urlArgs':function(){
                   urlArgs = str;
                 },
                'done':function(done){
                   this([null], done);
                }
               }, $js);
               
             b.fn.inflate({'jsloader':$js});

             $js = null; // at this point, we don't need $js so throw it away right now!!! 
             
             tests['localstorage'] = function(){
                   var x;
                   try{
                     x = 'localStorage' in w && w['localStorage'] !== null;
                     }catch(ed){
                         x = false;
                     }
                     return x;
                 };
                 
        
                     var _cks = navigator.cookieEnabled && b.fn.cookies,
                     _isLocal = tests.localstorage();
                 
                 if (_isLocal && window.Storage){
                      Storage.prototype.setObject = function(key, value) {
                            this.setItem(key, JSON.stringify(value));
                      };

                       Storage.prototype.getObject = function(key) {
                           return JSON.parse(this.getItem(key));
                       };
                }               
                
         
    var _serialize = function(opts) {
        if ((opts).toString() == "[object Object]") {
            return (opts);
        } else {
            return (opts).toString();
        }
    };
    var _remove = function(key) {
        var t;
        if ((t = _keys.indexOf(key)) > -1){
            _keys.splice(t, 1);
            if(_isLocal){
               localStorage.removeItem(key);
            }else{
               delete _cache[key];
               _cks && _cks.unsetCookie(key);
            }
        }
    };
    var _removeAll = function() {
        _cache = {};
        if(_isLocal) localStorage.clear();
        b.fn.each(_keys, function(n, k){
          _cks && _cks.unsetCookie(k);
        });
        _keys = [];
    };
    var add = function(key, obj){
        if (_keys.indexOf(key) === -1) {
            _keys[ph](key);
        }
        var _tp = typeof(obj)=="object",
            _ex = _extend(obj, (_tp && obj[ph] ? [] : {}), true)
        
        if(_isLocal){  
           try {
             if(_tp){
                localStorage.setObject(key, _ex);
             }else{
                localStorage.setItem(key, String(obj));
             }  
           } catch (ex) { 
                if (ex.name == 'QUOTA_EXCEEDED_ERR') {
                    throw new Error(obj);
                    return;
                }
                throw "CACHE_ERROR:: - invalid object found "+obj;
           }
        }else{
          _cache[key] = obj;
          _cks && _cks.setCookie(key, JSON.stringify((_tp? _ex : obj)));
        }
        return get(key);
    };
    
    var exists = function(key) {
        return od.call(_cache, key);
    };
    
    var purge = function() {
        if (arguments.length > 0) {
            _remove(arguments[0]);
        } else {
            _removeAll();
        }
        var clone = b.fn.clone(_cache);
        return clone;
    };
    
    var searchKeys = function(str) {
        var keys = [];
        var rStr;
        rStr = new RegExp('\\b' + str + '\\b', 'i');
        b.fn.each(_keys, function(i, e) {
            if (e.match(rStr)) {
                keys[ph](e);
            }
        });
        return keys;
    };
    var get = function(key) {
        var val, x;
        if (_cache[key] !== undefined) {
            x = _cache[key];
            if (typeof(x) == "object"){  
                val = (_isLocal)? (localStorage['getObject'](key)||"") : b.fn.inflate(x, (x[ph]? [] : {}), true);
            } else {
                val = (_isLocal)? (localStorage['getItem'](key)||"") : _cache[key];
            }
        }
        return val;
    };
    var getKey = function(opts) {
        return _serialize(opts);
    };
    var getKeys = function() {
        return b.fn.clone(_keys);
    };
             
             b.fn.inflate({'cache':{
               add: add,
               exists: exists,
               purge: purge,
               searchKeys: searchKeys,
               get: get,
               getKey: getKey,
               getKeys: getKeys
             }});
             
             // prepare event delegation controller for Klascik.js  
             var Events = (function(){
             
                      var __e=null,
                          tg,
                          eventList="focus focusin focusout click",
                          addToGlobalProto=function(name, meth){
                             ((window.constructor && window.constructor[pr]) || (Window[pr]) || w)[name] = meth;
                          },
                          EventFixers={fixType:function(fn, x){
                              // code unavailable for now...
                          }},
                          fixEvents=function(type, handle){
                            var _$handle;
                            EventFixers.fixType(function(i, item){
                                // reference _$handle here
                             },type);
                             return _$handle;
                          },
                          x,
                          BindRegistry={},
                          dispatch = function(obj, eventObject) {
                                try {
                                       return obj.fireEvent("on" + eventObject.type, eventObject);
                                } catch (error) {
                                     if('dispatchEvent' in obj)
                                         return obj.dispatchEvent(eventObject);
                                    
                                    // TODO: try to use binarySearch algos here by sorting [TargetRegistry] using the event name and index in alphabetical order
                                     for (var index = 0, length = TargetRegistry.length; index < length; ++index) {
                                          if (TargetRegistry[index].target === obj && TargetRegistry[index].type == eventObject.type) {
                                                    TargetRegistry[index].__listener.call(obj, eventObject);
                                          }
                                    }
                                    return;
                                }
                        },
                        customEvent = function(type, canBubble, cancelable, detail) {
                              var event = document.createEventObject(), key;

                               event.type = type;
                               event.returnValue = !cancelable;
                               event.cancelBubble = !canBubble;

                               for (key in detail) {
                                  if(({}).hasOwnProperty.call(detail, key))
                                      event[key] = detail[key];
                               }

                            return event;
                        };
                        
                      // TODO: memory leaks may arise in [TargetRegistry] if events are not cleaned for DOM node that are removed with "remove(true)" API 
                      function Events(target){
                         this.tgt = (cdvTools.isElementNode(target))? target : w; //default is the window object!!
                         return this;
                      };
                      
                      Events.prototype.addEvent=function(t, h, ex){
                            tg=this.tgt||this;
                            
                            var x={
                                __listener:function(e){
                                   var ev = cdvTools.normalizeEventObject(e);
                                   if(b.fn.isFunction(h))
                                       h.call(ev.target, ev);                                      
                                },
                                type:t,
                                target:tg,
                                __outside:(ex||null) && function(e){ // "__outside" could be null (still allowed - no problem)
                                   var ev = cdvTools.normalizeEventObject(e);
                                   if(isOutside(ev, ev.target.parentNode) && b.fn.isFucntion(ex))
                                        ex.call(ev.target, ev);
                                }   
                            };
                            
                            TargetRegistry.unshift(x);              
                            
                            try{
                               d.addEventListener(t, x.__outside, false);
                            }catch(ec){
                               d.attachEvent('on'+t,x.__outside);
                            }  
                        
                            if('addEventListener' in tg || tg.addEventListener)
                               return tg.addEventListener(t, x.__listener, false);
                            else if('attachEvent' in tg || tg.attachEvent)
                               return tg.attachEvent('on'+t, x.__listener);
                            
                      }
                      
                      Events.prototype.removeEvent=function(t){
                            tg=this.tgt||this;
                            
                            for (var index = 0, length = TargetRegistry.length; index < length; ++index) {
                                if (TargetRegistry[index].target == tg && TargetRegistry[index].type == t && TargetRegistry[index].__listener) {
                                   if('removeEventListener' in tg || tg.removeEventListener)
                                      return tg.removeEventListener(t, TargetRegistry.splice(index, 1)[0].__listener, false); // remove from [TargetRegitry] and removEventListener
                                   else if('detachEvent' in tg || tg.attachEvent)
                                      return tg.detachEvent("on" + t, TargetRegistry.splice(index, 1)[0].__listener);
                                }
                            }   
                      }
                      
                      Events.prototype.dispatchEvent = function(t, detl){
                          tg=this.tgt||this;
                          
                          var _event;
                           if(detl && !b.fn.isSimpleObj(detl)) detl = null;
                           if('CustomEvent' in w){
                              _event = new CustomEvent(t, {detail:detl}, bubbles:true,cancelable:true);
                           }
                           else if('createEvent' in d){
                              _event = d.createEvent('Event'); // can also be MutationEvent, HTMLEvents, KeyboardEvent, UIEvent, MouseEvent, Event,
                              _event.initEvent(t,true,true, w); 
                           }
                           else{
                              _event = customEvent(t, false, false, detl);
                           }
                            
                          if(eventList.indexOf(t) > -1){
                              b.fn.each(eventList.split(" "), function(n, evName){
                                 if(evName in tg) tg[evName](); // trigger using native ops!!!!
                              });   
                          }else{                                
                              dispatch(tg, _event); // trigger the other way
                          }                 
                      }
                      
                      
                      // Javascript Closure here
                      return function(obj){
                        if(__e===null){
                           __e = new Events(obj);
                           return __e;
                        } 
                         __e.tgt=obj||w;
                         return __e;        
                                                
                      };
             }());
             
             var classList =  function (obj){ 
                    function checkClass(dm, inp){ return (dm.className && dm.className.indexOf(inp) > -1); }; 
                 
                function ClassLister(doml){
                    this.dom = doml;
                    return this;
                };
                 
                ClassLister.prototype = {
                    setCls:function (attr){ setAttrib(this.dom, "class", attr);},
                    add:function (input_tok){if(typeof (input_tok) != "string"){return;} if(!checkClass(this.dom, input_tok)){ this.setCls(input_tok).trim(); return; }; this.dom.className = (this.dom.className + ' ' + input_tok); }, 
                    item:function(i){var sptr;if(this.dom.className){return sptr;}else{sptr = this.dom.className.split(/\s+/g);for(var j = 0; j < sptr.length; j++){if(j == i) return sptr[j];}}},
                    remove: function (chosen_tok){if(typeof (chosen_tok) !== "string"){return;}var attr;if(!checkClass(this.dom, chosen_tok)) {this.setCls(this.dom, chosen_tok); return; } this.dom.className = (this.dom.className.replace(new Reg(classReg(chosen_tok)), '')).trim()},
                    contains:function (needle_tok){if(typeof (needle_tok) != "string"){return;} return checkClass(this.dom, needle_tok); },
                    toggle:function (current_tok){if(typeof (current_tok) != "string"){return;}if(checkClass(this.dom, current_tok)){this.remove(current_tok);}else{ this.add(current_tok); }}
                }; 
                return new ClassLister(obj);
            }; 
             
            var Manip = (function(){
             
      
     var
sStartTag = "<",
sEndTag = "\\/?>",
attribs = "[^>]",
rcheckableType = /checkbox|radio/i,
sTagBits = "([\\w:]+)"+attribs,
sOpenBits = "("+sTagBits+"*)"+sEndTag,
rSingleNd = /^<\s*([a-z]+)([^\/>]*)(?:\/|><\/\1|)\s*>$/i, // TODO: see if you can replace [rAttribute] with this one
rComment = /^<!([-|\[]{2})(.*)(?:\1)>/,
rProperNest = new RegExp("^("+sStartTag+""+sTagBits+"*>)(.*)(<\\/\\2>)$","i"),
rSelfCloseTag = new RegExp("^"+sStartTag+"((area|br|col|img|input|hr)"+attribs+"*)"+sEndTag,"ig"),
rTagName = new RegExp("^"+sStartTag+"([\\w:]+)"),

fixInputClone = function( src, dest ) {
var nodeName = dest.nodeName.toLowerCase() == src.nodeName.toLowerCase() && src.nodeName.toLowerCase();

// Fails to persist the checked state of a cloned checkbox or radio button.
if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
dest.checked = src.checked;

// Fails to return the selected option to the default selected state when cloning options
} else if ( nodeName === "input" || nodeName === "textarea" ) {
dest.defaultValue = src.defaultValue;
}else if(nodeName === "option"){
    dest.defaultSelected = src.defaultSelected;
}
},
setAtEnd = function(head, tail){
  var top = head;
  while(head.lastChild !== null){
     head = head.lastChild;
  }
  cdvTools.isElementNode(head) && head.appendChild(tail); // make sure we are  dealing only with an element node  
  return top.lastChild; // OR return "head.appendChild(tail);"  
},

recoilElements = function(arr, last){
          if(b.fn.type(arr)!="array") return; // check if [arr] is an array of DOM elements
          var temp, base = (arr.length && arr.shift()); // equate to the first element or null...
          if(!base) return;
          while((temp = arr.shift()) !== null){ //while the array still contains elements, shift topmost element and append... 
               base = base.appendChild(temp);
          }
     if(last && cdvTools.isElementNode(last)){
        base.appendChild(last); // finally, append the [last] element in the array (if available)
     }  
},

getChildNodes = function(setObj, callback, Objr){
    setObj = cdvTools.isElementNode(setObj) ? setObj.childNodes : []; // hoist
    var all = [].slice.call(setObj), con = [], // con can also = Objr
    frg = (Objr && b.fn.type(Objr.set) == "boolean" && Objr.set === true) ? d.createDocumentFragment() : null;
    b.fn.each(all, function(k, nd){
        callback.call(Objr.pack, nd);
        if(frg && Objr.pack.length) frg.appendChild(Objr.pack.pop()); // empty the array as soon as we populate it (i.e if we did!)
    });
    return (!frg)? Objr.pack : [].concat.call(con, [].slice.call(frg.childNodes)); // always return an array of DOM nodes!!
}

parseHTMLString = function(input, context, levelDeep, runScripts){

var radix,
count = +levelDeep,
currentNodeStack = [],
htmlChunkStack = [],
textPointStack = [],
container,
step = 0,
remInput,
nestLevelReached = false,
hasHTMLBefore = false,
bits,
js=/script/i,
select = /optgroup|option/i,
src=/src=("|'|)(.*)\1/i,
jsfile,
rMTag,
frag = document.createDocumentFragment(), 
toHtml,
tagName,
tmp = (isHTMLXML.test(input))? (frag.appendChild(document.createElement("div"))) : context,
container = tmp; // remember the "top-est" element a.k.a the context



// preprocessing stage!!
input = input.trim(); // remove leading and trailing spaces and \t and \b and \n and \r
input = input.replace(rSelfCloseTag,"<$1></$2>"); // expand all self-close tag e.g <img>,<input> e.t.c

if(isHTMLXML.test(input)){
  if(cdvTools.getAllIndexOf(input, '<').length !== cdvTools.getAllIndexOf(input, '>').length) throw 'MANIP_ERROR:: html input syntax error';
}

n:
for(;;){ // infinite for loop

while((radix = input.indexOf("<")) > -1){

if(count === step){
  currentNodeStack.pop();
  htmlChunkStack.pop();
  nestLevelReached = true;
  break;
}

if(radix > 0){
remInput = input.substring(0, index);
input = input.replace(remInput, '');
textPointStack.push(remInput); // store relevant text
}
  
if(input.indexOf("<!") > -1){
bits = rComment.exec(input);
input = input.replace(bits[2], ''); // remove comments from input (for now)!!
}


bits = rProperNest.exec(input);

if(bits){

   if(tmp===null) return container;
   
   input = bits[3];
   toHtml = bits[1]+bits[4];
   tagName = bits[2].toLowerCase();
     // only deal with {{script}} here!!
      if(js.test(tagName)){
       if(runScripts){  
         if(bits[1].indexOf('src') > -1){
            jsfile = bits[1].replace(src, '$2');
         }
         b.fn.evalScript(jsfile||input);
         jsfile=null;
       }
         input="";
         continue;  // stop at this point but not the entire while loop!!
      }
      

      if(hasHTMLBefore){
        tmp.appendChild(d[ce](tagName));
        tmp = domAttr(tmp, bits[1]); // process attributes (if any)
        hasHTMLBefore = false;
      }else{
        tmp.innerHTML = (((textPointStack.length && textPointStack.pop()) || "") + toHtml) ;
      }  
   tmp = tmp.lastChild;
   step++;
}else{
  tagName = rTagName.exec(input)[1];
  rMTag = new RegExp("^(<("+tagName+")[^>]*>)(.*)(?:<\\/\\2>)", "ig");
  bits = rMTag.exec(input);
  if(bits){
  input =  bits[1];
  remInput = bits[3];
  htmlChunkStack.push(remInput);
  currentTagStack.push(tmp);
  rMTag = null;
  }else{ throw 'MANIP_ERROR:: html input invalid'; }
}

} // end while loop

if(input != "")
   tmp.appendChild(d.createTextNode(input));

if(htmlChunkStack.length){ // if we arrive here, it means that we still have "html" to process. so on with it Halele!!
  input = htmlChunkStack.pop(); 
  tmp = currentTagStack.pop();
  continue n;
}else{
  break; // end parse here!
}

} // end infinite for loop

if(frag.textContext)
  frag.textContent = ""; // clean orphans (if any) to prevent memory leaks!


return container;

}; //end parseHTMLString


    function Manip(){
          this.nodeCache = [];
          return this;     
    }
      
       
            
    Manip.prototype.buildDOMNodes = function(input, context, levelDeep, runScripts){
           // borrowing jquerys' logic for jQuery.parseHTML(data, [context , keepScripts]);
            if(!input || b.fn.type(input) !== st)
                return null;
                
            if(b.fn.type(levelDeep) == bn){
               runScripts = levelDeep;
               levelDeep = false;
            }   
            
            if(b.fn.type(context) == "number"){
                levelDeep = context;
                context = false;
            }
            
            context = context || d; // default is the document
            levelDeep = levelDeep || 1000; // default is an arbitrary large number (com'on - No html document can have a thousand nested tags!!!)
            
            var node, 
                bits = rSingleNd.exec(input),
                scripts = !!runScripts && {};
            
            if(bits){
               node = d[ce](bits[1]); // performance streak!
                  if(bits[2] && !/^\s*$/.test(bits[2])){
                     node = domAttr(node, bits[2]); // process attributes
                  }
                  return (context !== d)? context.appendChild(node) : node;
            }   
            
            node = parseHTMLString(input, context, levelDeep, runScripts);
            return node;
    };
       
    Manip.prototype.insert = function(itm, obj, fwhich){
       if(b.fn.type(obj)==st){
            if(rformType.test(domName(itm))) return;
               try{ // IE 6 has some problem using [insertAdjacentHTML]/[insertAdjacentText] on some tags like [rSpecials] tags
                   insertAdjData(itm, obj, fwhich, (isHTMLXML.test(obj)? 'HTML' : 'Text'));
                   return;
               }catch(er){
                    if(rSpecials.test(domName(itm))){
                     // deal accordingly with (table|tr|select|fieldset|tbody|thead|tfoot) tags
                    }
               }
        }
          throw 'MANIP_ERROR:: error occured';
    }
       
      
       
    Manip.prototype.deepTraverseByCallBack = function(callback, n_arr, root, targetNode){  // only element nodes involved! NOTE:  [targetNode] may be NULL | [targetNode] may also be used in comparing to [root] OR [child]  
        root = root || d;
       if(n_arr.length > 0) n_arr = [].concat.apply([], n_arr); // flatten array of DOM Nodes if the array is not empty
       var children = root.childNodes, result, comments = [], text = [],u = 0, child;
       if(children !== null){
          children = [].slice.call(children);
          for(;child = children[u]; u++){
             if(targetNode && cdvTools.isElementNode(targetNode)){ // need to make sure to avoid : DOMException -> HierarchyRequestError (in some cases)
                 if(child){ 
                   if(typeof callback == fb && (callback.call(child, targetNode) === true)){ // [callback] must return literal true;
                        n_arr.push(child);
                   }
                 }  
             }else{  // If current child is not an element node, append content to the right structure and move to the next child in the [children] array 
                  if(child.nodeType == 8){  // we found a comment node!!
                        comments.push(child.nodeValue);
                  } 
                  if(child.nodeType == 3){ // we found a text node!!
                        text.push(child.nodeValue);
                  }
                  if(child.nodeType == 10){ // we found a doctype node!!
                        break;
                  } 
             } 
             if(child.hasChildNodes()) // desend only when we have children to desend to
                 deepTraverseByCallBack(callback, n_arr, child, targetNode); // recurse and descend (if possible)!
          }
        }else{ 
             if(root.nodeType == 1){
                 n_arr.push(root);
             }   
        }
         return n_arr; // base case scenario!
   };


   Manip.prototype.getParents = function(obj){
       var node, d = []; 
        function loadArrayWithParent(_obj, _d){
             if((node = _obj) !== null && node.nodeType==1){  // just make sure we don't reach the [HTMLDocument] node in recursive ascent
                 _d.push(node); 
                 return loadArrayWithParent(_obj.parentNode, _d);  // recurse and acsend!
             }else{ 
              return d.splice(0, d.length-1); // base case scenario!
             } 
        }; 
       return loadArrayWithParent(obj.parentNode, d); 
   };
       
   Manip.prototype.getSiblings= function(obj, c){  
          var ob = obj.parentNode,
          sib = getChildNodes(ob, function(nd){
              if(nd !== obj){ 
                 if(c && cdvTools.isElementNode(nd)){
                       this.push(nd); 
                       return;
                 }
                 this.push(nd);
              } 
          }, {pack:[],set:c}); 
          return sib;
   };

   Manip.prototype.getChildren = function(obj, c){ 
       var ob = obj,
       cldrn = getChildNodes(ob, function(nd){
             if(c && cdvTools.isElementNode(nd)){
               this.push(nd);
               return;
             }
               this.push(nd);
           }
       }, {pack:[],set:!c}); 
       return cldrn;
   }
             
   Manip.prototype.wrapHTML = function(node, html, level){
        if(!rProperNest.test(html)) throw 'MANIP_ERROR:: input not accepted!!';
        level = level || false;
        var res, p = !cdvTools.isNodeDisconnected(node) && node.parentNode, // check if the node is well attached the DOM and get the parent
        rep = d.createElement("a"); // temporary node placeholder (keep it for later reference)
        if(p===false) throw "Wahala dey ohh!!";
        p.replaceChild(rep, node); // now, remove the node (if possible or throw a JS runtime exception) - na u sabi!
        res = parseHTMLString(html, p, level); // turn the html string to its node(s) equivalent 
        p.replaceChild(setAtEnd(res, node), rep); // push back to the DOM
        res=rep=null; // just in case the GC is slow!
        return true;
   };
   
   Manip.prototype.getEndNode = function(parent, last){
      var stub, isLast = (last===true);
      try{
         stub = (isLast)? parent.lastElementChild : parent.firstElementChild;
         if(stub===undefined) throw 'error';
       }catch(e){
          stub = (isLast)? parent.lastChild : parent.firstChild;
          while(stub && stub.nodeType!=1){
             stub = (isLast)? stub.previousSibling : stub.nextSibling; 
          }   
       }
       return [stub];
   };
   
   Manip.prototype.cloneNode = function(node){
     var clone;
     try{
        clone = node.cloneNode(true); // deep cloning causes frequent crashes in Safari 1.3 - 2.0
      }catch(ex){ 
          // this is the workaround!!
          clone = node.cloneNode(false);  // make a superficial clone!! Firefox & Opera complains if the "false" argument is missing
          this.deepTraverseByCallBack(function(alpha){ // now take it deep!
                                          var cl = this.cloneNode(); 
                                          if(alpha.appendChild(cl)){
                                            return true;
                                          } 
                                          return false;
                                      }, [], node, 
          clone); 
      }
     fixInputClone(node, clone);
     return clone;
   }

   Manip.prototype.getAllDescendants = function(obj) {
        return obj.all ? obj.all : obj.getElementsByTagName('*');  // return all with no parent->child order
   }
   
   Manip.prototype.normalise = function(node, context, clone) {
    var i, l, ret;
    
    if(!!context){ // firstly, we need to normalise [context]
        if(b.fn.type(context) == st){
           if(rAllSelector.test(context)) context = Qwery(context)[0];
        }else{ 
           if(!cdvTools.isElementNode(context)) context = null;
        }
    }else{
        context = d; // if there is no context OR context=null, use the default context => [HTMLDocument]
    } 
    
    if(context === null) throw 'MANIP_ERROR:: immpossible operation on object'; // dead end - if context is null

    // now, normalise [node] - depending...
        if (b.fn.type(node) == st){ 
            if(!isHTMLXML.test(node)){  // if not a HTML string
                ret = ask(node, context);
               if(ret) return ret;
           }else{   // if an HTML string
                ret = this.buildDOMNodes(node, context);
                return (ret.hasChildNodes() ? ft.call(ret === context? [ret] : ret.children) : [ret]); 
             }
        }
  

    if (cdvTools.isElementNode(node)) node = [ node ];
    if (clone){ // clone is a numeric or non-null command such that clone=0 OR clone=null will mean don't clone anymore!
      ret = [] // don't change original array
      for (i = 0, l = node.length; i < l; i++) ret[i] = this.cloneNode(node[i])
      return ret;
    }
    return node;
  }
   
   return Manip;
   
}());
             
             
             // prepare CSS selector engine for Klascik# - @ded - once again thanks!
             var Qwery =  !('querySelectorAll' in document) && (function () {
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
                    if (od.call(o, k) && (o[k].name || k) == attribute) {
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
                tokens = b.fn.clone(tokens); // copy array
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

        function qwery(selector, rt) {
            var m, el, root = (rt===null && doc) || normalizeRoot(rt);

            // easy, fast cases that we can dispatch with simple DOM calls
            if (!root || !selector) return [];
            if (selector === window || cdvTools.isElementNode(selector)) {
                return !_root || (selector !== window && cdvTools.isElementNode(root) && isAncestor(selector, root)) ? [selector] : []
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
    }()) || (function(sl, cn){ return ft.call((cn || d).querySelectorAll(sl)); });
         
             x = new b(); 
             x.init = x.copy = null; /* prototype chain override override */
             $_ = function(t, c){ var q = new b.fn.init(t, c);  return q; };
        
             
             $_.plugin = function(/*Varargs*/){
                 var args=arguments,len=args.length,str,defObj,fnc, hlps;
             
                 if(len){
                      switch(b.fn.type(args[0])){
                         case st:
                            str=args[0];
                         break;
                         case 'object':
                            if(b.fn.isSimpleObj(args[0]))
                               defObj=args[0];
                         break;
                      }
                      if(2 <= len || len <= 3){
                         if(args[1]){
                            switch(b.fn.type(args[1])){
                               case 'function':
                                  fnc=args[1];
                               break;
                               case 'object':
                                  if(b.fn.isSimpleObj(args[1]))
                                  hlps=args[1];
                               break;
                            }     
                         }
                      }
                  }
                 
                  if(str===null || defObj===null || fnc===null)
                     throw 'PLUGIN_ERROR:: - cannot add functionality';
                  
                  
                  hlps=(b.fn.type(args[2])=='object' && b.fn.isSimpleObj(args[2]) && args[2]);
                  
                  if(defObj){
                     for(var j in defObj) js[j] = od.call(defObj, j) && defObj[j];
                  }else{ 
                     b.fn.init[pr][str]=fnc;
                  }
            };
            
            /* Ensure the cache works properly */
            
             addInLine(w, 'load', function(e){
              if(!_isLocal){ 
                _keys = b.fn.cookies.readCookie("__js_cache_keys");
                if(_keys ){
                   _keys = _keys.split(",");
                   b.fn.each(_keys, function(j, ky){
                      _cache[ky] = _extend(JSON.parse(_cks.readCookie(ky)), {});
                  });
                }  
             }  
            });
    
            addInLine(w, 'unload', function(e){
                 setTimeout(function(){ // push to event loop to ensure execution
                  if(!_isLocal){
                    if(_keys.length){
                        b.fn.cookies.setCookie("__js_cache_keys", String(_keys), 1, true);
                       _cache = _keys = null;
                    }   
                   }    
                 }, 0);
            });
             
            
             b.fn.inflate(x, $_);
             
             
             /* end */ 
             return $_;
 }(this, this.document));        
        

   

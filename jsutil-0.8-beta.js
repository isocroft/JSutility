  /**************************************************************************
   *  Copyright © 2012 @abnlabs http://cproscodedev.com.ng                  *
   *  All Rights Reserved                                                   *
   *                                                                        *
   *  @package Library                                                      *
   *  @license GPL                                                          *
   *  @author  Codedev Team                                                 *
   *  @description  provides polyfill functionality for all browsers!!!     *
   *                                                                        *
   * ---------------------------------------------------------------------- *
   * File Name: JSutil-0.8-beta.js                                          *
   * Version: 0.8 (beta)                                                    *
   * Date Created: 21/03/2012                                               *
   * Date Released: 09/02/2013                                              *
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

function isEven(num){
                           if(isNaN(num)){
                            return;
                           }
                         var mod = num % 2;
                         return (mod == 0)? true: false;
}

(function(w, d, undefined){

 //"use strict";
 
/*!
 *  Code Function Init (CFI)
 *
 *  @process-> Method Injection Procedure
 *          -> {Element | Document} Faking Interface Replacement
 * 
 *  @notes  -> Since IE 5 / 6 / 7 do not have native support for interfaces {Element | HTMLDocument | e.t.c},
 *          -> we try to mimic the functionality of extending these "hidden" interfaces by injecting
 *          -> the custom and fill methods directly into the currently loaded DOM for IE 5 / 6 / 7 / 8
 *          -> In addition, we implement several other non-native patches for IE 5 / 6 / 7 / 8
 */
 
 
 
     //IE only... [Error Handling]
     function handleError (errType, errURL, errLNum){  
	    Debug.writeln("Error: " + errType + " on line " + errLNum + " at, " + errURL);
	    return true; // control error reporting in IE
     }
	 
	 /*!@supermodule    Copyright © 2012
	  * Qwery - Mini CSS Selector Engine
	  * https://github.com/ded/qwery
	  * Dustin Diaz
	  */
	 
	 window._qwery = (function () {
                     var doc = document
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
                    , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
                    , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
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
    return r
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
      for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
    }
    if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
    if (wholeAttribute && !value) { // select is just for existance of attrib
      o = this.attributes
      for (k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
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
      }([]) :
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
    if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?

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
    }()
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
        select =  selectNonNative;
        
    }

                configure();

                qwery.configure = configure
                qwery.uniq = uniq
                qwery.is = is
                qwery.pseudos = {}

  return qwery;
})();
	 
	 if(document.all){
	    window.onerror = handleError;
		
		var _addEventListener = function(on, fn, capture){
		      //if(capture) this.setCapture();
              return (this).attachEvent('on' + on, function(e){
				     var _fn = (this)['ex'+on+(new Date).getTime()] = fn; // really ingineous code logic by John Resig!!
					 if(!!~e){
					     e = window.event;
                         e.preventDefault = e.preventDefault || function(){e.returnValue = false};
                         e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true};
						 e.target = e.srcElement || this;
					     e.timestamp = (new Date).getTime();
					     e.which = e.button || e.keyCode;
					     e.relatedTarget = e.fromElement;
						 e.currentTarget = e.toElement;
						 e.pageX = e.clientX + document.body.scrollLeft;
					     e.pageY = e.clientY + document.body.scrollTop;
					 }
                     _fn.call(this, e);
                });
        }
		
		var _removeEventListener = function(on, fn, capture){
		    //if(capture) this.setCapture();
              return (this).detachEvent('on' + on, function(e){
				     var _fn = (this)['ex'+on+(new Date).getTime()] = fn; // really ingineous code logic by John Resig!!
                     if(!!~e){
					     e = window.event;
                         e.preventDefault = e.preventDefault || function(){e.returnValue = false};
                         e.stopPropagation = e.stopPropagation || function(){e.cancelBubble = true};
						 e.target = e.srcElement || this;
					     e.timestamp = (new Date).getTime();
					     e.which = e.button || e.keyCode;
					     e.relatedTarget = e.fromElement;
						 e.currentTarget = e.toElement;
						 e.pageX = e.clientX + document.body.scrollLeft;
					     e.pageY = e.clientY + document.body.scrollTop;
					 }
                     _fn.call(this, e);
                });
		}
		
		var _isElementEmpty = function(){
              return (!(this.children.length == 0) || !(this.childNodes.length == 0))? false: true;
        }
		
		var _addCSSRules = function(rObj){
		             if(rObj && Object.prototype.toString.call(rObj) == "[object Array]"){
                       var i = 0, styler = "";
                       while(i < rObj.length){
                       styler += rObj[i] + ":" + rObj[i+1] + "; "
                       i++;
                        if(!isEven(i))
                              ++i;   
                        }
						try{ 
						   this.style.cssText = styler; 
                          }catch(ex){ (this).setAttribute("style", styler); }						
                       }
                     else{ return;}
 
        }
		
		var _hasClass = function(classtext){
                          if(typeof(classtext) == "string" && this.clasName !== null){
                             return (this.className.indexOf(classtext) > -1)? true : false ; 
                          }else if(typeof(classtext) == "string" && this.hasAttribute("class")){
                             return (this.getAttribute("class").indexOf(classtext) > -1) ? true : false ;
                          }else{} 
		}
		
		var _isParentTo = function(els){
                     var temp = this.getElementsByTagName('*');
                        for(var i = 0; i < temp.length; i++){
                            if(temp[i] === els){
	                           return true;
	                        }else{
	                          continue;
	                        }
                        }
                    return false;   
        }
		
		var _insertAfter = function(nel, cel){
                     if(typeof(cel) != "object" && typeof(cel.nodeType) != "number"){
	                        return;
	                 }
	                 if(typeof(nel) != "object" && typeof(nel.nodeType) != "number"){
	                       return;
	                 }
	                if(this.childNodes.length > 0  && cel.parentNode === this){
	                   this.insertBefore(nel, cel.nextSibling);
	                }
        }
		
		var _isSameNode =  function (node1, node2){
                            if(isNode(node1) && isNode(node2)){
                                if(isElementNode(node1) === isElementNode(node2) || isAttributeNode(node1) === isAttributeNode(node2) || isTextNode(node1) === isTextNode(node2))
                                               return true;
								else
                                               return false;								
                            }else{
                                     return null;
                            }
        }
		
		var _getElementText = function(kind){
                    if(typeof(kind) == "undefined") kind = 0;

                        if(this.children.length == 0 || isTextNode(this)){
                                kind = null;
                                return this.firstChild.data;
                        }else if(isElementNode(this)){
                            var whichNode = this.children[kind];
                            var div = document.createElement('div');
                            var holder = (div.textContent !== undefined)? "textContent" : "innerText";
                            return (whichNode !== undefined)? whichNode[holder] : null;
                        }else{ return;}
        }
		
		var _emptyElement = function(){
                             if(this.children.length != 0){
                                var child = (isElementNode(this.firstChild.nextSibling))? this.firstChild.nextSibling : ((this.firstChild.nodeType == 3)? this.firstChild : "nothing");
                                if(child == "nothing") return;
                                var i = 0;
								if(child){
                                    while((child = this.children.item(0)) !== null){
									    this.children.item(0).parentNode.removeChild(child);
						                i=i+1;
								    }
								} 
                            }
                                
        }
		
		var _removeElement = function(findParent){		               
                        var parent = this.parentNode;
                        if(typeof(findParent) == "undefined" || !findParent){
                                 if(parent.removeChild){
                                        parent.removeChild(this);
                                 }
                        }else if(typeof(findParent) == "boolean" && findParent){  
                                 if(parent != null){
	                                var clone = this.cloneNode(true);
	                                parent.removeChild(this);
                                    return clone;		 
	                             }
                         }
        }
		
		var _setElementText = function(word, index){
                                if(typeof(index) == "undefined") index = 0;
                                     if(this.children.length != 0){
                                         var div = document.createElement('div');
                                         div.appendChild(document.createTextNode(word));                                               
                                            this.children[index].innerText = div.childNodes[0].nodeValue                                                
                                     }else{ 
                                            var tnode = null, containsText = false;
                                            for(var g=0; g < this.childNodes.length; g++){
                                                 if(this.childNodes[g].nodeType < 3){ // exclude attribute and element nodes...
                                                      continue;
                                                 }else{ 
                                                      containsText = true; 
                                                      break;
                                                  }
                                            }
                                                   if(containsText){
                                                      this.normalise();
                                                      this.innerText = word; 
                                                   }
                                     }
        }
		
		var _hasStyle = function(sty){
                       var esty = (document.getElementsByTagName("style")[0].innerHTML)? document.getElementsByTagName("style")[0].innerHTML : document.getElementsByTagName("style")[0].innerText;
                       var srt, obj = this, isTrue = false;
					   var extSty = getCurrElementStyle(obj, sty);
                       if(sty.indexOf("-") > -1){ 
                            srt = "" + sty.substr(0,sty.indexOf("-")) + sty.charAt(sty.indexOf("-")+1).toUpperCase() + sty.substring(sty.indexOf("-")+2); 
                        }
                       return (obj.style.cssText.indexOf(sty) != -1 || extSty !== null  || eval("obj.style." + srt) != "" || (esty.indexOf(obj.getAttribute("class") || obj.nodeName.toLowerCase() || obj.id) != -1)) ? true : false;
        }
		
		var _classList = function(){
                         function ClassLister(domelement){
                            // @ClassLister constructor 
                            this.dom = domelement;
                         }

                          ClassLister.prototype  =  {
                                    add:function(input_tok){
                                          try{   
                                             if(typeof(this.dom) != "object" || typeof(input_tok) != "string"){ 
		                                        throw new TypeError('Invalid argument!');
                                             }
	                                       }catch(e){  Debug.writeln("Error: 0x349219");  return; }	
        
                                     var attr = this.dom.className, attr_l = this.dom.hasAttribute("class"), list;
                                         if(!attr || typeof(attr) == 'undefined'){
   		                                      this.dom.className = input_tok;
                                              list = '';		 
                                         }else if((attr && attr.indexOf(" ") == -1) || (attr && attr.indexOf(" ") > -1)){
                                                                 list = attr.split(" ");
		                                                  if(list instanceof Array && attr_l){
                                                               for(var i = 0; i < list.length;i++){
                                                                   if(this.dom.className.indexOf(input_tok) > -1){
                                                                      return;
                                                                    }
                                                                }
		                                                      this.dom.setAttribute('class', attr + " " + input_tok);
                                                          }
                                         }else{ } 
                                    },
                                    remove:function(chosen_tok){
	                                         try{
                                                if(typeof(this.dom) !== "object" && typeof(chosen_tok) !== "string"){ 
                                                       throw new TypeError('invalid argument!');
                                                }
                                             }catch(e){ Debug.writeln("Error: 0x349219"); return; }
        
                                               var attr = this.dom.className;
                                                    if(!attr){
                                                       return;
                                                    }else if(attr && attr.indexOf(chosen_tok) > -1){
                                                          attr = attr.replace(chosen_tok, '');
		                                                  attr = attr.replace(/^\s+|\s+$/,'');
		                                                  this.dom.setAttribute('class',attr);
                                                    }else{}  
                                    },
									contains:function(needle_tok){
									    if(typeof(this.dom) != "object" || typeof(needle_tok) != "string"){ 
                                                          throw new TypeError('invalid argument!');
                                        }
									    return (this.dom.indexOf(needle_tok) > -1);
									},
                                    toggle:function(current_tok){
	                                          try{
	                                             if(typeof(this.dom) != "object" || typeof(current_tok) != "string"){ 
                                                          throw new TypeError('invalid argument!');
                                                 }
                                               }catch(e){ window.console.log("Error: 0x349219"); return; }
	  
	                                              var attr = this.dom.className;
	  
	                                                if(attr.indexOf(current_tok) > -1){
	                                                    this.remove(current_tok);
	                                                }else{
	                                                    this.add(current_tok);
	                                                }
	                                }
                           }
  
                          return new ClassLister(this); 
        }
		
	    function addMethodsToDOM(obje){
			
           if ((obje.length !== null) && (typeof (obje) == "object" || typeof (obje['item']) == "function")){
		   
		     
              for (c in obje){  // loop through the current DOM elements...
			  
			    obje[c]['classList'] = obje[c]['classList'] || _classList;
				
				obje[c]['getElementText'] = obje[c]['getElementText'] || _getElementText;
			     
                obje[c]['addCSSRules'] = obje[c]['addCSSRules'] || _addCSSRules;
				  
				obje[c]['removeElement'] = obje[c]['removeElement'] || _removeElement;
				  
			    obje[c]['hasClass'] = obje[c]['hasClass'] || _hasClass;
				 
				obje[c]['emptyElement'] = obje[c]['emptyElement'] || _emptyElement;  
				  
				obje[c]['insertAfter'] = obje[c]['insertAfter'] || _insertAfter;
				
				obje[c]['isElementEmpty'] = obje[c]['isElementEmpty'] || _isElementEmpty;
				
				obje[c]['hasStyle'] = obje[c]['hasStyle'] || _hasStyle;
				
				obje[c]['setElementText'] = obje[c]['setElementText'] || _setElementText;

                obje[c]['isParentTo'] = obje[c]['isParentTo'] || _isParentTo;

                obje[c]['isSameNode'] = obje[c]['isSameNode'] || _isSameNode;				
                  
                obje[c]['addEventListener'] = obje[c]['addEventListener'] || _addEventListener;
				
				obje[c]['removeEventListener'] = obje[c]['removeEventListener'] || _removeEventListener;
 
         }
       }
     }
	 
	// good job by Neil [http://] - just borrowing your code's logic by the way...
	function docHijack(p){var old = document[p];document[p] = function(v){return addMethodsByHack(old(v))}} // Hijacking native 'createElement' method... 
		
    function addMethodsByHack(obj){ 
       obj.addEventListener = _addEventListener;
	   obj.isElementEmpty = _isElementEmpty;
	   obj.hasClass = _hasClass;
	   obj.addCSSRules = _addCSSRules;
	   obj.removeElement = _removeElement;
	   obj.isParentTo = _isParentTo;
	   obj.getElementText = _getElementText;
	   obj.emptyElement = _emptyElement;
	   obj.insertAfter = _insertAfter;
	   obj.hasStyle = _hasStyle;
	   obj.setElementText = _setElementText;
	   obj.classList = _classList;
	   obj.isSameNode = _isSameNode;
	   obj.removeEventListener = _removeEventListener; 
       return obj;
    }

    function addMethodsByInterface(_obj){
	   //_obj.addEventListener = _addEventListener;
	   _obj.isElementEmpty = _isElementEmpty;
	   _obj.hasClass = _hasClass;
	   _obj.addCSSRules = _addCSSRules;
	   _obj.removeElement = _removeElement;
	   _obj.isParentTo = _isParentTo;
	   _obj.getElementText = _getElementText;
	   _obj.emptyElement = _emptyElement;
	   _obj.insertAfter = _insertAfter;
	   _obj.hasStyle = _hasStyle;
	   _obj.setElementText = _setElementText;
	   _obj.classList = _classList;
	   //_obj.isSameNode = _isSameNode;
	   //_obj.removeEventListener = _removeEventListener;
	}		
	 
    //shadow function for injection...	
    function enhanceDOMNodes(){
       if(document.readyState == "complete"){ // make sure the DOM is fully ready!!! 
		      addMethodsToDOM(document.all); // inject all patch methods directly into all current DOM elements
		  if(typeof(Document) == "undefined"){ 
			   docHijack('createElement');// hack into document.createElement in order that the DOM is updated accordingly
		  }else{
		     addMethodsByInterface(Element.prototype); // hacking native methods directly produces errors in IE 9+, so we try a different approach!! 
		  }
		}		        		 
    }

document.onreadystatechange = enhanceDOMNodes;
}

 // list of conditions to check while targeting the numerous "shanky" browsers out there
 var cond0 = new Boolean(typeof(Element) == "undefined").valueOf(); // include IE 5 / 6 / 7
 var cond1 = new Boolean(typeof(Element) == "function").valueOf(); // include W3C 
 var cond2 = new Boolean(typeof(Element) == "object").valueOf(); // include IE 8 
 var cond3 = new Boolean(document.documentMode != 9).valueOf(); // exclude IE 9
 
if((typeof(Element) == 'undefined' || typeof(HTMLElement) == 'undefined') && (typeof(Document) == 'undefined' || typeof(HTMLDocument) == 'undefined')){
   
var Opera5 = navigator.userAgent.indexOf("Opera 5") > -1; 

// POLYFILLS   
if(document.all && (document.documentMode == 7 || document.documentMode === undefined)){ // IE 5 / 6 / 7 only!

    /* @submodule
	 * document.setCookie
	 */
	 
	document.setCookie = function(name,value,expires,secure){
        // the [expire] parameter should reflect the number of days for the cookie to be set
       if(expires){
          var date = new Date();
	        if(typeof(expires) == 'number'){
              date.setTime(date.getTime()+(1000*24*60*60*expires));
	        }else{
	          return;
	        }
              var exp = date.toGMTString();
        }else { 
            exp = ""; 
        }
        if(typeof(secure) == 'boolean'){
            document.cookie += name + "=" + value + ";expires="+ exp + ";path=/;domain=" + document.domain + ";secure="+secure;
        }else if(typeof(secure) == 'undefined'){
            document.cookie += name + "=" + value + ";expires="+ exp + ";path=/;domain=" + document.domain;
        }else{}
    } 
	
	/* @submodule
	 * document.readCookie
	 */

 
    document.readCookie = function(ckname){
         var val = ckname + "=";
         var result = document.cookie.split(';');
          for(var i=0;i < result.length;i++) {
               var c = result[i];
                  while (c.charAt(0) == ' ') 
	                      c = c.substring(1,c.length);
                   if (c.indexOf(val) == 0)
         	            return c.substring(val.length,c.length);
           }
               return false;
    }
 
	
	/* @submodule
	 * document.ajaxPOST
	 */
	 
	document.ajaxPOST = function(url,callback,asXML,params){
                   var req = false, ret;
                     try{
                        req = new XMLHttpRequest();
                     }catch(ez){
                        req = new ActiveXObject("Microsoft.XMLHTTP"); // IE 6 only
						}
                        if(!req){
                            return;
                        }else{
                             if(typeof(params) == 'undefined' && typeof(callback) == 'function'){
                                    req.open("POST",url);
                                    req.onreadystatechange=function(){
                                            if(req.readyState==4 && req.status==200){
											     ret = (asXML == false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, getXMLByNName:function(m){ if(typeof(m) != "string"){ return null;} return (this.text.documentElement.getElementsByTagName(m));}, findXMLByTrans:function(){},status:req.statusText});
												 };
												return ret(); 
                                            }else{ callback.call({done:false, text:null, status:req.statusText}); req.abort(); }
                                    }
                                    req.send(null);	
                            }else if(typeof(params) == "string" && typeof(callback) == 'function'){
                                  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                  req.setRequestHeader("Content-Length", params.length);
                                  req.open("POST",url);
                                  req.onreadystatechange=function(){
                                            if(req.readyState==4 && req.status==200){
											     ret = (asXML == false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, status:req.statusText});
												 };
												return ret(); 
                                            }else{ callback.call({done:false, text:null, status:req.statusText}); req.abort(); }
                                  }
                               req.send(params);	
                            }else{ return; }

                        }
    }

    /* @submodule
	 * document.handleQuery
	 * custom definition
	 */
	 
	document.handleQuery =  function(aspect, url){
          if(typeof(url) == "undefined"){
              url = document.location.search
          }
            if(typeof(aspect) == "string"){
               var mode = url.replace(/^\?/,"");
               var q = mode.split("&");
               var h;
                for(var k=0; k < q.length; k++){
                    if(q[k].indexOf(aspect) != -1){
                       h = q[k].substring(q[k].indexOf("=")+1);
                        return h;
                    }
                }
            }else{return;}
    }
	
	/* @submodule
	 * document.ajaxGET
	 * custom definition
	 */

	document.ajaxGET = function(url,callback,asXML){
                        var req = false, ret = null;
                        try{
                           req = new XMLHttpRequest();
                        }catch(ez){
                           req = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                        if(!req){
                             return;
                        }else{
                          if(typeof(callback) == 'function'){
                              if(url.indexOf("?") > -1)
                               req.open("GET",url,true);
							else
                               req.open("GET", url);
							   
                              req.onreadystatechange=function(){
                                 if(req.readyState==4 && req.status==200){
											     ret = (asXML == false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, status:req.statusText});
												 };
												return ret(); 
                                            }else{ callback.call({done:false, text:null, status:req.statusText}); req.abort(); }
                              }
                             req.send(null);
                          }
                        }
    }
	
	/* @submodule
     * document.evaluate... (no native support By IE 5 / 6 / 7)
	 * patch definition 
	 */ 
   
    document.evaluate = function(){
    
	}	
   
   /*
    * @submodule
	* document.getElementsByClassName... (no native support By IE 5 / 6 / 7)
	* patch definition.
	*/
	
	document.getElementsByClassName = function(cname){
	  var CLASS = function(cname){
             var retArr = [], ek = document.all;
             for(var t=0;t<ek.length;t++){
               if(ek[t].className.indexOf(" ")>=0){
                   var all = ek[t].className.split(" ");
                 for(var z=0;z<all.length;z++){
                   if(all[z]==cname){ retArr.push(ek[t])}
                    }   
                 }
               else if(ek[t].className==cname){ retArr.push(ek[t])}
			   else{}
             }
          return retArr; 
       }
	    
       return CLASS(cname);	  
	}
	
	
	/*
    * @submodule
	* document.querySelectorAll... (no native support By IE 5 / 6 / 7)
	* patch definition.
	*/
	document.querySelectorAll = window._qwery;

 }
 
 var Safari2 = (!navigator.taintEnabled && navigator.vendor == 'Apple Computer' && /gecko/g.test(navigator.userAgent.toLowerCase()));  // Safari UA detection...
   if(Safari2){
        HTMLElement = function(){};
        HTMLElement.prototype = window["[[DOMElement.prototype]]"]; // Safari 2 Hack!
    }		
        
		
}

   
   
   
/**
 Function: [HTMLDocument.prototype]>  getElementsByClassName
 
  
 Arguments: String:cname

 
 Notes: returns HTML collections having a class name of [cname]

 Example: var block = document.getElementsByClassName("messages");
 
*/

if(!document.getElementsByClassName && cond2){ // IE 8 only version
HTMLDocument.prototype.getElementsByClassName = function(cname){
var retArr = [], ek = document.all;
for(var t=0;t<ek.length;t++){
if(ek[t].className.indexOf(" ")>=0){
   var all = ek[t].className.split(" ");
   for(var z=0;z<all.length;z++){
   if(all[z]==cname){ retArr.push(ek[t])}
        }   
      }
else if(ek[t].className==cname){ retArr.push(ek[t])}
    }
return retArr; 
 }
}

/**
  Function:  [HTMLDocument]> handleQuery
  
  
  
  Arguments: String: aspect
             String: url (optional)
  
  Notes: extracts the value of a querystring parameter
  
  Example: var data = document.handleQuery("comp", document.location.href);
  */
  
if(cond3 && !document.handleQuery){
HTMLDocument.prototype.handleQuery =  function(aspect, url){
          if(typeof(url) == "undefined"){
              url = document.location.search
          }
            if(typeof(aspect) == "string"){
               var mode = url.replace(/^\?/,"");
               var q = mode.split("&");
               var h;
                for(var k=0; k < q.length; k++){
                    if(q[k].indexOf(aspect) != -1){
                       h = q[k].substring(q[k].indexOf("=")+1);
                        return h;
                    }
                }
            }else{return;}
    }
}

  
/**
  Function:  [Document]> handleQuery
  
  
  
  Arguments: String: aspect
             String: url (optional)
  
  Notes: extracts the value of a querystring parameter
  
  Example: var data = document.handleQuery("comp", document.location.href);
  */
  
if(!cond3 && !document.handleQuery){  // W3C only version
Document.prototype.handleQuery =  function(aspect, url){
          if(typeof(url) == "undefined"){
              url = document.location.search
          }
            if(typeof(aspect) == "string"){
               var mode = url.replace(/^\?/,"");
               var q = mode.split("&");
               var h;
                for(var k=0; k < q.length; k++){
                    if(q[k].indexOf(aspect) != -1){
                       h = q[k].substring(q[k].indexOf("=")+1);
                        return h;
                    }
                }
            }else{return;}
    }
}  

if(!cond3 && !document.addEventListener){  // W3C only version
Document.prototype.addEventListener = function(){

 }
}


/**
 Function: [HTMLDocument.prototype]>  ajaxGET
 
  
 Arguments: String:url
            Function: callback
			Boolean: asXML
 
 Notes: performs asynchronous get requests... 
        the parameters "data" and "stats" must always be passed to the callback!!

 Example: document.ajaxGET("http://opentypefoundry.otf", function(data, stats){
                 if(data)
				   document.getElementById("wp-keyset").innerHTML = data;
				 else
			 	   document.getElementById("wp-keyset").innerHTML = "Oops! an error ocurred " + stats.status;
  }, false);
          
*/
 
if(cond3 && !document.ajaxGET){  // IE 8 only version 
HTMLDocument.prototype.ajaxGET = function(url,callback,asXML){
                        var req = false, ret = null;
                        try{
                           req = new XMLHttpRequest();
                        }catch(ez){
                           req = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                        if(!req){
                             return;
                        }else{
                          if(typeof(callback) == 'function'){
                            if(url.indexOf("?") > -1)
                               req.open("GET",url,true);
							else
                               req.open("GET", url);
							   
                              req.onreadystatechange=function(){
                                 if(req.readyState==4 && req.status==200){
											     ret = (asXML === false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, status:req.statusText});
												 };
												return ret(); 
                                            }else{ callback.call({done:false, text:null, status:req.statusText}); req.abort(); }
                              }
                             req.send(null);
                          }
				}
				
        }                        
}

/**
 Function: [Document.prototype]>  ajaxGET
 
  
 Arguments: String:url
            Function: callback
			Boolean: asXML
 
 Notes: performs asynchronous get requests... 
        the parameters "data" and "stats" must always be passed to the callback!!

 Example: document.ajaxGET("http://opentypefoundry.otf", function(data){
                 if(data)
				   document.getElementById("wp-keyset").innerHTML = data.text;
				 else
			 	   document.getElementById("wp-keyset").innerHTML = "Oops! an error ocurred " + data.status;
  }, false);
          
*/
 
if(!cond3 && !document.ajaxGET){ // W3C only version...  
Document.prototype.ajaxGET = function(url,callback,asXML){
                        var req = false, ret = null;
                        try{
                           req = new XMLHttpRequest();
                        }catch(ez){
                           req = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                        if(!req){
                             return;
                        }else{
                          if(typeof(callback) == 'function'){
                            if(url.indexOf("?") > -1)
                               req.open("GET",url,true);
							else
                               req.open("GET", url);
							   
                              req.onreadystatechange=function(){
                                 if(req.readyState==4 && req.status==200){
											     ret = (asXML == false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, status:req.statusText});
												 };
												return ret(); 
                                            }else{ callback.call({done:false, text:null, status:req.statusText}); req.abort(); }
                              }
                             req.send(null);
                          }
				}
				
        }            
} 

/**
 Function: [HTMLDocument.prototype]>  addEventListener
 
  
 Arguments: String:etype
            Function: ehandle
            Boolean: capture
			
 Notes: adds an event listener to the document object

 Example:  document.addEventListener("message", function(e){ 
               window.console.log(postMessage);          
           }, false);
 
*/

if(!document.addEventListener && cond2){ // IE 8 only version
HTMLDocument.prototype.addEventListener = function(etype, ehandle, capture){
         if(etype == "load") return;
		 
         if(etype == "DOMContentLoaded"){
		     etype = "readystatechange"; 
		 }
         document.attachEvent("on"+etype, function (e) {
		        var state = document.readyState;
                if (!!~e) {
                    e = window.event;
                    e.stopPropagation = (e.stopPropagation) ? e.stopPropagation : function () { e.cancelBubble = true; }
                    e.preventDefault = (e.preventDefault) ? e.preventDefault : function () { e.returnValue = false; }
					e.target = e.srcElement;
					e.relatedTarget = e.fromElement;
					e.timestamp = (new Date).getTime();
					e.which = e.button || e.keyCode;
					e.pageX = e.clientX + document.body.scrollLeft;
					e.pageY = e.clientY + document.body.scrollTop;
                }
			  	 if(state == "complete"){
                    if (typeof(ehandle) == "function"){
                        ehandle.call(null, e); 
                    }
				 }	
        });
   }
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

if(cond1 && !document.querySelectorAll){ // W3C only version
Document.prototype.querySelectorAll = window._qwery;
}

/**
 Function: [HTMLDocument.prototype] readCookie
 
 
 Arguments: String: ckname
 
 Notes: retrieves the cookie value for [ckname]
 */
 
if(cond3 && !document.readCookie){  // IE 8 only version...
HTMLDocument.prototype.readCookie = function(ckname){
  var val = ckname + "=";
  var result = document.cookie.split(';');
  for(var i=0;i < result.length;i++) {
    var c = result[i];
    while (c.charAt(0) == ' ') 
	        c = c.substring(1,c.length);
    if (c.indexOf(val) == 0)
         	return c.substring(val.length,c.length);
  }
  return false;
}
} 


/**
 Function: [Document.prototype]> readCookie
 
 
 Arguments: String: ckname
 
 Notes: retrieves the cookie value for [ckname]
 */
 
if(!cond3 && !document.readCookie){  // W3C only version...
Document.prototype.readCookie = function(ckname){
  var val = ckname + "=";
  var result = document.cookie.split(';');
  for(var i=0;i < result.length;i++) {
    var c = result[i];
    while (c.charAt(0) == ' ') 
	        c = c.substring(1,c.length);
    if (c.indexOf(val) == 0)
         	return c.substring(val.length,c.length);
  }
  return false;
}
}

/**
 Function: [HTMLDocument.prototype]> setCookie
 
 
 Arguments: String: name, value, expires, domain, secure 
 
 Notes: sets the cookie on the browser
 */

if(cond3 && !document.setCookie){ // IE 8 only version...
HTMLDocument.prototype.setCookie = function(name,value,expires,secure){
  // the [expire] parameter should reflect the number of days for the cookie to be set
  if(expires){
    var date = new Date();
	if(typeof(expires) == 'number'){
    date.setTime(date.getTime()+(1000*24*60*60*expires));
	}else{
	  return;
	}
    var exp = date.toGMTString();
  }else { 
     exp = ""; 
  }
  if(typeof(secure) == 'boolean'){
  document.cookie += name + "=" + value + ";expires="+ exp + ";path=/;domain=" + document.domain + ";secure="+secure;
  }else if(typeof(secure) == 'undefined'){
    document.cookie += name + "=" + value + ";expires="+ exp + ";path=/;domain=" + document.domain;
  }else{}
}
}

/**
 Function: [HTMLDocument.prototype]>  ajaxPOST
 
  
 Arguments: String:url
            Function: callback
			Boolean: asXML
			Object: params (optional)
 
 Notes: performs asynchronous post requests... 
        the parameters "data" and "stats" must always be passed to the callback!!

 Example: document.ajaxPOST("http://opentypefoundry.otf", function(data){
                 if(data)
				   document.getElementById("wp-keyset").innerHTML = data.text;
				 else
			 	   document.getElementById("wp-keyset").innerHTML = "Oops! an error ocurred " + data.status;
  }, false);
          
*/

if(cond3 && !document.ajaxPOST){ // IE 8 only version
HTMLDocument.prototype.ajaxPOST = function(url,callback,asXML,params){
                   var req = false, ret = null;
                     try{
                        req = new XMLHttpRequest();
                     }catch(ez){
                        req = new ActiveXObject("Microsoft.XMLHTTP"); // IE 6 only
						}
                        if(!req){
                            return;
                        }else{
                             if(typeof(params) == 'undefined' && typeof(callback) == 'function'){
                                    req.open("POST",url);
                                    req.onreadystatechange=function(){
									        if(req.readyState==4 && req.status==200){
											     ret = (asXML == false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, status:req.statusText});
												 };
												return ret(); 
                                            }else{ callback.call({done:false, text:null, status:req.statusText}); req.abort(); }
                                    }
                                    req.send(null);	
                            }else if(typeof(params) == "string" && typeof(callback) == "function"){
                                  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                  req.setRequestHeader("Content-Length", params.length);
                                  req.open("POST",url);
                                  req.onreadystatechange=function(){
                                        if(req.readyState==4 && req.status==200){
											     ret = (asXML == false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, status:req.statusText});
												 };
												return ret(); 
                                            }else{ callback.call({done:false, text:null, status:req.statusText}); req.abort(); }
                                  }
                               req.send(params);	
                            }else{}

                        }
    }
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

if(!cond3 && !document.ajaxPOST){ // W3C only version
Document.prototype.ajaxPOST = function(url,callback,asXML,params){
                   var req = false, ret;
                     try{
                        req = new XMLHttpRequest();
                     }catch(ez){
                        req = new ActiveXObject("Microsoft.XMLHTTP"); // IE 6 only
						}
                        if(!req){
                            return;
                        }else{
                             if(typeof(params) == 'undefined' && typeof(callback) == 'function'){
                                    req.open("POST",url);
                                    req.onreadystatechange=function(){
									        if(req.readyState==4 && req.status==200){
											     ret = (asXML == false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, status:req.statusText});
												 };
												return ret(); 
                                            }else{ callback.call({done:false, text:null, status:req.statusText}); req.abort(); }
                                    }
                                    req.send(null);	
                            }else if(typeof(params) == "string" && typeof(callback) == "function"){
                                  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                  req.setRequestHeader("Content-Length", params.length);
                                  req.open("POST",url);
                                  req.onreadystatechange=function(){
                                            if(req.readyState==4 && req.status==200){
											     ret = (asXML == false) ? function(){
                                                     return callback({done:true, text:req.responseText, status:req.statusText}); 												   
												 } : function(){
                                                     return callback({done:true, text:req.responseXML, status:req.statusText});
												 };
												return ret(); 
                                            }else{ callback.call({done:false, text:null, status:req.statusText}); req.abort(); }
                                  }
                               req.send(params);	
                            }else{}

                        }
    }
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

if (cond2 && !(window.constructor.prototype.addEventListener)){  // IE 8 only version
        window.constructor.prototype.addEventListener = function (type, func, capture){
            window.attachEvent('on' + type, function (e) {
                if (!!~e) {
                    e = window.event;
                    e.stopPropagation = (e.stopPropagation) ? e.stopPropagation : function () { e.cancelBubble = true; }
                    e.preventDefault = (e.preventDefault) ? e.preventDefault : function () { e.returnValue = false; }
					e.target = e.srcElement || HTMLDocument;
					e.timestamp = (new Date).getTime();
					e.which = e.button || e.keyCode;
					e.relatedTarget = e.fromElement;
					e.pageX = e.clientX + document.body.scrollLeft;
					e.pageY = e.clientY + document.body.scrollTop;
                }
                if (typeof(func) == "function") {
                    func.call(window, e); 
                }
            });
        }
 }
 
 if (cond0 && typeof(window['addEventListener']) == "undefined" && window.attachEvent){ // IE 6 / 7 only version
        window['addEventListener'] = function (type, func, capture){
            window.attachEvent('on' + type, function (e) {
                if (!!~e) {
                    e = window.event;
                    e.stopPropagation = (e.stopPropagation) ? e.stopPropagation : function () { e.cancelBubble = true; }
                    e.preventDefault = (e.preventDefault) ? e.preventDefault : function () { e.returnValue = false; }
					e.target = e.srcElement || this.document;
					e.timestamp = (new Date).getTime();
					e.which = e.button || e.keyCode;
					e.relatedTarget = e.fromElement;
                }
                if (typeof(func) == "function") {
                    func.call(this, e); // "this" refers to the window object - so no need to worry
                }
            });
        }
 }



/**
 Function: [Window.prototype]> showModalDialog
 
  
 Arguments: None

 
 Notes: displays a modal type window on the screen

*/

if(window.opera && !(window.constructor.prototype.showModalDialog)){ // Opera only version
if(window && typeof(window.dialogArguments) == "undefined") window.dialogArguments = {};

(window.constructor.prototype).showModalDialog = function(hrefstring, diagObj, options){
var optstr = "dialogWidth,dialogHeight,dialogLeft,dialogTop,scroll,resizable";
optstr = optstr.split(",");

if(typeof(options) == "string" && typeof(hrefstring) == "string"){
options =  options.replace(/^\s+|\s+$/ig,"");
if(options.indexOf(":") == -1) return null;

options = options.replace(":","=");
options = options.replace(";",",");
var opts = options.split(","), terms, vals, __ter = [];
var winopts = '';
       for(var t=0; t < opts.length; t++){
          if(opts[t].indexOf("=") > -1)
		       terms = opts[t].substring(0, opts[t].indexOf("=")-1);
			   vals = opts[t].substring(opts[t].indexOf("=")+1);
			// do a linear search to determine if the parameter list is valid  
			for(var f=0; f < optstr.length; f++){ 
			      if(terms == optstr[f]) 
                       __ter[optstr[f]] = vals;  // create an associative array to hold mapped values 				  
			}  
       }
	  if(__ter.length == 0) return null;
	  winopts = 'height='+__ter["dialogHeight"]+',width='+__ter["dialogWidth"]+',top='+__ter["dialogTop"]+',left='+__ter["dialogLeft"]+',scrollbars='+__ter["scroll"]+',directories=no,resizable='+__ter["resizable"];
	  win = window.open(hrefstring,'_top',winopts);
	  if (typeof(diagObj) == "object" && !win.window.closed) { win.window.focus(); }
	  return typeof(win);
    }
  }
}

/**
 Function: [Element.prototype]> insertAdjacentText
 
  
 Arguments: String:context
            String:textblock

 
 Notes: 

*/

if(!document.all && !(HTMLElement.prototype).insertAdjacentText){
(HTMLElement.prototype).insertAdjacentText = function(context, textblock){
var allowables = ["afterBegin","beforeEnd","beforeEnd","afterEnd"];

 }
}


/**
 Function: [Window.prototype]> getSelectionText
 
  
 Arguments: None

 
 Notes: returns the text wrapped by a single selection

*/


if(cond2 && !(window.constructor.prototype.getSelectionText)){ // IE only 8 version
(window.constructor.prototype).getSelectionText = function(){
var doc = document.selection;
    if(doc){
      return doc.createRange().text;
    }else{
      return null;
   }
  }
}


if(cond1 && !(window.constructor.prototype).getSelectionText){ // W3C only version
(window.constructor.prototype).getSelectionText = function(){
var sel = window.getSelection();
if(sel) return sel.toString();
 }
}


if(cond0 && typeof(window['getSelectionText']) == "undefined" && window.attachEvent){ // IE 5 / 6 / 7 only version
window['getSelectionText'] = function(){
var doc = document.selection;
  if(doc){
    return doc.createRange().text;
  }else{
    return null;
   }
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

if((cond2 || window.opera) && !(window.constructor.prototype.find)){ // IE8 and Opera only version
(window.constructor.prototype).find = function(finder, mcase, forwardsrch){
var strholder;
 if(document.all){
 if(mcase == true && forwardsrch == true) mcase = 4; forwardsrch = 0;
 if(mcase == false && forwardsrch == true) mcase = 2 ; forwardsrch = 0;
strholder = document.body.createTextRange();
strholder.moveStart("word");
strholder.moveEnd("word"); 
strholder.select();
return strholder.findText(finder,forwardsrch,mcase);
 }
if(window.opera && !('OBackgroundSize' in document.body.style)){
strholder = document.createRange();
return findText(finder, mcase);
}else if(window.opera && ('OBackgroundSize' in document.body.style)){
return findText(finder, mcase);
}
function findText(ftext, usecase){
if(typeof(ftext) != "string") return;
 var bod = (document.body)? document.body : document.getElementsByTagName("body")[0];

 var bodstr = bod.innerHTML

 bodstr = bodstr.replace(/<.*?>/ig,"").replace(/<\/.*>/ig,"");

if(!usecase){ 
 if(bodstr.search(ftext) > -1){
  return true;
  }
}else {
var arrtext = [];

    for(var f=0; f < arrtext.length;f++){
       arrtext[f]  =  ftext.charCodeAt(f); 
    }
 }
  return false;
      }
   }
}


if(cond0 && typeof(window['find']) == "undefined" && window.attachEvent){  // IE 6 / 7 version
window['find'] = function(finder, mcase, forwardsrch){
var strholder;
 if(document.all){
 if(mcase == true && forwardsrch == true) mcase = 4; forwardsrch = 0;
 if(mcase == false && forwardsrch == true) mcase = 2 ; forwardsrch = 0;
strholder = document.body.createTextRange();
strholder.moveStart("word");
strholder.moveEnd("word"); 
strholder.select();
return strholder.findText(finder,forwardsrch,mcase);
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

Array.prototype.setIndex = function(arrVal, index) {
if(typeof(this[index]) == "undefined" || index > this.length-1){
  index = this.length - 1;
}
for(var i=0; i < this.length; i++){
if((this[i] == arrVal || this[i] === arrVal) && this[index] != arrVal){
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

if (!Array.prototype.reduce){
Array.prototype.reduce = function(fun){
var len = this.length;
if (typeof fun != "function" && len == 0 && arguments.length == 1){
return;
 }
var i = 0;
if (arguments.length >= 2){
var rv = arguments[1];
  }
else{
do
   {
if (i in this){
rv = this[i++];
  break;
  }
if (++i >= len) break;
  } while (true);
 }
for (; i < len; i++){
if (i in this){
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

if(!String.prototype.trimLeft){
String.prototype.trimLeft = function(){
return this.replace(/^\s+/,"");
 }
}

/**
  Function: [Array.prototype]> indexOf


  Argumnets: String: arrElem 
             
  
  Notes:  arrElem > 
		   
*/

if(!Array.prototype.indexOf){
Array.prototype.indexOf = function(arrElem) {
for(var i=0; i < this.length; i++){
if(this[i] == arrElem) return i;
     }
return -1 ;
  }
}

/**
  Function: [Array.prototype]> Truncate


  Argumnets: None
  
  
  Notes:
  
*/

Array.prototype.Truncate = function(radix){
if(typeof(radix) == 'undefined') radix = 1;
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

if(!Array.prototype.filter){
Array.prototype.filter=function(q,x){
if(typeof(q) != 'function'){ return; }

var j,k,l=this.length,m=[];

for(j=0;j<l;++j){
if(j in this){
  k=this[j];
       }
if(q.call(x,k,j,this)){
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

String.prototype.Capitalize = function(){
this.replace(/\s+\b/,"");
this.replace(/\s{2,}/, " ");
var temp = (this.indexOf(" ")) ? this.split(" ") : this;
for(var i = 0; i < temp.length; i++){
temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].substring(1);
     }
return temp.join(" ");
}

/**
  Function: [Array.prototype]> forEach


  Argumnets: 
  
  
  Notes: use > 
  
*/

if(!Array.prototype.forEach){
Array.prototype.forEach = function(f,i){
return (Array.prototype.map.call(this,f,i));
 }
}


/**
  Function: [Array.prototype]> isContained


  Argumnets: String: arrElem
  
  
  Notes: use > for checking the existence of a term in the array
  
*/

if(!Array.prototype.isContained){
Array.prototype.isContained = function(arrElem) {
for(var i=0; i < this.length; i++){
if(this[i] == arrElem){ return true}
   } 
return false;
 }
} 


if(!Array.prototype.Highest){
Array.prototype.Highest = function(){
var high = this[0];
for(var i = 0; i < this.length; i++){
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

if(!String.prototype.insertStr){
String.prototype.insertStr = function(pos, str) {
str = str.replace(/\s+\b/,"");
var ss = this.replace(/\s{2,}/gi," ");
var len = this.length - 1;
if(pos > len) pos = len;
return (str.search(/\s{2,}/gi) == -1)? this.substr(0,pos) + str + this.substr(pos+1, this.length) : ss.substr(0,pos) + " " + str + " " + ss.substr(pos+1, this.length);
 }
}

/**
 Function: [Array.prototype]> emptyArray
 
  
 Arguments: Boolean: withNulls

 
 Notes: empties an array completely or simply inserts empty strings at each pocket

 Example:
*/

if(!Array.prototype.emptyArray){
Array.prototype.emptyArray = function (withNulls){
   var len = this.length;
  if(typeof(withNulls) == "undefined"){
     for(var x=0; x < len; x++){
       if(this[x] != ""){
          delete this[x];
       }
     }
	 (this).length = 0;
	 return this;
  }
  else if(typeof(withNulls) == "boolean" && withNulls){
    for(var a=0; a < len; a++){
       if(this[a]){
	    try{
          this[a] = null;
		  }
		   catch(ex){
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

if(!Array.prototype.every){
Array.prototype.every = function(h,i){
if(typeof(h) != 'function') {
return;
}
var j=new Object(this),k=j.length;

for(var l=0;l<k;l++){
  if(l in j){ 
if(!h.call(i,j[l],l,j)){
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

if(!String.prototype.trim){
String.prototype.trim = function() {
return this.replace(/\s+\b/, "");
 }
}

/**
  Function: [Function.prototype]> addMethod


  Argumnets: String: name
             Function: func
  
  Notes:
  
*/

Function.prototype.addMethod = function (name, func) { 
    if (!this.constructor.prototype[name] && !Object.prototype.hasOwnProperty(this, name) && typeof(func) == "function") { 
        this.constructor.prototype[name] = func; 
    } 
}
  
/**
  Function: [Function.prototype]> addProperty


  Argumnets:  String: title
              String: prop
  
  Notes:
  
*/
  
Function.prototype.addProperty = function(title, prop){
   if(!this.constructor.prototype[title] && !Object.prototype.hasOwnProperty(this, name) && (typeof(prop) == "boolean" || typeof(prop) == "string")){
        this.constructor.prototype[title] = prop;
   }
 }

/**
  Function: [Array.prototype]> map


  Argumnets: 
  
  
  Notes:
  
*/

if(!Array.prototype.map){
Array.prototype.map= function(h,i){
if(typeof h!='function'){
return;
}

var j,k=this.length,l=new Array(k);

for(j=0;j<k;++j){

if(j in this){
l[j]=h.call(i,this[j],j,this);
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

if(!Array.prototype.some){
Array.prototype.some = function(h,i){
if(typeof(h) != 'function'){
return;
}

var j=new Object(this),k=j.length;

for(var l=0;l<k;l++){

if(l in j){

if(h.call(i,j[l],l,j)){
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

if(!Array.prototype.copy){
Array.prototype.copy = function(init, length){
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

if(!String.prototype.trimRight){
String.prototype.trimRight = function(){
return this.replace(/\s+$/,"");
  }
}

/**
 Function: [Array.prototype]> reduceRight
 
  
 Arguments:
      
 
 Notes: 

*/

if (!Array.prototype.reduceRight){
Array.prototype.reduceRight = function(fun){
var len = this.length;
if (typeof fun != "function" && len == 0 && arguments.length == 1){
 return;
}
var i = len - 1;
if (arguments.length >= 2){
 var rv = arguments[1];
}
else{
 do
  {
if (i in this){
rv = this[i--];
  break;
 }
if (--i < 0)return;
 }
while (true);
}
for (; i >= 0; i--){
if (i in this){
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

if(!Array.prototype.lastIndexOf){
Array.prototype.lastIndexOf = function(arlm){
for(var u=this.length-1; u > -1; u--){
if(this[u] == arlm) {
return u;
       }
else { return -1;}
    } 
  }
}


/**
 Function: [Array.prototype]> assoc
 
  
 Arguments: Array:arrKeys
      
 
 Notes: returns an asscociated array with the argument array as the key

*/

if(!Array.prototype.assoc){
Array.prototype.assoc = function(arrKeys){
if(!(arrKeys instanceof Array)) return;
var obj = [], len = (this.length == arrKeys.length) ? this.length : arrKeys.length;
for (var i = 0; i < len; i++) obj[arrKeys[i]] = this[i];
return obj;
 }
}

/**
 Function: [Element.prototype]> contains
 
  
 Arguments: DOM Element:objt
      
 
 Notes: returns true if [objt] is contained in the element

*/

if(!document.all){
if(!(HTMLElement.prototype).contains){
(HTMLElement.prototype).contains = function(objt){
if(typeof(objt) == "undefined") return;

if(objt.nodeType == 3){
return (this === objt.parentNode);
 }
else if(objt.nodeType == 1){
return (this === objt.parentNode);
 }

else if(this.compareDocumentPosition){
var isK = (this.compareDocumentPosition(objt));
return (isK == 1); 
    }
  }
 }



/**
 Function: [Element.prototype]> removeElement
 
  
 Arguments: Boolean:findParent

 
 Notes: if [findParent] is true, the removed element is cloned and returned 
 else the element is removed altogether along with its parent
 
 Example:  var jscomponent = document.getElementById('pager');
           var temp_obj = jscomponent.removeElement(true);
		   
		   document.getElementById('badge').appendChild(temp_obj);

*/

if(!(HTMLElement.prototype).removeElement){
(HTMLElement.prototype).removeElement = function(findParent){
    var parent = this.parentNode;
 if(typeof(findParent) == "undefined" || !findParent){
     if(parent.removeChild){
       parent.removeChild(this);
     }
   }
   else if(typeof(findParent) == "boolean" && findParent){  
       if(this.parentNode != null){
	     var clone = this.cloneNode(true);
	     parent.removeChild(this);
         return clone;		 
	   }
    }
  }
} 
}




if(window && (window.JSON === undefined)){
window.JSON = {};

window.JSON.parse = window.JSON.parse || function (str) {
	if (str === "") str = '""';
	eval("var p=" + str + ";");
	return p;
};
  
  
window.JSON.stringify = window.JSON.stringify || function (obj) {

	var t = typeof (obj);
	if (t != "object" || obj === null) {
		if (t == "string") obj = '"'+obj+'"';
		return (new String(obj));
	}
	else {
		var n, v, json = [], arr = (obj && obj.constructor == Array);

		for(n in obj) {
			v = obj[n]; t = typeof(v);
			if (t == "string") {
			v = '"'+v+'"';
			}
			else if (t == "object" && v !== null) {
			v = JSON.stringify(v);	
			}
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
}
  
}

/**
  Function: [Function.prototype]> bind


  Argumnets: Object:{variable argument}
  
  
  Notes: used in binding a function to an object in context
  
  Example:
  
*/

if(!Function.prototype.bind){
Function.prototype.bind = function() {
var fn = this,
args = Array.prototype.slice.call(arguments),
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


if(!document.all){
if(!window.crypto && !(HTMLElement.prototype).classList){ // W3C only version
HTMLElement.prototype.classList =  function(){
  function ClassLister(domelement){
     // @ClassLister constructor 
     this.dom = domelement;
  }

  ClassLister.prototype  =  {
   add:function(input_tok){
      try{   
        if(typeof(this.dom) != "object" || typeof(input_tok) != "string"){ 
		    throw new TypeError('Invalid argument!');
        }
	  }catch(e){  window.console.log("Error: 0x349219");  return; }	
        
        var attr = this.dom.className, attr_l = this.dom.hasAttribute("class"), list;
        if(!attr || typeof(attr) == 'undefined'){
   		 this.dom.className = input_tok;
         list = '';		 
        }
        else if((attr && attr.indexOf(" ") == -1) || (attr && attr.indexOf(" ") > -1)){
           list = attr.split(" ");
		if(list instanceof Array && attr_l){
         for(var i = 0; i < list.length;i++){
             if(this.dom.className.indexOf(input_tok) > -1){
                 return;
             }
         }
		   this.dom.setAttribute('class', attr + " " + input_tok);
        }
      }else{ } 
   }
    ,
    remove:function(chosen_tok){
	  try{
       if(typeof(this.dom) !== "object" && typeof(chosen_tok) !== "string"){ 
           throw new TypeError('invalid argument!');
        }
      }catch(e){ window.console.log("Error: 0x349219"); return; }
        
        var attr = this.dom.className;
        if(!attr){
           return;
        }
        else if(attr && attr.indexOf(chosen_tok) > -1){
           attr = attr.replace(chosen_tok, '');
		   attr = attr.replace(/^\s+|\s+$/,'');
		   this.dom.setAttribute('class',attr);
        }else{}
      
    },
	contains:function(needle_tok){
		if(typeof(this.dom) != "object" || typeof(needle_tok) != "string"){ 
               throw new TypeError('invalid argument!');
        }
       return (this.dom.indexOf(needle_tok) > -1);
    },
    toggle:function(current_tok){
	   try{
	     if(typeof(this.dom) != "object" || typeof(current_tok) != "string"){ 
           throw new TypeError('invalid argument!');
        }
      }catch(e){ window.console.log("Error: 0x349219"); return; }
	  
	  var attr = this.dom.className;
	  
	  if(attr.indexOf(current_tok) > -1){
	     this.remove(current_tok);
	  }else{
	     this.add(current_tok);
	  }
	}
  }
  
    return new ClassLister(this); 
  }
}

/**
 Function: [HTMLElement.prototype] setChildText
 
  
 Arguments: String:word - replacement text 
            Number:index - index of the child element in the stack
      
 
 Notes: sets the innnerText property of the child element to [word]

*/

if(!(HTMLElement.prototype).setElementText){
(HTMLElement.prototype).setElementText = function(word, index){
if(typeof(index) == "undefined") index = 0;
if(this.children.length != 0){
 var div = document.createElement('div');
 div.appendChild(document.createTextNode(word));
   if('innerText' in this.children){ // webkit browsers...
      this.children[index].innerText = div.childNodes[0].nodeValue
    }
  else { this.children[index].textContent = div.childNodes[0].nodeValue } // gecko browsers...
  }
else{ 
 var tnode = null, containsText = false;
for(var g=0; g < this.childNodes.length; g++){
  if(this.childNodes[g].nodeType < 3){ // exclude attribute and element nodes...
   continue;
     }
  else{ 
containsText = true; 
break;
   }
 }
 if(containsText){
this.normalise();
this.firstChild.data = word; 
   }
 }
}
}
/**
  Function: [Element.prototype] insertAdjacentHTML


  Argumnets: String: fwhich
             String: markup
  
  
  Notes: fwhich > selector token that can take any of these values ; 'afterBegin'; 'beforeEnd'; 'afterEnd'; 'beforBegin'; 
         markup > html markup which is to be inserted  
         use > inserts a HTML DOM element node relatively to the element
  
  Example: document.getElementsByTagName('p')[0].insertAdjacentHTML('afterEnd','<img src="pic-011.png" alt="" />');
  
*/

if(!(HTMLElement.prototype).insertAdjacentHTML){
(HTMLElement.prototype).insertAdjacentHTML = function(fwhich, markup){
 if(typeof(fwhich) != "string" || typeof(markup) != "string"){
 return;
 }

var elem, startIndex, endIndex,tagname, inner;
var isFound, b = 0, selectors = ['afterBegin','beforeEnd','afterEnd','beforeBegin'];

/*
  SEARCH STAGE (this will enable us search for any of the vaild selectors)
*/

 for(;b < selectors.length;b++){ //begin looping through all selectors to find a match for the 'fwhich' variable
      if(b == selectors.length-1){
   if(fwhich != selectors[b]){
        isFound = false;
        break;
         }
      }
 if(fwhich == selectors[b]){
 isFound = true; 
  break;
    }
 }
/*
 PARSE STAGE (this will enable us parse the markup argument passed by the user)
*/

if(markup.indexOf("=") == -1 && markup.indexOf(" ") == -1){
   
 inner = markup.replace(/<.*?>/,"").replace(/(<\/\w+>(?!\<))/,"");
 startIndex = markup.indexOf("<")+1;
 endIndex = markup.indexOf(">");
 tagname = markup.substring(startIndex,endIndex);
 elem = document.createElement(tagname);


 if(inner.indexOf("<") > -1){
  elem.innerHTML = inner;
 }
 else{
  elem.appendChild(document.createTextNode(inner));
 }


if(isFound && fwhich == selectors[0]){
this.insertBefore(elem,this.children[0]);
  }

if(isFound && fwhich == selectors[2]){
 if(this.parentNode && this.nextSibling.nodeType != 1){
  this.parentNode.insertBefore(elem,this.nextSibling.nextSibling);
 }
}

if(isFound && fwhich == selectors[1]){
this.appendChild(elem);
  }

if(isFound && fwhich == selectors[3]){
  if(this.parentNode){
   this.parentNode.insertBefore(elem,this.parentNode.firstChild);
  }
 }
}

else{

 inner = markup.replace(/<.*?>/,"").replace(/(<\/\w+>(?!\<))/,"");
 startIndex = markup.indexOf("<")+1;
 endIndex = markup.indexOf(">");
 tagname = markup.substring(startIndex,markup.indexOf(" "));
 header = markup.substring(startIndex,endIndex);
 header = header.replace(/\u0027/g,"").replace(/\w+([^=](?=\s+))/,"");

 elem = document.createElement(tagname);

var attrObj = {id:"id", style:"style", title:"title", name:"name", type:"type", tabindex:"tabindex", value:"value", cellpadding:"cellpadding", cellspacing:"cellspacing", align:"align", 
size:"size", "class":"class", dir:"dir", src:"src", href:"href", method:"method", action:"action", onclick:"onclick", onmouseover:"onmouseover", placeholder:"placeholder", onerror:"onerror", language:"language", vspace:"vspace", hspace:"hspace", alt:"alt", 
onfocus:"onfocus", onchange:"onchange", onmouseout:"onmouseout", onmousedown:"onmousedown", onmouseup:"onmouseup", target:"target", autocomplete:"autocomplete", spellcheck:"spellcheck", onkeypress:"onkeypress", onkeydown:"onkeydown", onblur:"blur", longdesc:"longdesc"}
var attrArr = [];
var i = 0;

 for(var o in attrObj){ 
 var temp = header.indexOf(attrObj[o]);
  if(temp > 0){
 attrArr[i] = [attrObj[o], header.substring(header.indexOf("=",temp)+1,header.indexOf(" ", temp))]
    }
  i++;
  }



 for(var n=0; n < attrArr.length;n++){
       if(typeof(attrArr[n]) != "object"){
        continue;
       }
    for(var f=0; f < attrArr[n].length;f++){
      elem.setAttribute(attrArr[n][f], attrArr[n][f+1]);
      break;
     }
 }


if(inner.indexOf("<") > -1){
elem.innerHTML = inner;
}
else{
elem.appendChild(document.createTextNode(inner));
}



if(isFound && fwhich == selectors[0]){
this.insertBefore(elem,this.children[0]);
  }

if(isFound && fwhich == selectors[2]){
 if(this.parentNode && this.nextSibling.nodeType != 1){
  this.parentNode.insertBefore(elem,this.nextSibling.nextSibling);
 }
}

if(isFound && fwhich == selectors[1]){
this.appendChild(elem);
  }

if(isFound && fwhich == selectors[3]){
  if(this.parentNode){
   this.parentNode.insertBefore(elem,this.parentNode.firstChild);
  }
 }

    }
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

if(!(HTMLElement.prototype).isParentTo){
(HTMLElement.prototype).isParentTo = function(els){
  var temp = this.getElementsByTagName('*');
   for(var i = 0; i < temp.length; i++){
     if(temp[i] === els){
	     return true;
	 }else{
	     continue;
	 }
   }
     return false;   
  }
}
}
// patch definition for Mozilla Firefox - [innerText]
if(window.crypto){
if(Element.prototype){
Object.defineProperty(Element.prototype,"innerText",{get:function(){ return this.innerHTML.replace(/<\w>/g,"").replace(/<\/\w>/g,"")} , set:function(str){ this.innerHTML = this.innerHTML.replace(this.innerHTML.nodeValue,str)}, configurable:true , enumerable:true});
 }
}

/**
  Function: [Element.prototype]> hasClass


  Argumnets: String:classtext
  
  
  Notes:checks the existence of a class name [classtext] on a DOM element
  
*/

if(!document.all){
if(!(HTMLElement.prototype).hasClass){
(HTMLElement.prototype).hasClass = function(classtext){
if(typeof(classtext) == "string" &&  this.className !== null){
     return (this.className.indexOf(classtext) > -1)? true : false ; 
}else if(typeof(classtext) == "string" && this.hasAttribute("class")){
return (this.getAttribute("class").indexOf(classtext) > -1) ? true : false ;
}else{}
}
}

/**
  Function: [Element.prototype]> emptyElement


  Argumnets: None
  
  
  Notes: removes all child node of the DOM element
  
  Example:
  
*/
if(!(HTMLElement.prototype).emptyElement){
(HTMLElement.prototype).emptyElement = function(){
if(this.children.length != 0){
var child = (isElementNode(this.firstChild.nextSibling))? this.firstChild.nextSibling : ((this.firstChild.nodeType != 2)? this.firstChild : "nothing");

  if(child == "nothing") return;
  var i = 0;
	if(child){
        while((child = this.children.item(0)) != null){
			this.children.item(0).parentNode.removeChild(child);
		    i=i+1;
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
               if(!color_style)
			        return;
  
*/

if(!(HTMLElement.prototype).hasStyle){
(HTMLElement.prototype).hasStyle = function(sty){
var domsty = (document.getElementsByTagName("style")[0].innerHTML)? document.getElementsByTagName("style")[0].innerHTML : document.getElementsByTagName("style")[0].innerText;
var srt, obj = this, isTrue = false;
var extSty = getCurrElementStyle(obj, sty);
if(sty.indexOf("-") > -1) { 
srt = "" + sty.substr(0,sty.indexOf("-")) + sty.charAt(sty.indexOf("-")+1).toUpperCase() + sty.substring(sty.indexOf("-")+2); 
  }
return (obj.style.cssText.indexOf(sty) != -1 || extSty !== null || eval("obj.style." + srt) != ""  || (domsty.indexOf(obj.getAttribute("class") || obj.nodeName.toLowerCase() || obj.id) != -1)) ? true : false;
}
}

if(!(HTMLElement.prototype).getElementText){
(HTMLElement.prototype).getElementText = function(kind){
if(typeof(kind) == "undefined") kind = 0;

if(this.children.length == 0 || isTextNode(this)){
  kind = null;
  return this.firstChild.data;
}

else if(isElementNode(this)){
var whichNode = this.children[kind];
var div =document.createElement('div');
holder = (div.textContent != null)? "textContent" : "innerText" ;
return (whichNode !== undefined)? whichNode[holder] : "null";
   }
else{ return ""};
}
}


/**
  Function: [Element.prototype]> isElementEmpty


  Argumnets: None
  
  
  Notes:checks whether the element has any child nodes
  
*/
if(!(HTMLElement.prototype).isElementEmpty){
(HTMLElement.prototype).isElementEmpty = function(){
return (!(this.children.length == 0) || !(this.childNodes.length == 0))? false: true;
    }
  }
}
/***********************************************************************
*  @section Generic Functions                                          *
*                                                                      *
*  @source http://robertnyman.com/  - JavaScript v 1.8 Generic Methods *   
*                                                                      *
************************************************************************/

if(!Object.defineProperty){
 if(Object.prototype.__defineGetter__ && !true){
  Object.defineProperty = function(DOMObj, property, getorset){
   if(typeof(DOMObj) == "object" && typeof(property) == "string" && typeof(getorset) == "object"){
        for(var a in getorset){
         switch(a){
           case "get":
           DOMObj.__defineGetter__(property, getorset[a]);
           break;
           case "set":
           DOMObj.__defineSetter__(property, getorset[a]);
           break;
           default:
          }
        }
      }
    }
  }
else{
Object.defineProperty = function(DOMObj, property, getorset){
     if(typeof(DOMObj) == "object" && typeof(property) == "string" && typeof(getorset) == "object"){
       document.expando = true
        for(var a in getorset){
         switch(a){
           case "get":
             if(typeof(DOMObjproperty) == "undefined" && !(DOMObj.hasOwnProperty(property))){
                 var gprop = getorset[a]();
                 DOMObj.__proto__ = {};
                 DOMObj = {property: gprop}; 
              } 
           break;
           case "set":
           ObjectReplace(DOMObj[property], getorset[a]);
           break;
		   
		   case "enumerable":
		     //code goes here...
		   break;
           default:
          }
        }
function ObjectReplace(objct, func){
if(typeof(func) == "function"){
  if(func.arguments.callee.done){
   if(typeof(objct) == "string" && typeof(func.arguments[0]) == "string"){ objct = func.arguments[0]; } 
     }
   } 
 }
    
      }
    }
  }
}

if(!Object.create){
Object.create = function(fi){

if(typeof(fi) != 'object' && typeof(fi) != 'function'){
return;
}

var j=new Function();

j.prototype=fi;

return (new j());

 }
}

if(!Object.keys){
Object.keys= function(fuc){
if(typeof(fuc) != 'object' && typeof(fuc) !='function' || fuc=== null ){
return;
}
var j=[];
for(var k in fuc){

if(Object.prototype.hasOwnProperty.call(fuc,k)){
j.push(k)
 }
}
var l=!Object.prototype.propertyIsEnumerable('toString'),m=['toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','prototypeIsEnumerable','constructor'];

if(l){
for(var n=0;n<m.length;n++){
var o=m[n];
if(Object.prototype.hasOwnProperty.call(fuc,o)){
j.push(o);
      }
    }
  }
return j;
 }
}


if(!Array.filter){
Array.filter = function(str,func,i){
if(typeof(str) != 'string' && typeof(func) != 'function'){ return; }
var f,x = str.split(""), n = [];
for(d=0;d<x.length;++d){

f = x[d];

if(func.call(i,f,d,x)){
n.push(f);
    }
  }
return n;
 }
}


if(!String.replace){
String.replace = function(a,RE,out){
if(typeof(this) == 'function'){
this.apply(Object.prototype,new Array(arguments));
}
if(typeof(a)!='object'){ return;}
var Comp = [];
for(var i=0;i < a.length;i++){
Comp[i] = a[i].replace(RE,out);
  }
 if(Comp){ return Comp;}
return null;
 }
}

if(!Array.isArray){
Array.isArray = function(arr){
return (arr instanceof Array) ? true: false;
 }
}

/********************** End Generic Methods ****************************************/
/***********************************************************************************/


/**
  Function: [Element.prototype]> insertAfter


  Argumnets: DOM Node Object:new_elem
             DOM Node Object:ch_elem
  
  Notes:  inserts a DOM element after the element to form the next sibling 
          new_elem > 
		  ch_elem  > 
  Example: var bb = document.getElementById("nana");
           var nn = document.getElementById("case").cloneNode(true);
           document.getElementById("canvas").insertAfter(nn, bb);		  
*/

if(window.getComputedStyle && !(HTMLElement.prototype).insertAfter){
(HTMLElement.prototype).insertAfter = function(new_elem, ch_elem){
    if(typeof(ch_elem) != "object" && typeof(ch_elem.nodeType) != "number"){
	  return;
	}
	if(typeof(new_elem) != "object" && typeof(new_elem.nodeType) != "number"){
	  return;
	}
	if(this.childNodes.length > 0  && ch_elem.parentNode === this){
	    new_elem.removeAttribute('width');
	    this.insertBefore(new_elem, ch_elem.nextSibling.nextSibling);
	}
  }
}


 /**
  Function: [HTMLElement.prototype]> addCSSRules


  Argumnets: Array:rObj
  
  
  Notes:  rObj > an array of rule sets in succesion
		 
  Examples: var container = document.getElementById("fc-trigger"); 
             container.addCSSRules(['color','#ffeeee','border','none','display','inline-block']);  
*/


if(!document.all){
if(!(HTMLElement.prototype).addCSSRules){
(HTMLElement.prototype).addCSSRules = function(rObj){
if(rObj instanceof Array){
var i=0;
while(i < rObj.length){
this.style.cssText += "" + rObj[i] + ":" + rObj[i+1] + ";"
 i++;
  if(!isEven(i)){
       ++i;
     }
   }
 }
else{ return;}

  }
}
}

})(window, document); // end library

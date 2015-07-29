(function(window){
	var doc = window.document,
		body = doc.body,
		html = doc.documentElement;

	var ua = window.navigator.userAgent,
		isIe = /trident/gi.test(ua),
		oldIe = /msie [5678]/gi.test(ua);

	function dom(sel, obj){
		obj = obj||doc;
		if(typeof sel !== 'string') return;

		if(0) {
			return unique(document.querySelectorAll(sel));
		} else {
			//将" #nav  > ul.item ,#form   input[value=abc]" 变成 "#nav>ul.item,#form input[value=abc]", 并用","断开
			sel = sel.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ').replace(/\s*([:\,>])\s*/g, '$1').split(',');

			var res = [], cop = [];
			each(sel, function(i, e){
				if(e === '*') return filterType(tag('*'));

				e = e.match( /\s?#?[a-z][a-z0-9_\-]*|\.[a-z][a-z0-9_\-]*|>|\*|\s|\[[a-z][a-z0-9_\-]+?[!\$]?=.+?\]|:[a-z][a-z0-9_\-\(\)]+/gi );
		
				each(e, function(i, e){ detect(e); });
				res = concat(res, cop);
				cop.length = 0;
			});
			return unique(res);
		}

		function detect(str){
			var temp;
			if(str === '*') {}
			else if( str.charAt(0) === ' ' ){
				//" #item"和" li"和" "的特殊情况
				if( str.charAt(1) === '#' ) cop = [id(str.substring(1))];
				else {
					temp = [];
					each(cop, function(i, e){ temp.push(tag( (str.length === 1 ? '*' : str.substring(1)), e ) ); });
					cop = concat.apply(null, temp);
					console.log(res);
				}
			}
			else if( str === '>' ){
				var temp = [];
				each(cop, function(i, e){ temp.push(filterType(e.childNodes)); });
				cop = concat.apply(null, temp);
			}
			else{
				//仅过滤, 若cop为空, 根据情况判断
				if( str.charAt(0) === '#' ){
					cop = [id(str.substring(1))];
				}
				else if( str.charAt(0) === '.' ){
					cop = filter(cop.length ? cop : tag('*'), function(i, e){ return hasCls(e, str.substring(1)); });
				}
				else if( /^[a-z]+[0-9]?$/gi.test(str) ){
					cop = cop.length ? filter(cop, function(i, e){ return e.nodeName === str.toUpperCase(); }) : tag(str);
				}
				else if( str.charAt(0) === ':' ){
					cop.length || (cop = tag('*'));
					if( str.indexOf(':eq(') > -1 ) cop = [cop[str.substring(4, str.length-1)]];
					else if( str.indexOf(':gt(') > -1 ) cop = filter(cop, function(i, e){ return i > +str.substring(4, str.length-1); });
					else if( str.indexOf(':lt(') > -1 ) cop = filter(cop, function(i, e){ return i < +str.substring(4, str.length-1); });
					else if( str === ':header' ) cop = filter(cop, function(i, e){ return e.nodeName.charAt(0) === 'H' && +e.nodeName.charAt(1)<7; });
					else if( str === ':first' ) cop = [cop[0]];
					else if( str === ':last' ) cop = [cop.pop()];
					else if( str === ':even' ) cop = filter(cop, function(i, e){ return (i+1)%2===0; });
					else if( str === ':odd' ) cop = filter(cop, function(i, e){ return i%2===0; });
					else if( str === ':input' ) cop = filter(cop, function(i, e){ return e.nodeName === 'INPUT'; });
					else if( str === ':text' || str === ':password' || str === ':submit' || str === ':recop' || str === ':radio' || str === ':checkbox' || str === ':image' || str ===':file' || str === ':button' ){
						 cop = filter(cop, function(i, e){ return e.nodeName === 'INPUT' && str.substring(1) === e.type; });
					}
					else if( str === ':selected' ) cop = filter(cop, function(i, e){ return e.nodeName==='INPUT' && e.selected; });
					else if( str === ':checked' ) cop = filter(cop, function(i, e){ return e.nodeName==='INPUT' && e.checked; });
					else if( str === ':enabled' ) cop = filter(cop, function(i, e){ return e.nodeName==='INPUT' && !e.disabled; });
					else if( str === ':disabled' ) cop = filter(cop, function(i, e){ return e.nodeName==='INPUT' && e.disabled; });
				}
				else if( str.charAt(0) === '[' && str.charAt(str.length - 1) === ']' ){
					str = /^\[([a-z][a-z0-9_\-]+?)([!\$]?)=(.+?)\]$/g.exec(str);
					if( str[2] === '!' ) cop = filter(cop.length ? cop : tag('*'), function(i, e){ return getAttr(e, str[1]) !== str[3]; });
					else if( str[2] === '$' ){
						cop = filter(cop.length ? cop : tag('*'), function(i, e){
							var attr = getAttr(e, str[1])+'';
							return attr.indexOf(str[3]) + str[3].length === attr.length; 
						});
					}
				}
			}
			
		}
	}

	function id(id, obj){
		return (obj||doc).getElementById(id);
	}
	function tag(tag, obj){
		return (obj||doc).getElementsByTagName(tag);
	}
	function hasCls(obj, cls){
		var temp = obj.className.split(/\s+/);
		for(var i=0, m=temp.length; i<m; i++) if(temp[i] === cls) return true;
		return false;
	}
	function getAttr(obj, attr){
		return obj.getAttribute(attr);
	}
	function each(arr, fn){
		for(var i=0, m=arr.length; i<m; i++) fn.call(arr[i], i, arr[i]);
	}
	function trim(str, s, ignore){
		var re = new RegExp('^'+s+'+|'+s+'+$', 'g' + (ignore||'i'));
		return str.replace(re, '');
	}
	function filter(arr, fn){
		for(var i=0, m=arr.length, res=[]; i<m; i++) if(fn.call(arr[i], i, arr[i])) res.push(arr[i]);
		return res;
	}
	function filterType(arr){
		return filter(arr, function(i, e){ return e.nodeType === 1; });
	}
	function unique(arr){
		if(arr.length === 0) return arr;
		for(var i=0, m=arr.length, res=[]; i<m; i++) if(!exist(arr[i], res) && arr[i] !== null) res.push(arr[i]);
		return res;
		function exist(e, arr){
			for(var i=0, m=arr.length; i<m; i++) if(e === arr[i]) return true;
			return false;
		}
	}
	function concat(){
		var arg = arguments, res=[], i, j, m, n;
		for(i=0, m=arg.length; i<m; i++){
			for(j=0, n=arg[i].length; j<n; j++) res.push(arg[i][j]);
		}
		return res;
	}

	window.d = dom;
})(window);

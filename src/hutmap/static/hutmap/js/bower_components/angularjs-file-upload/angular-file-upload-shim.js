/**!
 * AngularJS file upload shim for HTML5 FormData
 * @author  Danial  <danial.farid@gmail.com>
 * @version 1.1.5
 */
(function() {

if (window.XMLHttpRequest) {
	if (window.FormData) {
		// allow access to Angular XHR private field: https://github.com/angular/angular.js/issues/1934
		XMLHttpRequest = (function(origXHR) {
			return function() {
				var xhr = new origXHR();
				xhr.send = (function(orig) {
					return function() {
						if (arguments[0] instanceof FormData && arguments[0].__setXHR_) {
							var formData = arguments[0];
							formData.__setXHR_(xhr);
						}
						orig.apply(xhr, arguments);
					}
				})(xhr.send);
				return xhr;
			}
		})(XMLHttpRequest);
	} else {
		XMLHttpRequest = (function(origXHR) {
			return function() {
				var xhr = new origXHR();
				var origSend = xhr.send;
				xhr.__requestHeaders = [];
				xhr.open = (function(orig) {
					xhr.upload = {
						addEventListener: function(t, fn, b) {
							if (t == 'progress') {
								xhr.__progress = fn;
							}
						}
					};
					return function(m, url, b) {
						orig.apply(xhr, [m, url, b]);
						xhr.__url = url;
					}
				})(xhr.open);
				xhr.getResponseHeader = (function(orig) {
					return function(h) {
						return xhr.__fileApiXHR ? xhr.__fileApiXHR.getResponseHeader(h) : orig.apply(xhr, [h]); 
					}
				})(xhr.getResponseHeader);
				xhr.getAllResponseHeaders = (function(orig) {
					return function() {
						return xhr.__fileApiXHR ? xhr.__fileApiXHR.getAllResponseHeaders() : orig.apply(xhr); 
					}
				})(xhr.getAllResponseHeaders);
				xhr.abort = (function(orig) {
					return function() {
						return xhr.__fileApiXHR ? xhr.__fileApiXHR.abort() : (orig == null ? null : orig.apply(xhr)); 
					}
				})(xhr.abort);
				xhr.send = function() {
					if (arguments[0].__isShim && arguments[0].__setXHR_) {
						var formData = arguments[0];
						if (arguments[0].__setXHR_) {
							var formData = arguments[0];
							formData.__setXHR_(xhr);
						}
						var config = {
							url: xhr.__url,
							complete: function(err, fileApiXHR) {
								Object.defineProperty(xhr, 'status', {get: function() {return fileApiXHR.status}});
								Object.defineProperty(xhr, 'statusText', {get: function() {return fileApiXHR.statusText}});
								Object.defineProperty(xhr, 'readyState', {get: function() {return 4}});
								Object.defineProperty(xhr, 'response', {get: function() {return fileApiXHR.response}});
								Object.defineProperty(xhr, 'responseText', {get: function() {return fileApiXHR.responseText}});
								xhr.__fileApiXHR = fileApiXHR;
								xhr.onreadystatechange();
							},
							progress: function(e) {
								xhr.__progress(e);
							},
							headers: xhr.__requestHeaders
						}
						config.data = {};
						config.files = {}
						for (var i = 0; i < formData.data.length; i++) {
							var item = formData.data[i];
							if (item.val != null && item.val.name != null && item.val.size != null && item.val.type != null) {
								config.files[item.key] = item.val;
							} else {
								config.data[item.key] = item.val;
							}
						}
						setTimeout(function() {
							xhr.__fileApiXHR = FileAPI.upload(config);
						}, 1);
					} else {
						origSend.apply(xhr, arguments);
					}
				}
				return xhr;
			}
		})(XMLHttpRequest);
	}
}

if (!window.FormData) {
	HTMLInputElement.prototype.addEventListener = HTMLInputElement.prototype.attachEvent = (function(origAddEventListener) {
		return function(e, fn, b, d) {
			if ((e.toLowerCase() === 'change' || e.toLowerCase() === 'onchange') && this.getAttribute('type') == 'file') {
				if (!this.__isWrapped && (this.getAttribute('ng-file-select') != null || this.getAttribute('data-ng-file-select') != null)) {
					var wrap = document.createElement('div');
					wrap.innerHTML = '<div class="js-fileapi-wrapper" style="position:relative; overflow:hidden"></div>';
					wrap = wrap.firstChild;
					var parent = this.parentNode;
					parent.insertBefore(wrap, this);
					parent.removeChild(this);
					wrap.appendChild(this);
					this.__isWrapped = true;
				}
				origAddEventListener.apply(this, [e, 
						function(evt) {
							var files = FileAPI.getFiles(evt);
							if (!evt.target) {
								evt.target = {};
							}
							evt.target.files = files;
							evt.target.files.item = function(i) {
								return evt.target.files[i] || null;
							}
							fn(evt);
						}, b, d]); 
			} else {
				origAddEventListener.apply(this, [e, fn, b, d]);
			}
		}
	})(HTMLInputElement.prototype.addEventListener || HTMLInputElement.prototype.attachEvent);

	window.FormData = FormData = function() {
		return {
			append: function(key, val, name) {
				this.data.push({
					key: key,
					val: val,
					name: name
				});
			},
			data: [],
			__isShim: true
		};
	};
		
	(function () {
		//load FileAPI
		if (!window.FileAPI || !FileAPI.upload) {
			var base = '', script = document.createElement('script'), allScripts = document.getElementsByTagName('script'), i, index, src;
			if (window.FileAPI && window.FileAPI.jsPath) {
				base = window.FileAPI.jsPath;
			} else {
				for (i = 0; i < allScripts.length; i++) {
					src = allScripts[i].src;
					index = src.indexOf('angular-file-upload-shim.js')
					if (index == -1) {
						index = src.indexOf('angular-file-upload-shim.min.js');
					}
					if (index > -1) {
						base = src.substring(0, index);
						break;
					}
				}
			}

			if (!window.FileAPI || FileAPI.staticPath == null) {
				FileAPI = {
					staticPath: base
				}
			}
	
			script.setAttribute('src', base + "FileAPI.min.js");
			document.getElementsByTagName('head')[0].appendChild(script);
		}
	})();
}})();
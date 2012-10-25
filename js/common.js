var idebug = function(obj){
  var str=''; for(var key in obj) str+=' '+key+'='+obj[key];
  alert(str);
}
var debug = function(obj){
  if(typeof(console)!= 'undefined'){
    if(console.debug) console.debug(obj);
    else if(console.log) console.log(obj);
  }
  return obj;
}
String.prototype.template = function(values) {
  if(values === undefined) {
    return this+'';
  } else {
    var newValue = this+'';
    for (var key in values) {
      newValue = newValue.replace(RegExp('\\{'+key+'\\}', 'gi'), values[key]);
    }   
    return newValue;
  }
};
if(!String.prototype.trim){
  String.prototype.trim = function(){
    var string = this+'';
    return string.replace(new RegExp('(^\\s+)|(\\s+$)', 'g'), '');
  }
}
if (!Array.prototype.forEach){
  Array.prototype.forEach = function(fun /*, thisp */) {
    "use strict";
    if (this === void 0 || this === null)
      throw new TypeError();
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        fun.call(thisp, t[i], i, t);
    }
  };
}
if (!Array.prototype.indexOf){
  Array.prototype.indexOf = function(searchElement /*, fromIndex */)
  {
    "use strict";
 
    if (this === void 0 || this === null)
      throw new TypeError();
 
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0)
      return -1;
 
    var n = 0;
    if (arguments.length > 0)
    {
      n = Number(arguments[1]);
      if (n !== n) // shortcut for verifying if it's NaN
        n = 0;
      else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
 
    if (n >= len)
      return -1;
 
    var k = n >= 0
          ? n
          : Math.max(len - Math.abs(n), 0);
 
    for (; k < len; k++)
    {
      if (k in t && t[k] === searchElement)
        return k;
    }
    return -1;
  };
}
if(!Object.keys) Object.keys = function(o){var ret=[];
 for(p in o) if(Object.prototype.hasOwnProperty.call(o)) ret.push(p);
 return ret;
}
if (!Array.prototype.map){
  Array.prototype.map = function(fun /*, thisp */){
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
        res[i] = fun.call(thisp, t[i], i, t);
    }

    return res;
  };
}
if (!Array.prototype.filter){
  Array.prototype.filter = function(fun /*, thisp */)
  {
    "use strict";
 
    if (this === void 0 || this === null)
      throw new TypeError();
 
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();
 
    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t))
          res.push(val);
      }
    }
 
    return res;
  };
}
//transition and transform detects
(function(){
  var testStyle = document.createElement('div').style;
  jQuery.extend({
    transformSupport:   false,
    transformProp:      'transform',
    transformCssProp:   'transform',
    transitionSupport:  false,
    transitionEndEvent: 'transitionend',
    transitionProp:     'transition'
  });
  //var transitionEndEvent  = 'transitionend';
  var transitionPropAr  = ['MozTransition', 'WebkitTransition',     'MsTransition'];
  var transitionEndAr   = ['transitionend', 'webkitTransitionEnd',  'msTransitionEnd'];
  
  var transformPropAr   = ['MozTransform',    'WebkitTransform',    'msTransform',    'transform'];
  var transformCssPropAr= ['-moz-transform',  '-webkit-transform',  '-ms-transform',  'transform'];
  //detect transitions
    transitionPropAr.forEach(function(prop, k){
      if(prop in testStyle){
        jQuery.transitionSupport  = true;
        jQuery.transitionEndEvent = transitionEndAr[k];
        jQuery.transitionProp     = prop;
      }
    });
  //detect transforms
    transformPropAr.forEach(function(prop, k){
      if(prop in testStyle){
        jQuery.transformSupport = true;
        jQuery.transformProp    = prop;
        jQuery.transformCssProp = transformCssPropAr[k];
      }
    });
  //idebug(testStyle);
  //debug([jQuery.transitionEndEvent, jQuery.transitionSupport]);
  jQuery.fn.extend({
    setTransformStyle: function(transform, trigerTransition){
      var prevTransform = (this.get(0).style[jQuery.transformProp]+'').replace(new RegExp('\\,\\s', 'g'), ',');
      this.get(0).style[jQuery.transformProp] = transform;
      if(trigerTransition && (transform != prevTransform)) this.reportTransition();
    },
    reportTransition: function(){
      if(!jQuery.transitionSupport){
        var obj = this;
        setTimeout(function(){
          obj.trigger(jQuery.transitionEndEvent);
        }, 0);
      }
    }
  })
})();
//redirect and cutom events
(function(){
  jQuery.extend({
    redirect: function(url){
      if (url){
        if (url.match(new RegExp('^(http|https)\\:', 'gi'))){
          window.document.location.href = url;
        }else{
          window.document.location.href = 'http://'+window.document.location.host+url;
        }
      }else{
        window.location.reload()
      }
    },
    customEvents: [],
    emitedCustomEvents: [],
    on: function(event, handler){
      this.customEvents.push([event, handler]);
    },
    emit: function(event){
      var self    = this;
      var emitAr  = Array.prototype.slice.call(arguments, 1);
      self.customEvents.filter(function(handlerAr){
        return (handlerAr[0]==event);
      }).forEach(function(handlerAr){
        handlerAr[1].apply(emitAr.slice(0,1), emitAr);
      });
    }
  })
})();
//icons
(function(){
  jQuery.extend({
    svgIconsCollection: {},
    setSvgIcons: function(newIcons){
      this.svgIconsCollection = jQuery.extend(this.svgIconsCollection, newIcons);
    },
    svgIcons: function(holder){
      var self = this;
      holder.find('i[class!=svgicon]').each(function(k, iconHolder){
        (iconHolder.className+'').split(' ').forEach(function(className){
          var iconPath = self.svgIconsCollection[className];
          if(iconPath){
            iconHolder.innerHTML  = '';
            var iconHolderJQ      = jQuery(iconHolder);
            iconHolderJQ.addClass('svgicon');
            var size    = Math.floor(parseFloat(iconHolderJQ.css('fontSize')));
            var color   = jQuery(iconHolder).css('color');
            var yShift  = (parseFloat(iconHolderJQ.css('lineHeight'))-size)/2;
            var paper = Raphael(iconHolder, size, size+yShift);
            var path  = paper.path(iconPath).attr({
              fill: color, 
              stroke: "none"
            });
            path.scale(size/32, size/32, 0, 0).translate(0, yShift);
            var box = path.getBBox();
            paper.setSize(box.width+2*box.x, paper.height);
          }
        })
      })
    }
  });
  jQuery.fn.extend({
    svgIcons: function(){
      jQuery.svgIcons(this);
      return this;
    }
  });
  jQuery(function(){
    jQuery('body').svgIcons();
  })
})();
//buttons
(function(){
  jQuery.fn.extend({
    wait: function(){
      this.each(function(k, element){
        element         = jQuery(element);
        element.blur();
        var background  = jQuery('<div></div>');
        element.data('waitAnimation', background);
        background.css('position', 'absolute');
        background.css('overflow', 'hidden');
        background.css('zIndex', '10');
        var width   = parseInt(element.css('width'))+parseInt(element.css('paddingLeft'))+parseInt(element.css('paddingRight'));
        var height  = parseInt(element.css('height'))+parseInt(element.css('paddingTop'))+parseInt(element.css('paddingBottom'));
        background.width(width);
        background.height(height);
        background.css(element.offset());
        background.appendTo('body');
        var scale = height/32;
        var paper = Raphael(background.get(0), width, height);
        var lineWidth = 20*scale;
        var lineNum = Math.floor(width/lineWidth)+1;
        var paths   = paper.set();
        var color   = element.css('color');
        for(var x = -lineNum*lineWidth; x<=lineNum*lineWidth; x+=lineWidth){
          paths.push(paper.path('M9.633,31.5H-0.5l21.868-32H31.5L9.633,31.5z').attr({
            'fill':          color,
            'fill-opacity':  0.2,
            'stroke':       'none'
          }).scale(scale, scale, 0, 0).translate(x, 0));
        }
        var animationLoop = function(){
          paths.translate(-lineWidth, 0);
          paths.animate({translation: [lineWidth,0].join(' ')}, 200, animationLoop);
        }
        animationLoop();
        var onResize = function(){
          if(element.data('waitAnimation')){
            element.reset();
            setTimeout(function(){
              element.wait();
            }, 10);
          }
        }
        jQuery(window).one('resize', onResize);
      })
    },
    reset: function(){
      this.each(function(k, element){
        element = jQuery(element);
        var background = element.data('waitAnimation');
        if(background) background.remove();
        element.data('waitAnimation', false);
      })
    }
  })
})();
//hash
(function(){
  jQuery.extend({
    hash: (function(){
      var hash = function(){
        var self = this;
        self.binds      = {}
        self.hash       = self.getHash();
        self.hashAr     = {}
        self.prevHashAr = {}
        self.parseHash();
        if((typeof window.addEventListener)=='function'){
          window.addEventListener('hashchange', function(){
              self.checkHashChange();
          }, false);
        }else{
          setInterval(function(){
            self.checkHashChange();
          }, 100);
        }
        self.checkHashChange();
        //jQuery(function(){
        //  setTimeout(function(){
        //    self.checkHashChange();
        //  }, 0);
        //})
      }
      hash.prototype = {
        getHash: function(){
          return (document.location.hash+'').replace(new RegExp('^\\#', 'gi'), '');
        },
        checkHashChange: function(){
          var self = this;
          var hash = self.getHash();
          if(self.hash!=hash){
            self.hash = hash;
            self.hashChanged();
          }
        },
        parseHash: function(){
          var self        = this;
          self.prevHashAr = {}
          Object.keys(self.hashAr).forEach(function(key){
            self.prevHashAr[key] = self.hashAr[key];
          })
          self.hash.split('/').filter(function(str){
            return str.match(':')&&str.length>3;
          }).map(function(str){
            return str.split(':')
          }).forEach(function(itemAr){
            self.hashAr[itemAr[0]] = itemAr[1];
          });
        },
        hashChanged: function(){
          var self = this;
          self.parseHash();
          Object.keys(self.binds).forEach(function(key){
            if((self.hashAr[key]+'')!=(self.prevHashAr[key]+'')) self.binds[key](self.hashAr[key]);
          });
        },
        bind: function(name, callback){
          var self = this;
          self.binds[name] = callback;
          if(self.hashAr[name]) callback(self.hashAr[name]);
        },
        get: function(name){
          var self = this;
          return self.hashAr[name];
        },
        set: function(name, value){
          var self = this;
          self.hashAr[name] = value+'';
          self.hash = (Object.keys(self.hashAr)).map(function(key){
            return key+':'+self.hashAr[key]
          }).join('/');
          document.location.hash  = self.hash;
        }
      }
      return new hash();
    })()
  })
})();
//iscroll
var Scroller = (function(){
  var scroller = function(scroller, parent, axis){
    var self = this;
    if(!axis) axis = 'Y';
    self.axis = axis;
    self.scroller   = scroller;
    self.holder     = parent ? parent : self.scroller.parent();
    self.setHeight();
    jQuery(window).resize(function(){
      self.setHeight();
    });
    self.touchSupport = 'createTouch' in document;
    self.scrolled     = 0;
    if(!self.touchSupport){
      //self.holder.css('overflowY', 'scroll');
      self.setTransition('0.5s');
      //self.scroller.addClass('no-touch-scroll');
      self.startMousePosition = false;
      self.holder.bind('mousemove', function(e){
        var mousePosition = e['client'+axis];
        if((self.startMousePosition)&&(mousePosition)){                   
          self.scrolled+=2*(self.startMousePosition-mousePosition)/(self.holderHeight)*self.height;
          var maxScroll = -(self.height-self.holderHeight);
          if(self.scrolled>0){
            self.scrolled = 0;
          }else if(self.scrolled<maxScroll){
            self.scrolled = maxScroll;
          }
          self.scroll(self.scrolled);
        }
        self.startMousePosition = mousePosition;
      })
    }else{
      //self.scroller.addClass('touch-scroll');
      self.setTransition('0.0s');
      self.prevClientY  = 0;
      self.prevMoveTime = 0;
      self.scrollDY     = 0;
      self.scrollDTime  = 0;
      self.holder.bind('touchstart', function(){
        self.setTransition('0s');
      });
      self.holder.bind('touchend', function(){
        self.prevClientY  = self.prevMoveTime = 0;
        if(self.scrollDTime>0){
          var momentum  = Math.round(self.scrollDY/self.scrollDTime*0.5*1000);
          //debug([momentum, self.scrollDTime, self.scrollDY])
          self.scrollDY = self.scrollDTime = 0;
          self.scrolled+=momentum;
          self.setTransition('0.5s');
          //self.scroller.addClass('touch-scroll-momentum');
          //var maxScroll = self.holderHeight/2;
          var maxScroll = self.holderHeight;
          var minScroll = -self.height;
          //var minScroll = -self.height;
          if(self.scrolled>maxScroll) self.scrolled = maxScroll;
          if(self.scrolled<minScroll) self.scrolled = minScroll;
          self.scroll(self.scrolled);
        }
      });
      self.scroller.bind('webkitTransitionEnd', function(e){
        var maxScroll   = 0;
        var minScroll   = self.holderHeight-self.height;
        var newScrolled = self.scrolled;
        if(self.scrolled>(maxScroll+10))      newScrolled = maxScroll;
        else if(self.scrolled<(minScroll-10)) newScrolled = minScroll;
        else self.setTransition('0s');
        //else self.scroller.removeClass('touch-scroll-momentum');
        if (self.scrolled!=newScrolled) self.scroll(newScrolled);
      });
      self.holder.bind('touchmove', function(e){
        var clientY   = e.originalEvent.changedTouches[0]['client'+axis];
        var mooveTime = Date.now();
        if((self.prevClientY!=0)&&((clientY-self.prevClientY)!=0)){
          self.scrollDY       = clientY-self.prevClientY;
          self.scrollDTime    = mooveTime-self.prevMoveTime;
          if(!self.scrolled) self.scrolled = 0;
          self.scrolled = self.scrolled*1+self.scrollDY;
          self.scroll(self.scrolled);
        }
        self.prevMoveTime   = mooveTime;
        self.prevClientY    = clientY;
      })
    }
  }
  scroller.prototype = {
    setTransition: function(time){
      var self = this;
      self.scroller.get(0).style[jQuery.transitionProp] = ('{prop} {time} ease').template({
        prop: jQuery.transformCssProp,
        time: time
      });
      //debug(jQuery.transitionProp);
      //debug(self.scroller.get(0).style[jQuery.transitionProp]);
    },
    setHeight: function(){
      var self = this;
      var param = self.axis=='Y' ? 'height' : 'width';
      self.holderHeight = self.holder[param]();
      self.height       = self.scroller[param]();
    },
    scroll:function(d){
      var self = this;
      self.scrolled = d;
      var transform = 'translate{axis}({y}px)'.template({
        axis: self.axis,
        y: d
      });
      self.scroller.setTransformStyle(transform, false);
    }
  }
  return scroller;
})();
//cookie
(function(){
  jQuery.extend({
    cookie: {
      set: function(name, value, expire){
        var date = new Date();
        date.setTime(date.getTime()+(expire*1000));
        document.cookie = name+'='+escape(value)+'; expires='+date.toGMTString()+'; path=/'
      },
      get: function(name){
        var values = (new RegExp(name+'=([^\\;]{1,})', 'g')).exec(document.cookie+'');
        if (values) return unescape(values[1])
        else return false;
      }
    }
  })
})();

//drag and drob like in iPad
  var iDrag = function(outer){
    var self = this;
    self.outer           = jQuery(outer);
    self.children        = self.outer.children();
    self.jQueryChildren  = jQuery(self.children);
    self.outerH          = self.outer.height();
    self.timeOutID       = null;
    self.timeOutTime     = 200;
    self.transitionCount = 0;
    self.animated        = false;
    self.animationTime   = 0.4;
    self.dragging        = false;
    self.offset;
    self.childW;
    self.childH;
    self.margin;
    self.col;
    self.currentObjNum;
    self.mouseOverObjNum;
    self.mouseX;
    self.mouseY;
    
    self.setPosition();
    self.initializeEvent();
  }
  
  iDrag.prototype = {
    setPosition: function(){
      var self     = this;
      var outer    = self.outer;
      var outerW   = outer.width();
      self.offset  = self.outer.offset();
      var child    = jQuery(self.children[0]);
      self.childW  = child.outerWidth(true);
      self.childH  = child.outerHeight(true);
      self.col     = Math.floor(outerW/self.childW);
      console.log(child);
      self.margin  = (outerW - self.childW*self.col) / (self.col*1+1);
      var row      = Math.ceil(self.children.length/self.col);
      console.log(this.margin);
      console.log(row);
      
      if(row*self.childH > self.outerH) self.outer.css('height', row*self.childH+'px');
      else self.outer.css('height', self.outerH+'px');
      
      for(var i = 0; i < self.children.length; i++){
        if(!self.children.iDrag){
          self.children[i]       = jQuery(self.children[i]);
          self.children[i].css(jQuery.transitionProp, self.animationTime+'s ease');
          self.children[i].iDrag = {'x':null, 'y':null, 'offsetX':null, 'offsetY':null};
        }
      }
      self.refreshUIPosition();
    },
    //func wich call after change in children array
    refreshUIPosition: function(){
      var self  = this;
      
      for(var i = 0, j = 0; i < self.children.length; i++, j++){
        if(i%self.col == 0) j = 0;
        if(i == self.currentObjNum && self.dragging) continue;
        var newX = Math.round(self.margin+j*(self.childW + self.margin));
        var newY = Math.round(Math.floor(i/self.col)*self.childH);
        if(self.children[i].iDrag){
          if(newX != self.children[i].iDrag.x || newY != self.children[i].iDrag.y 
          || newX != self.children[i].iDrag.offsetX || newY != self.children[i].iDrag.offsetY) self.transitionCount++;
        }
        var transform          = 'translate('+newX+'px,'+newY+'px)';
        self.children[i].setTransformStyle(transform, true);
        self.children[i].iDrag = {'x':newX, 'y':newY, 'offsetX':newX, 'offsetY':newY};
      }
    },
    
    initializeEvent: function (){
      var self = this;
      jQuery(window).bind('mousemove', function(e){self.mouseMoveHandler(e);});
      jQuery(window).bind('mouseup', function(e){self.mouseUpHandler(e);});
      jQuery(window).resize(function(){self.setPosition();})
      self.outer.bind(jQuery.transitionEndEvent, function(e){self.transitionEndHandler(e);});
      self.outer.bind('mousedown', function(e){self.mouseDownHandler(e); return false;});
    },
    
    mouseMoveHandler: function(e){
      var self = this;
      if(self.dragging){
        var obj   = self.children[self.currentObjNum];
        var x     = e.pageX - self.offset.left + 1;//one need to count from one to outer width
        var y     = e.pageY - self.offset.top  + 1;
        var newX  = obj.iDrag.x + (x - self.mouseX);
        var newY  = obj.iDrag.y + (y - self.mouseY);
        var trans = 'translate('+newX+'px,'+newY+'px)';
        obj.setTransformStyle(trans, false);
        obj.iDrag.offsetX = newX;
        obj.iDrag.offsetY = newY;
        
        if(!self.animated){
          var newMouseOverObjNum = self.checkTarget(x, y);
          if(newMouseOverObjNum != null && newMouseOverObjNum != self.currentObjNum){
             if(newMouseOverObjNum != self.mouseOverObjNum){
               if(self.timeOutID != null){
                 window.clearTimeout(self.timeOutID);
                }
               self.timeOutID    = window.setTimeout(function(){self.clearMouseOverPosition();}, self.timeOutTime);
              }
            self.mouseOverObjNum = newMouseOverObjNum;
          }
        }
      }
    },
    
    clearMouseOverPosition: function(){
      var self      = this;
      self.animated = true;
      var temp      = self.mouseOverObjNum - self.currentObjNum;
      var step      = temp > 0? 1 : -1;
      var first     = self.currentObjNum;
      var last      = self.mouseOverObjNum;
      var curr      = self.children[first];
      for(var i = first; step > 0? i < last : i > last; i+=step){
        self.children[i]  = self.children[i+step];
      }
      self.children[last] = curr;
      self.currentObjNum  = last;
      self.refreshUIPosition();
    },
    
    mouseDownHandler: function(e){
      var self               = this;
      //self.jQueryChildren.addClass('animated');
      self.transitionCount   = 0;
      var x                  = e.pageX - self.offset.left + 1;//one need to count from one to outer width
      var y                  = e.pageY - self.offset.top + 1;
      self.currentObjNum     = self.checkTarget(x, y);
      if(self.currentObjNum != null){
        self.mouseOverObjNum = self.currentObjNum;
        
        self.children[self.currentObjNum].css('z-index', 1000);
        self.children[self.currentObjNum].css('opacity', 0.6);
        self.children[self.currentObjNum].css(jQuery.transitionProp,'');
        self.dragging = true;
        self.mouseX   = x;
        self.mouseY   = y;
      }
    },
    
    checkTarget: function(x, y){
      var self         = this;
      if(x > self.margin/2 && x < self.outer.width() - self.margin/2){
        x              = x - self.margin/2;
        var currentCol = Math.floor(x/(self.childW+self.margin));
      }
      
      var y = y - parseInt(self.outer.css('padding-top'));
      if(y >= 0){
        var currentRow = Math.floor(y/self.childH);
      }
      
      if(currentCol != undefined  && currentRow != undefined){
        var currentObj = self.col*currentRow + currentCol;
        if(currentObj >= self.children.length || currentObj == undefined){
          currentObj   = null;
        }
      }
      return currentObj;
    },
    
    mouseUpHandler: function(e){
      var self = this;
      if(self.dragging){
        window.clearTimeout(self.timeOutID);
        self.children[self.currentObjNum].css('z-index', 1);
        self.children[self.currentObjNum].css('opacity', 1);
        self.children[self.currentObjNum].css(jQuery.transitionProp, self.animationTime+'s ease');
        if(self.mouseOverObjNum != null){
          var temp = self.children[self.currentObjNum];
          self.children[self.currentObjNum]   = self.children[self.mouseOverObjNum];
          self.children[self.mouseOverObjNum] = temp;
        }
        self.dragging = false;
        self.refreshUIPosition();
        }
    },
    
    transitionEndHandler: function(){
      var self = this;
      self.transitionCount--;
      if(self.transitionCount == 0){
        self.animated = false;
      } 
    },
    //public functions
    remove: function(index){
      var self = this;
      self.children[index].remove();
      self.children.splice(index,1);
      self.setPosition();
    },
    
    add: function(object){
      var self = this;
      self.outer.append(object);
      self.children.push(object);
      self.setPosition();
    },
  } 

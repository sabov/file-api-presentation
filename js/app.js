(function(){
  dragDemo = {
    li : '<li class="item"></li>',
    initEl : function() {
      for(var i = 0; i < 30; i++) {
        this.holder.append(jQuery(this.li));
      }
    },
    initInput : function() {
      jQuery('.drag-input').bind('change', function(e) {
        this.files = e.currentTarget.files;
        this.renderImg();
      }.bind(this));
    },
    renderImg : function() {
      var tmId;
      for(var i = 0; i < this.files.length; i++) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var img    = jQuery('<img/>');
          img.attr('src', e.target.result);
          jQuery('.items').append(img);
          clearTimeout(tmId);
          tmId = setTimeout(function() {
            alert('strat');
            myDrag = new iDrag('.items');
          }, 1000);
        };
        reader.readAsDataURL(this.files[i]);
      }
    }
  };

  var saveTextDemo = {
    init : function() {
      window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
      window.requestFileSystem(window.TEMPORARY, 5*1024*1024, this.initFS.bind(this), this.errorHandler);
      jQuery('.create-text').bind('click', this.createFile.bind(this));
      jQuery('.add-text').bind('click', this.writeToFile.bind(this));
      jQuery('.get-text').bind('click', this.getFile.bind(this));
      jQuery('.remove-text').bind('click', this.removeFile.bind(this));

    },
    initFS : function(fs) {
      this.fs = fs;
    },
    createFile : function() {
      var fs = this.fs;
      fs.root.getFile('test.txt', {create: true, exclusive: true}, function(fileEntry) {
        alert('A file ' + fileEntry.name + ' was created successfully.');
      }, this.errorHandler);
    },
    writeToFile : function() {
      var fs = this.fs;
      fs.root.getFile('test.txt', {create: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
          fileWriter.seek(fileWriter.length);
          window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;
          var bb = new BlobBuilder();
          var text = ' ' + jQuery('.textarea textarea').val();
          jQuery('.textarea textarea').val('');
          bb.append(text);
          fileWriter.write(bb.getBlob('text/plain'));
        }, this.errorHandler);
      }.bind(this), this.errorHandler);
    },
    getFile : function() {
      var fs = this.fs;
      fs.root.getFile('test.txt', {}, function(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            alert(this.result);
          };
          reader.readAsText(file);
        }, this.errorHandler);
      }.bind(this), this.errorHandler);
    },
    removeFile : function(callback) {
      var fs = this.fs;
      fs.root.getFile('test.txt', {create: false}, function(fileEntry) {
        fileEntry.remove(function() {
          console.log('File successufully removed.');
          if(callback) callback()
        }, this.errorHandler);
      }.bind(this), this.errorHandler);
    },
    errorHandler : function(err) {
     var msg = 'An error occured: ';
      switch (err.code) {
        case FileError.NOT_FOUND_ERR:
          msg += 'File or directory not found';
          break;
        case FileError.NOT_READABLE_ERR:
          msg += 'File or directory not readable';
          break;
        case FileError.PATH_EXISTS_ERR:
          msg += 'File or directory already exists';
          break;
        case FileError.TYPE_MISMATCH_ERR:
          msg += 'Invalid filetype';
          break;
        default:
          msg += 'Unknown Error';
          break;
      };
     console.log(msg);
    }
  }

  jQuery(function() {
    dragDemo.initInput();
    saveTextDemo.init();
  });
})();

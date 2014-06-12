// Generated by CoffeeScript 1.6.3
(function() {
  var convertToMenuTemplate, createMenu, pathToHtml5FileObject, showFileChooserDialog;

  window.onload = function() {
    WebInspector.ContextMenu.prototype.show = function() {
      var menuObject;
      menuObject = this._buildDescriptor();
      if (menuObject.length) {
        WebInspector._contextMenu = this;
        createMenu(menuObject, this._event);
        return this._event.consume();
      }
    };
    return WebInspector.createFileSelectorElement = function(callback) {
      var fileSelectorElement;
      fileSelectorElement = document.createElement('span');
      fileSelectorElement.style.display = 'none';
      fileSelectorElement.click = showFileChooserDialog.bind(this, callback);
      return fileSelectorElement;
    };
  };

  convertToMenuTemplate = function(items) {
    var item, template, _fn, _i, _len;
    template = [];
    _fn = function(item) {
      var transformed;
      transformed = item.type === 'subMenu' ? {
        type: 'submenu',
        label: item.label,
        enabled: item.enabled,
        submenu: convertToMenuTemplate(item.subItems)
      } : item.type === 'separator' ? {
        type: 'separator'
      } : item.type === 'checkbox' ? {
        type: 'checkbox',
        label: item.label,
        enabled: item.enabled,
        checked: item.checked
      } : {
        type: 'normal',
        label: item.label,
        enabled: item.enabled
      };
      if (item.id != null) {
        transformed.click = function() {
          return WebInspector.contextMenuItemSelected(item.id);
        };
      }
      return template.push(transformed);
    };
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      _fn(item);
    }
    return template;
  };

  createMenu = function(items, event) {
    var Menu, menu, remote;
    remote = require('remote');
    Menu = remote.require('menu');
    menu = Menu.buildFromTemplate(convertToMenuTemplate(items));
    menu.popup(remote.getCurrentWindow());
    return event.consume(true);
  };

  showFileChooserDialog = function(callback) {
    var dialog, files, remote;
    remote = require('remote');
    dialog = remote.require('dialog');
    files = dialog.showOpenDialog(remote.getCurrentWindow(), null);
    if (files != null) {
      return callback(pathToHtml5FileObject(files[0]));
    }
  };

  pathToHtml5FileObject = function(path) {
    var blob, fs;
    fs = require('fs');
    blob = new Blob([fs.readFileSync(path)]);
    blob.name = path;
    return blob;
  };

}).call(this);

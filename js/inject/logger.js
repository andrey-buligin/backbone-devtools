// Load this file immediately after backbone.debug.js

(function() {

  var instanceType = function(object) {
    if (object instanceof Backbone.Model) return 'Model';
    if (object instanceof Backbone.Collection) return 'Collection';
    if (object instanceof Backbone.View) return 'View';
    if (object instanceof Backbone.Router) return 'Router';
    return '';
  };

  var prettyInstanceName = function(object) {
    var name;
    name = object.constructor.name || instanceType(object);
    if (object.cid) {
      name = "" + name + ":" + object.cid;
    }
    return name;
  };

  var prettyElementName = function(elem) {
    if (!elem) {
      console.warn('[BDT Warning] Incorrect view.el value');
      return elem + '';
    }
    return elem.tagName.toLowerCase() + (elem.id && ("#" + elem.id));
  };

  var BDTLogger = {

    data: {
      'event': [],
      'view': [],
      'instance': [],
      'sync': []
    },

    log: function(type, object, details) {
      this.data[type].push({
        t: Date.now(),
        c1: (type === 'event') || (type === 'sync')
            ? prettyInstanceName(object)
            : object,
        c2: type === 'view'
            ? prettyElementName(details)
            : details
      });
      this.notify(type);
    },

    getData: function(type, fromIndex) {
      if (!fromIndex) return this.data[type];
      return this.data[type].slice(fromIndex);
    },

    notify: function(type) {
      document.dispatchEvent(new CustomEvent('bdt:message', {
        detail: {
          msg: 'new_logs',
          type: type
        }
      }));
    }

  };

  window.Backbone.debug.logger = BDTLogger;

})();

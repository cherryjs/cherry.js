//   cherry.js 0.1.0
//   http://cherryjs.com
//   (c) 2013-2014 Jerry Zou
//   Under the MIT license

((function () {
  var root = this;
  var $C, CherryJs;

  CherryJs = function (func) {
    var result;

    if (typeof(func)==="function") {
      bind();
      result = func();
      unbind();
    }

    return result;
  };

  $C = CherryJs;

  // Export the Cherry.js object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `$C` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = CherryJs;
    }
    exports.$C = exports.CherryJs = CherryJs;
  } else {
    root.$C = root.CherryJs = CherryJs;
  }

  var bindList = {
      object: [ '$clone', '$equal', '$at', '$debug' ],
      array: [ '$clone', '$equal', '$swap', '$intersect', '$unite' ],
      number: [ '$clone', '$equal' ],
      string: [ '$clone', '$equal', '$removeSpace', '$trim' ],
      regexp: [ '$clone', '$equal' ],
      date: [ '$clone', '$equal' ]
    },
    functionContainer = {
      object: {},
      array: {},
      number: {},
      string: {},
      regexp: {},
      date: {}
    };

  var bind = function () {
    for (var i=0; i < bindList.object.length; i++) {
      if (Object.prototype[bindList.object[i]]) {
        functionContainer.object[bindList.object[i]] = Object.prototype[bindList.object[i]];
      }
    }
    for (i=0; i < bindList.array.length; i++) {
      if (Array.prototype[bindList.array[i]]) {
        functionContainer.array[bindList.array[i]] = Array.prototype[bindList.array[i]];
      }
    }
    for (i=0; i < bindList.string.length; i++) {
      if (String.prototype[bindList.string[i]]) {
        functionContainer.string[bindList.string[i]] = String.prototype[bindList.string[i]];
      }
    }
    for (i=0; i < bindList.number.length; i++) {
      if (Number.prototype[bindList.number[i]]) {
        functionContainer.number[bindList.number[i]] = Number.prototype[bindList.number[i]];
      }
    }
    for (i=0; i < bindList.number.length; i++) {
      if (Date.prototype[bindList.date[i]]) {
        functionContainer.date[bindList.date[i]] = Date.prototype[bindList.date[i]];
      }
    }
    for (i=0; i < bindList.regexp.length; i++) {
      if (RegExp.prototype[bindList.regexp[i]]) {
        functionContainer.regexp[bindList.regexp[i]] = RegExp.prototype[bindList.regexp[i]];
      }
    }

    /*=====================================*
     * Object.prototype *
     *=====================================*/

    Object.defineProperties(Object.prototype, {
      "$clone": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function (objectStack) {
          var Constructor = this.constructor;
          var obj = new Constructor();
          objectStack = objectStack || [];
          objectStack.push(this);
  
          for (var attr in this) {
            if (this.hasOwnProperty(attr)) {
              if (typeof(this[attr]) !== "function") {
                if (this[attr] === null) {
                  obj[attr] = null;
                }
                else {
                  if (objectStack.indexOf(this[attr]) > 0) {
                    throw 'Cyclic Object';
                  }
                  obj[attr] = this[attr].$clone(objectStack);
                }
              }
            }
          }
          return obj;
        }
      },

      "$equal": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function (obj) {
          for (var attr in this) {
            if (this.hasOwnProperty(attr) && obj.hasOwnProperty(attr)) {
              if (typeof(this[attr]) !== "function") {
                if (typeof(this[attr]) === "object") {
                  if (this[attr] === null && obj[attr] === null) { }
                  else {
                    if ((this[attr] !== null && obj[attr] === null)|| (this[attr] === null && obj[attr] !== null)){ 
                      return false; 
                    }
                    else {
                      if (!this[attr].$equal(obj[attr])) {
                        return false;
                      }
                    }
                  }
                } else {
                  if (this[attr] !== obj[attr]) {
                    return false;
                  }
                }
              }
            }
            else {
              if (typeof(this[attr]) !== "function") {
                return false;
              }
            }
          }
          return true;
        }
      },

      "$at": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function (arr) {
          if (Object.prototype.toString.call(arr) === '[object Array]') {
            for (var i=0; i<arr.length; i++) {
              if (arr[i] === this.valueOf()) {
                return true;
              }
            }
          }
          else {
            console.log('Error 1001: the argument of Object.at() is not an array.');
          }
          return false;
        }
      },

      "$debug": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function (message) {
          console.log("Debug Message: " + message + ', Value: ' + this.valueOf());
          return this;
        }
      }
    });

    /*=====================================*
     * Array.prototype *
     *=====================================*/

    Object.defineProperties(Array.prototype, {
      "$clone": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function (objectStack) {
          var thisArr = this.valueOf();
          var newArr = [];
          for (var i=0; i<thisArr.length; i++) {
            newArr.push(thisArr[i].$clone(objectStack));
          }
          return newArr;
        }
      },

      "$equal": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function (arr) {
          var me = this.valueOf();
          if (me.length !== arr.length) {
            return false;
          }
          for (var i=0; i<me.length; i++) {
            if (me[i] !== undefined && arr[i] === undefined) {
              return false;
            } else if (me[i] === undefined && arr[i] !== undefined) {
              return false;
            } else if (me[i] !== undefined && arr[i] !== undefined) {
              if (me[i] !== arr[i]) {
                return false;
              }
            }
          }
          return true;
        }
      },

      "$swap": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function (index1, index2) {
          var me = this.valueOf();
          if (index1 === index2) {
            return this;
          }
          if (index1 < 0 || index1 >= me.length) {
            console.log('Error 2001: the argument index1 of Array.swap(index1, index2) is out of range.');
            return this;
          }
          if (index2 < 0 || index2 >= me.length) {
            console.log('Error 2002: the argument index2 of Array.swap(index1, index2) is out of range.');
            return this;
          }
          var tmp = me[index1];
          me[index1] = me[index2];
          me[index2] = tmp;
          return this;
        }
      },

      "$intersect": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function (arr) {
          var me = this.valueOf();
          var result = [];
          for (var i = 0; i < me.length; i++) {
            if (me[i].$at(arr) && !me[i].$at(result)) {
              result.push(me[i]);
            }
          }
          return result;
        }
      },

      "$unite": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function (arr) {
          var me = this.valueOf();
          var result = [];
          if (!arr) {
            return me;
          }
          for (var i = 0; i < me.length; i++) {
            if (!me[i].$at(result)) {
              result.push(me[i]);
            }
          }
          for (i = 0; i < arr.length; i++) {
            if (!arr[i].$at(result)) {
              result.push(arr[i]);
            }
          }
          return result;
        }
      }
    });

    /*=====================================*
     * Number.prototype *
     *=====================================*/

    Object.defineProperties(Number.prototype, {
      "$clone": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function() { return this.valueOf(); }
      },

      "$equal": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function(num) { return this.valueOf() === num; }
      }
    });

    /*=====================================*
     * String.prototype *
     *=====================================*/

    Object.defineProperties(String.prototype, {
      "$clone": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function() { return this.valueOf(); }
      },

      "$equal": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function(str) { return this.valueOf() === str; }
      },

      "$trim": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function(str) { return this.valueOf().replace(/^\s*((\S+.*\S+)|\S)\s*$/, '$1'); }
      },

      "$removeSpace": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function(str) { return this.valueOf().replace(/\s/g, ''); }
      }
    });

    /*=====================================*
     * Date.prototype *
     *=====================================*/

    Object.defineProperties(Date.prototype, {
      "$clone": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function() { return new Date(this.valueOf()); }
      },

      "$equal": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function(date) { return this.valueOf() === date.valueOf(); }
      }
    });

    /*=====================================*
     * RegExp.prototype *
     *=====================================*/

    Object.defineProperties(RegExp.prototype, {
      "$clone": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function() {
          var pattern = this.valueOf();
          var flags = '';
          flags += pattern.global ? 'g' : '';
          flags += pattern.ignoreCase ? 'i' : '';
          flags += pattern.multiline ? 'm' : '';
          return new RegExp(pattern.source, flags);
        }
      },

      "$equal": {
        enumerable: false,
        configurable: false,
        writable: true,
        value: function(regexp) {
          var me = this.valueOf();
          return me.source === regexp.source &&
            me.global === regexp.global &&
            me.ignoreCase === regexp.ignoreCase &&
            me.multiline === regexp.multiline;
        }
      }
    });
  };

  var unbind = function () {
    for (var i=0; i < bindList.object.length; i++) {
      if (functionContainer.object.hasOwnProperty(bindList.object[i])) {
        Object.prototype[bindList.object[i]] = functionContainer.object[bindList.object[i]];
      } else {
        delete Object.prototype[bindList.object[i]];
      }
    }
    for (i=0; i < bindList.array.length; i++) {
      if (functionContainer.array.hasOwnProperty(bindList.array[i])) {
        Array.prototype[bindList.array[i]] = functionContainer.array[bindList.array[i]];
      } else {
        delete Array.prototype[bindList.array[i]];
      }
    }
    for (i=0; i < bindList.string.length; i++) {
      if (functionContainer.string.hasOwnProperty(bindList.string[i])) {
        String.prototype[bindList.string[i]] = functionContainer.string[bindList.string[i]];
      } else {
        delete String.prototype[bindList.string[i]];
      }
    }
    for (i=0; i < bindList.number.length; i++) {
      if (functionContainer.number.hasOwnProperty(bindList.number[i])) {
        Number.prototype[bindList.number[i]] = functionContainer.number[bindList.number[i]];
      } else {
        delete Number.prototype[bindList.number[i]];
      }
    }
    for (i=0; i < bindList.date.length; i++) {
      if (functionContainer.date.hasOwnProperty(bindList.date[i])) {
        Date.prototype[bindList.date[i]] = functionContainer.date[bindList.date[i]];
      } else {
        delete Date.prototype[bindList.date[i]];
      }
    }
    for (i=0; i < bindList.regexp.length; i++) {
      if (functionContainer.regexp.hasOwnProperty(bindList.regexp[i])) {
        RegExp.prototype[bindList.regexp[i]] = functionContainer.regexp[bindList.regexp[i]];
      } else {
        delete RegExp.prototype[bindList.regexp[i]];
      }
    }
    // empty the functionContainer
    functionContainer = {
      object: {},
      array: {},
      number: {},
      string: {},
      date: {},
      regexp: {}
    };
  };

  CherryJs.bind = bind;
  CherryJs.unbind = unbind;

})());
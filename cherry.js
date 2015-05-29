//   cherry.js 0.2.1
//   http://cherryjs.com
//   (c) 2013-2015 Jerry Zou
//   Under the MIT license

(function () {

    function defineMethods(protoArray, nameToFunc) {
        protoArray.forEach(function(proto) {
            var names = Object.keys(nameToFunc),
                i = 0;

            for (; i < names.length; i++) {
                Object.defineProperty(proto, names[i], {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: nameToFunc[names[i]]
                });
            }
        });
    }

    /*=====================================*
     * Object / Array / Number / Boolean / String / Date / RegExp.prototype
     * - $clone()
     * - $equal(obj)
     * - $isPlainObject()
     * - $isFunction()
     * !! Some Methods will be overridden by methods below. !!
     *=====================================*/

    defineMethods([
        Object.prototype,
        Array.prototype,
        Number.prototype,
        Boolean.prototype,
        String.prototype,
        Date.prototype,
        RegExp.prototype
    ], {
        '$clone': function() { return this.valueOf(); },
        '$equal': function(val) { return this.valueOf() === val; },
        '$isPlainObject': function() { return false; },
        '$isFunction': function() { return false; }
    });

    /*=====================================*
     * Object.prototype
     * - $clone()
     * - $equal(obj)
     * - $isPlainObject()
     * - $isArray()
     * - $in()
     *=====================================*/

    defineMethods([ Object.prototype ], {
        '$clone': function (srcStack, dstStack) {
            var obj = Object.create(Object.getPrototypeOf(this)),
                keys = Object.keys(this),
                index,
                prop;

            srcStack = srcStack || [];
            dstStack = dstStack || [];
            srcStack.push(this);
            dstStack.push(obj);

            for (var i = 0; i < keys.length; i++) {
                prop = this[keys[i]];
                if (prop === null || prop === undefined) {
                    obj[keys[i]] = prop;
                }
                else if (!prop.$isFunction()) {
                    if (prop.$isPlainObject()) {
                        index = srcStack.lastIndexOf(prop);
                        if (index > 0) {
                            obj[keys[i]] = dstStack[index];
                            continue;
                        }
                    }
                    obj[keys[i]] = prop.$clone(srcStack, dstStack);
                }
            }
            return obj;
        },

        '$equal': function (obj, stack) {
            var aKeys, bKeys, i, a, b;

            if (!obj) {
                return false;
            } else if (this === obj) {
                return true;
            }

            aKeys = Object.keys(this);
            bKeys = Object.keys(obj);
            if (!aKeys.$equal(bKeys)) {
                return false;
            }

            stack = stack || [];
            if (this.$in(stack)) {
                throw "MeaninglessEqual: Cannot call $equal on a object which contains a circular structure.";
            }
            stack.push(this);

            for (i = 0; i < aKeys.length; i++) {
                a = this[aKeys[i]];
                b = obj[aKeys[i]];
                if (a === null) {
                    if (b !== null) {
                        return false;
                    }
                } else if (a === undefined) {
                    if (b !== undefined) {
                        return false;
                    }
                } else if (!a.$equal(b, stack)) {
                    return false;
                }
            }
            return true;
        },

        '$in': function (arr) {
            if (arr && arr.$isArray()) {
                return arr.indexOf(this.valueOf()) >= 0;
            }
            throw 'ArgumentFault: Object.prototype.$in need arguments with array type';
        },

        '$isPlainObject': function() { return true; },

        '$isArray': function () { return Array.isArray(this.valueOf()); }
    });

    /*=====================================*
     * Array.prototype
     * - $clone
     * - $equal
     * - $swap
     * - $remove
     * - $intersect
     * - $unite
     *=====================================*/

    defineMethods([ Array.prototype ], {
        '$clone': function (srcStack, dstStack) {
            var thisArr = this.valueOf(),
                newArr = [],
                keys = Object.keys(thisArr),
                index,
                element;

            srcStack = srcStack || [];
            dstStack = dstStack || [];
            srcStack.push(this);
            dstStack.push(newArr);

            for (var i = 0; i < keys.length; i++) {
                element = thisArr[keys[i]];
                if (element === undefined || element === null) {
                    newArr[keys[i]] = element;
                } else if (!element.$isFunction()) {
                    if (element.$isPlainObject()) {
                        index = srcStack.lastIndexOf(element);
                        if (index > 0) {
                            newArr[keys[i]] = dstStack[index];
                            continue;
                        }
                    }
                }
                newArr[keys[i]] = element.$clone(srcStack, dstStack);
            }
            return newArr;
        },

        '$equal': function (arr, stack) {
            var me = this.valueOf();

            if (arr && !arr.$isArray()) {
                return false;
            }
            if (me.length !== arr.length) {
                return false;
            }

            stack = stack || [];
            if (this.$in(stack)) {
                throw "MeaninglessEqual: Cannot call $equal on a object which contains a circular structure.";
            }
            stack.push(this);

            for (var i = 0; i < me.length; i++) {
                if (me[i] === undefined && arr[i] !== undefined) {
                    return false;
                } else if (me[i] !== undefined && !me[i].$equal(arr[i], stack)) {
                    return false;
                }
            }
            return true;
        },

        '$swap': function (index1, index2) {
            var me = this.valueOf();
            if (index1 === index2) {
                return this;
            }
            if (index1 < 0 || index1 >= me.length) {
                console.warn('Warning 21001: the argument index1 of Array.$swap(index1, index2) is out of range.');
                return this;
            }
            if (index2 < 0 || index2 >= me.length) {
                console.warn('Warning 21002: the argument index2 of Array.$swap(index1, index2) is out of range.');
                return this;
            }
            var tmp = me[index1];
            me[index1] = me[index2];
            me[index2] = tmp;
            return this;
        },

        '$remove': function(index) {
            var me = this.valueOf(),
                i;

            if (index >= me.length || index < 0) {
                return this;
            }

            for (i = index; i < me.length - 1; i++) {
                me[i] = me[i+1];
            }

            me.pop();
            return this;
        },

        '$intersect': function() {
            var me = this.valueOf(),
                result = [],
                i, j, arr;

            // duplicate-free
            for (i = 0; i < me.length; i++) {
                if (result.indexOf(me[i]) < 0) {
                    result.push(me[i]);
                }
            }

            for (i = 0; i < arguments.length; i++) {
                arr = arguments[i];
                if (!arr || (arr && !arr.$isArray())) {
                    throw 'ArgumentFault: Array.prototype.$intersect need arguments with array type';
                }

                for (j = 0; j < result.length; j++) {
                    if (arr.indexOf(result[j]) < 0) {
                        result.$remove(j);
                        j--;
                    }
                }

            }

            return result;
        },

        '$unite': function() {
            var me = this.valueOf(),
                result = [],
                i, j, arr;

            // duplicate-free
            for (i = 0; i < me.length; i++) {
                if (result.indexOf(me[i]) < 0) {
                    result.push(me[i]);
                }
            }

            for (i = 0; i < arguments.length; i++) {
                arr = arguments[i];
                if (!arr || (arr && !arr.$isArray())) {
                    throw 'ArgumentFault: Array.prototype.$unite need arguments with array type';
                }

                for (j = 0; j < arr.length; j++) {
                    if (!arr[j].$in(result)) {
                        result.push(arr[j]);
                    }
                }

            }

            return result;
        }
    });

    /*=====================================*
     * String.prototype
     * - $trim()
     * - $removeSpace()
     *=====================================*/

    defineMethods([ String.prototype ], {
        '$trim': function() { return this.valueOf().replace(/^\s*((\S+.*\S+)|\S)\s*$/, '$1'); },
        '$removeSpace': function() { return this.valueOf().replace(/\s/g, ''); }
    });

    /*=====================================*
     * Date.prototype
     * - $clone
     *=====================================*/

    defineMethods([ Date.prototype ], {
        '$clone': function() { return new Date(this.valueOf()); }
    });

    /*=====================================*
     * RegExp.prototype
     * - $clone
     * - $equal
     *=====================================*/

    defineMethods([ RegExp.prototype ], {
        '$clone': function () {
            var pattern = this.valueOf();
            var flags = '';
            flags += pattern.global ? 'g' : '';
            flags += pattern.ignoreCase ? 'i' : '';
            flags += pattern.multiline ? 'm' : '';
            return new RegExp(pattern.source, flags);
        },
        '$equal': function (regexp) {
            var me = this.valueOf();
            return me.source === regexp.source &&
                me.global === regexp.global &&
                me.ignoreCase === regexp.ignoreCase &&
                me.multiline === regexp.multiline;
        }
    });

    /*=====================================*
     * Function.prototype
     * - $isFunction()
     * - $equal(obj)
     *=====================================*/

    defineMethods([ Function.prototype ], {
        '$isFunction': function() { return true; },
        '$equal': function (obj) {
            if (obj === undefined || obj === null) {
                return false;
            } else if (obj.$isFunction()) {
                return true;
            }
        }
    });

}());
  
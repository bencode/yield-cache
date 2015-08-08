var assert = require('assert');
var co = require('co');


/**
 * Create an instance for cache a group of generator
 *
 * @return  {Object}  cache instance
 */
module.exports = function() {
    var cache = {};

    /**
     * try get item from cache
     *
     * if not found, item will yield from generator
     *
     * @param {String|Number} key   cache key
     * @param {Generator|GeneratorFunction|Function} obj  generator
     * @return {Object}             item
     */
    var gen = function*(key, obj) {
        var item;
        if (key in cache) {
            item = cache[key];
            if (item && isPromise(item)) {
                item = cache[key] = yield item;
            }
            return item;
        }

        assert(obj, 'generator required');

        item = cache[key] = toPromise.call(this, obj);
        item = cache[key] = yield item;
        return item;
    };

    /**
     * remove cache item
     * @param {String|Number} key   cache key
     */
    gen.remove = function(key) {
        delete cache[key];
    };

    return gen;
};


function toPromise(obj) {
    if (isGeneratorFunction(obj) || isGenerator(obj)) {
        return co.call(this, obj);
    }

    if (typeof obj === 'function') {
        obj = obj.call(this);
        if (isPromise(obj)) {
            return obj;
        }
        throw new TypeError('function should return a promise object');
    }

    throw new TypeError('You may only cache generator, ' +
            'but the following object was passed: ' + String(obj));
}


function isPromise(obj) {
    return typeof obj.then === 'function';
}


function isGenerator(obj) {
    return typeof obj.next === 'function' &&
            typeof obj.throw === 'function';
}


function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    if (!constructor) {
        return false;
    }
    if (constructor.name === 'GeneratorFunction' ||
            constructor.displayName === 'GeneratorFunction') {
        return true;
    }
    return isGenerator(constructor.prototype);
}

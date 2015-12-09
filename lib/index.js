'use strict';


const assert = require('assert');
const co = require('co');


/**
 * Create an instance for cache a group of generator
 *
 * @return  {Object} - cache instance
 */
module.exports = function() {
  const cache = new Map();

  /**
   * try get item from cache
   *
   * if not found, item will yield from generator
   *
   * @param {String|Number} key                         - cache key
   * @param {Generator|GeneratorFunction|Function} obj  - generator
   * @return {Object}                                   - item
   */
  const gen = function* (key, obj) {
    if (cache.has(key)) {
      let item = cache.get(key);
      if (isPromise(item)) {
        item = yield item;
        cache.set(key, item);
      }
      return item;
    }

    assert(obj, 'generator required');

    let item = toPromise.call(this, obj);
    cache.set(key, item);
    item.catch(function() {
      cache.remove(key);
    });

    item = yield item;
    cache.set(key, item);
    return item;
  };


  /**
   * remove cache item
   *
   * @param {String|Number} key   - cache key
   */
  gen.remove = function(key) {
    cache.delete(key);
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
  const constructor = obj.constructor;
  if (!constructor) {
    return false;
  }
  if (constructor.name === 'GeneratorFunction' ||
      constructor.displayName === 'GeneratorFunction') {
    return true;
  }
  return isGenerator(constructor.prototype);
}

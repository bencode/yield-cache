'use strict';


const co = require('co');
const yieldCache = require('../');


/* global setTimeout */


describe('yield-cache', function() {
  it('use yield cache', function() {
    return co(function* () {
      const path = 'this is a test path';
      const list = yield [
        readWithCache(path),
        readWithCache(path)
      ];

      list[0].should.equal(list[1]);

      const o3 = yield* readWithCache('123');
      list[0].should.not.equal(o3);
    });
  });


  it('cache with promise', function() {
    return co(function* () {
      const path = 'this is a test path';
      const o1 = yield* readWithPromiseCache(path);
      const o2 = yield* readWithPromiseCache(path);
      o1.should.equal(o2);
    });
  });


  it('cache with generator', function() {
    return co(function* () {
      const cache = yieldCache();
      const gen = function* (path) {
        return { path: path };
      };

      const a = yield* cache('test', gen('hello'));
      const b = yield* cache('test', gen('hello'));
      a.should.equal(b);

      cache.remove('test');
      const c = yield* cache('test', gen('hello'));
      a.should.not.equal(c);
      a.should.eql(c);
    });
  });


  it('type error', function() {
    return co(function* () {
      const cache = yieldCache();
      let o = null;
      try {
        const obj = {};
        obj.constructor = null;
        yield* cache('test', obj);
      } catch (e) {
        o = e;
      }
      o.should.be.instanceof(TypeError);
    });
  });


  it('invalid function', function() {
    return co(function* () {
      const cache = yieldCache();
      let o = null;
      try {
        yield* cache('test', function() {
          return 123;
        });
      } catch (e) {
        o = e;
      }
      o.should.be.instanceof(TypeError);
    });
  });


  it('throw error', function() {
    return co(function* () {
      const cache = yieldCache();
      let times = 0;
      const fn = function() {
        times++;
        return new Promise(function(resolve, reject) {
          reject(new Error('some error'));
        });
      };

      let t1 = null;
      let t2 = null;

      try {
        yield* cache('test', fn);
      } catch (e1) {
        t1 = e1;
        try {
          yield* cache('test', fn);
        } catch (e2) {
          t2 = e2;
        }
      }

      t1.should.be.an.Error();
      t2.should.be.an.Error();
      times.should.be.equal(1);
    });
  });


  it('return null is ok', function() {
    return co(function* () {
      const cache = yieldCache();
      const ret = yield* cache('test', function* () {
        return null;
      });
      const ret2 = yield* cache('test', function* () {});

      (ret === null).should.be.true();
      (ret2 === null).should.be.true();
    });
  });
});


const readCache = yieldCache();
function* readWithCache(path) {
  return yield* readCache(path, function* () {
    return yield read(path);
  });
}


const promiseCache = yieldCache();
function* readWithPromiseCache(path) {
  return yield* promiseCache(path, read);
}


function read(path) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve({ path: path });
    }, 100);
  });
}

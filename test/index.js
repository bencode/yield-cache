var co = require('co');
var yieldCadche = require('../');


/* global setTimeout */


describe('yield-cache', function() {
    it('cache with generator function', function(done) {
        co(function*() {
            var path = 'this is a test path';
            var list = yield [
                readWithCache(path),
                readWithCache(path)
            ];

            list[0].should.equal(list[1]);

            var o3 = yield* readWithCache('123');
            list[0].should.not.equal(o3);
        }).then(done);
    });


    it('cache with promise', function(done) {
        co(function*() {
            var path = 'this is a test path';
            var o1 = yield* readWithPromiseCache(path);
            var o2 = yield* readWithPromiseCache(path);
            o1.should.equal(o2);
        }).then(done);
    });


    it('cache with generator', function(done) {
        co(function*() {
            var cache = yieldCadche();
            var gen = function*(path) {
                return { path: path };
            };  // jshint ignore: line
            var a = yield* cache('test', gen('hello'));
            var b = yield* cache('test', gen('hello'));
            a.should.equal(b);
        }).then(done);
    });


    it('type error', function(done) {
        co(function*() {
            var cache = yieldCadche();
            var o = null;
            try {
                var obj = {};
                obj.constructor = null;
                yield* cache('test', obj);
            } catch (e) {
                o = e;
            }
            o.should.be.instanceof(TypeError);
        }).then(done);
    });


    it('invalid function', function(done) {
        co(function*() {
            var cache = yieldCadche();
            var o = null;
            try {
                yield* cache('test', function() { return 123; });
            } catch (e) {
                o = e;
            }
            o.should.be.instanceof(TypeError);
        }).then(done);
    });
});


var readCache = yieldCadche();
function* readWithCache(path) {
    return yield* readCache(path, function*() {
        return yield read(path);
    });
}


var promiseCache = yieldCadche();
function* readWithPromiseCache(path) {
    return yield* promiseCache(path, function() {
        return read(path);
    });
}


function read(path) {
    return new Promise(function(resolve) {
        setTimeout(function() {
            resolve({ path: path });
        }, 100);
    });
}

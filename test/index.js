var co = require('co');
var yieldCadche = require('../');


/* global setTimeout */


describe('yield-cache', function() {
    it('cache with generator', function(done) {
        co(function*() {
            var path = 'this is a test path';
            var o1 = yield* readWithCache(path);
            var o2 = yield* readWithCache(path);
            o1.should.equal(o2);

            var o3 = yield* readWithCache('123');
            o2.should.not.equal(o3);
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

# yield-cache

Cache utility for yieldable object(Promise, Generator or GeneratorFunction)


## cache(gen|gen*|promise)


```js
var cache = require('yield-cache');


// init
var itemCache = cache(function*() {
    return yield* requestItem();
});


// use
var item = yield* itemCache.get();

var item2 = yield* itemCache.get();

item.should.equal(item2);
```

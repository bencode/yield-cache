# yield-cache


Cache utility for yieldable object(Promise, Generator, GeneratorFunction or thunk)


## Useage

1. create an instance for cache

```js
var cache = yieldCache();
```

2. use cache instance


```js
// it should used in generator function
function* () {
    // call with cackeKey and yieldable object
    var item = yield* cache(cacheKey, promise | generator | generator function | thunk);

}
```


## Example

```js
var yieldCache = require('yield-cache');


// create an instance
var renderCache = yieldCache();


// use
function* getRender(path) {
    var render = yield* renderCache(path, function* () {
        var tpl = yield fs.readFile(path, 'utf-8');
        return compiler.complie(tpl);
    });

    return render;
}


var path = ...
var render = yield* getRender(path);
var render2 = yield* getRender(path);

render.should.equal(render2);
```

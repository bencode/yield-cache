# yield-cache


Cache utility for yieldable object(Promise, Generator, GeneratorFunction)


## Useage

1\. Create an instance for cache

```js
var cache = yieldCache();
```

2\. Use cache instance


```js
// it should used in generator function
function* () {
    // call with cackeKey and yieldable object
    var item = yield* cache(cacheKey, Promise | Generator | GeneratorFunction);

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

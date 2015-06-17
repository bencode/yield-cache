# yield-cache


Cache utility for generator


```shell
$ npm install yield-cache
```


## API

### yieldCache()

create cache instance

### cache(key, obj)

try get item from cache or yeild from obj

### cache(key, false)

remove cache item for key


## Useage

1\. Create an instance for cache a group of generator

```js
var cache = yieldCache();
```

2\. Use cache instance


```js
// it should used in generator function
function* () {
    // call with cackeKey and yieldable object
    var item = yield* cache(cacheKey, Generator or GeneratorFunction or Functin that return Promise);

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

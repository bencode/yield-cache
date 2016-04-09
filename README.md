# yield-cache

[![Build Status](https://travis-ci.org/bencode/yield-cache.svg?branch=master)](https://travis-ci.org/bencode/yield-cache)
[![Coverage Status](https://coveralls.io/repos/bencode/yield-cache/badge.svg)](https://coveralls.io/r/bencode/yield-cache)


Cache utility for generator


plover \ node | 5.x | 4.x | 0.12.x
---           | --- | --- | ----
0.x.x         | √   | √   | √
1.x.x         | √   | √   | X


```shell
$ npm install yield-cache
```


## API

### yieldCache()

create cache instance

```
const cache = yieldCache();
```

### cache(key, obj)

try get item from cache or yeild from obj

### cache.remove(key)

remove cache item for key


## Useage

1\. Create an instance for cache a group of generator

```js
const cache = yieldCache();
```

2\. Use cache instance


```js
// it should used in generator function
function* () {
  // call with cackeKey and yieldable object
  const item = yield* cache(cacheKey, Generator or GeneratorFunction or Functin that return Promise);
}
```


## Example

```js
const yieldCache = require('yield-cache');


// create an instance
const renderCache = yieldCache();


// use
function* getRender(path) {
  const render = yield* renderCache(path, function* () {
    const tpl = yield fs.readFile(path, 'utf-8');
    return compiler.complie(tpl);
  });

  return render;
}


const path = ...
const render = yield* getRender(path);
const render2 = yield* getRender(path);

render.should.equal(render2);
```

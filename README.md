Bodewell Resource
=================
This package exports the Bodewell `Resource` class used by the Bodewell
service and related plugins.

```js
const Resource = require("bodewell-resource");

var toplevel, child1, child2;

toplevel = new Resource(function() {
    return this.resources().reduce((a,b) => a+b, 0);
})

toplevel.other = 42;

child1 = new Resource(function() {return 4;});
child2 = new Resource(function() {return 7;});

toplevel.attach("four", child1);
toplevel.attach("seven", child2);

assert(Number(toplevel) === 11);
assert(Number(toplevel.resource("four")) === 4);
assert(Number(toplevel.resource("seven")) === 4);
assert(Number(toplevel.resource("other")) === 42);
```

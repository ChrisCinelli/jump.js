# Jump.js

[![Jump.js on NPM](https://img.shields.io/npm/v/jump.js.svg?style=flat-square)](https://www.npmjs.com/package/jump.js)

582 bytes gzipped (1.07KB uncompressed)

A small, modern, dependency-free smooth scrolling library.

* [Demo Page](http://callmecavs.github.io/jump.js/) (Click the arrows!)

## Usage

Jump was developed with a modern JavaScript workflow in mind. To use it, it's recommended you have a build system in place that can transpile ES6, and bundle modules. For a minimal boilerplate that fulfills those requirements, check out [outset](https://github.com/callmecavs/outset).

Follow these steps to get started:

1. [Install](#install)
2. [Import](#import)
3. [Call](#call)
4. [Review Options](#options)

### Install

Using NPM, install Jump, and save it to your `package.json` dependencies.

```bash
$ npm install jump.js --save
```

### Import

Import Jump, naming it according to your preference.

```es6
// import Jump

import { jump } from 'jump.js'
```

### Call

Jump exports a _singleton_, so there's no need to create an instance. Just call it, passing a [target](#target).

```es6
// call Jump, passing a target

jump('.target')
```

Note that the singleton can make an infinite number of jumps.

## Options

All options, **except [target](#target)**, are optional, and have sensible defaults. The defaults are shown below:

```es6
jump('.target', {
  duration: 1000,
  offset: 0,
  callback: undefined,
  easing: easeInOutQuad,
  a11y: false
})
```

Explanation of each option follows:

* [target](#target)
* [absolute](#absolute)
* [duration](#duration)
* [offset](#offset)
* [callback](#callback)
* [easing](#easing)
* [a11y](#a11y)

### target

Scroll _from the current position_ by passing a number of pixels when [`absolute`](#absolute) equal to `false` (default).

```es6
// scroll down 100px

jump(100)

// scroll up 100px

jump(-100)
```

Or, scroll _to an element_, by passing either:

* a node, or
* a CSS selector

```es6
// passing a node

const node = document.querySelector('.target')

jump(node)

// passing a CSS selector
// the element referenced by the selector is determined using document.querySelector

jump('.target')
```

### absolute

If `true`, the number passed in `target` is interpreted in absolute terms.

```es6
// Scroll to the very top

jump(0, {absolute : true});
```

### duration

Pass the time the `jump()` takes, in milliseconds.

```es6
jump('.target', {
  duration: 1000
})
```

Or, pass a function that returns the duration of the `jump()` in milliseconds. This function is passed the `jump()` `distance`, in `px`, as a parameter.

```es6
jump('.target', {
  duration: distance => Math.abs(distance)
})
```

### offset

Offset a `jump()`, _only if to an element_, by a number of pixels.

```es6
// stop 10px before the top of the element

jump('.target', {
  offset: -10
})

// stop 10px after the top of the element

jump('.target', {
  offset: 10
})
```

Note that this option is useful for accommodating `position: fixed` elements.

### callback

Pass a function that will be called after the `jump()` has been completed.

```es6
// in both regular and arrow functions, this === window

jump('.target', {
  callback: () => console.log('Jump completed!')
})
```

### easing

Easing function used to transition the `jump()`.

```es6
function step(a,b,c,d) { return b + c }

jump('.target', {
  easing: step; // step function, scroll immediately to the location
})
```

See [easing.js](https://github.com/callmecavs/jump.js/blob/master/src/easing.js) for the definition of `easeInOutQuad`, the default easing function. Credit for this function goes to Robert Penner.

### a11y

If enabled, _and scrolling to an element_:

* add a [`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) to, and
* [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) the element

```es6
jump('.target', {
  a11y: true
})
```

Note that this option is disabled by default because it has _visual implications_ in many browsers. Focusing an element triggers the `:focus` CSS state selector, and is often accompanied by an `outline`.


## Control during scrolling 

### cancel scrolling

A way to cancel the scrolling.

```es6
var cancel = jump('.target', {
  container: '.scrollable-div'
})

setTimeout(function(){
  cancel();
}, 500;)

```

### is it scrolling?

A way to know if it is currently scrolling.

```es6
// import Jump

import { jump, isJumping } from 'jump.js'

jump('.target', {
  offset: -10
})

setInterval(function(){
  if (isJumping()) console.log('It is scrolling!');
}, 50);

```

## More than one instance

If you need to scroll more than one thing at the time
```es6
// import Jump

import { Jump } from 'jump.js'

j1 = Jump();
j2 = Jump();

var cancel1 = j1.jump('.target', {
  container: '.container1'
  duration: 2000
})

var cancel2 = j2.jump('.target2', {
  container: '.container2'
  duration: 500
})


setInterval(function(){
  if (j1.isJumping()) console.log('J1 is scrolling!');
  if (j2.isJumping()) console.log('J2 is scrolling!');
}, 50);

```


## Browser Support

Jump depends on the following browser APIs:

* [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

Consequently, it supports the following natively:

* Chrome 24+
* Firefox 23+
* Safari 6.1+
* Opera 15+
* IE 10+
* iOS Safari 7.1+
* Android Browser 4.4+

To add support for older browsers, consider including polyfills/shims for the APIs listed above. There are no plans to include any in the library, in the interest of file size.

## License

[MIT](https://opensource.org/licenses/MIT). © 2016 Michael Cavalea

[![Built With Love](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

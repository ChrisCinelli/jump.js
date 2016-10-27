(function() {
  function easeInOutQuad (t, b, c, d){
    t /= d / 2
    if(t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }
  
  const Jump = () => {
    // private variable cache
    // no variables are created during a jump, preventing memory leaks

    let element         // element to scroll to                   (node)

    let start           // where scroll starts                    (px)
    let stop            // where scroll stops                     (px)

    let offset          // adjustment from the stop position      (px)
    let easing          // easing function                        (function)
    let a11y            // accessibility support flag             (boolean)

    let distance        // distance of scroll                     (px)
    let duration        // scroll duration                        (ms)

    let timeStart       // time scroll started                    (ms)
    let timeElapsed     // time spent scrolling thus far          (ms)

    let next            // next scroll position                   (px)

    let callback        // to call when done scrolling            (function)

    let requestID       // requestAnimationFrame id               (number)
    
    let container

    // scroll position helper

    function location() {
      return window.scrollY || window.pageYOffset
    }

    // scrollTo

    function scrollTo(y) {
      if (container) {
        container.scrollTop = y
      } else {
        window.scrollTo(0, y)
      }
    }

    // element offset helper

    function top(element) {
      return element.getBoundingClientRect().top
    }

    // rAF loop helper

    function loop(timeCurrent) {
      // store time scroll started, if not started already
      if(!timeStart) {
        timeStart = timeCurrent
      }

      // determine time spent scrolling so far
      timeElapsed = timeCurrent - timeStart

      // calculate next scroll position
      next = easing(timeElapsed, start, distance, duration)

      // scroll to it
      scrollTo(next)

      // check progress
      if (timeElapsed < duration) {
        // continue scroll loop
        requestID = requestAnimationFrame(loop)
      } else {
        // scrolling is done
        done();
      }
    }

    // scroll finished helper

    function done() {
      // account for rAF time rounding inaccuracies
      scrollTo(start + distance)

      // if scrolling to an element, and accessibility is enabled
      if(element && a11y) {
        // add tabindex indicating programmatic focus
        element.setAttribute('tabindex', '-1')

        // focus the element
        element.focus()
      }

      // if it exists, fire the callback
      if(typeof callback === 'function') {
        callback()
      }

      // reset time for next jump
      timeStart = false
    }

    // cancels the requestAnimationFrame

    function cancel() {
      timeStart = false;

      cancelAnimationFrame(requestID);
    }

    // indicates whether jumper is executing

    function isJumping() {
      return !!timeStart;
    }

    // API

    function jump(target, options = {}) {
      // resolve options, or use defaults
      duration = options.duration || 1000
      offset   = options.offset   || 0
      callback = options.callback                       // "undefined" is a suitable default, and won't be called
      easing   = options.easing   || easeInOutQuad
      a11y     = options.a11y     || false
      container = options.container
      
      // if it is not a string it assume that the contaienr is a DOM element
      if (container && typeof container === 'string') {
        container = document.querySelector(container)
      }

      // cache starting position
      stop = start = container ? container.scrollTop : location()

      // resolve target
      switch(typeof target) {
        // scroll from current position
        case 'number':
          element = undefined           // no element to scroll to
          a11y    = false               // make sure accessibility is off
          stop    += target
        break

        // scroll to element (node)
        // bounding rect is relative to the viewport
        case 'object':
          element = target
          stop    += top(element)
        break

        // scroll to element (selector)
        // bounding rect is relative to the viewport
        case 'string':
          element = document.querySelector(target)
          stop    += top(element)
        break
      }

      // resolve scroll distance, accounting for offset
      distance = stop - start + offset

      // resolve duration
      switch(typeof options.duration) {
        // number in ms
        case 'number':
          duration = options.duration
        break

        // function passed the distance of the scroll
        case 'function':
          duration = options.duration(distance)
        break
      }

      // start the loop
      requestID = requestAnimationFrame(loop)

      return cancel
    }

    // expose only the jump method
    return {
      jump,
      cancel,
      isJumping,
    };
  }

  module.exports = Jump()
  module.exports.Jump = Jump;
})();

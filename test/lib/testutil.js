var assert = require('assert');

exports.refreshThen =
function refreshThen(page, callback) {
  page.reload(function(err) {
    assert.ifError(err);
    // Wait a little time before interacting with the page after a refresh.
    setTimeout(callback, 100);
  });
}

// asyncTest does a single async test using a headless webkit.
//
// In these tests, there is the testing process driving the tests
// and checking assertions, and there is the headless webkit process
// running the website being tested. This function performs a
// three-step dance that is used in many of the tests.
//
// 1. (in webkit) it runs an "action" script once in the browser.
//    This is typically a simulation of a user action like clicking
//    on a button.
// 2. (in webkit) it waits for some condition to be satisfied in the
//    browser by polling a "predicate" script in the browser
//    repeatedly.  If the predicate returns without a value,
//    it is not yet done and it needs to be polled again.
//    When the predicate returns a value (usually a JSON tuple),
//    it is done.
// 3. (back in the test process) the results of the predicate or
//    error (if there was one) are passed to a callback in the
//    main testing process.  The callback can do the test validation.
//
// Parameters:
//
// page the node-phantom page object being tested.
//   The action and predicate will be evaluated within this page.
// timeout is the amount of time, in milliseconds, that are allowed
//   after which the test can fail.
// params is an optional array of values to be marshalled from the
//   test process to the browser.  These will be given as arguments
//   to both the action and predicate functions.
// action is a function to execute once within the browser.
//   Note that although action is written as as a function in the
//   test process, it is actually not run in the test process: it is
//   just serialized as a source code string to be evaled within the
//   browser.  Therefore nonlocal variables such as globals or
//   calls to functions within the test process will not work.
// predicate a function to execute repeatedly within the browser.
//   Again this is run in the browser to the same rules apply.
//   If the predicate returns without a value, or with a value that
//   has a non-false property "poll", it will be called again
//   unless the timeout has elapsed.  If the predicate returns with
//   a value, the polling will stop and the value will be passed
//   to the callback.
// callback is called when the predicate is satisfied or when
//   an error occurs.  It is passed (err, result) where err is
//   non-null if there was an error, and result is the result
//   of the predicate if there wasn't.
exports.asyncTest =
function asyncTest(page, timeout, params, action, predicate, callback) {
  var startTime = +(new Date), evalTime = startTime,
      rt_args, ac_args;

  function handletry(err, result) {
    if (err || (result != null && !result.poll)) {
      callback(err, result);
    } else if (evalTime - startTime > timeout) {
      // Note that timeout is measured not from the time
      // of the callback, but the time of the call-in.
      // After a slow callback, we can try one more time.
      throw (new Error('timeout'));
    } else {
      if (result) { console.log(result); }
      setTimeout(retry, 100);
    }
  }
  function retry() {
    evalTime = +(new Date);
    page.evaluate.apply(page, rt_args);
  }
  function handleact(err, result) {
    if (err) {
      callback(err);
    }
    retry();
  }

  rt_args = [ predicate, handletry ];
  ac_args = [ action, handleact ];
  rt_args.push.apply(rt_args, params);
  ac_args.push.apply(ac_args, params);

  if (action) {
    page.evaluate.apply(page, ac_args);
  } else {
    retry();
  }
}


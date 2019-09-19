// export function promisefy(Datastore, methodName) {
//   const method = Datastore.prototype[methodName];
//
//   return function (...args) {
//     const self = this
//
//     return new Promise(function (resolve, reject) {
//       let callback = args[args.length -1]
//       let newArgs = [...args]
//
//       if (typeof callback === 'function') {
//         newArgs = newArgs.slice(0, -1)
//       } else {
//         callback = function () {}
//       }
//
//       method.bind(self)(...newArgs, function (err, res) {
//         callback(err, res)
//         if (err) return reject(err)
//         resolve(res)
//       })
//     })
//   }
// }

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisefy = promisefy;

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

function promisefy(Datastore, methodName) {
  var method = Datastore.prototype[methodName];

  return function() {
    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    var self = this;

    return new Promise(function(resolve, reject) {
      var callback = args[args.length - 1];
      var newArgs = [].concat(args);

      if (typeof callback === "function") {
        newArgs = newArgs.slice(0, -1);
      } else {
        callback = function callback() {};
      }

      method.bind(self).apply(
        undefined,
        _toConsumableArray(newArgs).concat([
          function(err, res) {
            callback(err, res);
            if (err) return reject(err);
            resolve(res);
          }
        ])
      );
    });
  };
}

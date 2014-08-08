angular.module('barrier', [])
  .service('barrier', function($q) {
    this.create = function(n) {
      var args = [];
      var count = 0;
      var deferred = $q.defer();
      var shouldReject = false;

      function tryResolve() {
        if (++count == n) {
          if (shouldReject) {
            deferred.reject(args);
          } else {
            deferred.resolve(args);
          }
          args = [];
          count = 0;
        }
      }

      function tryReject() {
        shouldReject = true;
        if (++count == n) {
          deferred.reject(args);
          args = [];
          count = 0;
        }
      }

      return {
        promise: deferred.promise,
        callback: function() {
          args.push(arguments);
          tryResolve();
        },
        errback: function() {
          args.push(arguments);
          tryReject();
        }
      }
    }
  });

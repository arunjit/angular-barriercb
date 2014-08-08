angular.module('barrier', [])
  .service('barrier', function($q) {
    this.create = function(n) {
      var args = [];
      var count = 0;
      var deferred = $q.defer();
      var shouldReject = false;
      var isCompleted = false;

      function validate() {
        if (isCompleted) {
          throw new Error('barrier reached!')
        }
      }

      function tryResolve() {
        if (++count == n) {
          if (shouldReject) {
            deferred.reject(args);
          } else {
            deferred.resolve(args);
          }
          isCompleted = true;
        }
      }

      function tryReject() {
        shouldReject = true;
        if (++count == n) {
          deferred.reject(args);
          isCompleted = true;
        }
      }

      return {
        promise: deferred.promise,
        callback: function() {
          validate();  // TODO: validation should happen when a callback is added.
          args.push(arguments);
          tryResolve();
        },
        errback: function() {
          validate();
          args.push(arguments);
          tryReject();
        }
      }
    }
  });

angular.module('barrier', [])
  .service('barrier', function($q) {
    this.create = function(n) {
      var args = [];
      var count = 0;
      var cbCount = 0;
      var ebCount = 0;
      var deferred = $q.defer();
      var shouldReject = false;

      function validate() {
        if (cbCount > n || ebCount > n) {
          throw new Error('barrier reached! ' + cbCount + '/' + n);
        }
      }

      function tryResolve() {
        if (++count >= n) {
          (shouldReject ? deferred.reject : deferred.resolve)(args);
        }
      }

      function tryReject() {
        shouldReject = true;
        if (++count >= n) {
          deferred.reject(args);
        }
      }

      return {
        promise: deferred.promise,
        getCallback: function() {
          cbCount++;
          validate();
          return function() {
            args.push(arguments);
            tryResolve();
          }
        },
        getErrback: function() {
          ebCount++;
          validate();
          return function() {
            args.push(arguments);
            tryReject();
          }
        }
      }
    }
  });

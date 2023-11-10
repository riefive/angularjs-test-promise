namespace App 
{
    let ng = angular.module('AppTest');

    export class GreetingService 
    {
        static $inject = ['$q'];

        constructor(
            private q: angular.IQService
        )
        {
        }

        public ToGreet(name: string) {
            let deferred = this.q.defer();
            setTimeout(() => {
              deferred.notify('About to greet ' + name + '.');
              if (!['fake', 'not'].includes(name)) {
                deferred.resolve('Hello, ' + name + '!');
              } else {
                deferred.reject('Greeting ' + name + ' is not allowed.');
              }
            }, 1000);
            return deferred.promise;
        }
    }

    ng.service('GreetingService', GreetingService);
}

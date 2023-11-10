namespace App 
{
    let ng = angular.module('AppTest');

    export class GreetingService 
    {
        static $inject = ['$q', '$http'];

        constructor(
            private q: angular.IQService,
            private http: angular.IHttpService
        )
        {
        }

        public toGreet(name: string) {
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

        public toGetProduct()
        {
          let deferred = this.q.defer();
          this.http.get('https://api.escuelajs.co/api/v1/products?offset=0&limit=10')
            .then((data) => {
              deferred.resolve(data);
            })
            .catch(() => {
              deferred.reject();
            });
          return deferred.promise;
        }
    }

    ng.service('GreetingService', GreetingService);
}

namespace App
{
    let ng = angular.module('AppTest');

    export class GreetingController implements angular.IOnInit
    {
        static $inject = ['$scope', 'GreetingService'];

        constructor(
            private scope: angular.IScope,
            private greetSrv: GreetingService
        )
        {
        }

        public simulateSuccess()
        {
            this.greetSrv.ToGreet('john doe').then((result) => console.log(result)).catch((error) => console.log(error));
        }

        public simulateReject()
        {
            this.greetSrv.ToGreet('fake').then((result) => console.log(result)).catch((error) => console.log(error));
        }

        $onInit(): void 
        {
            this.simulateSuccess();
            this.simulateReject();
        }
    }

    ng.controller('GreetingController', GreetingController);
}
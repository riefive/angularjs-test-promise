namespace App
{
    let ng = angular.module('AppTest');

    export class GreetingController implements angular.IOnInit
    {
        static $inject = ['$scope', 'GreetingService'];
        public products = []
        public status = 0

        constructor(
            private scope: angular.IScope,
            private greetSrv: GreetingService
        )
        {
        }

        public simulateSuccess()
        {
            return this.greetSrv.toGreet('john doe')
                .then((result) => {
                    console.log(result);
                    return result;
                });
        }

        public simulateReject()
        {
            return this.greetSrv.toGreet('fake')
                .then((result) => {
                    console.log(result);
                    return result;
                })
                .catch((error) => {
                    console.log(error);
                    return error;
                });
        }

        public simulateProduct()
        {
            return this.greetSrv.toGetProduct()
                .then((result: any) => {
                    this.status = result.status;
                    this.products = result.data;
                    return result;
                })
                .catch((error) => {
                    return error;
                });
        }

        $onInit(): void 
        {
            this.simulateSuccess();
            this.simulateReject();
        }
    }

    ng.controller('GreetingController', GreetingController);
}
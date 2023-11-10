import angular = require('angular');

(window.jasmine as any) = jest;
export {};

require('angular');
require('angular-mocks/ngMockE2E');
require('jest');

require('./app');
require('./greeting.service');
require('./greeting.controller');

describe('Testing a Controller that uses a Promise', () => {
    const module = angular.mock.module;
    const inject = angular.mock.inject;
    const spyOn = jest.spyOn;
    let rootScope: angular.IRootScopeService;
    let scope: angular.IScope;
    let ctrl: angular.IControllerService;
    let httpBackend: any;
    let srv: any;
    let el: any;
    let component: App.GreetingController;
    let html = `<div ng-controller='GreetingController as vm'><h2>Test</h2></div>`;

    const doAdd = (a: number, b: number, callback) => {
        callback(a + b);
    };

    beforeEach(() => {
        module('AppTest', 'ngMockE2E');
        inject(
            function(
                $injector: any,
                $rootScope: angular.IRootScopeService,
                $controller: angular.IControllerService,
                $compile: angular.ICompileService,
                GreetingService: App.GreetingService
            ) 
            {
                ctrl = $controller;
                rootScope = $rootScope;
                scope = $rootScope.$new();
                el = angular.element(html);
                $compile(el)(scope);

                srv = GreetingService;
                httpBackend = $injector.get('$httpBackend');

                httpBackend.when('GET', 'https://api.escuelajs.co/api/v1/products?offset=0&limit=10').respond(200, 'content', {
                    status: 200,
                    statusText: 'Ok',
                    data: [
                        { id: 1, title: 'Test', price: 100, description: 'Test' }
                    ]
                });
                // httpBackend.whenGET(/\/*/).passThrough();
            }   
        );
        component = ctrl('GreetingController', { $scope: scope });
    });

    it('Greeting controller should be created', () => {
        expect(component).toBeDefined();
    });

    it('Greeting controller simulate success', (done) => {
        const greetMock = spyOn(srv, 'toGreet');
        const simulateMock = spyOn(component, 'simulateSuccess');
        greetMock.mockImplementation((name) => {
            return Promise.resolve('Hello, ' + name + '!')
        });
        component.simulateSuccess().then((result) => {
            expect(result).toEqual('Hello, john doe!');
            expect(simulateMock).toHaveBeenCalled();
            done();
        });
    });

    it('Greeting controller simulate reject', (done) => {
        const greetMock = spyOn(srv, 'toGreet');
        const simulateMock = spyOn(component, 'simulateReject');
        greetMock.mockImplementation((name) => {
            return Promise.reject('Greeting ' + name + ' is not allowed.')
        });
        component.simulateReject().then((result) => {
            expect(result).toEqual('Greeting fake is not allowed.');
            expect(simulateMock).toHaveBeenCalled();
            done();
        });
    });

    it('Greeting controller simulate product', async () => {
        const simulateMock = spyOn(component, 'simulateProduct');
        expect(component.status).toBe(0);
        return component.simulateProduct().then((result) => {
            console.log(result);
            expect(component.status).toBe(200);
            expect(simulateMock).toHaveBeenCalled();
            return true;
        });
    }, 5000);
    
    it('should simulate promise',
        inject(function ($injector: any) {
            let $q = $injector.get('$q');
            let deferred = $q.defer();
            let promise = deferred.promise;
            let resolvedValue: any;
            promise.then((value: any) => { resolvedValue = value; });
            expect(resolvedValue).toBeUndefined();
            deferred.resolve(123);
            expect(resolvedValue).toBeUndefined();
            scope.$apply();
            expect(resolvedValue).toEqual(123);
        })
    );

    it('also mock implementation', () => {
        const mock = jest.fn().mockImplementation(() => 'bar');
        expect(mock('foo')).toBe('bar');
        expect(mock).toHaveBeenCalledWith('foo');
    });

    it('mock return value', () => {
        const mock = jest.fn();
        mock.mockReturnValue('bar');
        expect(mock('foo')).toBe('bar');
        expect(mock).toHaveBeenCalledWith('foo');
    });
      
    it('mock promise resolution', () => {
        const mock = jest.fn();
        mock.mockResolvedValue('bar');
        expect(mock('foo')).resolves.toBe('bar');
        expect(mock).toHaveBeenCalledWith('foo');
    });

    it('calls callback with arguments added', () => {
        const mockCallback = jest.fn();
        doAdd(1, 2, mockCallback);
        expect(mockCallback).toHaveBeenCalledWith(3);
    });
});

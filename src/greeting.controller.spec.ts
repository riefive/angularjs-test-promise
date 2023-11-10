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
    let deferred: any;
    let srv: any;
    let el: any;
    let component: App.GreetingController;
    let html = `<div ng-controller='GreetingController as vm'><h2>Test</h2></div>`;

    const doAdd = (a: number, b: number, callback) => {
        callback(a + b);
    };

    beforeEach(() => {
        module('AppTest', 'ngMockE2E')
        inject(
            function(
                $rootScope: angular.IRootScopeService,
                $controller: angular.IControllerService,
                $compile: angular.ICompileService,
                $httpBackend: angular.IHttpBackendService,
                $q: angular.IQService,
            ) 
            {
                $httpBackend.whenGET(/\/*/).passThrough();
                ctrl = $controller;
                rootScope = $rootScope;
                scope = $rootScope.$new();
                el = angular.element(html);
                $compile(el)(scope);
                deferred = $q.defer();
            }
        )
        // spyOn(SearchService, 'getSearch').mockReturnValue(deferred.promise); // Use a Jasmine Spy to return the deferred promise
        component = ctrl('GreetingController', { $scope: scope });
    });

    it('Greeting controller should be created', () => {
        expect(component).toBeDefined();
    });
    
    it('should simulate promise', () => {
        let promise = deferred.promise;
        let resolvedValue: any;
        promise.then((value: any) => { resolvedValue = value; });
        expect(resolvedValue).toBeUndefined();
        deferred.resolve(123);
        expect(resolvedValue).toBeUndefined();
        scope.$apply();
        expect(resolvedValue).toEqual(123);
    });

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

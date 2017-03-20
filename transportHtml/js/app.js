var app = angular
    .module('TransBox',
        ['ui.router', 'fullPage.js', 'angular.morris']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/query');

    $stateProvider
        .state('query', {
            url: '/query',
            templateUrl: 'html/query.html',
            controller: 'QueryController'
        })
        .state('onway', {
            url: '/onway',
            templateUrl: 'html/onway.html',
            controller: 'OnWayController'
        })
        .state('finishDetail', {
            url: '/finishDetail',
            templateUrl: 'html/finish_detail.html',
            controller: 'FinishDetailController'
        })

}]);

app.factory('Config', tsConfig);
function tsConfig() {
    return {
        boxid: '',
        hospitalid: '',
        name: '',

        baseInfo: '' // query基本信息

    }

}

var app = angular
    .module('TransBox',
        ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/create');

    $stateProvider
        .state('create', {
            url: '/create',
            templateUrl: 'create.html',
            controller: 'CreateController'
        })
        .state('createSuccess', {
            url: '/createSuccess',
            templateUrl: 'create_success.html',
            controller: 'CreateSuccessController'
        })

}]);

app.factory('Config', tsConfig);
function tsConfig() {
    return {
        deviceId : '',
        boxid: '',
        hospitalid: '',
        name: '',

        baseInfo: '' // query基本信息

    }

}

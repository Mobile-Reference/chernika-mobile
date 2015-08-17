/**
 * Created by vl on 31.3.15.
 */
(function(angular) {
    'use strict';

    angular.module('app.main', ['app.main.matches', 'app.main.settings', 'app.main.swiper', 'app.main.common', 'app.api'])
        .config(appConfig)
        .run(mainRun);

    appConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function appConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            // setup an abstract state for the tabs directive
            .state('main', {
                url: "/main",
                abstract: true,
                controller: mainController,
                templateUrl: "modules/main/mainLayout.html",
                resolve: {
                    userProfile: userProfileResolve
                }
            })
    }

    mainRun.$inject = ['multiplatformGeolocation'];
    function mainRun(multiplatformGeolocation) {
        multiplatformGeolocation.init();
    }

    userProfileResolve.$inject = ['userApi', '$ionicLoading', '$rootScope'];
    function userProfileResolve(userApi, $ionicLoading, $rootScope) {
        $ionicLoading.show();

        function onCheckedLogIn(loginData) {
            $rootScope.$broadcast('user.login.checked', loginData);
            $ionicLoading.hide();
            return loginData;
        }

        return userApi.checkLoggedIn()
            .then(onCheckedLogIn, onCheckedLogIn);
    }

    mainController.$inject = ['$rootScope', '$scope', '$state', 'userProfile'];
    function mainController($rootScope, $scope, $state, userProfile) {
        $rootScope.userProfile = userProfile;
        $rootScope.platformId = window.cordova ? (window.cordova.platformId == 'android' ? 'android' : 'ios') : 'desktop';
        $scope.tabGo = function (state, params) {
            $state.go(state, params);
        }
    }

})(angular);
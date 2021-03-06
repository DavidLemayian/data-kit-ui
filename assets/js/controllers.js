angular.module('app.controllers', [])

.factory('API', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
         RestangularConfigurer.setBaseUrl('https://sahara-datakit-api.herokuapp.com/');
    });
 }])
  
.controller('appCtrl', function($scope, Restangular, $state, $stateParams) {
    Restangular.all('project').getList().then(function(response){
        $scope.projects = response;
    })

    Restangular.all('person').getList().then(function(response){
        $scope.persons = response;
    })
    
    $scope.quantity = 3;

	$scope.search = function() {
        if ($scope.searchKeyword){ 
            Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
                $scope.results = response;
                $scope.persons = $scope.results.person;
                $scope.projects = $scope.results.project;
                $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
             }, function(error){
                $scope.error = error;
            })
            
            $state.go('results', {query: $scope.searchKeyword})
        }
    }
    $scope.showResult = function(person) {
        Restangular.one('person', person.id).get().then(function(response){
            $scope.entity = response;
            console.log($scope.entity.plain());
            $scope.contracts = response.projects;
            // console.log($scope.contracts)
        })
        $scope.personNode = true;
    }

    $scope.showProject = function(project) {
        Restangular.one('project', project.id).get().then(function(response){
            $scope.entity = response;
            console.log($scope.entity.plain());
            // $scope.contracts = response.projects;
        })
        $scope.projectNode = true;
    }

    $scope.close = function() {
        $scope.personNode = false;
        $scope.projectNode = false;
    }
})

.controller('resultCtrl', function($scope, Restangular, $state, $stateParams) {
	$scope.searchKeyword = $stateParams.query;

    $scope.search = function() {
    	if ($scope.searchKeyword){
            $state.go('results', {query: $scope.searchKeyword})
            $scope.searching = true;
    		Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
                $scope.searching = false;
                if (response.person == '' && response.project == '') {
                    $scope.notFound = true;
                } else {
                    $scope.results = response;
                    $scope.persons = $scope.results.person;
                    $scope.projects = $scope.results.project;
                    $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
                }
             }, function(error){
                $scope.searching = false;
                $scope.error = error;
            });
    	}
    }

    $scope.search();

    $scope.showResult = function(person) {
        Restangular.one('person', person.id).get().then(function(response){
            $scope.entity = response;
            console.log($scope.entity.plain());
            $scope.contracts = response.projects;
            // console.log($scope.contracts)
        })
        $scope.personNode = true;
    }

    $scope.showProject = function(project) {
        Restangular.one('project', project._id).get().then(function(response){
            $scope.entity = response;
            console.log($scope.entity.plain());
            // $scope.contracts = response.projects;
        })
        $scope.projectNode = true;
    }

    $scope.close = function() {
        $scope.personNode = false;
        $scope.projectNode = false;
    }
})
var app = angular.module('ems');
var http_headers = { headers: {'Content-Type': 'application/json'}};

/* This factory service is used for create operation i.e. to create a resource
    
    For example, creating a user.

    'create()' function takes arguments:

    $scope: $scope variable from controller where call took place
    data: http data required to make http request for that resource (username, password, email)
    resourceName: Name of resource which is getting created (users)
*/

app.factory('CreateService', function($http, $rootScope, $localStorage, 
              $mdDialog, ResourceConstants, $state) {
      function create($scope, data, resourceName) {
         $scope.show_prog_bar = true;
         $scope.show_form_elements = false;

         $scope.show_status_msgs = true;
         $scope.show_err_icon = false;
         $scope.show_success_icon = false;
         $scope.status_msg = "Creating " + ResourceConstants[resourceName] + "...";

         $http.post($scope.resourceUrl + "/" + 
                    resourceName + "/", data, http_headers).then(
          function(response) {
             $scope.show_prog_bar = false;
             $rootScope.$emit('scope-operation'); 
             $scope.show_success_icon = true;
             $scope.show_err_icon = false;
             $scope.status_msg = ResourceConstants[resourceName] + " created successfully.";
          },
          function(response) {
            if (response.status == 401 || response.status == 403) {
              delete $localStorage.currentUser;
              $localStorage.error = 'The session expired. Please login again.';
              $mdDialog.cancel();
              $state.go('login'); 
            }else{
               $scope.show_prog_bar = false;
               $scope.show_err_icon = true;
               $scope.show_success_icon = false;
               $scope.status_msg = ResourceConstants[resourceName] + " creation failed due to following \
                                    errors. Please correct listed fileds.";
               $scope.error_messages = response.data;
             }
         });
      }; 

    return {
        create: create
    }
});

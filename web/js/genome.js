/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

;

var app = angular.module('genomePage', []);


app.factory('RestService', ['$http', '$q', function chatServiceFactory($http, $q) {
        return {
            getProfile: function () {

                var url_string = window.location.href;
                var userSplit = url_string.split("?");
                var userID;
                if (userSplit.length > 1) {
                    userID = userSplit[1];
                } else {
                    userID = localStorage.getItem('userID');
                    if (!userID) {
                        var timeout = setInterval(function ()
                        {
                            if (document.getElementById('signInModal')) {
                                clearInterval(timeout);
                                $('#signInModal').modal('show');
                            }
                        }, 1000);
                    }
                }
                console.log(userID);
                if (userID) {
                    return $http.get('GetPeople?userID=' + userID);
                } else {
                    $(".loader").hide();
                    return [];
                }
            }
        };
    }
]);

app.controller('GenomeController', ['RestService', '$scope', '$compile', '$timeout', function (RestService, $scope, $compile, $timeout) {


        RestService.getProfile().then(function (response) {
            if (response) {
                $scope.profile = response.data;

            }
            $(".loader").hide();
        });

        $scope.formatSummary = function (summary) {
            if (summary) {
                return summary.split("\n").join("").split("â?¢").join("\n");
            } else {
                return "";
            }
        };

        $('#HomeMenu').addClass('active');

    }]);

function my_callback(data) {
    console.log('in my callback');
    console.log(data);
}
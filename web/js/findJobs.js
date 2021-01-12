/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('searchJob', []);

var offset = 0;

app.factory('RestService', ['$http', '$q', function chatServiceFactory($http, $q) {
        return {
            getOpportunityAggregators: function () {
                return $http.post('https://search.torre.co/opportunities/_search/?offset=0&size=0&aggregate=true');
            },
            getJobsList: function (filters) {
                var url = "https://search.torre.co/opportunities/_search/?offset=" + offset + "&size=20&aggregate=true";
                return $http.post(url, filters);
            }
        };
    }
]);
app.controller('JobController', ['RestService', '$scope', '$compile', '$timeout', function (RestService, $scope, $compile, $timeout) {
        $scope.resultObtained = false;
        RestService.getOpportunityAggregators().then(function (response) {
            $scope.aggregators = response.data.aggregators;
            $scope.totalResult = response.data.total;
            for (var item in $scope.aggregators.remote) {
                if ($scope.aggregators.remote[item].value.toLowerCase() == "yes") {
                    $scope.remoteJobsCount = $scope.aggregators.remote[item].total;
                    break;
                }
            }
            $(".loader").hide();
        });
        $scope.formatNumber = function (num) {
            return numFormatter(num);
        };
        $scope.formatNumberWithComma = function (num) {
            return numberWithCommas(num);
        };
        $scope.searchPrev = function () {
            offset = $scope.offset - $scope.size;
            $scope.searchJobs();
        };
        $scope.searchNext = function () {
            offset = $scope.offset + $scope.size;
            $scope.searchJobs();
        };
        $scope.searchJobs = function () {
            $(".loader").show();
            var and = [];
            if ($scope.type) {
                and.push(createSearchJson("type", $scope.type));
            }

            if ($scope.skill) {
                and.push(createSearchJson("skill", $scope.skill));
            }
            if ($scope.compensationrange) {
                and.push(createSearchJson("compensationrange", $scope.compensationrange));
            }
            if ($scope.remote) {
                and.push(createSearchJson("remote", $scope.remote));
            }
            if ($scope.name) {
                console.log($scope.name);
                and.push(createSearchJson("name", $scope.name));
            }
            if ($scope.organization) {
                and.push(createSearchJson("organization", $scope.organization));
            }
            if ($scope.status) {
                and.push(createSearchJson("organization", $scope.status));
            }

            $scope.postData = and.length > 1 ? {"and": and} : and[0];

            console.log($scope.postData)
            RestService.getJobsList($scope.postData).then(function (response) {
                $scope.aggregators = response.data.aggregators;
                $scope.totalResult = response.data.total;
                for (var item in $scope.aggregators.remote) {
                    if ($scope.aggregators.remote[item].value.toLowerCase() == "yes") {
                        $scope.remoteJobsCount = $scope.aggregators.remote[item].total;
                        break;
                    }
                }
                $scope.resultObtained = true;
                $scope.searchJobList = response.data.results;
                $scope.offset = response.data.offset;
                $scope.size = response.data.size;
                $scope.totalCount = response.data.total;
                $scope.disableClassOnZeroOffset = ($scope.offset == 0) ? "disabled" : "";
                $(".loader").hide();
                $('body').animate({
                    scrollTop: $('#search-content').offset().top
                }, 500, function () {
                    window.location.href = "#search-content";
                });
            });
        };
        $scope.reset = function () {
            $scope.type = null;
            $scope.skill = null;
            $scope.compensationrange = null;
            $scope.remote = null;
            $scope.name = null;
            $scope.organization = null;
            $scope.status = null;
            $scope.resultObtained = false;
        };
    }]);
function createSearchJson(type, value) {

    switch (type) {
        case "remote":
            return {"remote": {"term": value}};
        case "type":
            return {"type": {"code": value.value}};
        case "status":
            return {"status": {"code": value.value}};
        case "name":
            return {"organization": {"term": value}};
        case "organization":
            return {"organization": {"term": value.value}};
        case "compensationrange":
            var compensation = value.value.split(" ");
            var range = compensation[1].split("-");
            var time = range[1].split("/");
            return {"compensationrange": {
                    "minAmount": range[0],
                    "maxAmount": time[0],
                    "currency": compensation[0],
                    "periodicity": time[1]
                }}
        case "skill":
            return {"skill": {"term": value.value, "experience": "potential-to-develop"}};
    }
}

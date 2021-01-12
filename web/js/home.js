/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('homePage', []);


app.factory('RestService', ['$http', '$q', function chatServiceFactory($http, $q) {
        return {
            getPeopleAggregators: function () {
                return $http.post('https://search.torre.co/people/_search/?offset=0&size=0&aggregate=true');
            },
            getOpportunityAggregators: function () {
                return $http.post('https://search.torre.co/opportunities/_search/?offset=0&size=0&aggregate=true');
            }
        };
    }
]);

app.controller('HomeController', ['RestService', '$scope', '$compile', '$timeout', function (RestService, $scope, $compile, $timeout) {

        RestService.getPeopleAggregators().then(function (response) {
            $scope.peopleAggregate = [];

            var aggregators = response.data.aggregators;
            for (var type in aggregators) {
                var aggregateTitle, typeCount, jobCount = 0;

                for (var item in aggregators[type]) {
                    if (type.toLowerCase() == "remoter") {
                        if (aggregators[type][item].value.toLowerCase() == "yes") {
                            jobCount = aggregators[type][item].total;
                            break;
                        }
                    } else {
                        jobCount += aggregators[type][item].total;
                    }
                }


                switch (type) {
                    case "remoter":
                        aggregateTitle = "Remote jobs";
                        typeCount = "Open to";
                        break;
                    case "compensationrange":
                        aggregateTitle = "Compensation Ranges";
                        typeCount = "Expecting various";
                        break;
                    case "opento":
                        aggregateTitle = "various profiles";
                        typeCount = "Open to";
                        break;
                    case "skill":
                        aggregateTitle = formatCapitalizeAndEndWithS(type);
                        typeCount = numFormatter(aggregators[type].length);
                        break;
                }

                $scope.peopleAggregate.push({aggregate: aggregateTitle, jobCount: numFormatter(jobCount), typeCount: typeCount});
            }
            $(".loader").hide();
        });

        RestService.getOpportunityAggregators().then(function (response) {
            $scope.opportunityAggregate = [];

            var aggregators = response.data.aggregators;
            for (var type in aggregators) {
                if (type.toLowerCase() == "status") {
                    continue;
                }

                var aggregateTitle, typeCount, jobCount = 0;

                for (var item in aggregators[type]) {
                    if (type.toLowerCase() == "remote") {
                        if (aggregators[type][item].value.toLowerCase() == "yes") {
                            jobCount = aggregators[type][item].total;
                            break;
                        }
                    } else {
                        jobCount += aggregators[type][item].total;
                    }
                }

                typeCount = aggregators[type].length > 10 ? numFormatter(aggregators[type].length) : "Various";

                switch (type) {
                    case "remote":
                        aggregateTitle = "Remote jobs";
                        typeCount = "";
                        break;
                    case "compensationrange":
                        aggregateTitle = "Compensation Ranges";
                        break;
                    case "type":
                        aggregateTitle = "Type of Employments";
                        break;
                    case "organization":
                    case "skill":
                        aggregateTitle = formatCapitalizeAndEndWithS(type);
                        break;
                }

                $scope.opportunityAggregate.push({aggregate: aggregateTitle, jobCount: numFormatter(jobCount), typeCount: typeCount});
            }
            $(".loader").hide();
        });

        $('#HomeMenu').addClass('active');

    }]);

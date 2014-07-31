'use strict';

/* Controllers */

var monadexControllers = angular.module('monadexApp.controllers', []);

monadexControllers.controller('MonadexTshirtLanding', [
    function() {}
]);

monadexControllers.controller('MonadexTshirtDesigner', ['$scope',
    function($scope) {
        // base cost for tshirt
        $scope.baseCost = 50;
        $scope.currentTshirtType = null;

        $scope.tshirtTypes = [
            { id: 1,
              name: "Short Sleeve Shirts",
              variants:
              [ { name: "Hanes Tagless Tee",
                  description: "Budget friendly",
                  colors: [ {title:"White", style:"background-color:#ffffff;"},
                            {title:"Dark Heather", style:"background-color:#616161;"},
                            {title:"Gray", style:"background-color:#f0f0f0;"},
                            {title:"Salmon", style:"background-color:#eead91;"},
                            {title:"Kiwi", style:"background-color:#8aa140;"},
                          ]
                },
                { name: "Canvas Ringspun Tee",
                  description: "Premium material",
                  colors: [ {title:"Heather Orange", style:"background-color:#fc8d74;"},
                            {title:"Heather Dark Chocolate", style:"background-color:#432d26;"},
                            {title:"Salmon", style:"background-color:#eead91;"}
                          ]
                },
                { name: "American Apparel Crew",
                  description: "Brand name",
                  colors: [ {title:"Avocado", style:"background-color:#aeba5e;"},
                            {title:"Kiwi", style:"background-color:#8aa140;"},
                            {title:"Irish Green", style:"background-color:#1f6522;"}
                          ]
                }
              ]
            },
            { id: 2,
              name: "Long Sleeve Shirts",
              variants:
              [ { name: "Gildan 6.1oz Long Sleeve",
                  description: "Budget friendly",
                  colors: [ {title:"White", style:"background-color:#ffffff;"},
                            {title:"Dark Heather", style:"background-color:#616161;"},
                            {title:"Gray", style:"background-color:#f0f0f0;"}
                          ]
                },
                { name: "Hanes 6.1oz Long Sleeve",
                  description: "Premium material",
                  colors: [ {title:"Heather Orange", style:"background-color:#fc8d74;"},
                            {title:"Heather Dark Chocolate", style:"background-color:#432d26;"},
                            {title:"Salmon", style:"background-color:#eead91;"}
                          ]
                }
              ]
            },
            { id: 3,
              name: "Hoodies",
              variants:
              [ { name: "Gildan 8oz Heavy Blend Hoodie",
                  description: "Basic hoodie",
                  colors: [ {title:"White", style:"background-color:#ffffff;"},
                            {title:"Dark Heather", style:"background-color:#616161;"},
                            {title:"Gray", style:"background-color:#f0f0f0;"}
                          ]
                },
                { name: "Canvas Poly-Cotton Hoodie",
                  description: "Premium blend hoodie",
                  colors: [ {title:"Heather Orange", style:"background-color:#fc8d74;"},
                            {title:"Heather Dark Chocolate", style:"background-color:#432d26;"},
                            {title:"Salmon", style:"background-color:#eead91;"}
                          ]
                }
              ]
            },
            { id: 4,
              name: "Tank tops",
              variants:
              [ { name: "Gildan Unisex Tank",
                  description: "Budget friendly",
                  colors: [ {title:"White", style:"background-color:#ffffff;"},
                            {title:"Dark Heather", style:"background-color:#616161;"},
                            {title:"Gray", style:"background-color:#f0f0f0;"}
                          ]
                },
                { name: "Canvas Ringspun Tank",
                  description: "Premium material",
                  colors: [ {title:"Heather Orange", style:"background-color:#fc8d74;"},
                            {title:"Heather Dark Chocolate", style:"background-color:#432d26;"},
                            {title:"Salmon", style:"background-color:#eead91;"}
                          ]
                },
                { name: "American Apparel Tank",
                  description: "Top of the line",
                  colors: [ {title:"Avocado", style:"background-color:#aeba5e;"},
                            {title:"Kiwi", style:"background-color:#8aa140;"},
                            {title:"Irish Green", style:"background-color:#1f6522;"},
                          ]
                }
              ]
            }
        ];

        $scope.colors = [
        ];

        $scope.images = [
            {src: "img/avatar/avatar-1.jpeg"},
            {src: "img/avatar/avatar-2.png"},
            {src: "img/avatar/avatar-3.png"},
            {src: "img/avatar/avatar-4.png"},
            {src: "img/avatar/avatar-5.png"},
        ];

        $scope.currentFont = {
            name: 'Arial',
            class: 'Arial'
        };

        $scope.fonts = [
            {name: 'Arial', class: 'Arial'},
            {name: 'Helvetica', class: 'Helvetica'},
            {name: 'Myriad Pro', class: 'MyriadPro'},
            {name: 'Delicious', class: 'Delicious'},
            {name: 'Verdana', class: 'Verdana'},
            {name: 'Georgia', class: 'Georgia'},
            {name: 'Courier', class: 'Courier'},
            {name: 'Comic Sans MS', class: 'ComicSansMS'},
            {name: 'Impact', class: 'Impact'},
            {name: 'Monaco', class: 'Monaco'},
            {name: 'Optima', class: 'Optima'},
            {name: 'Hoefler Text', class: 'Hoefler Text'},
            {name: 'Plaster', class: 'Plaster'},
            {name: 'Engagement', class: 'Engagement'},
        ];
    }
]);

monadexControllers.controller('MonadexTshirtCampaign', ['$scope',
    function($scope) {
        $scope.numOfTshirts = 50;
    }
]);

monadexControllers.controller('MonadexTshirtCampaignDetails', ['$scope',
    function($scope) {
        $scope.campaignTitle = "";
        $scope.campaignDescription = "";
    }
]);

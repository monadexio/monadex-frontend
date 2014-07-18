'use strict';

/* Controllers */

var monadexControllers = angular.module('monadexApp.controllers', []);

monadexControllers.controller('MonadexTshirtDesigner', ['$scope',
    function($scope) {
        $scope.currentTshirtType = {
            id: 1,
            name: "Short Sleeve Shirts"
        };

        $scope.tshirtTypes = [
            {id: 1, name: "Short Sleeve Shirts" },
            {id: 2, name: "Long Sleeve Shirts"},
            {id: 3, name: "Hoodies"},
            {id: 4, name: "Tank tops"}
        ];

        $scope.colors = [
            {title:"White", style:"background-color:#ffffff;"},
            {title:"Dark Heather", style:"background-color:#616161;"},
            {title:"Gray", style:"background-color:#f0f0f0;"},
            {title:"Charcoal", style:"background-color:#5b5b5b;"},
            {title:"Black", style:"background-color:#222222;"},
            {title:"Heather Orange", style:"background-color:#fc8d74;"},
            {title:"Heather Dark Chocolate", style:"background-color:#432d26;"},
            {title:"Salmon", style:"background-color:#eead91;"},
            {title:"Chesnut", style:"background-color:#806355;"},
            {title:"Dark Chocolate", style:"background-color:#382d21;"},
            {title:"Citrus Yellow", style:"background-color:#faef93;"},
            {title:"Avocado", style:"background-color:#aeba5e;"},
            {title:"Kiwi", style:"background-color:#8aa140;"},
            {title:"Irish Green", style:"background-color:#1f6522;"},
            {title:"Scrub Green", style:"background-color:#13afa2;"},
            {title:"Teal Ice", style:"background-color:#b8d5d7;"},
            {title:"Heather Sapphire", style:"background-color:#15aeda;"},
            {title:"Sky", style:"background-color:#a5def8;"},
            {title:"Antique Sapphire", style:"background-color:#0f77c0;"},
            {title:"Heather Navy", style:"background-color:#3469b7;"},
            {title:"Cherry Red", style:"background-color:#c50404;"}
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

monadexControllers.controller('MonadexTshirtLanding', ['$scope',
    function($scope) {
    }
]);

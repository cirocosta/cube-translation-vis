angular.module('meuApp', ['cube-trans-vis'])
	.controller('MainCtrl', function ($scope) {
		$scope.onMove = function (e) {
			console.log(e);
		};
	});

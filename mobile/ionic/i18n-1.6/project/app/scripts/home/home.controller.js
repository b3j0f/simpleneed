(function() {
	'use strict';

	angular
		.module('i18n.home')
		.controller('HomeController', HomeController);

	HomeController.$inject = ['$scope', 'menuItems'];

	/* @ngInject */
	function HomeController($scope, menuItems) {
		var vm = angular.extend(this, {
			entries: menuItems,
			lang: ''
		});
		
		$scope.$on('$localeChangeSuccess', function(args, language) {
			vm.lang = language;
		});
	}
})();
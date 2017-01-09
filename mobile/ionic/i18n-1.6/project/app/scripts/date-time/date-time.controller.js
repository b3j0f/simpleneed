(function() {
	'use strict';

	angular
		.module('i18n.date-time')
		.controller('DateTimeController', DateTimeController);

	DateTimeController.$inject = [];

	/* @ngInject */
	function DateTimeController() {
		var vm = angular.extend(this, {
			dateTime: new Date()
		});
	}
})();
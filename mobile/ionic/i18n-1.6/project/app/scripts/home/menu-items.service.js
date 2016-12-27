(function() {
	'use strict';

	angular
		.module('i18n.home')
		.factory('menuItems', menuItems);

	menuItems.$inject = [];

	/* @ngInject */
	function menuItems() {
		var data = [{
			title: 'PLAIN_TEXT',
			path: 'plain-text',
			icon: 'ion-document-text'
		}, {
			title: 'DATE_TIME',
			path: 'date-time',
			icon: 'ion-ios-clock-outline'
		}, {
			title: 'CONTROLS',
			path: 'controls',
			icon: 'ion-android-checkbox-outline'
		}];

		return data;
	}
})();
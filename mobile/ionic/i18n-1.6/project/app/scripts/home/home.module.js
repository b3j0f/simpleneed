(function() {
	'use strict';

	angular
		.module('i18n.home', [
			'ionic',
			'ngCordova',
			'i18n.common'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.home', {
					url: '/home',
					views: {
						'menuContent': {
							templateUrl: 'scripts/home/home.html',
							controller: 'HomeController as vm'
						}
					}
				});
		});
})();
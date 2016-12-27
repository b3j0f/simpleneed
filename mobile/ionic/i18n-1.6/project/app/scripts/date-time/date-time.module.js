(function() {
	'use strict';

	angular
		.module('i18n.date-time', [
			'ionic'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.date-time', {
					url: '/date-time',
					views: {
						'menuContent': {
							templateUrl: 'scripts/date-time/date-time.html',
							controller: 'DateTimeController as vm'
						}
					}
				});

		});

})();
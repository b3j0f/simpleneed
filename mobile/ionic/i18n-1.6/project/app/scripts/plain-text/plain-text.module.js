(function() {
	'use strict';

	angular
		.module('i18n.plain-text', [
			'ionic'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.plain-text', {
					url: '/plain-text',
					views: {
						'menuContent': {
							templateUrl: 'scripts/plain-text/plain-text.html'
						}
					}
				});
		});
})();
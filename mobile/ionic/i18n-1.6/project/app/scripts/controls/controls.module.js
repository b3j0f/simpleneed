(function() {
	'use strict';

	angular
		.module('i18n.controls', [
			'ionic'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('app.controls', {
					url: '/controls',
					views: {
						'menuContent': {
							templateUrl: 'scripts/controls/controls.html'
						}
					}
				});
		});
})();

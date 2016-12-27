// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'i18n' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('i18n', [
	'ionic',
	'config',
	'i18n.common',
	'i18n.infrastructure',
	'i18n.plain-text',
	'i18n.home',
	'i18n.menu',
	'i18n.controls',
	'i18n.date-time',
	'ngCordova',
	'tmh.dynamicLocale',
	'pascalprecht.translate'
])

	.value('_', window._)

	.constant('availableLanguages', ['en-US', 'ru-RU', 'el-GR'])
	.constant('defaultLanguage', 'en-US')

	.run(function (
		$ionicPlatform, tmhDynamicLocale, $translate, $cordovaGlobalization,
		availableLanguages, $rootScope, defaultLanguage, $locale) {

		function applyLanguage(language) {
			tmhDynamicLocale.set(language.toLowerCase());
		}

		function getSuitableLanguage(language) {
			for (var index = 0; index < availableLanguages.length; index++) {
				if (availableLanguages[index].toLowerCase() === language.toLocaleLowerCase()) {
					return availableLanguages[index];
				}
			}
			return defaultLanguage;
		}

		function setLanguage() {
			if (typeof navigator.globalization !== "undefined") {
				$cordovaGlobalization.getPreferredLanguage().then(function (result) {
					var language = getSuitableLanguage(result.value);
					applyLanguage(language);
					$translate.use(language);
				});
			} else {
				applyLanguage(defaultLanguage);
			}
		}

		$ionicPlatform.ready(function () {
			// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
			// for form inputs)
			setLanguage();

			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				// org.apache.cordova.statusbar required
				StatusBar.styleDefault();
			}
		});
	})

	.config(function (tmhDynamicLocaleProvider, $translateProvider, defaultLanguage) {
		tmhDynamicLocaleProvider.localeLocationPattern('locales/angular-locale_{{locale}}.js');
		$translateProvider.useStaticFilesLoader({
			'prefix': 'i18n/',
			'suffix': '.json'
		});
		$translateProvider.preferredLanguage(defaultLanguage);
	})

	.config(function ($urlRouterProvider) {
		// if none of the above states are matched, use this as the fallback
		$urlRouterProvider.otherwise('/app/home');
	});

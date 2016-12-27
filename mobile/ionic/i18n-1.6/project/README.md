# i18n Ionic
i18n Ionic is a full working example of an Internationalized Ionic application.

## Dependecies, Run and Build
### Install NodeJS dependencies

Run `npm install` to install all needed dependencies.

### Install Plugins and Javascript dependencies
#### Linux/MacOX
Run `./install.sh` to install all needed plugins and dependencies

#### Windows Users
Similarly, Windows users should run `install.bat`.

### Run the app
Use `grunt serve -l` to run the app in browser and watch for changes in code

or

use `grunt serve` to just run the app for a browser preview

or

use `grunt serve --lab` to run the app in a browser on two platforms at the same time.

### Add a platform

```bash
$ grunt platform:add:<platform>
```

Supported Cordova platforms:

```bash
$ grunt platform:add:ios
$ grunt platform:add:android
```

### Build the app

```bash
$ grunt build
```

### Emulate the app on simulator
iOS:

```bash
$ grunt emulate:ios
```

Android:

```bash
$ grunt emulate:android
```

For more information, see [Ionic Framework Generator's instructions](https://github.com/diegonetto/generator-ionic).

### Angular localization files

Localization files can be found in [Angular's directory](https://code.angularjs.org/1.3.6/i18n/). Any downloaded locale should be included in the `app/locales` folder.

### Plugins installation

Use the following commands and install all the plugins required by the app:
```bash
$ cordova plugin add {plugin name or url}
```

eg:

```bash
cordova plugin add cordova-plugin-inappbrowser
```

#### Used Cordova plugins
In case that the required Cordova plugins are not installed while installing NodeJS dependencies, Cordova's command mentioned previously can be used to install the following plugins:

* **cordova-plugin-device** - This plugin defines a global device object, which describes the device's hardware and software.
* **cordova-plugin-console** - This plugin is meant to ensure that console.log() is as useful as it can be. It adds additional function for iOS, Ubuntu, Windows Phone 8, and Windows.
* **ionic-plugin-keyboard** - It provides functions to make interacting with the keyboard easier, and fires events to indicate that the keyboard will hide/show.
* **cordova-plugin-whitelist** - This plugin implements a whitelist policy for navigating the application webview on Cordova 4.0
* **cordova-plugin-globalization** - It obtains information and performs operations specific to the user's locale and timezone.
* **cordova-plugin-transport-security** - Cordova / PhoneGap Plugin to allow 'Arbitrary Loads' by adding a declaration to the Info.plist file to bypass the iOS 9 App Transport Security

## Demo
Install [Ionic View](http://view.ionic.io/) and preview the app on your mobile device using the following Ionic View ID: `298e193c`

## Documentation
* [i18n Ionic Quick Start Guide](https://docs.google.com/document/d/1o_88Rk-u-dOtqcHsITNl3sOTPFliLP4AsVYGQf-m3F8/edit?usp=sharing)


## Changelog
```
1.6 - May 05, 2016
- Ionic update to v1.3.0
- Fix of the ionic keyboard plugin id

1.5 - February 10, 2016
- Ionic update to v1.2.4 as Ionic 1.2 uses native scrolling by default.
- Ionic CLI update to v1.7.13
- Addition of task in Gruntfile to minify and obfuscate CSS, HTML and Javascript files

1.4 - December 16, 2015
- Ionic update to v1.1.1
- Cordova CLI update to v5.4.1
- Ionic CLI update to v1.7.12
- ngCordova update to v0.1.23-alpha
- Support of android versions back to 4.0
- Plugins update
- Copy of package file to be used as a replacement when needed
- Improved installation process for Win/Linux/MacOS
- README.md update with improved instructions on how to install, run, build the app.

1.3 - November 5, 2015
- README.md update with improved instructions on how to install, run, build the app

1.2 - October 19, 2015
- Ionic CLI update to v1.7.6
- Add dependency to Transport Security plugin which enables/allows the HTTP requests for iOS9 and above
- Fix bouncing of the webview

1.1 - October 14, 2015
- ngCordova update to v1.1.18
- Utilization of ng-cordova-auth v0.1.4
- Ionic update to v1.1.0
- Cordova CLI update to v5.3.3
- Ionic CLI update to v1.6.4

1.0 - August 3, 2015
- Initial release
```
## Credits

* [Yeoman](http://yeoman.io/)
* [Yeoman's Ionic Framework generator](https://github.com/diegonetto/generator-ionic)

# Third Party Licences
* [Apache License](http://www.apache.org/licenses/)
* [MIT License](https://opensource.org/licenses/MIT)

import { Component } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

import {CallNumber} from 'ionic-native';

@Component({
    selector: 'page-emergency',
    templateUrl: 'emergency.html'
})
export class EmergencyPage {

    constructor(public navCtrl: NavController, public ctl: ToastController) {

    }

    call() {
        CallNumber.callNumber('112', true)
            .then(() => console.log('Launched dialer!'))
            .catch((error) => console.error('Error launching dialer: ' + error));
    }

}

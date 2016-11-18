import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {CallNumber} from 'ionic-native';

@Component({
    selector: 'page-emergency',
    templateUrl: 'emergency.html'
})
export class EmergencyPage {

    constructor(public navCtrl: NavController) {

    }

    call() {
        CallNumber.callNumber('112', true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.error('Error launching dialer'));
    }

}

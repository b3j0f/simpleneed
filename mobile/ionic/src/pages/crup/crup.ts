import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-crup',
    templateUrl: 'crup.html'
})
export class CRUPPage {

    parent: any;

    // default parmas
    params: any = {
        kind: 'needlocation',
        mood: 2,
        people: 1,
        comment: '',
        enddatetime: new Date(new Date().getTime() + 8 * 3600 * 1000),
        coordinate: [0, 0]
    };

    kind: string = "needlocation";

    coordinate: any = [0, 0];

    // need location properties
    mood: number = 2;
    people: number = 1;
    money: boolean = false;
    snack: boolean = false;
    food: boolean = false;
    clothes: boolean = false;
    company: boolean = false;
    hygiene: boolean = false;
    accomodation: boolean = false;
    accessories: boolean = false;
    health: boolean = false;
    comment: string = '';

    // roam properties
    name: string = '';
    description: string = '';

    // both properties
    duration: number = 4;

    constructor(public navCtrl: NavController, navParams: NavParams) {
        this.parent = navParams.get('parent');
        let params = navParams.get('params');
        let coordinate = navParams.get('coordinate');
        this.setparams(params);
    }

    save() {
        let params = this.getparams();
        this.parent.save(params);
        this.navCtrl.pop();
    }

    setparams(params) {
        if (params == undefined) {
            params = this.params;
        }
        if (params.kind == 'needlocation') {
            for(let need in params.needs) {
                this[need] = true;
            }
            this.people = params.people;
            this.comment = params.comment;
        } else {
            this.name = params.name;
            this.description = params.description;
        }
        this.duration = Math.round(
            Math.abs(
                params.enddatetime.getTime() - new Date().getTime()
            ) / (3600 * 1000)
        );
        this.coordinate = this.params.coordinate;
    }

    getparams() {

        let result;

        if (this.kind === "needlocation") {
            let needs = [];
            let addneed = (need) => {
                if (this[need]) {
                    needs.push(need);
                }
            }
            addneed('money');
            addneed('snack');
            addneed('food');
            addneed('clothes');
            addneed('company');
            addneed('hygiene');
            addneed('accomodation');
            addneed('accessories');
            addneed('health');

            result = {
                mood: this.mood,
                people: this.people,
                needs: needs,
                comment: this.comment
            }
        } else {
            result = {
                name: this.name,
                description: this.description
            }
        }

        result.enddatetime = new Date(
            new Date().getTime() + this.duration * 3600 * 1000
        )
        result.kind = this.kind;

        return result;
    }

}

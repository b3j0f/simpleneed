import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-filter',
    templateUrl: 'filter.html'
})
export class FilterPage {

    parent: any;

    filter: any = {
        kind: 'needlocation',
        mood: 2,
        needs: [],
        description: '',
        enddatetime: new Date(new Date().getTime() + 8 * 3600 * 1000)
    }

    kind: string = 'needlocation';

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

    // roam properties
    name: string = '';

    // both properties
    duration: number = 4;
    description: string = '';

    constructor(public navCtrl: NavController, navParams: NavParams) {
        this.parent = navParams.get('parent');
        let filter = navParams.get('filter');
        this.setfilter(filter);
    }

    setfilter(filter) {
        if (filter == undefined) {
            filter = this.filter;
        }
        if (filter != undefined) {
            if (filter.kind == 'needlocation') {
                for (let need in filter.needs) {
                    this[need] = true;
                }
                this.people = filter.people;
            } else {
                this.name = filter.name;
            }
            this.description = filter.description;
            this.duration = Math.round(
                Math.abs(filter.enddatetime.getTime() - new Date().getTime()) / (3600000)
            );
        }
        console.log(this.duration);
    }

    search() {
        let filter = this.getfilter();
        this.parent.refresh(filter);
        this.navCtrl.pop();
    }

    getfilter() {

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
                needs: needs
            }
        } else {
            result = {
                name: this.name
            }
        }
        result.description = this.description;
        result.enddatetime = new Date(
            new Date().getTime() + this.duration * 3600 * 1000
        )
        result.kind = this.kind;

        return result;
    }

    clickneed(name) {
        console.log(this);
        this[name] = !this[name];
    }

}

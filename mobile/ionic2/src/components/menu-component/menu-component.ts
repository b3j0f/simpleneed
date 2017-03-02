import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';

import { AboutPage } from '../../pages/about/about';
import { ContactPage } from '../../pages/contact/contact';

export interface PageInterface {
	title: string;
	icon: string;
	action: string;
}

@Component({
	selector: 'menu-component',
	templateUrl: 'menu-component.html'
	})
export class MenuComponent {

	// set our app's pages
	appPages: PageInterface[] = [
	{ title: 'Guide', action: 'https://simpleneed.net', icon: 'calendar' },
	{ title: 'About', action: 'openPage(AboutPage)', icon: 'information-circle' },
	{ title: 'Contact', action: 'openPage(ContatPage)', icon: 'contacts' }
	];

	constructor(public menu: MenuController, public nav: NavController) {
	}

	openPage(page: PageInterface) {
    // the nav component was found using @ViewChild(Nav)
    // reset the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario

    this.menu.close();

    this.nav.setRoot(page);
	}

}
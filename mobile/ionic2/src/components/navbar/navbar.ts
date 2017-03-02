import { Component, ViewChild } from '@angular/core';

@Component({
	selector: 'navbar-component',
	templateUrl: 'navbar.html'
})
export class NavBarComponent {

	@ViewChild('navbar') navbar;

}
import { Component } from '@angular/core';
import { gameComponent } from './game.component/game.component';
import { MatDrawerMode } from '@angular/material/sidenav';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../styles.css']
})
export class AppComponent {
  title = 'FE-app';
  sidenavMode : MatDrawerMode = 'side';
  
  constructor(){
    
  }
  toggleSidenav() {
    this.sidenavMode = this.sidenavMode === 'side' ? 'over' : 'side';
  }
}

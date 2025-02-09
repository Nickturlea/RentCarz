import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: false,
  template: '<router-outlet></router-outlet>', 
  styleUrls: ['./app.component.css']
})
export class AppComponent { }

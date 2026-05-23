import { Component, signal } from '@angular/core';
import { ButtonDemo } from './button/button';

@Component({
  selector: 'app-root',
  imports: [ButtonDemo],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('tennis-managment');
}

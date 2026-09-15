import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-base theme-transition">
      <app-navbar />
      <div class="flex flex-col flex-1">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AppComponent {}

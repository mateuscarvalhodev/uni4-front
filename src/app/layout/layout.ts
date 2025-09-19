import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { LoadingBarComponent } from '../shared/ui/loading-bar.component';
import { ToastsComponent } from '../shared/ui/toasts.component';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoadingBarComponent, ToastsComponent],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class LayoutComponent {}

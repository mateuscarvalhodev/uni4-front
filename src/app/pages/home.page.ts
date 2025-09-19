import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="page">
      <h1>UNI4</h1>
      <p>Bem-vindo! Use o menu abaixo para navegar.</p>
      <nav class="nav">
        <a class="btn" routerLink="/users">Usuários</a>
      </nav>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 24px;
        display: grid;
        gap: 16px;
      }
      .nav {
        display: flex;
        gap: 8px;
      }
      .btn {
        padding: 10px 14px;
        border-radius: 8px;
        background: #2a2a2a;
        border: 1px solid #3a3a3a;
        color: #fff;
        text-decoration: none;
      }
    `,
  ],
})
export class HomePage {}

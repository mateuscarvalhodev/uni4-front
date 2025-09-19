import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user';

@Component({
  standalone: true,
  selector: 'app-users-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss'],
})
export class UsersList implements OnInit {
  private svc = inject(UsersService);
  private users = signal<User[]>([]);
  vm = computed(() => this.users());

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.svc.list().subscribe((d) => this.users.set(d));
  }

  remove(id: number) {
    if (confirm('Excluir usuário?')) {
      this.svc.remove(id).subscribe(() => this.reload());
    }
  }
}

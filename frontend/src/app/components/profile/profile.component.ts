import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollsService } from '../../services/polls.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;

  constructor(private pollsService: PollsService, public auth: AuthService) {}

  ngOnInit() {
    this.pollsService.getProfile().subscribe({
      next: (u) => { this.user = u; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}

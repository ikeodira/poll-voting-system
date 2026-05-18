import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PollsService } from '../../services/polls.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  polls: any[] = [];
  loading = true;
  error = '';

  constructor(public auth: AuthService, private pollsService: PollsService) {}

  ngOnInit() {
    this.pollsService.getAll().subscribe({
      next: (polls) => { this.polls = polls; this.loading = false; },
      error: () => { this.error = 'Failed to load polls'; this.loading = false; },
    });
  }
}

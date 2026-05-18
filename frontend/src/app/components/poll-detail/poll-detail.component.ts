import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PollsService } from '../../services/polls.service';

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.css'],
})
export class PollDetailComponent implements OnInit {
  poll: any = null;
  myVote: any = null;
  loading = true;
  voting = false;
  error = '';
  voteError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pollsService: PollsService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.pollsService.getOne(id).subscribe({
      next: (poll) => {
        this.poll = poll;
        this.loading = false;
        this.pollsService.getMyVote(id).subscribe({
          next: (v) => this.myVote = v,
          error: () => {},
        });
      },
      error: () => { this.error = 'Poll not found'; this.loading = false; },
    });
  }

  vote(optionId: string) {
    this.voting = true;
    this.voteError = '';
    this.pollsService.castVote(this.poll.id, optionId).subscribe({
      next: () => this.router.navigate(['/polls', this.poll.id, 'results']),
      error: (err) => {
        this.voteError = err.error?.message || 'Vote failed';
        this.voting = false;
      },
    });
  }

  getVotedOption(): string {
    if (!this.myVote?.option) return '';
    return this.poll.options.find((o: any) => o.id === this.myVote.option.id)?.optionText ?? '';
  }
}

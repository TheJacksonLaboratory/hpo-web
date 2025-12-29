import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-floating-feedback',
  standalone: true,
  imports: [RouterModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './floating-feedback.component.html',
  styleUrls: ['./floating-feedback.component.scss']
})
export class FloatingFeedbackComponent {}

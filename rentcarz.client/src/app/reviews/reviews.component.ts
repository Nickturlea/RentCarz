import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReviewService } from '../services/review.service';
import { AuthService } from '../services/auth.service';
import { Reviews } from '../models/reviews.model';
import { Member } from '../models/member.model';

@Component({
  selector: 'app-reviews',
  standalone: false,
  
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent {
  reviewForm: FormGroup;
  reviews: Reviews[] = []; // Holds the list of reviews
  members: Member[] = []; // Holds the list of members
  errorMessage: string = '';
  userId: string | null = "";
  year: string = "";
  isReviwed: boolean = false;

constructor(private reviewService: ReviewService, private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.reviewForm = this.fb.group({
      rating: [''],
      comment: [''],
    });
    this.year = new Date().toISOString().split('T')[0];
  } 



 ngOnInit(): void {
  this.getUser();
  this.getReviews();
  this.getMemberList();
  this.userReviewed();
}

getUser(): void{
  this.userId = this.authService.getUserId();
}

getReviews(): void{
  this.reviewService.getReviews().subscribe({
    next: (data: any) => this.reviews = data,
    error: (err: any) => this.errorMessage = 'Failed to load reviews. Please try again later: ' + err
  });
}

getMemberList():void{
  console.log("getusers");
  this.reviewService.getUsers().subscribe({
    next: (data: any) => this.members = data,
    error: (err: any) => this.errorMessage = 'Failed to load reviews. Please try again later: ' + err
  });
}

userReviewed():void{
  this.reviewService.hasReviewed(Number(this.userId)).subscribe({
    next: (data: any) => this.isReviwed = data,
    error: (err: any) => this.errorMessage = 'Failed to load reviews. Please try again later: ' + err
  });
}


 onSubmit(){
  var user = Number(this.userId);
  var date = this.year+'T00:00:00';
  var today = new Date(date);

  const reviewData = {
    MemberId : user,
    Rating: Number(this.reviewForm.value.rating),
    Comment: this.reviewForm.value.comment,
    ReviewDate: today
  }

  console.log(reviewData);

  this.reviewService.addReview(reviewData).subscribe({
    next: (response) => {
      console.log('Review successful', response);
      window.location.reload();
    },
    error: (error) => {
      console.error('Review failed', error);
      this.errorMessage = error.error?.message || "Review failed. Please try again.";
    }
  });
 }
}

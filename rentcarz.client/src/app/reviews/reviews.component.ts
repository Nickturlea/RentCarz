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
    var local = new Date().toLocaleString("en-US", {timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit"});
    this.year = new Date(local).toISOString().split('T')[0];
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

deleteReview():void{
  this.reviewService.deleteReview(Number(this.userId)).subscribe({
    next: (response) => {
      console.log('Delete successful', response);
      window.location.reload();
    },
    error: (error) => {
      console.error('Delete failed', error);
      this.errorMessage = error.error?.message || "Delete failed. Please try again.";
    }
  });
}


 onSubmit(){
  var user = Number(this.userId);
  var today = new Date(this.year);

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

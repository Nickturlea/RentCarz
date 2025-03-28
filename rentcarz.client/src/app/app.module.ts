import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GetStartedComponent } from './get-started/get-started.component';
import { SignupComponent } from './signup/signup.component'; 
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { ListingsComponent } from './listings/listings.component';
import { CartComponent } from './cart/cart.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
<<<<<<< HEAD
import { ReviewsComponent } from './reviews/reviews.component';
=======
import { NavbarComponent } from './navbar/navbar.component';
>>>>>>> css

@NgModule({
  declarations: [
    AppComponent,
    GetStartedComponent,
    SignupComponent,
    LoginComponent,
    ListingsComponent,
    CartComponent,
    ReservationComponent,
    AdminPanelComponent,
    AboutComponent,
    ContactComponent,
    AdminLoginComponent,
<<<<<<< HEAD
    ReviewsComponent,
=======
    NavbarComponent,
>>>>>>> css
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

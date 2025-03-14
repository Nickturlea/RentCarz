import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GetStartedComponent } from './get-started/get-started.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ListingsComponent } from './listings/listings.component';
import { CartComponent } from './cart/cart.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

const routes: Routes = [
  { path: '', component: GetStartedComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'listings', component: ListingsComponent },
  { path: 'cart', component: CartComponent},
  { path: 'reservation', component: ReservationComponent},
  { path: 'admin', component: AdminPanelComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

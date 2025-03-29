# RentCarz

This project is a full-featured car rental website that consists of an angular-based frontend backed by a RESTful api using dotnet framework.  The backend has multiple api endpoints that carry out tasks for the frontend.

## Features

Car Listings: Users can browse available cars, including detailed information such as make, model, year, color, price per day, car type, and availability.

Car Reservation: Users can reserve a car for a specific period.

Admin Functionality: Admins can add, update, and delete car listings. They can also manage the availability and details of each car.

Review System: Users can leave reviews, providing valuable feedback to future users.

Authentication: User authentication and role-based access control, where only admins can manage car listings.

## Tech Stack

Frontend: Angular, TypeScript
Backend: C# (ASP.NET Core)

Other Tools: JWT authentication, RESTful API for backend communication

## Instructions
Clone repo.  In CLI, navigate to root folder `RentCarz` and run `npm install` to install required dependencies.  Navigate to RentCarz.client and run `ng serve` to start frontend.  Navigate to rentcarz.server and run `dotnet run` to start backend.

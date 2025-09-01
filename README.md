# RateMyCollegeClub
**Helping students find their perfect college community through honest reviews and ratings.**
*Discover and review college clubs.*
---
## 📑 Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Future Plans](#future-roadmap)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Introduction
RateMyCollegeClub was inspired by *RateMyProfessors* and built to solve a common problem for college students: the overwhelming number of student organizations.
When I first entered college as a freshman CS major, I was encouraged by friends to join nearly every tech or robotics related club. 
Very quickly, I ran into a bunch of scheduling conflicts, and eventual burnout from trying to juggle too many commitments. Frustration crept in when clubs didn’t align with my interests. 
It took me months of trial and error to figure out which organizations were truly worth my time, valuable time could have been spent more meaningfully.

This personal experience of mine highlighted a gap. There simply wasn’t a central, reliable platform for students to discover and evaluate clubs before joining. 
RateMyCollegeClub was created to fill that gap. The main goal is to help students save time, make better decisions, and find the communities that truly fit their interests through
reviews and ratings.

In a nutshell, students can search for clubs by university, browse by category, read and write reviews, bookmark their favorites, and much more.

## Features
Here are some of the most important features of RateMyCollegeClub.

## 🔑 Core Features (student-facing)

🔍 Search – Typeahead search with debounced input to quickly find universities and clubs.

🏷️ Browse by Categories – Filter clubs by type (e.g., cultural, professional, sports, tech).

📝 Club Reviews – Students can write, edit, and delete their own reviews.

👍 Review Voting – Upvote/downvote reviews to highlight the most helpful ones.

❤️ Bookmark Clubs – Save favorite clubs for quick access later.

📄 Request Forms – Students can request new schools/clubs to be added (based on admin approval).

## 🔒 Core Features (admin-facing)

✅ Admin Club & Category Management – Only admins can create, update, or delete clubs and categories.

🛠️ Approve Requests – Admins can approve or reject new club requests submitted by students.

🔐 Role-Based Permissions – Enforced using ASP.NET Identity roles

## 🧩 Supporting Features

🔑 Authentication & Authorization – Secure login/signup powered by Firebase OAuth.

📩 Email Verification – SendGrid integration to verify users during signup.

👤 User Profiles – View your saved clubs, reviews, and club requests in one place.

🗂️ Request Tracking – Check the status of clubs you’ve requested.

📝 Review Management – Quickly view and manage all reviews you’ve left.

⚡ Responsive UI – Built with Next.js, Tailwind, and shadcn/ui for a clean, modern interface.

## 🛠 Tech Stack

## Frontend

Next.js – Framework used for routing and page structure (all pages currently use client-side rendering)

React – Provides the basic UI logic; minimal component-based structure

Tailwind CSS + shadcn/ui – Modern styling and UI components

## Backend

.NET 8.0 (C#) – REST API and business logic

Entity Framework Core – ORM for database access

ASP.NET Identity (with Firebase OAuth integration) – Role-based authorization

## Database

PostgreSQL – Relational database for persistent storage

## Authentication & Security

Firebase OAuth – User authentication and identity management

SendGrid – Email verification & transactional emails

## Infrastructure & DevOps

Docker – Containerized frontend, backend, and database services

Vercel – Hosting for frontend

Railway – Backend + Database hosting (managed PostgreSQL service from Railway)

GitHub Actions (planned) – Future CI/CD pipeline deployment target

## Architecture

## High level Overview
This section gives a bird’s-eye view of how the entire app functions. Keep in mind that this is a highly simplified, high-level overview.
<img width="1646" height="681" alt="Screenshot (996)" src="https://github.com/user-attachments/assets/357dd41d-0f75-4e16-8da9-1c191d677a57" />

Here is an ERD diagram for the database schema
<img width="624" height="721" alt="Screenshot (999)" src="https://github.com/user-attachments/assets/8f779bc0-60f9-405f-9503-6ecf5c9f9975" />

And here is an attempt to fit them all in one screenshot (Relationship mappings now are real messy).
<img width="1681" height="712" alt="Screenshot (1001)" src="https://github.com/user-attachments/assets/897ccf5a-2428-4a3b-b9d4-5f0d55db70da" />




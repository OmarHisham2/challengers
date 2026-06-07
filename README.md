[![Logo.png](https://i.postimg.cc/26s6LZ7p/Logo.png)](https://postimg.cc/1nKPL4dM)

# **Project Overview**

**Challengers** is a full-stack web application designed to streamline tennis league operations. The platform features an interactive public website alongside role-based dashboard experiences built natively into the system to manage tournament lifecycles and real-time scorekeeping.

## **Table of Contents**

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Links](#links)

## **Features**

- **Admin Dashboard**: Centralized control panel to manage the full tournament lifecycle (`Draft` ➔ `Registration` ➔ `Active` ➔ `Completed`), configure tournament rules (**Round Robin** / **Single Elimination**, **Best of 3** / **Best of 5** sets), enforce registration deadlines, and assign judges.
- **Judge Dashboard**: Secure officiating interface where assigned judges have exclusive rights to input match scores using a hierarchical scoring system (**Match** ➔ **Sets** ➔ **Games per set**).
- **Public Website (Logged-In Players)**: Personalized portal where players can log in to view their upcoming schedule, check match times, track personal statistics, and register for active tournaments.
- **Public Website (Guests)**: Open informational hub allowing anyone to browse tournament brackets, player profiles, standings, and match dates without needing an account.
- **Multi-Layer Security**: Protected backend API routes enforced via middleware and controller-level verification, backed by JWT authentication and Bcrypt password hashing.

## **Tech Stack**

**Front End:** Angular, PrimeNG, Sakai Admin Template

**Server:** Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt

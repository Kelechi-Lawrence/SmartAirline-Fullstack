# SmartAirline Full-Stack

A flight management and booking system built with a **Spring Boot** REST API and a **React** frontend. The application implements secure **JWT-based Authentication** and **Role-Based Access Control** to manage different user permissions.

##  Core Tech Stack
* **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA.
* **Frontend:** React, React Router (Routing & Protected Routes), Axios.
* **Database:** PostgreSQL.
* **Mail:** Spring Mail (SMTP/Gmail).

##  Key Features
* **RBAC Security:** Multi-page navigation logic based on user roles (Admin vs. User).
* **JWT Auth:** Secure stateless authentication and protected API endpoints.
* **Automated Email:** Transactional email notifications via Gmail SMTP.
* **Environment Safety:** All database and mail credentials are injected via environment variables to ensure no sensitive data is committed to the repository.
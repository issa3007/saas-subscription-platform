# SaaS Subscription Platform (NestJS)

REST API backend for SaaS platform where companies can register, manage employees, upload files and use subscription plans.

The system supports company accounts, employee invitations, file access control and subscription-based billing.

# Tech Stack

NestJS

TypeScript

TypeORM

MySQL

# Infrastructure

AWS S3 

JWT Authentication

Winston Logger



# Features

Authentication

Company registration

Email verification

Login with JWT

Company & Employees

Company account management

Invite employees

Employee activation

Subscriptions

Free / Basic / Premium plans

Plan upgrade / downgrade

Files

Upload CSV / XLS / XLSX files

File visibility control

Restricted access for selected employees

Billing

Monthly billing calculation based on subscription plan


git clone https://github.com/issa3007/saas-subscription-platform.git




# Endpoints

POST   /auth/register
POST   /auth/login
GET    /auth/verify-email

GET    /plans

GET    /subscriptions
PATCH  /subscriptions/change-plan

GET    /users
POST   /users/invite
POST   /users/activate
DELETE /users/:id

POST   /files/upload
GET    /files
PATCH  /files/:id/visibility
POST   /files/:id/access
DELETE /files/:id

GET    /billing
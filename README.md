##Car4Sure 
A full-stack insurance policy management system built with 
**Laravel (PHP) for the backend
** and **Angular for the frontend**.

---

##  Features
- Manage Insurance Policies (CRUD)
- Manage Policy Holders, Vehicles, and Drivers
- RESTful API for external integrations


---

## Tech Stack
- **Backend**: Laravel (PHP 8)
- **Frontend**: Angular 16
- **Database**: MySQL
- **API Requests**: Axios (Frontend) & Postman (Testing)

---

## Installation & Setup

###Backend (Laravel)
1. Clone the repository:
   ```bash
   git clone https://github.com/londiwekoo/car4sure-server
   cd car4sure-server

## Database Setup

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=car4sure
DB_USERNAME=root
DB_PASSWORD=


## Create DB table Care4Sure- Server 
Folder migrations 
Run php artisan migrate 
This command will create the tables in the DB

## Laravel server
composer run dev 
This will start laravel


##Angular project 
Git clone https://github.com/londiwekoo/car4sure-ui

## start the development sever
ng serve

##API Documentation (Postman)

##Import the Postman collection from the Car4Sure.postman_collection.jsonfile.

##Endpoints

##Policies

	•	GET /api/policies - List all policies
	•	POST /api/policies - Create a new policy
	•	GET /api/policies/{id} - Get policy details
	•	PUT /api/policies/{id} - Update a policy
	•	DELETE /api/policies/{id} - Delete a policy

# insurance_policy

## 🎯 Task

Develop an API endpoint and SPA that talks to the endpoint

---

### 📖 Description

* MVT Architecture - API REST
* Database has dummy records- dbSqlite used 
* Supports pagination
* Supports Filtration
* Support searching

### 🔧 API Enpoints and Architecture
* REST API - DjangoREST used
* JWT - Authentication used
* CRUD operations implemented within the API

### 🔧 Frontend Architecture
* React.Js used to render
* Implemented
   - Login page
   - Dashboard- Two user Types rendering based on user(is_lead, is_customer)

### 🔎 Improvements

- Complete CRUD operation: Mostly delete , Edit , on the Frontend
- Testing
- Pagination, Filtration, Searching, Register Page on frontend
- Create Endpoint Documentation

### 🏁 API Usage

Added a [Postman collection] to easily use API endpoints and query parameters combinations.
Also contains examples of expected responses.

### Endpoint: /api/v1/register/
#### HTTP Method: POST

Create a new User 

- username: required. User's username. 
- email: required. User's email address. 
- password: required. 

Create a customer.

Required json body:
  ```json
    {
    "username": "usertest",
    "email": "usertest@gmail.com",
    "password": "userpassword"
}
  ```

### Endpoint: /api/v1/users/login/
#### HTTP Method: POST
Required json body:
  ```json
    {
    "username": "usertest",
    "password": "userpassword"
}
  ```

### Endpoint: /api/v1/lead/create_lead

#### HTTP Method: GET
Get a list of Leads (not-paginated)
### Endpoint: /api/v1/lead/

#### HTTP Method: POST
Create a New lead
### Endpoint: /api/v1/lead/create_lead/

#### HTTP Method: POST
Craete a new customer from a lead
### Endpoint: /api/v1/customer/customer_create/

Required json body:
  ```json
    {
    "lead": 2,
    "photo": "http://127.0.0.1:8000/photos/test.png",
    "annual_earning": "2377272.00",
    "products": "A",
     }
  ```

### ✨ Local environment set up 

**To be able to get this project to your local machine**
***Using virtualenv***

``` sh
    $  git@github.com:BethMwangi/basigo-take-home.git
    $  pip install virtualenv venv
    $ . venv/bin/activate
    $  cd /basigo
    $  pip install -r requirements.txt
    $  ./manage.py createsuperuser - Admin interface 
```

- Create .env file and 

- Copy .env.example items to .env and set up a secret key 

- To create dummy data ; run the commands 
```sh
   $  python manage.py runscript generate_users
   $  python manage.py runscript generate_leads
```

**To test API successfully set up visit: http://localhost:8000**  

### ☁️ To test with frontend 

``` sh
    $  cd /frontend
    $  npm install
    $ npm run start
```

**This will start up the development server : http://localhost:3000**  


### ☁️ Production environment - TODO

Have a nice coding, Pythonizate!

---
⌨️ with ❤️ by [Beth Mwangi](https://github.com/BethMwangi) 😊
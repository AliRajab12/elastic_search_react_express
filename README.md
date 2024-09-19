A web app implements elastic search for search optimization


Prerequisites

Before running the application, ensure you have the following installed:

Node.js (v14+)
npm or yarn
SQLite (or a compatible database)

Step-by-Step Guide

1. Clone the Repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

2. Install Dependencies
Run the following command to install the required dependencies:

npm install

Or if you use yarn:

yarn install

3. Set Up the Database
This project uses SQLite with Knex for migrations.

Ensure SQLite is properly installed on your system.
Run the database migrations to set up the required tables (like comments)

npx knex migrate:latest

4. Start the Development Server
Run the following command to start the backend and frontend development server:

node server.js
npm run compile

5. Build for Production (Optional)
npm run build


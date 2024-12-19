import sqlite3 from 'sqlite3'; 

const db = new sqlite3.Database('database.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (email TEXT, password TEXT)");

    db.run("INSERT INTO users (email, password) VALUES (?, ?)", ['user@gmail.com', 'password123']);
    
    
});

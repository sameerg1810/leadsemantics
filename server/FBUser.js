import mysql from "mysql2";

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  database: "leads",
  user: "root",
  password: "root456",
  connectionLimit: 10, // Adjust the limit as per your requirements
});

// Define the User model
const User = {};

// Define the findById method with a Promise
User.findById = (id) => {
  return new Promise((resolve, reject) => {
    // Perform the necessary database query
    const query = "SELECT * FROM users WHERE user_id = ?";
    const values = [id];

    const userId = 1;
    pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId],
      (error, results, fields) => {
        if (error) {
          console.error("Error executing query:", error);
        } else {
          console.log("User data:", results);
        }
      }
    );
  });
};

// Export the User model
export default User;

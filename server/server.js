// importing all dependencies
import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mysql2 from "mysql2";
import csv from "csv-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import logger from "morgan";
import bcrypt from "bcrypt";
import Papa from "papaparse";
import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { URLSearchParams } from "url";
import router from "./router/route.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { OAuthStrategy } from "passport-oauth";
import util from "util";
import { OAuth2Client } from "google-auth-library";
import { fileURLToPath } from "url";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";
import axios from "axios";
import { PdfReader } from "pdfreader";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);
import querystring from "querystring";
import randomstring from "randomstring";
import crypto from "crypto";
import base64url from "base64url";
import jwt from "jsonwebtoken";
const secretKey = "thisIsUser";
import dotenv from "dotenv";
dotenv.config();
const databaseUrl = process.env.DATABASE_URL;
// Replace with your secret key
const app = express();
const PORT = 8080;
let jsonData = [];
// Creating a connection pool to MySQL
const pool = mysql2.createPool({
  host: "localhost",
  port: 3306,
  database: "leads",
  user: "root",
  password: "root456",
  connectionLimit: 10, // Adjust the limit as per your requirements
});

// Connect to MySQL
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("MySQL server running");

  // Retrieve and display the users table data from MySQL
  connection.query("SELECT * FROM users", (err, rows) => {
    connection.release();
    if (err) throw err;
    console.log("Users Table Data:");
    console.log(rows);
  });
});
//Display all tables
//Display all tables
let tables = [];
pool.query("SHOW TABLES FROM leads", (err, rows) => {
  if (err) throw err;
  tables = rows;
  console.log(tables);
});
//Display Sql message ______________________________________

// Middlewares
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.set("view engine", "ejs");
// a variable to save a session

app.use(
  session({
    secret: "sameerg",
    saveUninitialized: true,
    resave: false,
    cookie: {
      name: "my-session-cookie",
      path: "/",
      expires: new Date(Date.now() + 60000),
      maxAge: null, // 5 minutes of session
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join("D:/userportal/client/public")));
app.use(
  "/index.html",
  express.static("D:/userportal/client/public/index.html")
);
app.use(
  "/dashboard.html",
  express.static("D:/userportal/client/public/dashboard.html")
);
app.use("/mla.html", express.static("D:/userportal/client/public/mla.html"));
app.use("/login", (req, res, next) => {
  req.session.regenerate((err) => {
    if (err) {
      // Handle error
    } else {
      // Session has been regenerated
      next();
    }
  });
});
// app.use(
//   "/linkedin",
//   express.static("D:/userportal/client/public/linkedin.html")
// );
//Getting SEARCH suggestions_______________________________________________________________________
app.get("/stateQuestions", (req, res) => {
  const selectedState = req.query.state;
  // Your SQL query to retrieve data from the table
  const sqlQuery = "SELECT * FROM state_questions WHERE state=?";

  // Execute the SQL query
  pool.query(sqlQuery, [selectedState], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
      console.log("these are the results coming from database 131:", results);
    }
  });
});
// getting Mlas-----------------------------------------------------------------------------
app.get("/getMlas", (req, res) => {
  const selectedState = req.query.state;
  const selectedDistrict = req.query.district;
  // Perform a SQL JOIN to fetch MLAs for the selected state and district
  // Send the MLA information as JSON response
});
// Middleware for session timeout
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    const now = Date.now();
    const lastActive = req.session.lastActive || now;

    // If the session has expired, clear the session and redirect to login
    if (now - lastActive > req.session.cookie.maxAge) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        res.redirect("/?error=Session Timed Out,Login Again.");
        console.log("session has timed out");
      });
    } else {
      req.session.lastActive = now;
      next();
    }
  } else {
    next();
  }
});
//server-down
// Assuming you have already defined 'pool' for MySQL connection
app.get("/connect", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("Error connecting to server:", err);
      res.sendStatus(500); // Sending a status code 500 (Internal Server Error)
    } else {
      console.log("Connected to server");
      connection.release();
      res.sendStatus(200); // Sending a status code 200 (OK)
    }
  });
});

//abort the server______________________________________
// Example: Aborting the server in response to a specific request
app.get("/abort", (req, res) => {
  const alertMessage = "User Aborted The Server!";
  const alertScript = `<script>alert("${alertMessage}");</script>`;
  // Sending the alert message in the response
  res.send(alertScript);
  // Perform any necessary cleanup or other actions before exiting the process
  process.exit(1);
});
//PDF READER_______________________________________________________________
// Function to read and parse a PDF file
// Route for PDF upload and parsing
// Serve user login page
app.get("/login", (req, res) => {
  res.render("login.html");
});
// Serve user dashboard page______________________________________________________________________
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    // Set the timeout to 5 minutes
    const timeout = 3000000;
    // Create a new interval
    const interval = setInterval(() => {
      // Check if the user is still logged in
      if (!req.session.user) {
        // The user is not logged in, so redirect to the login page
        res.redirect("/login");
        clearInterval(interval);
      }
    }, timeout);
    // Render the dashboard page
    res.render("dashboard.html");
  }
});

//dasboard____________________________________________________________________________
// Middleware for file upload__________________________________________________________________________________________________________________
const allowedFileExtensions = [".csv", ".pdf"];
const storage = multer.diskStorage({
  destination: path.join(__dirname, "./uploads"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedFileExtensions.includes(fileExtension)) {
      callback(null, true);
    } else {
      callback(new Error("Only CSV file is allowed"));
    }
  },
  limit: 20, // File limit is 10
  headers: {
    "Content-Type": "text/csv",
  },
});

// Verify the JWT token before upload_______________________________________________________________________________________________________________
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // Attach the decoded user information to the request object for later use
    req.user = decoded;
    next();
  });
};
// Route for file upload
app.post("/upload", verifyToken, upload.array("csvFile"), (req, res) => {
  console.log(`Received request to ${req.url}`);
  const totalFilesCount = req.files.length + tables.length;
  console.log(
    "total files count",
    totalFilesCount,
    "tables length",
    tables.length
  );
  if (req.files && req.files.length > 0) {
    const csvFiles = req.files;
    console.log("csvFiles was sent from client-side", csvFiles);
    const processFile = (csvFile) => {
      console.log("this is csvFile inside /upload route", csvFile);
      return new Promise((resolve, reject) => {
        const results = []; // Separate results array for each file

        const filePath = csvFile.path;
        const stream = fs.createReadStream(filePath);

        // Use Papa Parse to parse the CSV data
        Papa.parse(stream, {
          header: true,
          step: (result) => {
            results.push(result.data);
            console.log;
          },
          complete: () => {
            resolve(results);
          },
          error: (error) => {
            reject(error);
          },
        });
      });
    };

    // Process each file sequentially and collect the results
    const processFilesSequentially = async () => {
      const fileResults = [];
      for (const file of csvFiles) {
        try {
          const result = await processFile(file);
          fileResults.push(result);

          // Define the new path where you want to move the file
          const oldPath = file.path;
          const newPath = path.join(__dirname, "./temp", file.originalname);

          // Use fs.renameSync to move the file
          fs.renameSync(oldPath, newPath);
        } catch (error) {
          console.error("Error processing file:", error);
          res.status(500).send("Error processing file.");
          return;
        }
      }
      res.json(fileResults); // Send the results as a JSON response
    };

    processFilesSequentially();
  } else {
    res.status(400).send("No file uploaded.");
  }
});

// app.post("/upload", upload.array("csvFile"), (req, res) => {
//   console.log(`Received request to ${req.url}`);
//   const totalFilesCount = req.files.length + tables.length;
//   if (req.files && req.files.length > 0) {
//     const csvFiles = req.files;
//     console.log("csvFiles was sent from client-side", csvFiles);
//     const processFile = (csvFile) => {
//       console.log("this is csvFile inside /upload route", csvFile);
//       return new Promise((resolve, reject) => {
//         const results = []; // Separate results array for each file

//         const filePath = csvFile.path;
//         const stream = fs.createReadStream(filePath);

//         // Use Papa Parse to parse the CSV data
//         Papa.parse(stream, {
//           header: true,
//           step: (result) => {
//             results.push(result.data);
//             console.log;
//           },
//           complete: () => {
//             resolve(results);
//           },
//           error: (error) => {
//             reject(error);
//           },
//         });
//       });
//     };

//     // Process each file sequentially and collect the results
//     const processFilesSequentially = async () => {
//       const fileResults = [];
//       for (const file of csvFiles) {
//         try {
//           const result = await processFile(file);
//           fileResults.push(result);
//         } catch (error) {
//           console.error("Error processing file:", error);
//           res.status(500).send("Error processing file.");
//           return;
//         }
//       }
//       res.json(fileResults); // Send the results as a JSON response
//     };

//     processFilesSequentially();
//   } else {
//     res.status(400).send("No file uploaded.");
//   }
// });
// retrive table data___________________________________________________________________________________________________________________________
// Assuming you have already set up your Express app and MySQL connection
// ...

app.get("/api/state-questions", (req, res) => {
  // Your SQL query to retrieve data from the table
  const sqlQuery = "SELECT * FROM state_questions";

  // Execute the SQL query
  pool.query(sqlQuery, (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});
//storing the Table in Data-Base_______________________________________________
app.post("/storeTableData", async (req, res) => {
  try {
    console.log("Received request to store table data");

    const { tableName, columns, data } = req.body;

    console.log("tableName", tableName);
    console.log("columns", columns);
    console.log("data ", data);

    if (!data || !tableName || !columns) {
      console.log("Invalid request data");
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Sanitize table name to remove disallowed characters
    const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, "_");

    // Sanitize column names while allowing all characters
    const sanitizedColumns = columns.map((column) =>
      column.replace(/[^a-zA-Z0-9_]/g, "_")
    );

    console.log("Sanitized Table Name:", sanitizedTableName);
    console.log("Sanitized Columns:", sanitizedColumns);

    const tableExists = await checkTableExists(sanitizedTableName);

    if (tableExists) {
      console.log(`Table '${sanitizedTableName}' already exists.`);
      return res.status(200).json({
        message: `The table '${sanitizedTableName}' already exists. Do you want to continue?`,
        buttons: ["OK", "Cancel"],
      });
    }

    // Log the contents of the data object
    console.log("Data Contents:", data);

    // Access the "data" array inside the data object (if needed)
    const dataArray = Array.isArray(data) ? data[0].data : [];

    // Log the contents of the data array
    console.log("Data Array Contents:", dataArray);

    // Create an array for inserting data
    const flattenedData = dataArray.map((item) =>
      sanitizedColumns.map((col) => item[col])
    );

    console.log("Flattened Data:", flattenedData);

    await createTableAndInsertData(
      sanitizedTableName,
      sanitizedColumns,
      flattenedData
    );

    console.log("Table data stored successfully");
    res.status(200).json({ message: "Table data stored successfully" });
  } catch (error) {
    console.error("Error:", error);

    // Handle specific MySQL duplicate column error
    if (error.code === "ER_DUP_FIELDNAME") {
      return res.status(400).json({ error: "Duplicate column name" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/checkTable", async (req, res) => {
  try {
    console.log("Received request to check table existence");
    const { tableName } = req.body;
    const tableExists = await checkTableExists(tableName);
    console.log(`Table '${tableName}' exists: ${tableExists}`);
    res.status(200).json({ exists: tableExists });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const checkTableExists = (tableName) => {
  return new Promise((resolve, reject) => {
    console.log(`Checking if table '${tableName}' exists`);
    pool.query(`SHOW TABLES LIKE ?`, [tableName], (error, results) => {
      if (error) {
        console.error("Error checking table existence:", error);
        reject(error);
      } else {
        console.log(`Table '${tableName}' exists: ${results.length > 0}`);
        resolve(results.length > 0);
      }
    });
  });
};

const createTableAndInsertData = (tableName, columns, data) => {
  return new Promise((resolve, reject) => {
    console.log("Creating table in MySQL database:", tableName);
    console.log("Creating columns in MySQL database:", columns);
    console.log("Creating data in columns in MySQL database:", data);

    if (!tableName || !columns || columns.length === 0) {
      console.log("Invalid parameters for creating table");
      reject("Invalid parameters for creating table");
      return;
    }

    if (!data) {
      console.log("No data to insert");
      reject("No data to insert");
      return;
    }

    const columnDefinitions = columns
      .map((column) => `${column} VARCHAR(255)`)
      .join(", ");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ${columnDefinitions}
      )`;

    console.log("Create Table Query:", createTableQuery);

    pool.query(`SHOW TABLES LIKE ?`, [tableName], (checkError, results) => {
      if (checkError) {
        console.error("Error checking table existence:", checkError);
        reject(checkError);
      } else {
        if (results.length > 0) {
          console.log(`Table '${tableName}' already exists.`);
          resolve();
        } else {
          pool.query(createTableQuery, (err) => {
            if (err) {
              console.error("Error creating table:", err);
              reject(err);
            } else {
              console.log(`Table ${tableName} created successfully`);

              const insertQuery = `INSERT INTO ${tableName} (${columns.join(
                ", "
              )}) VALUES ?`;

              console.log("Insert Query:", insertQuery);

              pool.query(insertQuery, [data], (error) => {
                if (error) {
                  console.error("Error inserting data:", error);
                  reject(error);
                } else {
                  console.log(`Table data stored in ${tableName} successfully`);
                  resolve();
                }
              });
            }
          });
        }
      }
    });
  });
};

// ...getting inserted tables data from database to client-side______________________________________
app.get("/tables", (req, res) => {
  pool.query("SHOW TABLES FROM leads", (err, rows) => {
    if (err) {
      console.error("Error fetching table list:", err);
      res.status(500).json({ error: "Error fetching table list" });
      return;
    }

    if (!rows || rows.length === 0) {
      res.status(404).json({ message: "No tables found" });
      return;
    }

    res.status(200).json(rows);
  });
});

// ...login

//Route for login________________________________________________________________________________________________________________

// Route for login__________________________________________________________________________________________________________________________________

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("the email of the user", email);
  console.log("the password of the user", password);
  const sql = "SELECT * FROM users WHERE email = ?";
  const values = [email];

  pool.query(sql, values, (err, result, fields) => {
    if (err) {
      console.error("Error finding user:", err);
      res.status(500).json({ error: "Error finding user." });
    } else if (result.length === 0) {
      console.log("User not found");
      res.status(404).json({ error: "User not found." });
    } else {
      const hashedPassword = result[0].user_pass;
      const userRoles = result[0].ROLES;

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          res.status(500).json({ error: "Error comparing passwords." });
        } else if (!isMatch) {
          console.log("Incorrect password");
          res.status(401).json({ error: "Incorrect password." });
        } else {
          const payload = {
            user_id: result[0].user_id,
            email: result[0].email,
            username: result[0].user_name,
            ROLES: userRoles,
          };

          // Sign the payload to generate the token
          const token = jwt.sign(payload, secretKey, { expiresIn: "15m" });

          // Store user details in session
          req.session.user = {
            user_id: result[0].user_id,
            email: result[0].email,
            username: result[0].user_name, // Include the username
            ROLES: userRoles, // Include user roles
            token: token,
          };

          // Set session expiration time (e.g., 15 minutes from now)
          req.session.cookie.expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes in milliseconds

          // Redirect to the dashboard page with a success message
          const userParams = encodeURIComponent(
            JSON.stringify(req.session.user)
          );
          const successMessage = "User logged in successfully";

          // Redirect to the dashboard page with userParams and successMessage in the query string
          res.redirect(
            `/dashboard.html?user=${userParams}&success=${encodeURIComponent(
              successMessage
            )}`
          );
        }
      });
    }
  });
});

// Route for register___________________________________________________________________________________________________________________________________
app.post("/register", (req, res) => {
  const { user_name, user_pass, email, age, gender } = req.body;

  // Check if the email already exists in the database
  const emailCheckQuery = "SELECT * FROM users WHERE email = ?";
  const emailCheckValues = [email];

  // Perform server-side email validation if email is provided
  if (email && !isValidEmail(email)) {
    return res.status(400).redirect("/?error=Invalid email.");
  }

  // Check if the email already exists in the database
  pool.query(emailCheckQuery, emailCheckValues, (err, result) => {
    if (err) {
      console.error("Error checking email:", err);
      res.status(500).redirect("/?error=Error checking email.");
    } else if (result.length > 0) {
      console.log("Email already exists");
      res.status(409).redirect("/?emailError=Email already exists.");
    } else {
      // Hash the password before storing it in the database
      const hashedPassword = bcrypt.hashSync(user_pass, 10);

      // Save the hashed password and other fields in the database
      const sql =
        "INSERT INTO users (user_name, user_pass, email, age, gender) VALUES (?, ?, ?, ?, ?)";
      const values = [user_name, hashedPassword, email, age, gender];

      pool.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error registering user:", err);
          res.status(500).redirect("/?error=Error registering user.");
        } else {
          console.log("User registered successfully", result);
          res.redirect("/?success=User registered successfully.");
        }
      });
    }
  });
});

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Log uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Log unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:", reason);
  process.exit(1);
});

// Route for resetting password___________________________________________________________________________________________________________________________
app.post("/reset-password", (req, res) => {
  const { email } = req.body;

  // Checking if the user email exists or not
  const emailCheckQuery = "SELECT * FROM users WHERE email=?";
  const emailCheckValues = [email];

  pool.query(emailCheckQuery, emailCheckValues, (err, result) => {
    if (err) {
      console.error("Error checking email:", err);
      res.status(500).send("Error checking email.");
    } else if (result.length === 0) {
      console.log("Email not found");
      res.status(404).send("Email not found.");
    } else {
      // Generate a new password (implement your own logic)
      const newPassword = generateRandomPassword(); // Implement your own logic to generate a random password

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update the user's password in the database
      const updatePasswordQuery = "UPDATE users SET user_pass=? WHERE email=?";
      const updatePasswordValues = [hashedPassword, email];

      pool.query(updatePasswordQuery, updatePasswordValues, (err, result) => {
        if (err) {
          console.error("Error updating password:", err);
          res.status(500).send("Error updating password.");
        } else {
          sendPasswordToUser(email, newPassword); // Implement your own logic to send the new password to the user
          res.status(200).send("Password reset successfully...");
        }
      });
    }
  });
});

//Session timout to dashboard------------------------------------------------------------------------------------------------------
// Session timeout route
app.post("/session-timeout", (req, res) => {
  // Check the status of the request
  if (req.body.status === "Session timeout") {
    // Display a message to the user
    const sessionTimeoutMessage =
      "Your session has expired. Please log in again.";

    res.json({
      sessionTimeoutMessage: sessionTimeoutMessage,
    });
  } else {
    // Handle other errors
    res.status(500).send("An error occurred.");
  }
});

//------------------------------------------------------------------------------------------------------------------------
// Route for session timeout logout
app.get("/logout", (req, res) => {
  console.log(req.session, "session logged out");

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error destroying session.");
    }

    // Check if the user is authenticated
    if (req.user && req.user.accessToken) {
      const Token = req.user.accessToken;
      console.log("the accessToken 602", Token);
      // Assuming revokeToken is a function to revoke the token
      revokeToken(req.user.accessToken);
      console.log("revokeToken worked");
      res.clearCookie("connect.sid"); // Clear the session cookie
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    } else {
      console.log("User is not authenticated");
    }

    const sessionTimeoutMessage =
      "Your session has expired or logged out. Please log in again.";
    res.json({ message: sessionTimeoutMessage });
  });
});

//clear cookies_____________________________________________
// Get the current date and time
// To delete all cookies, we can loop through the document.cookie property and set the expiration date to a past date:

//checking the token is working or not__________________

const oauth2Client = new OAuth2Client(
  "1044384300379-p2stncd95po7p4ikoethg8uhbh80oc6j.apps.googleusercontent.com",
  "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",
  "http://localhost:8080/auth/google/callback"
);

async function revokeToken(accessToken) {
  try {
    await oauth2Client.revokeToken(accessToken);
    console.log("Token revoked");
  } catch (err) {
    console.error("Error revoking token:", err);
  }
}

async function checkToken(accessToken) {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });
    const res = await oauth2Client.request({
      url: "https://www.googleapis.com/oauth2/v1/userinfo",
    });
    console.log(res.data);
  } catch (err) {
    if (
      err.response &&
      err.response.data &&
      err.response.data.error === "invalid_grant"
    ) {
      console.log("Token is invalid");
    } else {
      console.error("Error checking token:", err);
    }
  }
}
//---------------------------------------------------------HOME PAGE ROUTE--------------------------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile("D:/userportal/client/public/index.html");
});
// get userID and email---------------------------------------------------------------------------------------------------------------
app.get("/user-data", (req, res) => {
  console.log("get user-data get initiated");
  if (req.session.user) {
    const { username, email, user_id, token, ROLES } = req.session.user;
    console.log("line 496 request sent to Front-end", req.session.user);
    res.json({ username, email, user_id, token, ROLES });
    console.log(
      "username , email, user_id sent to front-end",
      username,
      email,
      user_id,
      token,
      ROLES
    );
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

//get Table-DATA____________________________________________________________________________________________________________________________________
// Define a GET route for /tables
// Create a route that accepts a table name as a parameter
app.get("/tables/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  console.log("Received request for table:", tableName);

  if (!tableName || tableName.trim() === "") {
    return res.status(400).json({ error: "Invalid table name" });
  }

  // Sanitize the table name using ?? for proper escaping
  const query = "SELECT * FROM ??";

  pool.query(query, [tableName], (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      if (err.code === "ER_NO_SUCH_TABLE") {
        return res.status(404).json({ error: `Table ${tableName} not found` });
      } else {
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ message: `No data found in table ${tableName}` });
    } else {
      res.status(200).json(results);
    }
  });
});

// Route to delete a table with the given table name
app.delete("/tables/:tableName", (req, res) => {
  const tableName = req.params.tableName;

  if (!tableName) {
    return res.status(400).json({ error: "Invalid table name" });
  }

  // Formulate the SQL query to drop the table
  const dropTableQuery = `DROP TABLE IF EXISTS ${tableName}`;

  // Execute the query to drop the table
  pool.query(dropTableQuery, (err, result) => {
    if (err) {
      console.error("Error dropping table:", err);
      res.status(500).json({ error: "Error dropping table" });
    } else {
      console.log(`Table ${tableName} dropped successfully`);
      res
        .status(200)
        .json({ message: `Table ${tableName} dropped successfully` });
    }
  });
});

//________________________use papaparse_________________________________
function DisplayTableData(tableName) {
  console.log("DisplayTableData function is working");
  axios
    .get(`/tables/${tableName}`)
    .then((response) => {
      // Pass tableName to the displayTableWindow function
      displayTableWindow(response.data, tableName);
      console.log("response sent to displayTableWindow", response.data);
      console.log(
        "type of data I am sending to displayTableWindow is",
        typeof response.data
      );
    })
    .catch((error) => {
      console.error(error);
    });
  console.log("axios has sent a request to get the tables with tableName");
}

// Displaying Table in upload window
function displayTableWindow(data, tableName) {
  // Rest of your code remains unchanged

  // Update the windowTitle element to display the tableName
  const windowTitle = document.getElementById("windowTitle");
  windowTitle.textContent = tableName;

  // Rest of your code remains unchanged
}
// Route to update table data with CELL_______________________________________________________________________________

app.patch("/updateTableCell/:tableName/:rowId", async (req, res) => {
  const { tableName, rowId } = req.params;
  console.log("Received request with params:", req.params);
  const { updatedValue, oldValue } = req.body;

  try {
    if (!tableName || !rowId || !updatedValue || !oldValue) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Check if the table exists
    const checkTableQuery = `SHOW TABLES LIKE ?`;
    const [tableExists] = await executeQuery(checkTableQuery, [tableName]);

    if (!tableExists) {
      return res.status(404).json({ error: `Table ${tableName} not found` });
    }

    // Build the update query based on the updated data and row ID
    const updateQuery = `UPDATE ${tableName} SET ${Object.keys(updatedValue)
      .map((column) => `${column} = ?`)
      .join(", ")} WHERE id = ?`;

    const values = [...Object.values(updatedValue), rowId];

    // Execute the update query
    const result = await executeQuery(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Row with ID ${rowId} not found` });
    }

    res.json({ message: "Table cell updated successfully" });
  } catch (err) {
    console.error("Error updating table cell:", err);
    res.status(500).json({ error: "Error updating table cell" });
  }
});
// Route to update table data with rowID_______________________________________________________________________________
app.patch("/updateTableRow/:tableName/:rowId", async (req, res) => {
  const { tableName, rowId } = req.params;
  const { updatedData, oldData } = req.body;
  console.log("these are req.params from cleient", req.params);
  console.log("these are req.body from cleient", req.body);
  try {
    // Check if the table exists
    const checkTableQuery = `SHOW TABLES LIKE ?`;
    const [tableExists] = await executeQuery(checkTableQuery, [tableName]);

    if (!tableExists) {
      return res.status(404).json({ error: `Table ${tableName} not found` });
    }

    if (!tableName || !rowId || !updatedData || !oldData) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Convert updatedData and oldData to JSON objects
    const updatedDataObj = JSON.parse(updatedData);
    const oldDataObj = JSON.parse(oldData);

    // Extract column name and values from oldData and updatedData
    const columnName = Object.keys(oldDataObj)[0];
    const oldValue = oldDataObj[columnName];
    const newValue = updatedDataObj[columnName];

    console.log("tableName:", tableName);
    console.log("rowId:", rowId);
    console.log("columnName:", columnName);
    console.log("oldValue:", oldValue);
    console.log("newValue:", newValue);

    // Construct the update query
    const updateQuery = `UPDATE ${tableName} SET ${columnName} = ? WHERE id = ? AND ${columnName} = ?`;
    const values = [newValue, rowId, oldValue];

    console.log("updateQuery:", updateQuery);
    console.log("values:", values);

    // Execute the update query
    const result = await executeQuery(updateQuery, values);

    console.log("result:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Row with ID ${rowId} not found` });
    }

    res.json({ message: "Table cell updated successfully" });
  } catch (err) {
    console.error("Error updating table cell:", err);
    if (err instanceof SyntaxError) {
      return res.status(400).json({ error: "Invalid JSON data" });
    }
    res.status(500).json({ error: "Error updating table cell" });
  }
});

//delete Multiple Tables_________________________________________________
app.post("/deleteSelectedTables", (req, res) => {
  // Get the table names from the request body
  const tableNames = req.body.tableNames;

  // Check if tableNames is an array and is not empty
  if (!Array.isArray(tableNames) || tableNames.length === 0) {
    return res.status(400).send("Invalid tableNames data");
  }

  // Create a SQL query to drop the tables using parameterized query
  const placeholders = tableNames
    .map((tableName) => `\`${tableName}\``)
    .join(", ");
  const sql = `DROP TABLE ${placeholders}`;

  // Execute the query with tableNames as parameters
  pool.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error deleting tables");
    } else {
      console.log("the table has been deleted", result);
      res.status(200).send("Tables deleted successfully");
    }
  });
});
//Delete the record from notify Table_________________________________________________
// Add a new route to handle record deletion
app.delete("/deleteNotify/:noteId", async (req, res) => {
  const { noteId } = req.params;
  console.log("the request body we are getting as noteId", req.params);
  try {
    // Perform the record deletion in your MySQL database
    const deleteQuery = "DELETE FROM notify WHERE note_id = ?";
    await executeQuery(deleteQuery, [noteId]);

    res.status(200).json({ message: "Notify Table refreshed successfully" });
  } catch (error) {
    console.error("Error Refreshing record:", error);
    res.status(500).json({ error: "Error Refreshing record" });
  }
});

//facebook Authentication
app.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

//facebook Authentication_______________________________

const queryAsync = util.promisify(pool.query).bind(pool);

passport.use(
  new FacebookStrategy(
    {
      clientID: "799022472012843",
      clientSecret: "598352d12e1c0f08c5cea60070e91b10",
      callbackURL: "http://localhost:8080/oauth2/redirect/facebook",
      enableProof: true,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        // Begin transaction
        await queryAsync("BEGIN");

        // Check if user exists
        const [cred] = await queryAsync(
          "SELECT * FROM users WHERE facebook_Id = ?",
          [profile.id]
        );
        console.log(profile);
        let user;
        if (!cred) {
          // Create new user
          const result = await queryAsync(
            "INSERT INTO users (user_name,  facebook_Id, access_token, refresh_token) VALUES (?, ?,  ?, ?)",
            [profile.name, profile.id, accessToken, refreshToken]
          );
          const id = result.insertId;
          let email;
          if (profile.emails && profile.emails.length > 0) {
            email = profile.emails[0].value;
          }

          user = {
            id: id.toString(),
            user_name: profile.name,
            facebook_Id: profile.id,
            access_token: accessToken,
            refresh_token: refreshToken,
          };
        } else {
          // Update existing user
          await queryAsync(
            "UPDATE users SET access_token = ?, refresh_token = ? WHERE user_id = ?",
            [accessToken, refreshToken, cred.user_id]
          );
          // Get updated user record
          [user] = await queryAsync("SELECT * FROM users WHERE user_id = ?", [
            cred.user_id,
          ]);
        }

        // Commit transaction
        await queryAsync("COMMIT");

        console.log(user); // Print user details
        return cb(null, user);
      } catch (err) {
        // Rollback transaction
        await queryAsync("ROLLBACK");
        return cb(err);
      }
    }
  )
);

// Set up route to initiate authentication with Facebook
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    authType: "reauthenticate",
    scope: ["email"],
  })
);
// Set up route to handle callback from Facebook
app.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:8080/dashboard.html");
  }
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  // In a real scenario, you might want to fetch user data from a database
  done(null, user);
});

// When you need to refresh the access token

// Routes for Facebook authentication
app.get("/facebook-user", (req, res) => {
  console.log("route facebook-user has been executed");
  if (req.isAuthenticated()) {
    const user = req.user;
    // Query the database to retrieve user_id based on facebook_Id
    const findUserIdQuery = "SELECT user_id FROM users WHERE facebook_Id = ?";
    pool.query(findUserIdQuery, [user.facebook_Id], (err, result) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Error querying the database" });
      }
      if (result.length === 0) {
        console.log("User not found in the database");
        return res.status(404).json({ error: "User not found" });
      }
      const user_id = result[0].user_id;
      // Include user_id and username in userData
      const userData = {
        email: user.email,
        username: user.user_name,
        user_id: user_id,
      };
      console.log("this is facebook user data going to front-end", userData);
      res.json(userData);
      console.log("user has been authenticated", user);
      console.log("userData has been authenticated", userData);
    });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});

//Google Authentication_________________
passport.authenticate("google");
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1044384300379-p2stncd95po7p4ikoethg8uhbh80oc6j.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8080/auth/google/callback",
      prompt: "login",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile || !profile.id) {
          return done(new Error("Invalid profile data"));
        }
        console.log(profile);
        const { id, displayName, emails } = profile;
        // Extract relevant data from the profile
        const email = emails[0].value;

        // Check if the user already exists in the database
        const findUserQuery = "SELECT * FROM users WHERE google_Id = ?";
        try {
          const result = await executeQuery(findUserQuery, [id]);
          if (result.length === 0) {
            // User does not exist, create a new entry
            const insertUserQuery =
              "INSERT INTO users (google_Id, email, user_name) VALUES (?, ?, ?)";
            const values = [id, email, displayName];
            try {
              await executeQuery(insertUserQuery, values);
              console.log("User data stored in the database:", email);
              console.log("google_Id stored in the database:", id);
              console.log("Username in the database:", displayName);
              return done(null, { id, email, displayName });
            } catch (insertError) {
              console.error("Error storing user in the database:", insertError);
              return done(insertError);
            }
          } else {
            // User exists, provide an alert message
            const alertMessage = "User is a duplicate entry.";
            console.log(alertMessage);
            return done(null, { id, email, displayName, alertMessage });
          }
        } catch (queryError) {
          console.error("Error querying the database:", queryError);
          return done(queryError);
        }
      } catch (error) {
        console.error("Error in verification:", error);
        return done(error);
      }
    }
  )
);

// Helper function to check if a table exists
// function checkTableExists(query) {
//   return new Promise((resolve, reject) => {
//     pool.query(query, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result.length > 0);
//       }
//     });
//   });
// }
// Helper function to execute a query
function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  // In a real scenario, you might want to fetch user data from the database using `user.email`
  done(null, user);
});

// Redirect to linkedin after successful login
// app.get("/linkedin", (req, res) => {
//   res.render("linkedin.html");
// });
// Routes for Google and Facebook authentication
app.get(
  "/auth/google",
  passport.authenticate("google", {
    authType: "reauthenticate",
    scope: ["profile", "email"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect to dashboard with user details
    res.redirect(
      `/dashboard.html?user=${encodeURIComponent(JSON.stringify(req.user))}`
    );
  }
);
app.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect:
      "/dashboard.html?user=${encodeURIComponent(JSON.stringify(req.user))}",
    failureRedirect: "/login",
  })
);

//send google-user to front-end
app.get("/google-user", (req, res) => {
  console.log("route google-user has been executed");
  if (req.isAuthenticated()) {
    const user = req.user;
    // Query the database to retrieve user_id based on google_id
    const findUserIdQuery = "SELECT user_id FROM users WHERE google_Id = ?";
    pool.query(findUserIdQuery, [user.id], (err, result) => {
      if (err) {
        console.error("Error querying the database:", err);
        return res.status(500).json({ error: "Error querying the database" });
      }
      if (result.length === 0) {
        console.log("User not found in the database");
        return res.status(404).json({ error: "User not found" });
      }
      const user_id = result[0].user_id;
      // Include user_id in userData
      const userData = {
        email: user.email,
        username: user.displayName,
        user_id: user_id,
        ROLES: ROLES,
      };
      res.json(userData);
      console.log("user has been authenticated", user);
      console.log("userData has been authenticated", userData);
    });
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
});
//dashboard___________re-authentication__________________
// Define routes for Google authentication
router.get("/login/federated/google", passport.authenticate("google"));
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const findUserQuery = "SELECT * FROM users WHERE id = ?";
  pool.query(findUserQuery, [id], (err, result) => {
    if (err) {
      console.error("Error querying the database:", err);
      return done(err);
    }
    if (result.length === 0) {
      return done(null, false);
    }
    const user = result[0];
    return done(null, user);
  });
});

// Profile route after successful login
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    res.render("profile", { user: user }); // Render the profile view
  } else {
    res.redirect("/");
  }
});

// Define an linkedin route___________________________________
let linkedinId;
const clientId = "86p5hp5w3t7zsx";
const clientSecret = "MxkM1Y7zGQFGvGdJ";
const redirectUri = "http://localhost:8080/auth/linkedin/callback";
const scope = "openid profile email";
const state = "signin:1";
app.get("/auth/linkedin", (req, res) => {
  req.session.req.session.regenerate((err) => {
    if (err) {
      console.log(err);
    } else {
      const authorizationUrl =
        `https://www.linkedin.com/oauth/v2/authorization` +
        `?response_type=code` +
        `&client_id=${clientId}` +
        `&redirect_uri=${redirectUri}` +
        `&scope=${scope}` +
        `&state=${state}` +
        `&prompt=consent` +
        `&max_age=0`;
      res.redirect(authorizationUrl);
    }
  });
});
app.get("/auth/linkedin/callback", async (req, res) => {
  const authorizationCode = req.query.code;
  console.log("this is authorisationCode", authorizationCode);
  const tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
  const tokenData = {
    grant_type: "authorization_code",
    code: authorizationCode,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  };
  const queryString = Object.entries(tokenData)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  const finalUrl = `${tokenUrl}?${queryString}`;
  console.log("this is 1184", finalUrl);
  console.log("this is TokenData line 1175", tokenData);
  const newState = req.body.state;
  console.log("line 1177 state", newState);
  try {
    const tokenResponse = await axios.post(
      tokenUrl,
      querystring.stringify(tokenData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    console.log("line 1168", accessToken);
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("this is TokenData", tokenData);
    const newState = req.body.state;
    console.log("state", newState);
    console.log("Profile Data:", profileResponse.data);
    linkedinId = profileResponse.data.sub;
    req.session.linkedinId = linkedinId;
    const linkedinEmail = profileResponse.data.email;
    const linkedinDisplayName = profileResponse.data.name;
    const findLinkedinUserQuery = "SELECT * FROM users WHERE linkedin_Id=?";
    try {
      const result = await executeQuery(findLinkedinUserQuery, [linkedinId]);
      if (result.length === 0) {
        const insertLinkedinUserQuery =
          "INSERT INTO users (linkedin_Id, email, user_name) VALUES (?, ?, ?)";
        //User does not exists,create a new entry
        const values = [linkedinId, linkedinEmail, linkedinDisplayName];
        await executeQuery(insertLinkedinUserQuery, values);
      }
      req.session.userData = {
        user_id: result[0].user_id,
        username: result[0].user_name,
        email: result[0].email,
      };
      res.redirect("http://localhost:8080/dashboard.html");
    } catch (error) {
      console.error("Error finding or inserting LinkedIn user:", error.message);
      res.status(500).send({ error: "Authentication failed" });
    }
    // Perform actions with the profile data, e.g., store in the database
    // res.send({
    //   profileResponse,
    // });
  } catch (error) {
    console.error("Error getting access token:", error.message);
    console.error("Error getting access token 1182:", error);
    res.status(500).send({ error: "Authentication failed" });
  }
});
app.post("/auth/revoke", async (req, res) => {
  const accessToken = req.body.access_token;
  const revokeUrl = "https://www.linkedin.com/oauth/v2/revoke";
  const revokeData = {
    token: accessToken,
    client_id: clientId,
    client_secret: clientSecret,
  };
  try {
    await axios.post(revokeUrl, querystring.stringify(revokeData), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    res.send({ message: "Token revoked successfully" });
  } catch (error) {
    console.error("Error revoking token:", error.message);
    res.status(500).send({ error: "Revocation failed" });
  }
});
//Sending the linkedin-data to front-end___________________________________________
app.get("/linkedin-user-data", async (req, res) => {
  try {
    // Extract the LinkedIn ID from the session
    linkedinId = req.session.linkedinId;
    console.log("this is linkedinId", linkedinId);
    // Query the MySQL database to fetch user data based on the LinkedIn ID
    const findLinkedinUserQuery =
      "SELECT user_id, user_name, email FROM users WHERE linkedin_Id=?";
    const result = await executeQuery(findLinkedinUserQuery, [linkedinId]);

    if (result.length === 0) {
      res.status(404).json({ error: "User data not found" });
    } else {
      // Send the user data as JSON response
      const userData = {
        user_id: result[0].user_id,
        username: result[0].user_name,
        email: result[0].email,
      };
      res.json(userData);
    }
  } catch (error) {
    console.error("Error fetching LinkedIn user data:", error.message);
    res.status(500).json({ error: "Error fetching user data" });
  }
});

//account_______________________________________________
app.get("/account", ensureAuthenticated, function (req, res) {
  res.render("account", { user: req.user });
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

//Send REquest to admin______________________________________________________________________________________________________________
// Assuming you have already established a connection to your MySQL database
app.post("/user-action", (req, res) => {
  const { action } = req.body; // You can pass additional data in the request body
  if (action === "confirm") {
    // Send a response to the client
    res.json({ message: "Action confirmed!" });
  } else {
    res.json({ message: "Action canceled or invalid!" });
  }
});
//this is insert Notification_______________________________________________________________________________________________________________
// Assuming you have already defined your 'pool' object as you mentioned

app.post("/insertNotification", (req, res) => {
  // Extract data from the request body
  let { user_id, file_name, operation, old_value, new_value, rowId } = req.body;

  // Fill null or undefined values with "N/A"
  user_id = user_id || "N/A";
  file_name = file_name || "N/A";
  operation = operation || "N/A";
  old_value = old_value ? JSON.stringify(old_value) : "N/A";
  new_value = new_value ? JSON.stringify(new_value) : "N/A";
  rowId = rowId || "N/A";

  console.log("Received request to insert notification data.");
  console.log("User ID:", user_id);
  console.log("File Name:", file_name);
  console.log("Operation:", operation);
  console.log("Old Value:", old_value);
  console.log("New Value:", new_value);
  console.log("Row ID:", rowId);

  // Get a connection from the existing pool
  console.log("Getting a connection from the pool...");
  pool.getConnection((err, poolConnection) => {
    if (err) {
      console.error("Error getting a connection from the pool:", err);
      res.status(500).json({ error: "Error inserting notification data" });
      return;
    }

    console.log("Connection obtained from the pool.");

    // Perform the database insert operation into the 'notify' table
    const sql =
      "INSERT INTO notify (user_id, file_name, operation, old_value, new_value, rowId) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [user_id, file_name, operation, old_value, new_value, rowId];

    console.log("Executing SQL query:", sql);
    console.log("Query values:", values);

    // Execute the query
    poolConnection.query(sql, values, (error, results) => {
      // Release the connection back to the pool
      poolConnection.release();

      if (error) {
        console.error("Error inserting notification data:", error);
        res.status(500).json({ error: "Error inserting notification data" });
      } else {
        console.log("Notification data inserted successfully.");
        res.json({ message: "Notification data inserted successfully" });
      }
    });
  });
});
//route to user_

//requesting for notify table data___________________________________________________________________________________________________
// Add a route to retrieve data from the 'notify' table
app.get("/getNotifyData", (req, res) => {
  const selectQuery = "SELECT * FROM notify";

  pool.query(selectQuery, (error, results) => {
    if (error) {
      console.error("Error retrieving data from notify table:", error);
      res
        .status(500)
        .json({ error: "Error retrieving data from notify table" });
    } else {
      res.status(200).json(results);
    }
  });
});

//get the user-messages________________________________________________________________________
app.post("/sendNotifyUser", (req, res) => {
  // Extract data from the request body
  const { userId, tableName, message } = req.body;

  console.log("Received request to insert notification data.");
  console.log("User ID:", userId);
  console.log("File Name:", tableName);
  console.log("Message:", message);

  // Get a connection from the existing pool
  console.log("Getting a connection from the pool...");
  pool.getConnection((err, poolConnection) => {
    if (err) {
      console.error("Error getting a connection from the pool:", err);
      res.status(500).json({ error: "Error inserting notification data" });
      return;
    }

    console.log("Connection obtained from the pool.");

    // Perform the database insert operation into the 'usernotify' table
    const sql =
      "INSERT INTO usernotify (user_id, file_name, message) VALUES (?, ?, ?)";
    const values = [userId, tableName, message];

    console.log("Executing SQL query:", sql);
    console.log("Query values:", values);

    // Execute the query
    poolConnection.query(sql, values, (error, results) => {
      // Release the connection back to the pool
      poolConnection.release();

      if (error) {
        console.error("Error inserting notification data:", error);
        res.status(500).json({ error: "Error inserting notification data" });
      } else {
        console.log("Notification data inserted successfully.");
        res.json({ message: "Notification data inserted successfully" });
      }
    });
  });
});
//get the user-messages_______________________________________________________________________
app.get("/getUserNotifications", (req, res) => {
  // Query to retrieve data from the usernotify table
  const sql = "SELECT * FROM usernotify";

  // Execute the query
  pool.query(sql, (error, results) => {
    if (error) {
      console.error("Error retrieving user notifications:", error);
      res.status(500).json({ error: "Error retrieving user notifications" });
    } else {
      // Send the retrieved data to the client
      res.json(results);
    }
  });
});

// Start the server__________________________________________________________________________________________________________________
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
//end of the code

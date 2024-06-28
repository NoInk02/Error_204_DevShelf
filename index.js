const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");

const usersFilePath = path.join(__dirname, "users.json");
const datasetPath = path.join(__dirname, 'UpdatedDatasetSOI.json');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

let books = [];

// Load books data from JSON file
fs.readFile(datasetPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }
  try {
    books = JSON.parse(data);
    console.log('Books data loaded successfully');
  } catch (jsonErr) {
    console.error('Error parsing JSON file:', jsonErr);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Received login request:", email, password);

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      return res.status(500).send("Server error");
    }

    try {
      const users = JSON.parse(data);
      const user = users.find((user) => user.email === email && user.password === password);

      if (user) {
        const encodedBooksIssued = encodeURIComponent(JSON.stringify(user.books_issued));
        res.redirect(`/profile.html?username=${user.username}&email=${user.email}&fav_author=${user.favourite_author}&fav_book=${user.favourite_book}&books_issued=${encodedBooksIssued}`);
      } else {
        res.send("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error parsing users data:", error);
      res.status(500).send("Server error");
    }
  });
});

app.post("/register", (req, res) => {
  const { username, email, password, favourite_book, favourite_author } = req.body;

  const newUser = {
    username,
    email,
    password,
    favourite_book,
    favourite_author,
    books_issued: []
  };

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      return res.status(500).send("Server error");
    }

    const users = data ? JSON.parse(data) : [];

    if (users.find((user) => user.username === username)) {
      return res.send("Username already taken");
    }

    users.push(newUser);

    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Server error");
      }
      res.send('Registration successful. You can now <a href="/">login</a>.');
    });
  });
});

app.get('/search', (req, res) => {
  const title = req.query.title.toLowerCase();
  const bookMatches = books.filter(b => b.title.toLowerCase().includes(title));

  if (bookMatches.length > 0) {
    res.json(bookMatches);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

app.post('/add-to-cart', (req, res) => {
  const { email, title } = req.body;

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      return res.status(500).send("Server error");
    }

    try {
      const users = JSON.parse(data);
      const user = users.find((user) => user.email === email);

      if (user) {
        const book = books.find(b => b.title === title);
        if (book && book.count > 0) {
          book.count -= 1;
          user.books_issued.push(title);

          // Save updated users
          fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
              console.error("Error writing to users file:", err);
              return res.status(500).send("Server error");
            }

            // Save updated books
            fs.writeFile(datasetPath, JSON.stringify(books, null, 2), (err) => {
              if (err) {
                console.error("Error writing to books file:", err);
                return res.status(500).send("Server error");
              }

              res.send("Book added to cart and count updated successfully.");
            });
          });
        } else {
          res.status(404).send("Book not found or out of stock");
        }
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error parsing users data:", error);
      res.status(500).send("Server error");
    }
  });
});

app.get('/profile', (req, res) => {
  const email = req.query.email;

  fs.readFile(usersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading users file:", err);
      return res.status(500).send("Server error");
    }

    try {
      const users = JSON.parse(data);
      const user = users.find((user) => user.email === email);

      if (user) {
        res.json(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error("Error parsing users data:", error);
      res.status(500).send("Server error");
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.post("/submit", async (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const address = req.body.address;
  const state = req.body.state;
  const whatsapp = req.body.whatsapp;
  const earbud_colour = req.body.earbud_colour;
  const fan_colour = req.body.fan_colour;
  const comment = req.body.comment;
  try {
      const result = await db.query(
        "INSERT INTO users (name, phone_number, address, state, whatsapp_number,  earbud_colour, fan_colour, comment) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
        [ name, phone, address, state, whatsapp, earbud_colour, fan_colour, comment, ]
        
      );
      console.log(result);
      res.render("thank-you.ejs");
    } catch (err) {
      console.log(err);
    }
});

app.post("/login", async (req, res) => {
  const email =req.body.username;
  const password = req.body.password;
  
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      if (password === storedPassword) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


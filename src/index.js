const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(cors());

const { port, dbconfig } = require("./config");

// app.get("/api/fill", async (req, res) => {
//   try {
//     const users = await fetch("https://jsonplaceholder.typicode.com/users");

//     const usersResponse = await users.json();
//     const userId = usersResponse.id;
//     // const userName = usersResponse.name;
//     // const userEmail = usersResponse.email;
//     //const userAddress = `${usersResponse.address.city} ${usersResponse.address.street}`;

//     const con = await mysql.createConnection(dbconfig);
//     for (const user of usersResponse) {
//       await con.execute(
//         `INSERT INTO users (name, email, address) VALUES ( ${user.name}, ${user.email}, ${user.address.city})`
//       );
//     }

app.get("/fill", async (req, res) => {
  try {
    const users = await fetch("https://jsonplaceholder.typicode.com/users");

    const usersResponse = await users.json();

    const userId = usersResponse[0].id;

    const userName = usersResponse[0].name;

    const userEmail = usersResponse[0].email;

    const userAddress = `${usersResponse[0].address.street} ${usersResponse[0].address.city}`;

    const con = await mysql.createConnection(dbconfig);
    for (const user of usersResponse) {
      await con.execute(
        `INSERT INTO users (name, email, address) values ( ${mysql.escape(
          userName
        )}, ${mysql.escape(userEmail)}, ${mysql.escape(userAddress)})`
      );
    }

    const [response] = await con.execute("SELECT * FROM users");
    await con.end();
    res.send(response);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error" });
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ error: "Page not found" });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

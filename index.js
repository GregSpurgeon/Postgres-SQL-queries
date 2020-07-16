const { Client } = require('pg');
const express = require('express');

// create an express application
const app = express();
app.use(express.json());
// create a postgresql client
const client = new Client({
    database: 'social-media'
});

// route handlers go here
app.get('/users', async (req, res) => {
  try{ await
      client.query('SELECT * FROM users', (err, result) => {
      res.send(result.rows);
  });
  }catch(err){
    req.log.error(err.message);
    res.status(500).send("Internal Server Error");
    }
})

app.get('/users/:id', async (req, res) => {
  // console.log(req.params.id)
try{ await
  client.query(`SELECT * FROM users WHERE id = ${req.params.id}`, (err, result) => {
    res.send(result.rows[0]);
  });
}catch(err){
    req.log.error(err.message);
    res.status(404).send("Page not found");
  }
});

app.post('/users', (req, res) => {
  const text = 'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *';
  const values = [req.body.username, req.body.bio];
    client.query(text, values, (err, result) => {
      console.log(result.rows[0]);
      res.send(result.rows[0])
    });
  });




// start a server that listens on port 3000 and connects the sql client on success
app.listen(3000, () => {
    client.connect();
    console.log("listening on port 3000")
});

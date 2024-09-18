const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const knex = require('knex')(require('./knexfile').development);

const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });



app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/src/js'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/src/views');



// Function to index a comment
const indexComment = async (comment) => {
    await client.index({
      index: 'comments',
      document: {
        text: comment.text,
        date: comment.date,
      },
    });
  };

  // Function to search comments
const searchComments = async (query) => {
    const { body } = await client.search({
      index: 'comments',
      body: {
        query: {
          match: { text: query },
        },
      },
    });
    return body.hits.hits.map(hit => hit._source);
  };

// Route to get comments
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await knex('comments').orderBy('date', 'desc');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comments' });
  }
});

// Route to add a comment
app.post('/api/comments', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }
    const [id] = await knex('comments').insert({
      text,
      date: new Date()
    });
    const newComment = await knex('comments').where({ id }).first();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Error adding comment' });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.render('index'); // Serve the React app from your Pug template
});


app.listen(3000, function () {
    console.log('listening on port 3000');
  });
  
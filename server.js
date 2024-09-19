const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex')(require('./knexfile').development);
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' });

const app = express();

app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/src/js'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/src/views');

// Index a comment
const indexComment = async (comment) => {
  await client.index({
    index: 'comments',
    id: comment.id,
    document: {
      text: comment.text,
      date: comment.date,
    },
  });
};

// Search for comments
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

// Clear the Elasticsearch index
const clearCommentsIndex = async () => {
  await client.deleteByQuery({
    index: 'comments',
    body: {
      query: { match_all: {} },
    },
  });
};

// Route to get comments
app.get('/api/comments', async (req, res) => {
  try {
    // Fetch comments from the database
    const comments = await knex('comments').orderBy('date', 'desc');
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);  // Log the exact error
    res.status(500).json({ error: 'Error fetching comments from the database' });
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
    
    // Index the comment in Elasticsearch
    await indexComment(newComment);

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Error adding comment' });
  }
});

// Route to clear all comments from the database and Elasticsearch
app.delete('/api/comments', async (req, res) => {
  try {
    await knex('comments').del();
    await clearCommentsIndex(); // Optionally clear Elasticsearch index if using it
    res.status(200).json({ message: 'All comments cleared' });
  } catch (error) {
    console.error('Error clearing comments:', error);
    res.status(500).json({ error: 'Error clearing comments' });
  }
});

// Route to search comments using Elasticsearch
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const results = await searchComments(query);
    res.json(results);
  } catch (error) {
    console.error('Error searching comments:', error);
    res.status(500).json({ error: 'Error searching comments' });
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.render('index'); // Serve the React app from your Pug template
});

app.listen(3000, function () {
  console.log('listening on port 3000');
});

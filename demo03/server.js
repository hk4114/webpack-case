const express = require('express');

const app = express();

app.get('/api/info.json', (req, res)=> {
  res.json({
    name: 'kane',
    age: 5,
    msg: 'success'
  })
})

app.listen('9092')
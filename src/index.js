const express = require('express');
const { handleTaskRequest } = require('./controllers/taskController');

const app = express();

app.use(express.json()); 

app.post('/task', handleTaskRequest);

const PORT = process.env.PORT || 3002;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;

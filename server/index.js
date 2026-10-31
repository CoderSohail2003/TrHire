require('dotenv').config();

const { app, connectDatabase } = require('./app');

const PORT = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB Error:', error);
    process.exitCode = 1;
  });

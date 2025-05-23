const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors');


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on PORT:${PORT}`);
});
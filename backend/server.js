const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const fieldsRoutes = require('./routes/fields');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SmartSeason Field Monitoring System API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldsRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

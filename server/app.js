import express from 'express';
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

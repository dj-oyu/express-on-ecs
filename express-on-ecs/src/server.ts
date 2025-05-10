import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// APIエンドポイント
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// ルートアクセスはindex.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

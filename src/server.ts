import 'dotenv/config';

import app from './app.js';

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

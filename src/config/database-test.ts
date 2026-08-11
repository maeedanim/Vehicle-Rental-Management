import database from './database.js';

const testDatabaseConnection = async (): Promise<void> => {
  try {
    await database.raw('SELECT 1');

    console.log('PostgreSQL connection successful');
  } catch (error: unknown) {
    console.error('PostgreSQL connection failed:', error);

    process.exitCode = 1;
  } finally {
    await database.destroy();
  }
};

void testDatabaseConnection();
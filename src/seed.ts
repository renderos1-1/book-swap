import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'book_swap',
  entities: [User, Book],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const bookRepository = AppDataSource.getRepository(Book);

  const user = await userRepository.save({
    email: 'test@esen.edu.sv',
    name: 'Test User',
    password: 'password123',
  });

  await bookRepository.save([
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'A classic American novel',
      owner: user,
    },
    {
      title: '1984',
      author: 'George Orwell',
      description: 'A dystopian social science fiction novel',
      owner: user,
    },
  ]);

  console.log('Seeders ejecutados correctamente!');
  await AppDataSource.destroy();
}

seed().catch(console.error);

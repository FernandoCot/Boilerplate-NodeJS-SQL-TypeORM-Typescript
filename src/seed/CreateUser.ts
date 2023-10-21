// Entities
import { User } from '../entity/User';

// Other
import { AppDataSource } from "../data-source";

const userRepository = AppDataSource.manager.getRepository(User);

export class UserSeed {
  public static async run(): Promise<void> {
    const usersData = [
      {
        name: 'Test User',
        email: 'test@gmail.com',
        password: '$2a$10$e2wOcsbS583Zu0turydzBOyJ2l4Pc7o.t29GbjsV.2w4ZcoqJjZdG', // 12345678
      },
    ];

    for (const userData of usersData) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
    }

    console.log('Users seeded successfully!');
  }
}

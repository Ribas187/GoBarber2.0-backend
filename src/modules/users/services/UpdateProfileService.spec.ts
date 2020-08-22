import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProvider', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Teste',
      email: 'john@email.com',
    });

    expect(updatedUser.name).toBe('John Teste');
    expect(updatedUser.email).toBe('john@email.com');
  });

  it('should not be able to show the profile from non-existing user', async () => {
    expect(
      updateProfile.execute({
        user_id: 'non-existing',
        name: 'John Teste',
        email: 'john@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Teste',
      email: 'teste@email.com',
      password: 'teste1',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'nome@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Teste',
      email: 'john@email.com',
      password: '123123',
      old_password: 'teste',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Teste',
        email: 'john@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Teste',
        email: 'john@email.com',
        password: '123123',
        old_password: 'wrong_old_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

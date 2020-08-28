"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _UpdateProfileService = _interopRequireDefault(require("./UpdateProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeHashProvider;
let updateProfile;
describe('UpdateProvider', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    updateProfile = new _UpdateProfileService.default(fakeUsersRepository, fakeHashProvider);
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Teste',
      email: 'john@email.com'
    });
    expect(updatedUser.name).toBe('John Teste');
    expect(updatedUser.email).toBe('john@email.com');
  });
  it('should not be able to show the profile from non-existing user', async () => {
    expect(updateProfile.execute({
      user_id: 'non-existing',
      name: 'John Teste',
      email: 'john@email.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste'
    });
    const user = await fakeUsersRepository.create({
      name: 'John Teste',
      email: 'teste@email.com',
      password: 'teste1'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'nome@email.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste'
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Teste',
      email: 'john@email.com',
      password: '123123',
      old_password: 'teste'
    });
    expect(updatedUser.password).toBe('123123');
  });
  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Teste',
      email: 'john@email.com',
      password: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to update the password without wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste'
    });
    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Teste',
      email: 'john@email.com',
      password: '123123',
      old_password: 'wrong_old_password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});
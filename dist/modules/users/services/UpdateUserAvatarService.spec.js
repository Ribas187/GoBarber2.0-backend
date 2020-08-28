"use strict";

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeStorageProvider = _interopRequireDefault(require("../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));

var _FakeUsersRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersRepository"));

var _UpdateUserAvatarService = _interopRequireDefault(require("./UpdateUserAvatarService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUsersRepository;
let fakeStorageProvider;
let updateUserAvatar;
describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new _FakeUsersRepository.default();
    fakeStorageProvider = new _FakeStorageProvider.default();
    updateUserAvatar = new _UpdateUserAvatarService.default(fakeUsersRepository, fakeStorageProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png'
    });
    expect(user.avatar).toBe('avatar.png');
  });
  it('should not be able to update avatar from non existing user', async () => {
    await expect(updateUserAvatar.execute({
      user_id: 'non-existing',
      avatarFilename: 'avatar.png'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'nome@email.com',
      password: 'teste'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.png'
    });
    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'newAvatar.png'
    });
    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('newAvatar.png');
  });
});
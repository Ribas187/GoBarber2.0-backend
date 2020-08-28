"use strict";

var _tsyringe = require("tsyringe");

var _DiskStorageProvider = _interopRequireDefault(require("./StorageProvider/implementations/DiskStorageProvider"));

var _EtherealMailProvider = _interopRequireDefault(require("./MailProvider/implementations/EtherealMailProvider"));

var _HandlebarsMailTemplateProvider = _interopRequireDefault(require("./MailTemplateProvider/implementations/HandlebarsMailTemplateProvider"));

var _RedisCacheProvider = _interopRequireDefault(require("./CacheProvider/implementations/RedisCacheProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('StorageProvider', _DiskStorageProvider.default);

_tsyringe.container.registerSingleton('MailTemplateProvider', _HandlebarsMailTemplateProvider.default);

_tsyringe.container.registerInstance('MailProvider', _tsyringe.container.resolve(_EtherealMailProvider.default));

_tsyringe.container.registerSingleton('CacheProvider', _RedisCacheProvider.default);
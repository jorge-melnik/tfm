import { test } from 'node:test';
import * as assert from 'node:assert';
import authRepository from '@repositories/auth.repository.js';
import { UnAuthenticatedError } from '@errors/response.errors.js';

test('AuthRepository - Login Suite', async (t) => {
  await t.test('emailLogin()', async (st) => {
    await st.test('Login exitoso', async () => {
      // Arrange
      const uniqueId = Date.now();
      const email = `l-${uniqueId}@test.com`;
      const password = 'Password.123';

      await authRepository.register({
        email,
        nombres: 'Test',
        apellidos: 'Login',
        username: `u-l-${uniqueId}`,
        celular: `+${uniqueId}`,
        password,
        password2: password,
        roles: ['CONSUMIDOR'],
        consumidor: {},
      });

      // Act
      const usuario = await authRepository.emailLogin(email, password);

      // Assert
      assert.ok(usuario.id_usuario);
      assert.ok(Array.isArray(usuario.roles));
      assert.ok(usuario.roles.includes('CONSUMIDOR'));
    });

    await st.test('Login que falla', async () => {
      // Arrange
      const uniqueId = Date.now();
      const email = `err-${uniqueId}@test.com`;
      const passwordCorrecto = 'Contraseña.1';

      await authRepository.register({
        email,
        nombres: 'Test',
        apellidos: 'Error',
        username: `u-err-${uniqueId}`,
        celular: `+${uniqueId}`,
        password: passwordCorrecto,
        password2: passwordCorrecto,
        roles: ['CONSUMIDOR'],
        consumidor: {},
      });

      // Act & Assert
      await assert.rejects(authRepository.emailLogin(email, 'PasswordEquivocado'), (err: any) => {
        assert.ok(err instanceof UnAuthenticatedError);
        return true;
      });
    });

    await st.test('Login que falla por email', async () => {
      // Act & Assert

      await assert.rejects(authRepository.emailLogin('no-existe@test.com', 'CualquierPass.1'), (err: any) => {
        assert.ok(err instanceof UnAuthenticatedError);
        return true;
      });
    });
  });

  await t.test('usernameLogin()', async (st) => {
    await st.test('Login exitoso con username', async () => {
      // Arrange
      const uniqueId = Date.now();
      const username = `u-un-${uniqueId}`;
      const password = 'Password.123';

      await authRepository.register({
        email: `un-${uniqueId}@test.com`,
        nombres: 'Test',
        apellidos: 'Login',
        username,
        celular: `+${uniqueId}`,
        password,
        password2: password,
        roles: ['CONSUMIDOR'],
        consumidor: {},
      });

      // Act
      const usuario = await authRepository.usernameLogin(username, password);

      // Assert
      assert.ok(usuario.id_usuario);
      assert.ok(Array.isArray(usuario.roles));
      assert.ok(usuario.roles.includes('CONSUMIDOR'));
    });

    await st.test('Login que falla por password incorrecto', async () => {
      // Arrange
      const uniqueId = Date.now();
      const username = `u-uerr-${uniqueId}`;
      const passwordCorrecto = 'Contraseña.1';

      await authRepository.register({
        email: `uerr-${uniqueId}@test.com`,
        nombres: 'Test',
        apellidos: 'Error',
        username,
        celular: `+${uniqueId}`,
        password: passwordCorrecto,
        password2: passwordCorrecto,
        roles: ['CONSUMIDOR'],
        consumidor: {},
      });

      // Act & Assert
      await assert.rejects(authRepository.usernameLogin(username, 'PasswordEquivocado'), (err: any) => {
        assert.ok(err instanceof UnAuthenticatedError);
        return true;
      });
    });

    await st.test('Login que falla por username inexistente', async () => {
      // Act & Assert
      await assert.rejects(authRepository.usernameLogin('no-existe-user', 'CualquierPass.1'), (err: any) => {
        assert.ok(err instanceof UnAuthenticatedError);
        return true;
      });
    });
  });
});

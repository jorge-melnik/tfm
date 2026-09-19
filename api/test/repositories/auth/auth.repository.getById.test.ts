import { test } from 'node:test';
import * as assert from 'node:assert';
import authRepository from '@repositories/auth.repository.js';
import { NotFound } from '@errors/response.errors.js';
import { Profile, RegisterSchema } from '@schemas/auth.schema.js';

test('AuthRepository - Profile Suite', async (t) => {
  await t.test('getUserById()', async (st) => {
    await st.test('Debe retornar el perfil completo de un usuario existente', async () => {
      // Arrange: Primero registramos para tener un ID real
      const uniqueId = Date.now();
      const email = `p-${uniqueId}@test.com`;
      const password = 'Password.123';

      // Necesitamos el ID. Como register no lo devuelve,
      // lo recuperamos con emailLogin tras registrar.
      const datosRegistro: RegisterSchema = {
        email,
        nombres: 'Perfil',
        apellidos: 'Test',
        username: `u-p-${uniqueId}`,
        celular: `+${uniqueId}`,
        password,
        password2: password,
        roles: ['CONSUMIDOR'],
        consumidor: {},
      };
      await authRepository.register(datosRegistro);

      const { id_usuario } = await authRepository.emailLogin(email, password);

      // Act
      const perfil: Profile = await authRepository.getUserById(id_usuario);

      // Assert
      assert.strictEqual(perfil.id_usuario, id_usuario);
      assert.ok(Array.isArray(perfil.roles), 'Roles debería ser un array');
      assert.strictEqual(perfil.rol_actual, 'CONSUMIDOR');
      assert.equal(perfil.username, datosRegistro.username);
    });

    await st.test('Debe lanzar NotFound si el id_usuario no existe', async () => {
      const idInexistente = '00000000-0000-0000-0000-000000000000'; //UUID que no existe.

      // Act & Assert
      await assert.rejects(authRepository.getUserById(idInexistente), (err: any) => {
        assert.ok(err instanceof NotFound);
        return true;
      });
    });
  });
});

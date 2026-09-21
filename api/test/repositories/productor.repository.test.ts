import { myPool } from '@database/pool.js';
import { InternalError } from '@errors/response.errors.js';
import authRepository from '@repositories/auth.repository.js';
import { productorRepository } from '@repositories/productor.repository.js';
import assert from 'node:assert';
import test from 'node:test';

await test('activarConsumidor() y activarProductor() - Casos de error', async (st) => {
  // 1. Arrange: Creamos un usuario base usando register
  const uniqueId = 'act' + Date.now();
  const email = `${uniqueId}@test.com`;
  await authRepository.register({
    email,
    nombres: 'Test',
    apellidos: 'Activacion',
    username: `u-${uniqueId}`,
    celular: `+5${Date.now()}`,
    password: 'Contraseña.1',
    password2: 'Contraseña.1',
    roles: ['CONSUMIDOR', 'PRODUCTOR'], // Solo consumidor al empezar
    consumidor: {},
    productor: { presentacion: 'La presentacion.' },
  });

  // Obtenemos el id para las pruebas directas
  const { rows } = await myPool.query('SELECT id_usuario FROM datos_personales WHERE email = $1', [email]);
  const { id_usuario } = rows[0];

  await st.test('Debe fallar si se intenta activar un CONSUMIDOR que ya existe', async () => {
    // Act & Assert
    // Como ya se activó en el register, esto debe lanzar un error de Unique Constraint
    await assert.rejects(
      productorRepository.activarConsumidor(id_usuario, { id_consumidor: id_usuario }),
      (err: any) => {
        assert.ok(err instanceof InternalError);
        return true;
      },
    );
  });

  await st.test('Metodo no permitido activate', async () => {
    await assert.rejects(productorRepository.activate(id_usuario), (err: any) => {
      assert.ok(err instanceof InternalError);
      return true;
    });
  });
});

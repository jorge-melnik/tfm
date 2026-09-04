import { BaseRepository } from '@repositories/base.repository.js';
import { myPool } from '../../database/pool.js';
import { Departamento } from '../../schemas/departamento.schema.js';

const baseUrl = 'https://direcciones.ide.uy/api/v0/geocode/localidades?alias=true&departamento=';

type LocalidadIdeuy = {
  id: number;
  nombre: string;
  codigoPostal: number;
  id_departamento: number;
  departamento: string;
  localidad: string;
};

async function getLocalidadesDepto(departamento: Departamento): Promise<LocalidadIdeuy[]> {
  const url = baseUrl + departamento.nombre;
  console.log(url);
  const res = await fetch(url);
  const localidades: LocalidadIdeuy[] = (await res.json()) as LocalidadIdeuy[];
  return localidades.map((d) => {
    return {
      ...d,
      departamento: departamento.nombre,
      id_departamento: departamento.id_departamento,
      localidad: d.nombre
        .toString()
        .normalize('NFD') // Separa acentos
        .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
        .toLowerCase()
        .replace(/\s+/g, '-') // Espacios por guiones
        .replace(/[^\w-]+/g, '') // Elimina todo lo que no sea letra, número o guion
        .replace(/--+/g, '-') // Evita guiones dobles
        .replace(/^-+/, '') // Quita guiones al inicio
        .replace(/-+$/, ''), // Quita guiones al final };
    };
  });
}

async function getLocalidades() {
  const res = await myPool.query('SELECT * FROM public.departamentos;');
  const departamentos: Departamento[] = res.rows;

  const localidadesIdeUyPromise = departamentos.map(async (departamento) => {
    return getLocalidadesDepto(departamento);
  });
  const localidadesIdeUy = await Promise.all(localidadesIdeUyPromise);
  return localidadesIdeUy.flat(); //uno todos los array de localidades de cada depto
}
async function syncLocalidades() {
  const localidades = await getLocalidades();

  if (localidades.length === 0) return;

  const idsDepartamento = localidades.map((l) => l.id_departamento);
  const nombres = localidades.map((l) => l.nombre.trim());
  const codigosPostales = localidades.map((l) => (l.codigoPostal ? Number(l.codigoPostal) : null));
  const slugLocalidades = localidades.map((l) => l.localidad);

  const query = `
    WITH MIS_LOCALIDADES AS (
      SELECT 
        u.id_dept, 
        u.nom, 
        u.cp,
        u.slug
      FROM UNNEST(
        $1::INTEGER[], 
        $2::CITEXT[], 
        $3::INTEGER[],
        $4::CITEXT[]
      ) AS u(id_dept, nom, cp, slug)
    )
    INSERT INTO localidades (id_departamento, nombre, codigo_postal, localidad)
    SELECT 
      ML.id_dept,
      ML.nom,
      ML.cp,
      ML.slug
    FROM MIS_LOCALIDADES ML
    LEFT JOIN localidades l ON l.id_departamento = ML.id_dept AND l.localidad = ML.slug
    WHERE l.id_localidad IS NULL; -- Solo los que no existen
  `;

  try {
    const result = await myPool.query(query, [idsDepartamento, nombres, codigosPostales, slugLocalidades]);
    console.log(`Sincronización completada. Filas insertadas: ${result.rowCount}`);
  } catch (error) {
    console.error('Error al insertar localidades:', error);
  }
}

syncLocalidades();

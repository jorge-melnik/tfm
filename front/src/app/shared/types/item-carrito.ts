export type ItemCarritoVerbose = {
  id_productor: string;
  id_producto: number;
  id_consumidor: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  username: string;
  nombre: string;
  descripcion: string;
  producto: string;
  fotos: string[];
  cantidad_disponible: number;
};

export type Carrito = {
  id_consumidor: string;
  cantidad_items: number;
  cantidad_productos_distintos: number;
  total: string;
};

export type ItemCarrito = Pick<ItemCarritoVerbose, 'id_productor' | 'id_producto' | 'cantidad'>;

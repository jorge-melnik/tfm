En el directorio shared ubicaremos todos los archivos con código que se puede instanciar en distintos lugares. Como por ejemplo:

- Components: Componentes que pueden ser utilizados e instanciados en múltiples lugares. Componentes tontos que solo reciben y procesan datos dentro del mismo componente. No consumen la api.
- directives: Directivas personalizas, sea para validadores con FormsModule u otras.
- models: interfaces/types que representan el dominio.
- pipes: tuberías que sean necesarias. Ejemplo agregar signo de $ o $U en los importes.
- validators: Funciones validator que sirven para reactive forms module o para forms module a travéz de una directiva.

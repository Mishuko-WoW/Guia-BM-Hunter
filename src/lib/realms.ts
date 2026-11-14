// Versiones de la guía. Para poner un logo oficial: guarda la imagen en public/brand/realms/
// y rellena `logo` con su ruta. Si `logo` está vacío la tarjeta de portada muestra texto.
// Logos oficiales: Blizzard Press Center (blizzard.gamespress.com), reducidos a WebP.
export type RealmId = 'midnight' | 'forever';

export type Realm = {
  id: RealmId;
  nombre: string;       // texto del selector
  titulo: string;       // texto grande de la tarjeta de portada (si no hay logo)
  subtitulo: string;
  href: string;
  logo?: string;
  etiqueta?: string;    // chip sobre la tarjeta ("NUEVO", "PRÓXIMAMENTE"…)
  disponible: boolean;  // false = página "en construcción"
  estado?: string;
  extra?: { texto: string; href: string }; // enlace secundario en la tarjeta de portada      // texto bajo el subtítulo en la portada (si falta, uno genérico)
};

export const REALMS: Realm[] = [
  {
    id: 'midnight',
    nombre: 'Midnight',
    titulo: 'Midnight',
    subtitulo: 'Guía Hunter BM · Temporada 2',
    href: '/midnight/',
    logo: '/brand/realms/midnight.webp',
    disponible: true,
  },
  {
    id: 'forever',
    nombre: 'Forever',
    titulo: 'Forever',
    subtitulo: 'Guía Hunter BM',
    href: '/forever/',
    logo: '/brand/realms/forever.webp',
    etiqueta: 'Nuevo',
    disponible: true,
    estado: 'General, talentos, rotación, mascotas y leveling 1-60 · se amplía cada día',
    extra: { texto: 'O ve directo al leveling 1-60', href: '/forever/leveling/' },
  },
];

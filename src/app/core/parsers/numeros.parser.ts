export interface TokenInvalido {
  token: string;
  posicion: number;
}

export interface ParseoNumeros {
  valores: number[];
  invalidos: TokenInvalido[];
  avisos: string[];
}

const NUMERO = /^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/;
const DECIMAL_COMA = /^[-+]?\d+,\d+([eE][-+]?\d+)?$/;

/**
 * Interpreta texto con números separados por coma, punto y coma, espacio o
 * salto de línea. Una coma entre dígitos sin espacios (p. ej. "2,2") se lee
 * como decimal; con varias comas seguidas ("1,2,3") se lee como separador.
 */
export function parsearNumeros(texto: string): ParseoNumeros {
  const valores: number[] = [];
  const invalidos: TokenInvalido[] = [];
  const avisos: string[] = [];
  let posicion = 0;

  const gruesos = (texto ?? '').split(/[;\s]+/).filter((t) => t.length > 0);
  for (const grueso of gruesos) {
    const limpio = grueso.replace(/^,+|,+$/g, '');
    if (limpio === '') continue;
    let partes: string[];
    if (DECIMAL_COMA.test(limpio)) {
      partes = [limpio.replace(',', '.')];
      avisos.push(`"${limpio}" se interpretó como ${partes[0]} (coma decimal).`);
    } else if (limpio.includes(',')) {
      partes = limpio.split(',').filter((p) => p !== '');
    } else {
      partes = [limpio];
    }
    for (const p of partes) {
      posicion++;
      const n = NUMERO.test(p) ? Number(p) : NaN;
      if (Number.isFinite(n)) valores.push(n);
      else invalidos.push({ token: p, posicion });
    }
  }
  return { valores, invalidos, avisos };
}

/** Parsea y devuelve además los mensajes de error listos para mostrar. */
export function validarSerie(
  texto: string,
  minimo = 1,
  etiqueta = 'datos',
): ParseoNumeros & { errores: string[] } {
  const p = parsearNumeros(texto);
  const errores: string[] = [];
  for (const i of p.invalidos) {
    errores.push(`"${i.token}" (posición ${i.posicion}) no es un número válido.`);
  }
  if (p.valores.length === 0 && p.invalidos.length === 0) {
    errores.push(`Ingresa ${etiqueta}: la entrada está vacía.`);
  } else if (p.invalidos.length === 0 && p.valores.length < minimo) {
    errores.push(`Se necesitan al menos ${minimo} ${etiqueta}; ingresaste ${p.valores.length}.`);
  }
  return { ...p, errores };
}

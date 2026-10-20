import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', title: 'Inicio', loadComponent: () => import('./features/inicio/inicio.component').then((m) => m.InicioComponent) },
  { path: 'descriptiva', title: 'Descriptiva', loadComponent: () => import('./features/descriptiva/descriptiva.component').then((m) => m.DescriptivaComponent) },
  { path: 'datos-experimentales', title: 'Datos experimentales', loadComponent: () => import('./features/datos-experimentales/datos-experimentales.component').then((m) => m.DatosExperimentalesComponent) },
  { path: 'tablas-graficas', title: 'Tablas y gráficas', loadComponent: () => import('./features/tablas-graficas/tablas-graficas.component').then((m) => m.TablasGraficasComponent) },
  { path: 'probabilidad', title: 'Probabilidad', loadComponent: () => import('./features/probabilidad/probabilidad.component').then((m) => m.ProbabilidadComponent) },
  { path: 'correlacion-regresion', title: 'Correlación y regresión', loadComponent: () => import('./features/correlacion-regresion/correlacion-regresion.component').then((m) => m.CorrelacionRegresionComponent) },
  { path: 'practica', title: 'Práctica', loadComponent: () => import('./features/practica/practica.component').then((m) => m.PracticaComponent) },
  { path: 'teoria', title: 'Teoría', loadComponent: () => import('./features/teoria/teoria.component').then((m) => m.TeoriaComponent) },
  { path: '**', redirectTo: '' },
];

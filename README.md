# Contador en Claro

MVP funcional de un copiloto para contadores mexicanos. Genera borradores revisables para responder consultas de clientes sobre SAT, facturación y documentación.

## Ejecutar localmente

Requiere Node.js 18 o superior.

```powershell
cd "C:\Users\julio\Documents\Codex\2026-09-10\en\outputs\contador-en-claro"
node server.js
```

Abre http://localhost:3000

## Qué incluye

- Landing page responsive.
- Demo de generación de consultas.
- Backend REST sin dependencias externas.
- Historial persistido en `data/store.json`.
- Lista de acceso anticipado.
- Clasificación básica de riesgo.
- Mensaje para cliente, nota interna, checklist y fuente.
- Protección contra envío de e.firma, contraseñas y datos bancarios en la interfaz.

## Importante

Sin `AI_API_KEY`, el generador usa un motor de demostración determinista. Con `AI_API_KEY`, `AI_MODEL` y `AI_BASE_URL` configura un proveedor compatible con Chat Completions y la aplicación llamará al modelo desde el backend; la clave nunca llega al navegador. Con `DATABASE_URL`, el backend usa PostgreSQL para persistir consultas y lista de espera; sin ella conserva el almacenamiento local de demo. Para producción todavía hay que añadir RAG con fuentes oficiales revisadas, autenticación real, control de acceso, políticas de privacidad y pagos. No usar este MVP para presentar declaraciones ni para guardar credenciales fiscales.

## Publicación

Este repositorio puede desplegarse en un servicio Node compatible. Configura `PORT` si el proveedor lo requiere. Antes de cobrar, reemplaza el almacenamiento local por PostgreSQL y el registro de lista de espera por un sistema con acceso autenticado.

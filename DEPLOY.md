# Publicación de Contador en Claro

## Estado actual

El código está listo para un servicio Node y contiene `render.yaml`. En esta sesión no hay una cuenta de GitHub, Render, Railway, Vercel ni un conector `@sites` autenticado, por lo que no es posible obtener una URL pública permanente sin acceso externo.

## Ruta recomendada: Render

1. Crea un repositorio privado en GitHub llamado `contador-en-claro`.
2. Sube todo el contenido de esta carpeta, incluyendo `server.js`, `package.json`, `public/` y `render.yaml`.
3. En Render selecciona **New → Blueprint** y conecta el repositorio.
4. Confirma el servicio `contador-en-claro` creado desde `render.yaml`.
5. En Environment añade `AI_API_KEY` como secreto. Nunca lo pongas en el repositorio.
6. Espera el despliegue y abre `/api/health`. Debe devolver `{"ok":true}`.
7. Abre la raíz del dominio y prueba: generar borrador, copiar mensaje y solicitar acceso.

## Antes de cobrar

El archivo `data/store.json` sirve para el prototipo, pero un hosting gratuito puede borrar el disco al reiniciar. Para usuarios reales sustituye ese almacenamiento por PostgreSQL/Supabase y añade autenticación, aislamiento por despacho, límites de uso, aviso de privacidad y pagos.

## Comprobación mínima después del despliegue

- `/api/health` responde 200.
- La consulta genera un resultado.
- El botón Copiar mensaje copia texto.
- La lista de acceso devuelve una confirmación.
- La clave de IA no aparece en el navegador.
- Una segunda cuenta no puede ver datos de la primera.

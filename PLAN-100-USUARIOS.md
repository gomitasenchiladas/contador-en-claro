# Plan exacto: primeros 100 usuarios de Contador en Claro

## Definición de usuario

En este plan, un usuario cuenta sólo cuando crea una cuenta, genera tres borradores y copia al menos una respuesta para usarla con un cliente. Un registro de correo no cuenta como usuario activo.

La primera meta comercial debe ser 100 usuarios activos y 10–20 despachos pagando. Conseguir 100 clientes de pago requiere más validación y no debe prometerse antes de medir retención.

## Matemática del embudo

Meta de ocho semanas:

| Etapa | Objetivo | Conversión necesaria |
|---|---:|---:|
| Contactos calificados | 1,200 | — |
| Conversaciones iniciadas | 600 | 50% |
| Entrevistas o demos | 250 | 42% |
| Registros | 150 | 60% |
| Usuarios activados | 100 | 67% |
| Despachos de pago | 10–20 | 10–20% |

No compres bases de datos ni envíes mensajes masivos. Cada contacto debe ser relevante y permitir que la persona no reciba más mensajes.

## Perfil exacto

Contador independiente o despacho mexicano con 5–50 clientes, que atiende por WhatsApp y repite explicaciones sobre facturas, documentación y declaraciones. No busques empresas grandes en la primera etapa.

## Oferta de entrada

“Te ayudo a convertir una pregunta real de tu cliente en un borrador claro para WhatsApp. Puedes probar 20 consultas sin tarjeta. Tú revisas y decides qué enviar.”

No vendas “IA” como beneficio principal. Vende tiempo ahorrado, mensajes más claros y menos seguimiento.

## Canales y cuotas semanales

- 150 contadores encontrados manualmente en Google Maps, directorios profesionales y LinkedIn.
- 100 invitaciones individuales en grupos de Facebook o WhatsApp, sólo donde estén permitidas.
- 30 estudiantes o profesores de contabilidad que puedan referir a un despacho.
- 10 publicaciones o videos cortos mostrando una transformación real: pregunta confusa → mensaje profesional.
- 5 alianzas con cursos, despachos o comunidades contables.

## Calendario de ocho semanas

### Semana 1: entrevistas, no venta

Habla con 30 contadores. Pregunta:

1. ¿Qué pregunta de clientes repites más?
2. ¿Cuánto tardas en contestarla?
3. ¿Qué información suele faltar?
4. ¿Qué herramienta usas hoy?
5. ¿Qué tendría que hacer una herramienta para que pagaras $99–149 MXN al mes?

Construye sólo las tres plantillas que aparezcan más veces.

### Semana 2: demo personalizada

Haz 50 demos. Pide una pregunta real, escríbela en la app y deja que la persona edite la respuesta. Registra las palabras que usan para describir el problema.

Objetivo: 30 registros y 15 usuarios activados.

### Semana 3: prueba guiada

Contacta a cada registrado dos veces: al día 1 y al día 4. Ayúdale a completar tres consultas. Pide una captura o comentario de la respuesta, sin datos de clientes.

Objetivo: 25 nuevos usuarios activados.

### Semana 4: referencias

Entrega un enlace de referencia. Por cada despacho referido que se active, regala un mes al usuario que lo refirió. Publica dos demostraciones y una historia de aprendizaje, no testimonios inventados.

Objetivo acumulado: 50 usuarios activos.

### Semanas 5 y 6: nicho único

Elige el grupo con mayor uso: por ejemplo, contadores que atienden RESICO o pequeños comercios. Elimina mensajes genéricos y crea una página específica para ese grupo.

Haz 20 contactos diarios y 5 demos semanales. Pide $99 MXN sólo a quienes hayan usado la herramienta al menos cinco veces.

Objetivo acumulado: 80 usuarios activos y primeros pagos.

### Semanas 7 y 8: retención y pago

Llama o escribe a los 100 usuarios. Pregunta qué les hizo volver y qué les impediría pagar. Conserva sólo las funciones que aumenten el uso semanal. Activa el plan individual y un plan para despachos.

Objetivo: 100 usuarios activos y 10–20 clientes de pago.

## Guiones de comunicación

### Primer contacto

> Hola, estudio contabilidad estratégica y estoy probando una herramienta que convierte dudas repetitivas de clientes sobre SAT y facturación en borradores claros para WhatsApp. ¿Cuál es la pregunta que más te repiten? No intento venderte nada; estoy validando el problema.

### Invitación a demo

> Gracias. Si me compartes una pregunta sin datos personales, te enseño en cinco minutos cómo la convierte en mensaje, checklist y nota interna. Tú revisas todo antes de enviarlo.

### Seguimiento

> ¿Pudiste probar una segunda consulta? Me interesa saber si la respuesta te ahorró tiempo o qué tuviste que corregir.

### Conversión

> Ya utilizaste cinco consultas. El acceso anticipado cuesta $99 MXN al mes e incluye 100 borradores y plantillas. ¿Quieres mantenerlo un mes y decidir con uso real? Si no te ahorra tiempo, no lo continúas.

## Cómo vender sin dominar el lenguaje corporal

Usa una estructura fija: pregunta → escucha → demuestra con su caso → pregunta si ahorra tiempo → ofrece prueba. No memorices discursos ni intentes convencer a quien no tiene el problema.

## Métricas que debes revisar cada viernes

- Contactos nuevos.
- Respuestas recibidas.
- Demos completadas.
- Registros.
- Usuarios que generaron tres borradores.
- Usuarios que regresaron en siete días.
- Consultas por usuario.
- Tiempo ahorrado declarado.
- Usuarios que aceptaron pagar.
- Costo de IA por consulta.

La señal de producto real es que un usuario vuelva por iniciativa propia y lo recomiende. Los “likes” no cuentan.

## Estado de publicación

El MVP actual funciona localmente con Node y un backend REST. Para publicar de forma confiable hay que completar estos pasos:

1. Crear un repositorio privado en GitHub.
2. Conectarlo a Render, Railway o un servicio Node equivalente.
3. Configurar `PORT`, `AI_API_KEY`, `AI_MODEL` y `AI_BASE_URL` como secretos.
4. Sustituir `data/store.json` por PostgreSQL/Supabase; el disco local de un hosting puede ser efímero.
5. Añadir autenticación real y separación por despacho.
6. Añadir aviso de privacidad, términos, límites de uso y monitoreo de errores.
7. Añadir pagos sólo después de observar uso repetido.
8. Probar el dominio con una consulta, copia de mensaje, lista de espera y límite de uso.

La conexión de hosting y las credenciales no están disponibles en esta sesión; por eso no se puede entregar honestamente una URL pública permanente todavía.

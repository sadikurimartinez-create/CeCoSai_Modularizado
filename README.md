# CeCo SAI modularizado

Esta carpeta contiene la version de trabajo separada del archivo original. El archivo original queda intacto dentro de backup.

## Como abrirlo en Visual Studio Code

1. Abre Visual Studio Code.
2. Ve a Archivo > Abrir carpeta.
3. Selecciona:
   C:\Users\sadi7\OneDrive\Desktop\ECOSISTEMA SAI\CeCoSAI\CeCo SAI modularizado
4. Abre index.html.

## Estructura actual

- index.html: estructura principal de la pantalla.
- css/: estilos visuales separados por tema.
- js/core/: funciones base del sistema.
- js/features/: modulos funcionales, por ejemplo busqueda juridica, MIC, exportaciones y escalera IA.
- backup/: copias de seguridad del archivo original y del CSS extraido.

## Archivos CSS

- 00-foundation.css: variables, reset y base visual.
- 01-navigation.css: barra superior, logo y menu.
- 02-layout.css: contenido principal, encabezados y tarjetas.
- 03-forms-tables.css: formularios y tablas.
- 04-actions-status.css: botones, estados y progreso.
- 05-modules.css: estilos de modulos internos.
- 06-downloads-interactions.css: descargas e interacciones.
- 07-intelligence-dashboard.css: dashboard e inteligencia activa.
- 08-mic.css: estilos del MIC y grafo.

## Archivos JavaScript

- js/core/00-ui-basico.js: navegacion, sugerencias, temporizador y preguntas basicas.
- js/core/01-descarga-sistema.js: descarga del sistema y envio opcional del caso al backend local.
- js/core/02-marco-documentos.js: marco juridico y documentos del caso.
- js/core/03-ui-feedback.js: modales, expandibles y notificaciones.
- js/core/04-sujetos-pasivos.js: registro y gestion de sujetos pasivos.
- js/core/06-acciones-base.js: acciones simples de modales, oficios y cuestionamientos.
- js/core/05-persistencia.js: guardado local, importacion y exportacion de datos.
- js/core/07-paginacion.js: paginacion reutilizable de tablas.
- js/core/08-utilidades-app.js: autosave, PWA, menu movil, validacion, lazy loading y atajos.
- js/core/10-inicializacion.js: arranque general del sistema y guardado antes de cerrar.
- js/core/09-eventos-ui.js: conecta eventos de interfaz sin usar onclick/onchange dentro del HTML.
- js/features/01-escalera-heptatomica-datos.js: diccionario de delitos, causas excluyentes y datos mock (CSD).
- js/features/01-escalera-heptatomica-estado.js: motor principal SAIEngine, currentCase y control de estado.
- js/features/01-escalera-heptatomica-seleccion.js: seleccion CSD/delito y arranque del analisis.
- js/features/01-escalera-heptatomica-conducta-tipicidad.js: conducta, tipicidad y sugerencias relacionadas.
- js/features/01-escalera-heptatomica-antijuridicidad-imputabilidad.js: antijuridicidad e imputabilidad.
- js/features/01-escalera-heptatomica-culpabilidad-punibilidad.js: culpabilidad y punibilidad.
- js/features/01-escalera-heptatomica-utilidades.js: acreditacion, bloqueos, reset y funciones publicas.
- js/features/02-busqueda-juridica.js: busqueda juridica.
- js/features/02-nexo-causal-datos.js: datos para el componente de Nexo Causal.
- js/features/03-mic-wigmore-api.js: APIs de Google, Gemini, Vision y CSE.
- js/features/03-mic-wigmore-ui.js: UI y semaforos de conexiones.
- js/features/03-mic-wigmore-analisis.js: Analisis IA, vigilancia, consistencia, cronologia.
- js/features/03-mic-wigmore-denuncia.js: Flujo de Denuncia Base.
- js/features/04-exportaciones-datos.js: datos mock y calculos de acreditacion.
- js/features/04-exportaciones-plantillas.js: plantillas HTML para la generacion de escritos.
- js/features/04-exportaciones-ui.js: actualizaciones de UI, barras de progreso y modales de escrito.
- js/features/04-exportaciones-descargas.js: logica para exportar a Word y generar blobs.
- js/features/05-metricas-csd.js: metricas CSD y reportes relacionados.
- js/features/06-resultados-investigativos-core.js: estado global, inicializacion y carga de datos.
- js/features/06-resultados-investigativos-ia.js: logica de negocio y clasificacion con IA.
- js/features/06-resultados-investigativos-ui.js: renderizado de tabla, metricas y alertas del fiscal.
- js/features/07-mic-grafo-base.js: estado base, arranque y configuracion de vis-network.
- js/features/07-mic-grafo-construccion.js: actualizacion, construccion del grafo y acreditacion global.
- js/features/07-mic-grafo-ia.js: autorizacion de carpeta y analisis IA/Wigmore.
- js/features/07-mic-grafo-estilos-validacion.js: estilos de aristas y validacion visual del argumento.
- js/features/07-mic-grafo-panel.js: panel de inferencia y funciones publicas MIC.
- js/features/08-escalera-ia-datos.js: datos y configuracion de Escalera IA.
- js/features/08-escalera-ia-flujo.js: seleccion de CSD/delito y arranque de analisis.
- js/features/08-escalera-ia-analisis.js: analisis IA por elemento y sugerencias.
- js/features/08-escalera-ia-validaciones.js: validaciones, bloqueos, reset y conexion OpenAI.
- js/features/09-matriz-interconexion.js: matriz de integracion e interconexion de metricas.
- js/features/10-hipotesis-datos.js: datos para el flujo de Hipotesis Inicial.
- js/features/10-hipotesis-nc.js: flujo de Hipotesis Inicial en Noticia Criminal.
- js/features/10-hipotesis-teoria.js: validacion y regeneracion de la Teoria del Caso (bloques factico, probatorio, juridico).
- js/features/10-hipotesis-ui.js: trazabilidad, UI y eventos de la pestana Hipotesis.
- js/features/11-friccion-ia-core.js: estado y banco de preguntas de Friccion IA.
- js/features/11-friccion-ia-logica.js: evaluacion de respuestas y generacion de preguntas.
- js/features/11-friccion-ia-ui.js: contadores, metricas y trazabilidad visual.

## Regla de seguridad

No trabajes sobre CeCo SAI v2.0.html. Desde ahora, los cambios deben hacerse en esta carpeta modularizada.

## Siguiente paso recomendado

Continuar con los archivos JavaScript grandes restantes, priorizando matriz/interconexion, MIC/Wigmore o exportaciones si se vuelven dificiles de mantener.


## Avance de limpieza de eventos

Se movieron fuera del HTML estos eventos:

- Navegacion principal del menu.
- Boton de menu movil.
- Botones del menu Descargas.
- Selector oculto para importar datos.
- Encabezados de secciones expandibles.
- Botones que solo cierran modales.

Resultado actual: index.html y los archivos dentro de js/ ya no contienen onclick ni onchange. Los eventos se conectan desde js/core/09-eventos-ui.js.



## Eventos inline eliminados

index.html y los archivos dentro de js/ ya no contienen onclick ni onchange. Los botones, selects e inputs usan atributos data-* y se conectan desde js/core/09-eventos-ui.js, incluyendo contenido generado dinamicamente como paginacion, FriccionIA y Resultados Investigativos.


## Siguiente etapa recomendada

Seguir reduciendo archivos JavaScript grandes, manteniendo respaldos antes de cada corte y verificando sintaxis/rutas despues de cada cambio.


## Avance de separacion JS

Se extrajeron de 01-nucleo.js los bloques de UI basica, marco/documentos, feedback visual, sujetos pasivos, matriz/interconexion, Hipotesis y Escalera. El antiguo 01-nucleo.js quedo archivado en backup/01-nucleo-pre-split.js y fue reemplazado por archivos con nombres especificos.


## Avance Hipotesis

Se extrajo el bloque de Hipotesis a js/features/10-hipotesis.js. Incluye validacion/modificacion/regeneracion de bloques, hipotesis inicial de Noticia Criminal y exportacion al PIC.


## Avance Escalera

Se extrajo la Escalera Heptatomica a js/features/01-escalera-heptatomica.js. Incluye datos de delitos, CSD, currentCase, SAIEngine y validaciones de conducta, tipicidad, antijuridicidad, imputabilidad, culpabilidad y punibilidad.


## Nucleo reemplazado

01-nucleo.js ya no se carga en index.html. Sus responsabilidades restantes se dividieron en js/core/01-descarga-sistema.js y js/core/06-acciones-base.js. Se guardo respaldo en backup/01-nucleo-pre-split.js.


## Persistencia y utilidades separadas

Se dividio js/core/05-persistencia-utilidades.js en persistencia, paginacion, utilidades de app, inicializacion y Friccion IA. El archivo anterior quedo respaldado en backup/05-persistencia-utilidades-pre-split.js.


## Avance Escalera IA

Se dividio js/features/08-escalera-ia.js en datos, flujo, analisis y validaciones. El archivo anterior quedo en backup/08-escalera-ia-pre-split.js.

## Avance Escalera Heptatomica detallada

Se dividio js/features/01-escalera-heptatomica.js en seis archivos por responsabilidad. El archivo anterior quedo respaldado en backup/01-escalera-heptatomica-pre-split.js.

## Avance MIC Grafo

Se dividio js/features/07-mic-grafo.js en cinco archivos. Tambien se corrigio la configuracion de estilos de fuerza probatoria y se quitaron opciones zoom/center mal ubicadas en vis-network. El archivo anterior quedo respaldado en backup/07-mic-grafo-pre-split.js.

## Avance MIC Wigmore (03)
Se dividio js/features/03-mic-wigmore.js en api, ui, analisis y denuncia para separar responsabilidades. El archivo original quedo vacio.

## Avance Exportaciones (04)
Se dividio js/features/04-exportaciones.js en datos, plantillas, ui y descargas para aislar la generacion pesada de HTML del flujo UI y los blobs de descarga. El archivo original quedo vacio.

## Avance Resultados Investigativos (06)
Se dividio js/features/06-resultados-investigativos.js en core, ia y ui para separar el estado, la logica de negocio y la manipulacion del DOM. El archivo original quedo vacio.

## Avance Friccion IA (11)
Se dividio js/features/11-friccion-ia.js en core, logica y ui para separar la generacion y evaluacion de preguntas de la UI. El archivo original quedo vacio.

## Avance Hipotesis (10)
Se dividio js/features/10-hipotesis.js en nc, teoria y ui para separar la logica de la hipotesis inicial, la teoria del caso y la interfaz. El archivo original quedo vacio.

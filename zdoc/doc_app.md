# Desglose del sistema lógica (partes mas pequeñas)

Haber todos inician por el login evidentemente
en el login una vez se autentica se consulta su rol y permisos
etc. entonces ahora si viene y se redirige dependiendo rol:
hay varios roles al comienzo solo superadmin, admin, docente y coordinador (pero se puede crear mas rolesy asignarles permisos aunque la funcionalidad es beta), en principio todos tienen asignado ciertos permisos
asociados a su rol ej: coordinador solo ve planificaciones pero tiene aceso para ver todas, en cambio docente solo ve siysolosi tiene asignado asignaturas ahi pueed crear planificaicones para cada una de esas asignaturas pero para las demas no etc.

Viendolo asi quiza es mejor descirbir basado en funcionalidades mas que describirlo basado en cad arol pues las funcionalidades se comparten en algunos casos por ejemplo que se yo el admin gesitona usuarios y el superadmin tambien etc. OK entonces las funcionalidades incluyen:

1. asignar_docentes
   Asignar docentes a asignaturas del período
2. configurar_asignaturas_periodo
   Asociar asignaturas al período activo
3. configurar_componentes_periodo
   Definir horas por componente en asignatura_periodo
4. configurar_periodos
   Crear y activar períodos académicos
5. configurar_regla_sincronico
   Configurar porcentaje sincronico/asincronico (Regla X/Y)
6. crear_cursos
   Permite crear cursos en Moodle
7. gestionar_configuracion_mfa
   configuracion mfa
8. gestionar_configuracion_sistema
   gestionar configuracion contrasenas
9. gestionar_limpieza
   Permite gestionar la limpieza de cursos y logs del sistema
10. gestionar_planificaciones
    Crear y editar planificaciones
11. gestionar_reglas_actividades
    Configurar reglas de actividades
12. gestionar_roles
    Asignar y cambiar roles
13. gestionar_usuarios
    Crear, editar y eliminar usuarios
14. gggg
    ggg es un permiso de prueba
15. habilitar_planificacion
    Desbloquear planificación docente para el período
16. index.php
    Acceso a p├ígina principal
17. ver_logs
    Visualizar registros y auditoría del sistema
18. ver_reportes
    Acceder a reportes acad??micos

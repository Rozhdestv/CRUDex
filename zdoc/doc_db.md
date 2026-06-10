# Desglose del sistema bd (osea en partes mas pequeñas)

El sistema tiene partes como:

1. LOGIN

Relativo a tablas como usuarios, roles, roles_permisos, permisos
permisos_rutas, password_reset, mfa_codes, configuracion_sistema etc. Tablas que permiten leer permisos etc asignados a cada usuario para dar paso del llogin y a donde van a acceder y que rol tienen etc tambien se podria dividir en parte admiinistrador o de configuraciones del sistema etc pero se incluye aqui.
tambien algunas tabla de auditoria basicamente logs solo 2 tablas

2. PLANIFICACION

Relativo a tablas de academico (asignaturas,temas,etc) y planificaciones (planificacion, planificacion_semana, actividades, recursos,etc.) esdecir todas las tablas donde se guarda la informacion primero para gestionar la planficacion y desde donde se envia al momento de crear el curso, ademas se valida y se configuran las reglas academicas como que cumplan los valores creditos etc.

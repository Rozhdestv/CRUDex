-- PLAN2COURSEEX - POSTGRESQL
-- CORRECCIONES: PKs, FKs, 3FN (sin id_carrera en planificacion)

/*
LA PRESENTE BD PARTE DE QUE EXISTEN: FACULTADES Y CADA FACULTAD TIENE N
CARRERAS CADA CARRERA TIENE N ASIGNATURAS Y CADA ASIGNATURA N UNIDADES
Y CAA UNIDAD N TEMAS; CADA ASIGNATURA TIENE N PLANIFICACIONES  Y CADA
PLANIFICACION N ACTIVIDADES PLANIFICADAS TENER CUIDADO CON PKS FKS 
Y AHORA ESTA BD VA A ESTAR EN POSTGRES NOMBRE BD: PLAN2COURSEEX
VERIFICAR NORMALIDAD MINIMO 3FN O + 
PK (Primary Key): Identifica cada fila única. SERIAL = auto-incremento
FK (Foreign Key): Vincula tablas. RESTRICT = no borra si hay referencias. CASCADE = actualiza si cambia PK
3FN: Elimina redundancias. planificacion SOLO tendrá id_asignatura (NO id_carrera) para evitar inconsistencias
*/

CREATE TABLE facultades (
  id_facultad SERIAL PRIMARY KEY,
  codigo_facultad VARCHAR(10) UNIQUE NOT NULL,
  nombre_facultad VARCHAR(100) NOT NULL
);

CREATE TABLE carreras (
  id_carrera SERIAL PRIMARY KEY,
  codigo_carrera VARCHAR(10) UNIQUE NOT NULL,
  id_facultad INT NOT NULL,
  nombre_carrera VARCHAR(100) NOT NULL,
  CONSTRAINT fk_carreras_facultades FOREIGN KEY (id_facultad) 
    REFERENCES facultades(id_facultad) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE asignaturas (
  id_asignatura SERIAL PRIMARY KEY,
  nombre_asignatura VARCHAR(150) NOT NULL,
  codigo_asignatura VARCHAR(50) UNIQUE NOT NULL,
  total_horas_creditos VARCHAR(20),
  id_carrera INT NOT NULL,
  CONSTRAINT fk_asignaturas_carreras FOREIGN KEY (id_carrera) 
    REFERENCES carreras(id_carrera) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE unidades (
  id_unidad SERIAL PRIMARY KEY,
  numero INT NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  resultado_aprendizaje TEXT,
  id_asignatura INT NOT NULL,
  CONSTRAINT fk_unidades_asignaturas FOREIGN KEY (id_asignatura) 
    REFERENCES asignaturas(id_asignatura) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE temas (
  id_tema SERIAL PRIMARY KEY,
  numero INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  id_unidad INT NOT NULL,
  CONSTRAINT fk_temas_unidades FOREIGN KEY (id_unidad) 
    REFERENCES unidades(id_unidad) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE planificacion (
  id_planificacion SERIAL PRIMARY KEY,
  id_asignatura INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  version INT DEFAULT 1,
  total_semanas INT DEFAULT 16,
  fecha_inicio DATE,
  fecha_fin DATE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'borrador' 
    CHECK (estado IN ('borrador', 'aprobada', 'publicada', 'eliminada')),
  observaciones TEXT,
  activo BOOLEAN DEFAULT TRUE,
  CONSTRAINT fk_planificacion_asignaturas FOREIGN KEY (id_asignatura) 
    REFERENCES asignaturas(id_asignatura) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE planificacion_actividad (
  id_actividad_planificada SERIAL PRIMARY KEY,
  id_planificacion INT NOT NULL,
  actividad VARCHAR(255) NOT NULL,
  descripcion TEXT,
  horas DECIMAL(5,2) DEFAULT 0.00,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  hora_inicio TIME,
  hora_fin TIME,
  CONSTRAINT fk_plan_actividad_planificacion FOREIGN KEY (id_planificacion) 
    REFERENCES planificacion(id_planificacion) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL,
    `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
      `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
          `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            
              `id_rol` int NOT NULL,
                `activo` tinyint(1) DEFAULT '1',
                  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,                                          
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    

INSERT INTO facultades (id_facultad, codigo_facultad, nombre_facultad) VALUES
(1, 'FADE', 'ADMINISTRACIÓN DE EMPRESAS'),
(2, 'FC', 'CIENCIAS'),
(3, 'FCP', 'CIENCIAS PECUARIAS'),
(4, 'FIE', 'INFORMÁTICA Y ELECTRÓNICA'),
(5, 'FIM', 'MECÁNICA'),
(6, 'FRN', 'RECURSOS NATURALES'),
(7, 'FSP', 'SALUD PÚBLICA');

INSERT INTO carreras (id_carrera, codigo_carrera, id_facultad, nombre_carrera) VALUES
(1, 'DG', 4, 'Diseño Gráfico'),
(2, 'TEL', 4, 'Telecomunicaciones'),
(3, 'TI', 4, 'Tecnologías de la Información'),
(4, 'ELE', 4, 'Electricidad'),
(5, 'EA', 4, 'Electrónica y Automatización'),
(6, 'SOF', 4, 'Software'),
(7, 'TLM', 4, 'Telemática');

INSERT INTO unidades (id_unidad, numero, titulo, resultado_aprendizaje, id_asignatura) VALUES
(1, 1, 'PERCEPCIÓN Y RESOLUCIÓN DE PROBLEMAS', 'Analiza y aplica los conceptos de bases de conocimiento y bases de datos para resolver problemas mediante el uso de un lenguaje de inteligencia artificial, demostrando pensamiento crítico, toma de decisiones fundamentadas y trabajo colaborativo en entornos digitales, utilizando herramientas de IA para la gestión del conocimiento.', 1),
(2, 2, 'PROCESAMIENTO DE LENGUAJE NATURAL (PLN)', 'Interpreta e implementa procesos de preprocesamiento, representación y análisis de texto en PLN, aplicando fundamentos lingüísticos y técnicas de aprendizaje automático, demostrando pensamiento crítico, resolución de problemas y trabajo en equipo en entornos digitales, mediante el uso de herramientas especializadas en PLN.', 1),
(3, 3, 'MÁQUINAS QUE APRENDEN (MACHINE LEARNING)', 'Comprende y aplica técnicas de preprocesamiento y exploración de datos, modelos de aprendizaje supervisado, aprendizaje no supervisado y clustering, así como aprendizaje por refuerzo en problemas reales relacionados con la ciencia de datos, utilizando herramientas y plataformas digitales especializadas, desarrollando trabajo en equipo para colaborar de manera efectiva en la resolución de problemas complejos, mientras fomenta su capacidad crítica y adaptativa en el análisis y toma de decisiones tecnológicas, fortaleciendo su competencia digital en el uso de herramientas de programación y software de machine learning.', 1),
(4, 4, 'REDES NEURONALES (DEEP LEARNING)', 'Comprende los fundamentos de redes neuronales y aplica redes neuronales convolucionales (CNN) y recurrentes (RNN) en la resolución de problemas, identifica y usa aplicaciones de Deep Learning, aprovechando herramientas de programación avanzadas, a la vez que desarrolla la habilidad para trabajar en equipo, fortalece el pensamiento crítico y creativo, mejorando la competencia digital en plataformas de inteligencia artificial.', 1),
(5, 1, 'INTRODUCCION A LOS ENTORNOS VIRTUALES DE APRENDIZAJE', 'Explica los conceptos básicos y las características de las TICs y su relación con los Entornos Virtuales de Aprendizaje (EVA), identificando su impacto en la educación para diseñar estrategias de enseñanza en plataformas virtuales, fomentando el pensamiento crítico y el uso responsable de las TIC.', 2),
(6, 2, 'E-LEARNING Y LAS TEORÍAS DE APRENDIZAJE', 'Analiza los modelos de enseñanza virtual y los estándares de e-learning, relacionándolos con las teorías del aprendizaje, para diseñar estrategias educativas efectivas en entornos virtuales de aprendizaje, fortaleciendo la adaptabilidad y gestionando información con herramientas TIC.', 2),
(7, 3, 'PLATAFORMAS DE ENSEÑANZA VIRTUAL', 'Instala y configura un sistema LMS en un entorno controlado, aplicando procedimientos técnicos con la perspectiva de construir entornos virtuales de aprendizaje adecuados para fomentar la resolución de problemas y el uso responsable de herramientas digitales con capacidades de inteligencia artificial.', 2),
(8, 4, 'DISEÑO Y ELABORACIÓN DE CURSOS', 'Diseña e implementa adecuadamente cursos en línea aplicando metodologías de diseño instruccional y herramientas digitales en plataformas de aprendizaje virtual para dar soluciones de proyectos educativos en modalidad en-línea, fomentando la creatividad al integrar recursos interactivos con el uso de tecnologías para el empoderamiento y la participación (TEP).', 2),
(9, 1, 'A WORLD OF POSSIBILITIES', 'Ilustra situaciones reales, verdades, y hechos científicos utilizando estructuras gramaticales del presente. Valida información verdadera o falsa a través de preguntas cortas. Relata historias cortas utilizando las estructuras del pasado.', 3),
(10, 2, 'UNREAL AND IMAGINARY SITUATIONS', 'Ilustra situaciones imaginarias en presente o pasado aplicando condicionales y estructuras gramaticales complejas.', 3),
(11, 3, 'REPORTING NEWS', 'Reporta información proporcionada por terceras personas para transmitir ideas relevantes. Produce enunciados complejos utilizando pronombres relativos para describir personas, cosas o situaciones.', 3),
(12, 1, 'LÍMITES Y CONTINUIDAD', 'Identifica los conceptos fundamentales de límites y continuidad a partir de materiales de estudio y exposiciones en clase. Calcula límites de funciones algebraicas, trigonométricas y racionales aplicando teoremas específicos. Diseña modelos matemáticos que incorporen el concepto de límite en áreas como la física, la economía o la ingeniería.', 6),
(13, 2, 'LA DERIVADA Y SUS APLICACIONES', 'Identifica los conceptos fundamentales de la derivada, incluyendo reglas de derivación. Calcula derivadas de funciones algebraicas, trigonométricas, exponenciales. Examina la relación entre la derivada y la optimización de funciones. Diseña modelos matemáticos que incorporen el uso de derivadas en el análisis de velocidad, aceleración u optimización.', 6),
(14, 3, 'INTEGRAL INDEFINIDA', 'Define los conceptos fundamentales de la integral indefinida. Resuelve problemas básicos de integración utilizando reglas directas. Identifica la técnica de integración más adecuada. Formula expresiones matemáticas complejas aplicando integrales en la resolución de problemas de modelado matemático.', 6),
(15, 4, 'INTEGRAL DEFINIDA', 'Enumera y describe las propiedades básicas de la integral definida y teoremas asociados. Calcula integrales definidas de funciones algebraicas y trigonométricas. Formula y resuelve problemas aplicados que involucren el uso de integrales en física, economía y otras disciplinas.', 6),
(16, 1, 'Cinemática de una Partícula', 'Utiliza con precisión y eficacia las diferentes fórmulas de la cinemática para analizar el movimiento de objetos, demostrando un sólido dominio de los conceptos y herramientas matemáticas subyacentes, abordando efectivamente situaciones que implican comprensión profunda y resolución precisa de problemas en contextos científicos y de ingeniería.', 7),
(17, 2, 'Dinámica Lineal', 'Resuelve con precisión y eficacia problemas de dinámica mediante la aplicación de las leyes de Newton, demostrando un sólido dominio de los principios físicos que rigen el movimiento de cuerpos, facilitando una comprensión profunda y una resolución precisa de problemas en contextos científicos y de ingeniería.', 7),
(18, 3, 'Trabajo, Energía y Potencia', 'Aplica de manera razonada y eficiente las fórmulas de trabajo, energía y potencia, demostrando una comprensión profunda de los conceptos físicos en diferentes contextos, contribuyendo a un análisis exhaustivo y preciso del uso de la energía en sistemas físicos.', 7),
(19, 4, 'Conservación del Movimiento y Colisiones', 'Aplica de manera efectiva y eficiente los principios de la conservación del movimiento en la resolución de problemas, demostrando un sólido entendimiento y capacidad para aplicar métodos analíticos y matemáticos apropiados en el análisis de situaciones que involucran colisiones y cambios de movimiento.', 7),
(20, 5, 'Dinámica Rotacional', 'Resuelve con precisión y eficacia problemas de dinámica rotacional, aplicando los conceptos y los principios de la mecánica rotacional, demostrando un sólido dominio relacionado con el momento de inercia, el torque y la aceleración angular.', 7),
(21, 1, 'Teoría de números y conjuntos', 'Conoce la Lógica y demostraciones para plantear y resolver problemas de forma eficiente y pertinente, aplicando técnicas y herramientas actuales, fomentando valores y códigos de ética, con análisis y caracterización de la realidad actual local, regional, nacional e internacional.', 8),
(22, 2, 'Lógica proposicional y demostraciones', 'Conoce la Lógica y demostraciones para plantear y resolver problemas de forma eficiente y pertinente, aplicando técnicas y herramientas actuales, fomentando valores y códigos de ética, con análisis y caracterización de la realidad actual local, regional, nacional e internacional.', 8),
(23, 3, 'Grafos', 'Aplica los conceptos básicos de la teoría de grafos en problemas de forma eficiente y pertinente, aplicando técnicas y herramientas actuales, fomentando valores y códigos de ética, con análisis crítico y caracterizando la realidad actual local, regional, nacional e internacional.', 8),
(24, 4, 'Las estructuras fundamentales', 'Utiliza y aplica las estructuras algebraicas para plantear y resolver problemas de forma eficiente y pertinente, aplicando técnicas y herramientas, logrando fomentar valores y códigos de ética, con análisis crítico y caracterizando la realidad actual local, regional, nacional e internacional.', 8),
(25, 5, 'Principios de teoría de números', 'Utiliza los conceptos matemáticos de la teoría de números para aplicarlos en problemas de software como la seguridad informática, fundamentado en la realidad actual local, regional, nacional e internacional.', 8);

INSERT INTO temas (id_tema, numero, titulo, id_unidad) VALUES
(1, 1, 'Tipos de Bases de Conocimiento', 1),
(2, 2, 'Bases de datos y bases de conocimiento', 1),
(3, 3, 'Resolución de problemas utilizando un lenguaje de Inteligencia Artificial', 1),
(4, 1, 'Fundamentos Lingüísticos para el PLN', 2),
(5, 2, 'Preprocesamiento de Texto para PLN', 2),
(6, 3, 'Representación de Texto en PLN', 2),
(7, 4, 'Tareas Básicas y Avanzadas en PLN', 2),
(8, 5, 'Aprendizaje Automático en PLN', 2),
(9, 1, 'Preprocesamiento y Exploración de Datos', 3),
(10, 2, 'Modelos de Aprendizaje Supervisado', 3),
(11, 3, 'Aprendizaje No Supervisado y Clustering', 3),
(12, 4, 'Aprendizaje por Refuerzo', 3),
(13, 5, 'Implementación Práctica de Proyectos de Machine Learning', 3),
(14, 1, 'Fundamentos de Redes Neuronales', 4),
(15, 2, 'Redes Neuronales Convolucionales (CNN)', 4),
(16, 3, 'Redes Neuronales Recurrentes (RNN)', 4),
(17, 4, 'Aplicaciones Especiales de Deep Learning', 4),
(18, 1, 'Introducción a las TICs', 5),
(19, 2, 'Uso del Internet y la WWW como apoyo al aprendizaje', 5),
(20, 3, 'Evolución de las plataformas virtuales', 5),
(21, 4, 'Características de los EVAs', 5),
(22, 5, 'Formación docente para la educación virtual', 5),
(23, 1, 'Marco conceptual del E-learning', 6),
(24, 2, 'Modalidades de enseñanza virtual', 6),
(25, 3, 'Modelos de enseñanza virtual', 6),
(26, 4, 'Estándares de E-learning', 6),
(27, 5, 'Teorías de aprendizaje y su aplicación en los EVAs', 6),
(28, 1, 'Introducción y visión general de los LMS', 7),
(29, 2, 'Análisis de herramientas LMS', 7),
(30, 3, 'Instalación y configuración de un LMS', 7),
(31, 4, 'Administración de un LMS', 7),
(32, 1, 'Desarrollo de recursos de aprendizaje usando H5P', 8),
(33, 2, 'Metodologías de diseño instruccional', 8),
(34, 3, 'Diseño instruccional usando ADDIE', 8),
(35, 4, 'Herramientas de diseño de recursos educativos', 8),
(36, 5, 'Elaboración de objetos de aprendizaje usando eXeLearning', 8),
(37, 6, 'Metodologías de diseño de aulas virtuales', 8),
(38, 7, 'Diseño de aulas virtuales en un LMS', 8),
(43, 1, 'Real life (functions)', 9),
(44, 2, 'Vocabulary', 9),
(45, 3, 'Useful phrases and expressions', 9),
(46, 4, 'Skills development', 9),
(47, 5, 'ESP Project', 9),
(48, 6, 'Grammar', 9),
(49, 1, 'Real life (functions)', 10),
(50, 2, 'Vocabulary', 10),
(51, 3, 'Useful phrases and expressions', 10),
(52, 4, 'Grammar', 10),
(53, 5, 'Skills development', 10),
(54, 6, 'ESP Project', 10),
(55, 1, 'Real life (functions)', 11),
(56, 2, 'Vocabulary', 11),
(57, 3, 'Useful phrases and expressions', 11),
(58, 4, 'Grammar', 11),
(59, 5, 'Skills development', 11),
(60, 6, 'ESP Project', 11),
(61, 1, 'Definición de límite', 12),
(62, 2, 'Propiedades de los límites', 12),
(63, 3, 'Límites notables', 12),
(64, 4, 'Número de Neper', 12),
(65, 5, 'Límites de funciones', 12),
(66, 6, 'Definición de continuidad', 12),
(67, 7, 'Propiedades de las funciones continuas', 12),
(68, 8, 'Teoremas', 12),
(69, 9, 'Ejemplos de aplicación', 12),
(70, 1, 'Definición e interpretación de las derivadas', 13),
(71, 2, 'Álgebra de las derivadas', 13),
(72, 3, 'Derivadas de orden superior', 13),
(73, 4, 'Teoremas sobre la derivación', 13),
(74, 5, 'Teorema de L-Hopital', 13),
(75, 6, 'Aplicaciones de la derivada', 13),
(76, 1, 'Definición de Primitiva y de Integral Indefinida', 14),
(77, 2, 'Integración por sustitución', 14),
(78, 3, 'Integración por partes', 14),
(79, 4, 'Integración de funciones racionales', 14),
(80, 5, 'Integración de Polinomios Trigonométricos', 14),
(81, 6, 'Integración por Sustituciones Trigonométricas', 14),
(82, 7, 'Aplicaciones', 14),
(83, 1, 'Definición de integral definida', 15),
(84, 2, 'Sumas finitas e infinitas', 15),
(85, 3, 'Teoremas fundamentales del Cálculo', 15),
(86, 4, 'Integrales Impropias', 15),
(87, 5, 'Aplicaciones', 15),
(88, 1, 'Vectores y suma de vectores', 16),
(89, 2, 'Componentes de vectores, Vectores unitarios', 16),
(90, 3, 'Productos de vectores', 16),
(91, 4, 'Desplazamiento, tiempo, velocidad media, velocidad instantánea, aceleración media y aceleración instantánea', 16),
(92, 5, 'Movimiento con aceleración constante', 16),
(93, 6, 'Cuerpos en caída libre', 16),
(94, 7, 'El vector aceleración', 16),
(95, 8, 'Movimiento de proyectiles', 16),
(96, 9, 'Movimiento en círculo. Velocidad y aceleración angulares. Rotación con aceleración angular constante. Relación entre cinemática lineal y cinemática angular', 16),
(97, 1, 'Fuerza e interacciones, Fuerzas fundamentales de la naturaleza', 17),
(98, 2, 'Leyes de Newton: Primera, Segunda y Tercera ley. Masa y peso', 17),
(99, 3, 'Diagramas de cuerpo libre. Partículas en equilibrio. Dinámica de partículas', 17),
(100, 4, 'Fuerzas de fricción', 17),
(101, 5, 'Dinámica del movimiento circular', 17),
(102, 1, 'Trabajo', 18),
(103, 2, 'Energía cinética y el teorema trabajo energía', 18),
(104, 3, 'Trabajo y energía con fuerza variable', 18),
(105, 4, 'Potencia', 18),
(106, 5, 'Energía potencial gravitacional', 18),
(107, 6, 'Energía potencial elástica', 18),
(108, 7, 'Fuerzas conservativas y no conservativas', 18),
(109, 8, 'Fuerza y energía potencial', 18),
(110, 9, 'Diagramas de energía', 18),
(111, 1, 'Cantidad de movimiento e impulso', 19),
(112, 2, 'Conservación de la cantidad de movimiento', 19),
(113, 3, 'Conservación de la cantidad de movimiento y choques', 19),
(114, 4, 'Choques elásticos', 19),
(115, 5, 'Centro de masa', 19),
(116, 6, 'Propulsión de un cohete', 19),
(117, 1, 'Energía en el movimiento de rotación', 20),
(118, 2, 'Teorema de los ejes paralelos', 20),
(119, 3, 'Cálculos de momento de inercia', 20),
(120, 4, 'Torca y aceleración angular de un cuerpo rígido', 20),
(121, 5, 'Rotación de un cuerpo rígido en torno a un eje móvil', 20),
(122, 6, 'Trabajo y potencia en movimiento de rotación', 20),
(123, 7, 'Momento angular', 20),
(124, 8, 'Conservación del momento angular', 20),
(125, 9, 'Giróscopos y precesión', 20),
(126, 1, 'Introducción', 21),
(127, 2, 'Conjuntos, elementos y subconjuntos', 21),
(128, 3, 'Diagramas de Venn', 21),
(129, 4, 'Operaciones con conjuntos', 21),
(130, 5, 'Álgebra de conjuntos, dualidad', 21),
(131, 6, 'Conjuntos finitos y principio de conteo', 21),
(132, 7, 'Clases de conjuntos, conjuntos potencia y particiones', 21),
(133, 1, 'Proposiciones', 22),
(134, 2, 'Proposiciones condicionales y equivalencia lógica', 22),
(135, 3, 'Cuantificadores', 22),
(136, 4, 'Demostraciones', 22),
(137, 5, 'Inducción matemática', 22),
(138, 6, 'Ejercicios para computadora', 22),
(139, 1, 'Grafos y multígrafos', 23),
(140, 2, 'Caminos y conectividad', 23),
(141, 3, 'Recorridos y grafos eulerianos', 23),
(142, 4, 'Grafos completos', 23),
(143, 5, 'Coloreados de grafos', 23),
(144, 6, 'Grafos dirigidos', 23),
(145, 1, 'Introducción', 24),
(146, 2, 'Operaciones', 24),
(147, 3, 'Semigrupos', 24),
(148, 4, 'Grupos', 24),
(149, 5, 'Subgrupos', 24),
(150, 6, 'Anillos, dominios de integridad y campos', 24),
(151, 7, 'Polinomios sobre un campo', 24),
(152, 1, 'Divisores', 25),
(153, 2, 'Representaciones de enteros y algoritmos enteros', 25),
(154, 3, 'El algoritmo euclidiano', 25),
(155, 4, 'El sistema criptográfico de llave pública RSA', 25),
(156, 5, 'Ejercicios para computadora', 25);
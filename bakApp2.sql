
CREATE DATABASE planificacion_test WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';


ALTER DATABASE planificacion_test OWNER TO postgres;

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;


-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-12 17:08:03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5021 (class 1262 OID 16388)
-- Name: planificacion; Type: DATABASE; Schema: -; Owner: postgres
--


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 235 (class 1255 OID 24891)
-- Name: actualizar_timestamp(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.actualizar_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.actualizar_timestamp() OWNER TO postgres;

--
-- TOC entry 248 (class 1255 OID 24897)
-- Name: auditar_tabla_seguridad(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auditar_tabla_seguridad() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    v_accion VARCHAR(255);
    v_recurso VARCHAR(100);
    v_recurso_id INT;
    v_detalle JSONB;
    v_user_setting TEXT;
    v_usuario_id INT;
BEGIN
    -- 1. Identificar el nombre de la tabla (recurso)
    v_recurso := TG_TABLE_NAME;

    -- 2. Identificar la acción y estructurar el detalle JSONB
    IF (TG_OP = 'INSERT') THEN
        v_accion := 'CREAR_' || UPPER(v_recurso);
        BEGIN v_recurso_id := NEW.id; EXCEPTION WHEN undefined_column THEN v_recurso_id := NULL; END;
        v_detalle := jsonb_build_object('nuevo', to_jsonb(NEW));
        
    ELSIF (TG_OP = 'UPDATE') THEN
        v_accion := 'MODIFICAR_' || UPPER(v_recurso);
        BEGIN v_recurso_id := NEW.id; EXCEPTION WHEN undefined_column THEN v_recurso_id := NULL; END;
        v_detalle := jsonb_build_object('anterior', to_jsonb(OLD), 'nuevo', to_jsonb(NEW));
        
    ELSIF (TG_OP = 'DELETE') THEN
        v_accion := 'ELIMINAR_' || UPPER(v_recurso);
        BEGIN v_recurso_id := OLD.id; EXCEPTION WHEN undefined_column THEN v_recurso_id := NULL; END;
        v_detalle := jsonb_build_object('anterior', to_jsonb(OLD));
    END IF;

    -- 3. CAPTURA SEGURA DEL USUARIO (Evita el error de sintaxis «»)
    v_user_setting := current_setting('app.current_user_id', true);
    
    -- Si la variable no existe, está vacía o no es numérica, la dejamos como NULL
    IF v_user_setting IS NULL OR v_user_setting = '' OR v_user_setting !~ '^[0-9]+$' THEN
        v_usuario_id := NULL;
    ELSE
        v_usuario_id := v_user_setting::INT;
    END IF;

    -- 4. Insertar en la tabla de logs de auditoría
    INSERT INTO logs_auditoria (usuario_id, accion, recurso, recurso_id, detalle)
    VALUES (v_usuario_id, v_accion, v_recurso, v_recurso_id, v_detalle);

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$_$;


ALTER FUNCTION public.auditar_tabla_seguridad() OWNER TO postgres;

--
-- TOC entry 236 (class 1255 OID 24895)
-- Name: auto_asignar_permiso_a_admin(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.auto_asignar_permiso_a_admin() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_admin_id INT;
BEGIN
    -- Buscamos el ID del rol admin
    SELECT id INTO v_admin_id FROM roles WHERE nombre = 'admin';

    -- Si el rol admin existe, le insertamos el nuevo permiso recién creado
    IF v_admin_id IS NOT NULL THEN
        INSERT INTO rol_permisos (rol_id, permiso_id)
        VALUES (v_admin_id, NEW.id)
        ON CONFLICT DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.auto_asignar_permiso_a_admin() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 24870)
-- Name: logs_auditoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs_auditoria (
    id integer NOT NULL,
    usuario_id integer,
    accion character varying(255) NOT NULL,
    recurso character varying(100),
    recurso_id integer,
    ip inet,
    user_agent text,
    detalle jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.logs_auditoria OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 24869)
-- Name: logs_auditoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_auditoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_auditoria_id_seq OWNER TO postgres;

--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 233
-- Name: logs_auditoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_auditoria_id_seq OWNED BY public.logs_auditoria.id;


--
-- TOC entry 226 (class 1259 OID 24771)
-- Name: permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permisos (
    id integer NOT NULL,
    recurso character varying(100) NOT NULL,
    accion character varying(50) NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permisos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24770)
-- Name: permisos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permisos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permisos_id_seq OWNER TO postgres;

--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 225
-- Name: permisos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permisos_id_seq OWNED BY public.permisos.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: tema; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tema (
    id integer CONSTRAINT planificaciones_id_not_null NOT NULL,
    tema text CONSTRAINT planificaciones_tema_not_null NOT NULL,
    descripcion character varying(25)
);


ALTER TABLE public.tema OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: planificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.planificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.planificaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 219
-- Name: planificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.planificaciones_id_seq OWNED BY public.tema.id;


--
-- TOC entry 232 (class 1259 OID 24850)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    token_hash character varying(255) NOT NULL,
    expira_en timestamp without time zone NOT NULL,
    revocado boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 24849)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO postgres;

--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 231
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- TOC entry 228 (class 1259 OID 24803)
-- Name: rol_permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol_permisos (
    rol_id integer NOT NULL,
    permiso_id integer NOT NULL
);


ALTER TABLE public.rol_permisos OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24756)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24755)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 223
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 230 (class 1259 OID 24838)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    sid character varying(255) NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24820)
-- Name: usuario_permisos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_permisos (
    usuario_id integer NOT NULL,
    permiso_id integer NOT NULL,
    concedido boolean DEFAULT true
);


ALTER TABLE public.usuario_permisos OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24786)
-- Name: usuario_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_roles (
    usuario_id integer NOT NULL,
    rol_id integer NOT NULL
);


ALTER TABLE public.usuario_roles OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24735)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    nombre character varying(100) NOT NULL,
    activo boolean DEFAULT true,
    ultimo_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24734)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 221
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4814 (class 2604 OID 24873)
-- Name: logs_auditoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria ALTER COLUMN id SET DEFAULT nextval('public.logs_auditoria_id_seq'::regclass);


--
-- TOC entry 4807 (class 2604 OID 24774)
-- Name: permisos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos ALTER COLUMN id SET DEFAULT nextval('public.permisos_id_seq'::regclass);


--
-- TOC entry 4811 (class 2604 OID 24853)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4804 (class 2604 OID 24759)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4799 (class 2604 OID 16393)
-- Name: tema id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tema ALTER COLUMN id SET DEFAULT nextval('public.planificaciones_id_seq'::regclass);


--
-- TOC entry 4800 (class 2604 OID 24738)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4851 (class 2606 OID 24880)
-- Name: logs_auditoria logs_auditoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_pkey PRIMARY KEY (id);


--
-- TOC entry 4832 (class 2606 OID 24783)
-- Name: permisos permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_pkey PRIMARY KEY (id);


--
-- TOC entry 4834 (class 2606 OID 24785)
-- Name: permisos permisos_recurso_accion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permisos
    ADD CONSTRAINT permisos_recurso_accion_key UNIQUE (recurso, accion);


--
-- TOC entry 4817 (class 2606 OID 16399)
-- Name: tema planificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tema
    ADD CONSTRAINT planificaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4845 (class 2606 OID 24861)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4847 (class 2606 OID 24863)
-- Name: refresh_tokens refresh_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 4838 (class 2606 OID 24809)
-- Name: rol_permisos rol_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_pkey PRIMARY KEY (rol_id, permiso_id);


--
-- TOC entry 4827 (class 2606 OID 24769)
-- Name: roles roles_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_nombre_key UNIQUE (nombre);


--
-- TOC entry 4829 (class 2606 OID 24767)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4843 (class 2606 OID 24847)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- TOC entry 4840 (class 2606 OID 24827)
-- Name: usuario_permisos usuario_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_pkey PRIMARY KEY (usuario_id, permiso_id);


--
-- TOC entry 4836 (class 2606 OID 24792)
-- Name: usuario_roles usuario_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_pkey PRIMARY KEY (usuario_id, rol_id);


--
-- TOC entry 4821 (class 2606 OID 24754)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4823 (class 2606 OID 24750)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4825 (class 2606 OID 24752)
-- Name: usuarios usuarios_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_username_key UNIQUE (username);


--
-- TOC entry 4848 (class 1259 OID 24890)
-- Name: idx_logs_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_created ON public.logs_auditoria USING btree (created_at);


--
-- TOC entry 4849 (class 1259 OID 24889)
-- Name: idx_logs_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_logs_usuario ON public.logs_auditoria USING btree (usuario_id);


--
-- TOC entry 4830 (class 1259 OID 24888)
-- Name: idx_permisos_recurso_accion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_permisos_recurso_accion ON public.permisos USING btree (recurso, accion);


--
-- TOC entry 4841 (class 1259 OID 24848)
-- Name: idx_sessions_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_expire ON public.sessions USING btree (expire);


--
-- TOC entry 4818 (class 1259 OID 24887)
-- Name: idx_usuarios_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_email ON public.usuarios USING btree (email);


--
-- TOC entry 4819 (class 1259 OID 24886)
-- Name: idx_usuarios_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_username ON public.usuarios USING btree (username);


--
-- TOC entry 4864 (class 2620 OID 24893)
-- Name: permisos tg_actualizar_permisos_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_actualizar_permisos_timestamp BEFORE UPDATE ON public.permisos FOR EACH ROW EXECUTE FUNCTION public.actualizar_timestamp();


--
-- TOC entry 4862 (class 2620 OID 24892)
-- Name: roles tg_actualizar_roles_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_actualizar_roles_timestamp BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.actualizar_timestamp();


--
-- TOC entry 4860 (class 2620 OID 24894)
-- Name: usuarios tg_actualizar_usuarios_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_actualizar_usuarios_timestamp BEFORE UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.actualizar_timestamp();


--
-- TOC entry 4867 (class 2620 OID 24901)
-- Name: rol_permisos tg_auditoria_rol_permisos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_auditoria_rol_permisos AFTER INSERT OR DELETE ON public.rol_permisos FOR EACH ROW EXECUTE FUNCTION public.auditar_tabla_seguridad();


--
-- TOC entry 4863 (class 2620 OID 24899)
-- Name: roles tg_auditoria_roles; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_auditoria_roles AFTER INSERT OR DELETE OR UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.auditar_tabla_seguridad();


--
-- TOC entry 4868 (class 2620 OID 24902)
-- Name: usuario_permisos tg_auditoria_usuario_permisos; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_auditoria_usuario_permisos AFTER INSERT OR DELETE OR UPDATE ON public.usuario_permisos FOR EACH ROW EXECUTE FUNCTION public.auditar_tabla_seguridad();


--
-- TOC entry 4866 (class 2620 OID 24900)
-- Name: usuario_roles tg_auditoria_usuario_roles; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_auditoria_usuario_roles AFTER INSERT OR DELETE ON public.usuario_roles FOR EACH ROW EXECUTE FUNCTION public.auditar_tabla_seguridad();


--
-- TOC entry 4861 (class 2620 OID 24898)
-- Name: usuarios tg_auditoria_usuarios; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_auditoria_usuarios AFTER INSERT OR DELETE OR UPDATE ON public.usuarios FOR EACH ROW EXECUTE FUNCTION public.auditar_tabla_seguridad();


--
-- TOC entry 4865 (class 2620 OID 24896)
-- Name: permisos tg_nuevo_permiso_a_admin; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_nuevo_permiso_a_admin AFTER INSERT ON public.permisos FOR EACH ROW EXECUTE FUNCTION public.auto_asignar_permiso_a_admin();


--
-- TOC entry 4859 (class 2606 OID 24881)
-- Name: logs_auditoria logs_auditoria_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs_auditoria
    ADD CONSTRAINT logs_auditoria_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 4858 (class 2606 OID 24864)
-- Name: refresh_tokens refresh_tokens_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4854 (class 2606 OID 24815)
-- Name: rol_permisos rol_permisos_permiso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES public.permisos(id) ON DELETE CASCADE;


--
-- TOC entry 4855 (class 2606 OID 24810)
-- Name: rol_permisos rol_permisos_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol_permisos
    ADD CONSTRAINT rol_permisos_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 4856 (class 2606 OID 24833)
-- Name: usuario_permisos usuario_permisos_permiso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_permiso_id_fkey FOREIGN KEY (permiso_id) REFERENCES public.permisos(id) ON DELETE CASCADE;


--
-- TOC entry 4857 (class 2606 OID 24828)
-- Name: usuario_permisos usuario_permisos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permisos
    ADD CONSTRAINT usuario_permisos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4852 (class 2606 OID 24798)
-- Name: usuario_roles usuario_roles_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 4853 (class 2606 OID 24793)
-- Name: usuario_roles usuario_roles_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2026-06-12 17:08:03

--
-- PostgreSQL database dump complete
--

-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.9.2
-- PostgreSQL version: 12.0
-- Project Site: pgmodeler.io
-- Model Author: Osvaldo

-- object: comfin | type: ROLE --
-- DROP ROLE IF EXISTS comfin;
CREATE ROLE comfin WITH 
	SUPERUSER
	CREATEDB
	CREATEROLE
	LOGIN;
-- ddl-end --


-- Database creation must be done outside a multicommand file.
-- These commands were put in this file only as a convenience.
-- -- object: comfin | type: DATABASE --
-- -- DROP DATABASE IF EXISTS comfin;
-- CREATE DATABASE comfin;
-- -- ddl-end --
-- 

-- object: public.usuario | type: TABLE --
-- DROP TABLE IF EXISTS public.usuario CASCADE;
CREATE TABLE public.usuario (
	id serial NOT NULL,
	nome character varying(250) NOT NULL,
	email character varying(250) NOT NULL,
	contato_nome character varying(250) NOT NULL,
	contato_celular char(11) NOT NULL,
	senha character varying(250) NOT NULL,
	CONSTRAINT pk_usuario PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE public.usuario OWNER TO comfin;
-- ddl-end --

-- object: public.mensagem | type: TABLE --
-- DROP TABLE IF EXISTS public.mensagem CASCADE;
CREATE TABLE public.mensagem (
	id serial NOT NULL,
	id_conversa integer NOT NULL,
	anexo smallint,
	texto text NOT NULL,
	valor double NOT NULL DEFAULT 0,
	data_anexo timestamptz,
	data_leitura timestamptz,
	data_envio timestamptz NOT NULL,
	CONSTRAINT pk_msg PRIMARY KEY (id_conversa,id)
);
-- ddl-end --
COMMENT ON COLUMN public.mensagem.data_anexo IS E'queremos saber quando ele pode ver o anexo';
-- ddl-end --
ALTER TABLE public.mensagem OWNER TO comfin;
-- ddl-end --

-- object: public.conversa | type: TABLE --
-- DROP TABLE IF EXISTS public.conversa CASCADE;
CREATE TABLE public.conversa (
	id serial NOT NULL,
	assunto character varying(250) NOT NULL,
	data_inicio timestamptz NOT NULL,
	id_remetente integer NOT NULL,
	id_destinatario integer NOT NULL,
	CONSTRAINT pk_conversa PRIMARY KEY (id)

);
-- ddl-end --
COMMENT ON COLUMN public.conversa.id_remetente IS E'Quem inicia a conversa';
-- ddl-end --
COMMENT ON COLUMN public.conversa.id_destinatario IS E'a quem primeiro e deistinada a conversa';
-- ddl-end --
ALTER TABLE public.conversa OWNER TO comfin;
-- ddl-end --

-- object: fk_conversa | type: CONSTRAINT --
-- ALTER TABLE public.mensagem DROP CONSTRAINT IF EXISTS fk_conversa CASCADE;
ALTER TABLE public.mensagem ADD CONSTRAINT fk_conversa FOREIGN KEY (id_conversa)
REFERENCES public.conversa (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_remetente | type: CONSTRAINT --
-- ALTER TABLE public.conversa DROP CONSTRAINT IF EXISTS fk_remetente CASCADE;
ALTER TABLE public.conversa ADD CONSTRAINT fk_remetente FOREIGN KEY (id_remetente)
REFERENCES public.usuario (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_destinario | type: CONSTRAINT --
-- ALTER TABLE public.conversa DROP CONSTRAINT IF EXISTS fk_destinario CASCADE;
ALTER TABLE public.conversa ADD CONSTRAINT fk_destinario FOREIGN KEY (id_destinatario)
REFERENCES public.usuario (id) MATCH FULL
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --



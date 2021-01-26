--
-- PostgreSQL database dump
--

-- Dumped from database version 11.10 (Ubuntu 11.10-1.pgdg20.04+1)
-- Dumped by pg_dump version 11.10 (Ubuntu 11.10-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_with_oids = false;

--
-- Name: anexo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.anexo (
    id_mensagem uuid NOT NULL,
    sequencia integer NOT NULL,
    instrucao character varying(255) NOT NULL,
    data_validade date,
    data_leitura timestamp with time zone,
    arquivo bytea NOT NULL,
    ext character varying(10) NOT NULL,
    valor double precision DEFAULT 0 NOT NULL
);


--
-- Name: categoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoria (
    id integer NOT NULL,
    descricao character varying(50) NOT NULL,
    cor character varying(8) NOT NULL
);


--
-- Name: categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;


--
-- Name: conversa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversa (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    assunto character varying(250) NOT NULL,
    data_inicio timestamp with time zone DEFAULT now() NOT NULL,
    id_usuario_primario uuid NOT NULL,
    id_usuario_secundario uuid NOT NULL,
    id_categoria integer DEFAULT 1 NOT NULL
);


--
-- Name: COLUMN conversa.id_usuario_primario; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.conversa.id_usuario_primario IS 'Quem inicia a conversa';


--
-- Name: COLUMN conversa.id_usuario_secundario; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.conversa.id_usuario_secundario IS 'a quem primeiro e deistinada a conversa';


--
-- Name: mensagem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mensagem (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    id_conversa uuid NOT NULL,
    id_remetente uuid NOT NULL,
    texto text NOT NULL,
    data_leitura timestamp with time zone,
    data_envio timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tipo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipo (
    id integer NOT NULL,
    descricao character varying(50) NOT NULL,
    cor character varying(8) DEFAULT 80912 NOT NULL
);


--
-- Name: tipo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tipo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipo_id_seq OWNED BY public.tipo.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nome character varying(250) NOT NULL,
    email character varying(250) NOT NULL,
    contato_nome character varying(250) NOT NULL,
    contato_celular character(11) NOT NULL,
    senha character varying(250) NOT NULL,
    criado_em timestamp with time zone DEFAULT now() NOT NULL,
    atualizado_em timestamp with time zone,
    master boolean DEFAULT false NOT NULL,
    id_tipo integer NOT NULL,
    foto bytea
);


--
-- Name: categoria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- Name: tipo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo ALTER COLUMN id SET DEFAULT nextval('public.tipo_id_seq'::regclass);


--
-- Name: anexo anexo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anexo
    ADD CONSTRAINT anexo_pkey PRIMARY KEY (id_mensagem, sequencia);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- Name: conversa pk_conversa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversa
    ADD CONSTRAINT pk_conversa PRIMARY KEY (id);


--
-- Name: mensagem pk_msg; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensagem
    ADD CONSTRAINT pk_msg PRIMARY KEY (id_conversa, id);


--
-- Name: usuario pk_usuario; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT pk_usuario PRIMARY KEY (id);


--
-- Name: tipo tipo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipo
    ADD CONSTRAINT tipo_pkey PRIMARY KEY (id);


--
-- Name: mensagem fk_conversa; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensagem
    ADD CONSTRAINT fk_conversa FOREIGN KEY (id_conversa) REFERENCES public.conversa(id) MATCH FULL;


--
-- Name: conversa fk_destinario; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversa
    ADD CONSTRAINT fk_destinario FOREIGN KEY (id_usuario_secundario) REFERENCES public.usuario(id) MATCH FULL;


--
-- Name: conversa fk_remetente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversa
    ADD CONSTRAINT fk_remetente FOREIGN KEY (id_usuario_primario) REFERENCES public.usuario(id) MATCH FULL;


--
-- Name: mensagem fk_remetente; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mensagem
    ADD CONSTRAINT fk_remetente FOREIGN KEY (id_remetente) REFERENCES public.usuario(id) MATCH FULL;


--
-- Name: usuario usuario_id_tipo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_tipo_fkey FOREIGN KEY (id_tipo) REFERENCES public.tipo(id) NOT VALID;


--
-- PostgreSQL database dump complete
--


INSERT INTO public.tipo(descricao, cor) VALUES ('Prog', '000000');

-- Senha: xakv7f7u

INSERT INTO public.usuario(
	nome, email, contato_nome, contato_celular, senha, master, id_tipo)
	VALUES ('USUARIO TESTE 01', 'mail@mail.com.br', 'GIOVANNY LUCAS', '88888888888', '$2a$10$gQ8oUlaWRU03gtPHmzooQOpuW8l4F/UpFx0wPze7Qrix8/.Y02T6e', true, 1);

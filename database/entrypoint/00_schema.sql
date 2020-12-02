--
-- PostgreSQL database dump
--

-- Dumped from database version 10.13
-- Dumped by pg_dump version 10.13

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
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: rsparg; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.rsparg AS (
	id_passo integer,
	id_reqservico integer
);


SET default_with_oids = false;

--
-- Name: requisicao_servico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.requisicao_servico (
    id integer NOT NULL,
    id_servico integer NOT NULL,
    id_funcionario_requisitante integer NOT NULL,
    id_funcionario_responsavel integer,
    inicio timestamp with time zone,
    fim timestamp with time zone,
    estado integer DEFAULT 0,
    cancelada boolean DEFAULT false,
    finalizada boolean DEFAULT false,
    justificativa_cancelamento text,
    possivel_responsavel integer,
    prioridade integer DEFAULT 1 NOT NULL
);


--
-- Name: RequisicaoServico_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."RequisicaoServico_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: RequisicaoServico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."RequisicaoServico_id_seq" OWNED BY public.requisicao_servico.id;


--
-- Name: acesso; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.acesso (
    id_funcionario integer NOT NULL,
    acesso integer NOT NULL
);


--
-- Name: area; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.area (
    id integer NOT NULL,
    nome character varying(250) NOT NULL
);


--
-- Name: area_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.area_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: area_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.area_id_seq OWNED BY public.area.id;


--
-- Name: bairro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bairro (
    id integer NOT NULL,
    id_cidade integer NOT NULL,
    nome character varying(250) NOT NULL
);


--
-- Name: cargo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cargo (
    id integer NOT NULL,
    nome character varying(250) NOT NULL,
    id_funcao integer
);


--
-- Name: cidade; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cidade (
    id integer NOT NULL,
    nome character varying(250) NOT NULL,
    uf character(2) NOT NULL
);


--
-- Name: empresa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empresa (
    id integer NOT NULL,
    id_logradouro integer NOT NULL,
    nome character varying(250),
    cnpj character(14) NOT NULL,
    endnro smallint DEFAULT 0
);


--
-- Name: empresa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.empresa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: empresa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.empresa_id_seq OWNED BY public.empresa.id;


--
-- Name: funcao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.funcao (
    id integer NOT NULL,
    nome character varying(250) NOT NULL,
    descricao text NOT NULL
);


--
-- Name: funcao_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.funcao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: funcao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.funcao_id_seq OWNED BY public.funcao.id;


--
-- Name: funcionario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.funcionario (
    id integer NOT NULL,
    id_residencialogr integer DEFAULT 1 NOT NULL,
    id_lotacaologr integer DEFAULT 1 NOT NULL,
    id_cargo integer DEFAULT 1 NOT NULL,
    id_super integer DEFAULT 1351,
    id_setor integer DEFAULT 1 NOT NULL,
    id_empresa integer DEFAULT 3 NOT NULL,
    cpf character varying(11) NOT NULL,
    nome character varying(250) NOT NULL,
    resnro smallint,
    reslat double precision NOT NULL,
    reslong double precision NOT NULL,
    lotnro smallint,
    lotlat double precision NOT NULL,
    lotlong double precision NOT NULL,
    emailprivado character varying(250),
    email1brisanet character varying(250),
    email2brisanet character varying(250),
    planilhas boolean,
    planilhaslista text[] DEFAULT ARRAY[]::text[],
    id_nivel smallint DEFAULT 7 NOT NULL,
    apelido character varying(250),
    id_origemlogr integer,
    orinro smallint,
    orilat double precision,
    orilong double precision,
    data_situacao timestamp without time zone,
    cnpj character varying(15),
    empresa character varying(250),
    ativo boolean DEFAULT true NOT NULL,
    matricula character varying(6) DEFAULT 0,
    acesso integer DEFAULT 1 NOT NULL
);


--
-- Name: funcionario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.funcionario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: funcionario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.funcionario_id_seq OWNED BY public.funcionario.id;


--
-- Name: grupo_atendimento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grupo_atendimento (
    id_servico integer NOT NULL,
    id_funcionario integer NOT NULL
);


--
-- Name: grupo_solicitante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.grupo_solicitante (
    id_servico integer NOT NULL,
    id_setor integer NOT NULL
);


--
-- Name: logradouro; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.logradouro (
    id integer NOT NULL,
    nome character varying(250) NOT NULL,
    id_bairro integer NOT NULL
);


--
-- Name: notificacao; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notificacao (
    id integer NOT NULL,
    ref text NOT NULL,
    acao integer NOT NULL,
    id_remetente integer NOT NULL,
    id_destinatario integer NOT NULL,
    critico integer DEFAULT 1 NOT NULL,
    criado_em timestamp without time zone DEFAULT now() NOT NULL,
    vista boolean DEFAULT false NOT NULL,
    setor_is_destinatario boolean DEFAULT false NOT NULL,
    id_setor integer
);


--
-- Name: notificacao_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notificacao_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notificacao_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notificacao_id_seq OWNED BY public.notificacao.id;


--
-- Name: passo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.passo (
    id integer NOT NULL,
    id_setor integer,
    id_servico integer NOT NULL,
    valor boolean DEFAULT false NOT NULL,
    anexo boolean DEFAULT false NOT NULL,
    obrigatorio boolean DEFAULT true NOT NULL,
    pendencia boolean DEFAULT false NOT NULL,
    identificacao text,
    tempo_padrao integer,
    sequencia integer DEFAULT 1,
    passo_aceito boolean,
    descricao text,
    ocorrencia boolean DEFAULT false,
    dependente text DEFAULT '0'::text NOT NULL
);


--
-- Name: passo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.passo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: passo_id_seq1; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.passo_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: passo_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.passo_id_seq1 OWNED BY public.passo.id;


--
-- Name: passo_recusado; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.passo_recusado (
    id_setor_criador integer NOT NULL,
    id_setor_recusa integer NOT NULL,
    motivo text NOT NULL,
    recusado_em integer NOT NULL
);


--
-- Name: requisicao_servico_passo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.requisicao_servico_passo (
    id_reqservico integer NOT NULL,
    id_passo integer NOT NULL,
    id_funcionario integer,
    valor numeric(9,2) DEFAULT 0.00 NOT NULL,
    informativo text NOT NULL,
    inicio timestamp with time zone,
    fim timestamp with time zone,
    estado integer DEFAULT 0 NOT NULL,
    justifica_atraso text,
    cancelado boolean DEFAULT false,
    possivel_responsavel integer,
    status_ocorrencia integer DEFAULT 4 NOT NULL,
    status_anexo integer DEFAULT 4 NOT NULL
);


--
-- Name: COLUMN requisicao_servico_passo.id_funcionario; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.requisicao_servico_passo.id_funcionario IS 'responsavel';


--
-- Name: requisicao_servico_passo_id_reqservico_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.requisicao_servico_passo_id_reqservico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: requisicao_servico_passo_id_reqservico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.requisicao_servico_passo_id_reqservico_seq OWNED BY public.requisicao_servico_passo.id_reqservico;


--
-- Name: rspocorrencia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rspocorrencia (
    id_reqservico integer NOT NULL,
    sequencia integer NOT NULL,
    ocorrencia text,
    datai timestamp without time zone,
    dataf timestamp without time zone,
    vista boolean DEFAULT false NOT NULL,
    id_passo integer NOT NULL
);


--
-- Name: rspocorrenciaanexo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rspocorrenciaanexo (
    id_requisicao integer NOT NULL,
    id_passo integer NOT NULL,
    sequencia integer NOT NULL,
    descricao text NOT NULL,
    arquivo bytea NOT NULL,
    ext text,
    servidor boolean DEFAULT false
);


--
-- Name: servico; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.servico (
    id integer NOT NULL,
    id_setor integer NOT NULL,
    identificacao text NOT NULL,
    descricao text NOT NULL,
    tempo_padrao integer DEFAULT 0 NOT NULL,
    tempo_entrega integer DEFAULT 24 NOT NULL,
    icone text DEFAULT 'mdi mdi-file-tree'::text NOT NULL
);


--
-- Name: servico_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.servico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: servico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.servico_id_seq OWNED BY public.servico.id;


--
-- Name: setor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.setor (
    id integer NOT NULL,
    id_super integer,
    id_logradouro integer NOT NULL,
    id_responsavel integer,
    nome character varying(250) NOT NULL,
    logrnro smallint,
    lat double precision,
    long double precision,
    ramal smallint,
    email character varying(250),
    id_area integer
);


--
-- Name: setor_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.setor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: setor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.setor_id_seq OWNED BY public.setor.id;


--
-- Name: area id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.area ALTER COLUMN id SET DEFAULT nextval('public.area_id_seq'::regclass);


--
-- Name: empresa id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa ALTER COLUMN id SET DEFAULT nextval('public.empresa_id_seq'::regclass);


--
-- Name: funcao id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcao ALTER COLUMN id SET DEFAULT nextval('public.funcao_id_seq'::regclass);


--
-- Name: funcionario id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionario ALTER COLUMN id SET DEFAULT nextval('public.funcionario_id_seq'::regclass);


--
-- Name: notificacao id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacao ALTER COLUMN id SET DEFAULT nextval('public.notificacao_id_seq'::regclass);


--
-- Name: passo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passo ALTER COLUMN id SET DEFAULT nextval('public.passo_id_seq1'::regclass);


--
-- Name: requisicao_servico id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requisicao_servico ALTER COLUMN id SET DEFAULT nextval('public."RequisicaoServico_id_seq"'::regclass);


--
-- Name: requisicao_servico_passo id_reqservico; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requisicao_servico_passo ALTER COLUMN id_reqservico SET DEFAULT nextval('public.requisicao_servico_passo_id_reqservico_seq'::regclass);


--
-- Name: servico id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servico ALTER COLUMN id SET DEFAULT nextval('public.servico_id_seq'::regclass);


--
-- Name: setor id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.setor ALTER COLUMN id SET DEFAULT nextval('public.setor_id_seq'::regclass);


--
-- Name: area area_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.area
    ADD CONSTRAINT area_pkey PRIMARY KEY (id);


--
-- Name: bairro bairro_cidade_ukey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bairro
    ADD CONSTRAINT bairro_cidade_ukey UNIQUE (nome, id_cidade);


--
-- Name: cidade cidade_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cidade
    ADD CONSTRAINT cidade_pkey PRIMARY KEY (id);


--
-- Name: funcionario cpf_ukey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT cpf_ukey UNIQUE (cpf);


--
-- Name: funcao funcao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcao
    ADD CONSTRAINT funcao_pkey PRIMARY KEY (id);


--
-- Name: notificacao notificacao_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notificacao
    ADD CONSTRAINT notificacao_pkey PRIMARY KEY (id);


--
-- Name: grupo_atendimento pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grupo_atendimento
    ADD CONSTRAINT pk PRIMARY KEY (id_servico, id_funcionario);


--
-- Name: bairro pk_bairro; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bairro
    ADD CONSTRAINT pk_bairro PRIMARY KEY (id);


--
-- Name: cargo pk_cargo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT pk_cargo PRIMARY KEY (id);


--
-- Name: empresa pk_empresa; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT pk_empresa PRIMARY KEY (id);


--
-- Name: acesso pk_func; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.acesso
    ADD CONSTRAINT pk_func PRIMARY KEY (id_funcionario);


--
-- Name: funcionario pk_funcionario; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT pk_funcionario PRIMARY KEY (id);


--
-- Name: grupo_solicitante pk_gs; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grupo_solicitante
    ADD CONSTRAINT pk_gs PRIMARY KEY (id_servico, id_setor);


--
-- Name: logradouro pk_logradouro; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.logradouro
    ADD CONSTRAINT pk_logradouro PRIMARY KEY (id);


--
-- Name: passo pk_passo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passo
    ADD CONSTRAINT pk_passo PRIMARY KEY (id);


--
-- Name: requisicao_servico pk_reqservico; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requisicao_servico
    ADD CONSTRAINT pk_reqservico PRIMARY KEY (id);


--
-- Name: requisicao_servico_passo pk_reqservicopasso; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requisicao_servico_passo
    ADD CONSTRAINT pk_reqservicopasso PRIMARY KEY (id_reqservico, id_passo);


--
-- Name: rspocorrenciaanexo pk_rspocorrenciaanexo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rspocorrenciaanexo
    ADD CONSTRAINT pk_rspocorrenciaanexo PRIMARY KEY (id_requisicao, id_passo, sequencia);


--
-- Name: servico pk_servico; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.servico
    ADD CONSTRAINT pk_servico PRIMARY KEY (id);


--
-- Name: rspocorrencia fk_id_passo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rspocorrencia
    ADD CONSTRAINT fk_id_passo FOREIGN KEY (id_passo) REFERENCES public.passo(id);


--
-- Name: passo fk_passo_servico; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passo
    ADD CONSTRAINT fk_passo_servico FOREIGN KEY (id_servico) REFERENCES public.servico(id);


--
-- Name: requisicao_servico_passo fk_req_servico_passo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requisicao_servico_passo
    ADD CONSTRAINT fk_req_servico_passo FOREIGN KEY (id_reqservico) REFERENCES public.requisicao_servico(id);


--
-- Name: grupo_atendimento fk_servico; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grupo_atendimento
    ADD CONSTRAINT fk_servico FOREIGN KEY (id_servico) REFERENCES public.servico(id) MATCH FULL;


--
-- Name: grupo_solicitante fk_servico; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.grupo_solicitante
    ADD CONSTRAINT fk_servico FOREIGN KEY (id_servico) REFERENCES public.servico(id) MATCH FULL;


--
-- Name: requisicao_servico_passo fk_servico_passo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requisicao_servico_passo
    ADD CONSTRAINT fk_servico_passo FOREIGN KEY (id_passo) REFERENCES public.passo(id);


--
-- PostgreSQL database dump complete
--


-- Table: public.feedback

-- DROP TABLE public.feedback;

CREATE TABLE IF NOT EXISTS public.feedback
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    course_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    is_read bit(1) NOT NULL DEFAULT '0'::"bit",
    date_created timestamp(0) without time zone NOT NULL DEFAULT now(),
    course_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    subaccount_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    term_code character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT feedback_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.feedback
    OWNER to postgres;

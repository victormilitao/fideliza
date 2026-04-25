


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


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."confirm_email_verify_profile"("p_token" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_user_id UUID;
  v_confirmed_at TIMESTAMPTZ;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- 1. Fetch the token record
  SELECT user_id, confirmed_at, expires_at
    INTO v_user_id, v_confirmed_at, v_expires_at
    FROM email_confirmation_tokens
   WHERE token = p_token;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('token_valid', false, 'user_id', NULL, 'error', 'Invalid token');
  END IF;

  -- 2. If already confirmed, just return success
  IF v_confirmed_at IS NOT NULL THEN
    RETURN jsonb_build_object('token_valid', true, 'user_id', v_user_id);
  END IF;

  -- 3. Check expiration
  IF v_expires_at < NOW() THEN
    RETURN jsonb_build_object('token_valid', false, 'user_id', v_user_id, 'error', 'Token expired');
  END IF;

  -- 4. Mark token as confirmed
  UPDATE email_confirmation_tokens
     SET confirmed_at = NOW()
   WHERE token = p_token;

  -- 5. Mark profile as verified
  UPDATE profiles
     SET verified = NOW()
   WHERE user_id = v_user_id;

  RETURN jsonb_build_object('token_valid', true, 'user_id', v_user_id);
END;
$$;


ALTER FUNCTION "public"."confirm_email_verify_profile"("p_token" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_business_structure_by_person"("p_person_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
begin
  return (
    select jsonb_agg(to_jsonb(business_row))
    from (
      select
        b.id,
        b.name,
        b.address,
        (
          select jsonb_agg(to_jsonb(campaign_row))
          from (
            select
              c.id,
              c.rule,
              c.prize,
              c.stamps_required,
              (
                select jsonb_agg(to_jsonb(card_row))
                from (
                  select
                    cd.id,
                    cd.person_id,
                    cd.prized_at,
                    cd.prize_code,
                    cd.created_at,
                    cd.completed_at,
                    (
                      select jsonb_agg(to_jsonb(s))
                      from stamps s
                      where s.card_id = cd.id
                    ) as stamps
                  from cards cd
                  where cd.campaign_id = c.id
                    and cd.person_id = p_person_id
                    and cd.prized_at is null
                ) card_row
              ) as cards
            from campaigns c
            where c.business_id = b.id
          ) campaign_row
        ) as campaigns
      from business b
      where exists (
        select 1
        from campaigns c
        join cards cd on cd.campaign_id = c.id
        where c.business_id = b.id
          and cd.person_id = p_person_id
          and cd.prized_at is null
      )
    ) business_row
  );
end;
$$;


ALTER FUNCTION "public"."get_business_structure_by_person"("p_person_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_id_by_email"("email_to_find" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    found_user_id UUID;
BEGIN
    SELECT id INTO found_user_id
    FROM auth.users
    WHERE email = email_to_find
    LIMIT 1;

    RETURN found_user_id;
END;
$$;


ALTER FUNCTION "public"."get_user_id_by_email"("email_to_find" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  insert into public.user_attributes (user_id, email)
  values (new.id, new.email);
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."business" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "address" "text",
    "cep" "text",
    "street_number" "text",
    "cnpj" "text",
    "neighborhood" "text",
    "state" "text",
    "city" "text",
    "phone" "text",
    "complement" "text"
);


ALTER TABLE "public"."business" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."business_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "business_id" "uuid" NOT NULL,
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "stripe_session_id" "text",
    "payment_status" "text" NOT NULL,
    "subscription_status" "text",
    "status" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."business_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."campaigns" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "rule" "text" NOT NULL,
    "prize" "text" NOT NULL,
    "stamps_required" smallint NOT NULL,
    "business_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."campaigns" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cards" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "campaign_id" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "person_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "completed_at" timestamp with time zone,
    "prize_code" "text",
    "prized_at" timestamp with time zone
);


ALTER TABLE "public"."cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."email_confirmation_tokens" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "expires_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone
);


ALTER TABLE "public"."email_confirmation_tokens" OWNER TO "postgres";


ALTER TABLE "public"."email_confirmation_tokens" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."email_confirmation_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."login_tokens" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "person_id" "uuid" NOT NULL,
    "expires_at" timestamp with time zone
);


ALTER TABLE "public"."login_tokens" OWNER TO "postgres";


ALTER TABLE "public"."login_tokens" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."login_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."password_reset_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."password_reset_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."person" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "phone" character varying NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."person" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."person_codes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "login" "text",
    "person_id" "uuid" NOT NULL
);


ALTER TABLE "public"."person_codes" OWNER TO "postgres";


ALTER TABLE "public"."person_codes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."person_codes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" bigint NOT NULL,
    "role" character varying NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "person_id" "uuid",
    "verified" timestamp with time zone,
    CONSTRAINT "profiles_role_check" CHECK ((("role")::"text" = ANY (ARRAY[('business_owner'::character varying)::"text", ('customer'::character varying)::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


ALTER TABLE "public"."profiles" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."profiles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."stamps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "person_id" "uuid" NOT NULL,
    "card_id" "uuid" NOT NULL
);


ALTER TABLE "public"."stamps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_attributes" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "email" "text" NOT NULL
);


ALTER TABLE "public"."user_attributes" OWNER TO "postgres";


ALTER TABLE "public"."user_attributes" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."user_attributes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."business"
    ADD CONSTRAINT "business_cnpj_unique" UNIQUE ("cnpj");



ALTER TABLE ONLY "public"."business"
    ADD CONSTRAINT "business_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."business_subscriptions"
    ADD CONSTRAINT "business_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."business_subscriptions"
    ADD CONSTRAINT "business_subscriptions_stripe_subscription_id_key" UNIQUE ("stripe_subscription_id");



ALTER TABLE ONLY "public"."business"
    ADD CONSTRAINT "business_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_duplicate_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_duplicate_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "campaigns_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_confirmation_tokens"
    ADD CONSTRAINT "email_confirmation_tokens_person_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."email_confirmation_tokens"
    ADD CONSTRAINT "email_confirmation_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."login_tokens"
    ADD CONSTRAINT "login_tokens_person_id_key" UNIQUE ("person_id");



ALTER TABLE ONLY "public"."login_tokens"
    ADD CONSTRAINT "login_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."password_reset_tokens"
    ADD CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."person_codes"
    ADD CONSTRAINT "person_codes_person_id_key" UNIQUE ("person_id");



ALTER TABLE ONLY "public"."person_codes"
    ADD CONSTRAINT "person_codes_person_id_key1" UNIQUE ("person_id");



ALTER TABLE ONLY "public"."person_codes"
    ADD CONSTRAINT "person_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."person"
    ADD CONSTRAINT "person_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_key" UNIQUE ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_person_id_key" UNIQUE ("person_id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id", "user_id");



ALTER TABLE ONLY "public"."stamps"
    ADD CONSTRAINT "stamp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."password_reset_tokens"
    ADD CONSTRAINT "unique_user_id" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_attributes"
    ADD CONSTRAINT "user_attributes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_attributes"
    ADD CONSTRAINT "user_attributes_user_id_key" UNIQUE ("user_id");



CREATE INDEX "idx_business_subscriptions_business_id" ON "public"."business_subscriptions" USING "btree" ("business_id");



CREATE INDEX "idx_business_subscriptions_payment_status" ON "public"."business_subscriptions" USING "btree" ("payment_status");



CREATE INDEX "idx_business_subscriptions_stripe_customer_id" ON "public"."business_subscriptions" USING "btree" ("stripe_customer_id");



CREATE INDEX "idx_business_subscriptions_stripe_subscription_id" ON "public"."business_subscriptions" USING "btree" ("stripe_subscription_id");



ALTER TABLE ONLY "public"."business_subscriptions"
    ADD CONSTRAINT "business_subscriptions_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."business"
    ADD CONSTRAINT "business_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."campaigns"
    ADD CONSTRAINT "campaigns_duplicate_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id");



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "cards_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id");



ALTER TABLE ONLY "public"."cards"
    ADD CONSTRAINT "cards_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id");



ALTER TABLE ONLY "public"."email_confirmation_tokens"
    ADD CONSTRAINT "email_confirmation_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."login_tokens"
    ADD CONSTRAINT "login_tokens_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id");



ALTER TABLE ONLY "public"."password_reset_tokens"
    ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."person_codes"
    ADD CONSTRAINT "person_codes_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id");



ALTER TABLE ONLY "public"."person"
    ADD CONSTRAINT "person_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."stamps"
    ADD CONSTRAINT "stamp_campaign_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id");



ALTER TABLE ONLY "public"."stamps"
    ADD CONSTRAINT "stamp_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."person"("id");



ALTER TABLE ONLY "public"."user_attributes"
    ADD CONSTRAINT "user_attributes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Enable insert for authenticated users only" ON "public"."person_codes" FOR INSERT TO "anon" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."login_tokens" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."person" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."person_codes" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profiles" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."user_attributes" FOR SELECT USING (true);



CREATE POLICY "Enable update for users based on email" ON "public"."person_codes" FOR UPDATE TO "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for users based on email" ON "public"."profiles" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Policy with security definer functions" ON "public"."business" TO "authenticated" USING (true);



CREATE POLICY "Policy with security definer functions" ON "public"."campaigns" TO "authenticated" USING (true);



CREATE POLICY "Policy with security definer functions" ON "public"."cards" TO "authenticated" USING (true);



CREATE POLICY "Policy with security definer functions" ON "public"."email_confirmation_tokens" USING (true) WITH CHECK (true);



CREATE POLICY "Policy with security definer functions" ON "public"."login_tokens" TO "authenticated" USING (true);



CREATE POLICY "Policy with security definer functions" ON "public"."person" TO "authenticated" USING (true);



CREATE POLICY "Policy with security definer functions" ON "public"."person_codes" TO "authenticated" USING (true);



CREATE POLICY "Policy with security definer functions" ON "public"."profiles" TO "authenticated" USING (true);



CREATE POLICY "Policy with security definer functions" ON "public"."stamps" TO "authenticated" USING (true);



ALTER TABLE "public"."business" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."campaigns" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."email_confirmation_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."login_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."password_reset_tokens" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."person" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."person_codes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stamps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_attributes" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."confirm_email_verify_profile"("p_token" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."confirm_email_verify_profile"("p_token" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."confirm_email_verify_profile"("p_token" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_business_structure_by_person"("p_person_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_business_structure_by_person"("p_person_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_business_structure_by_person"("p_person_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email_to_find" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email_to_find" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_id_by_email"("email_to_find" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON TABLE "public"."business" TO "anon";
GRANT ALL ON TABLE "public"."business" TO "authenticated";
GRANT ALL ON TABLE "public"."business" TO "service_role";



GRANT ALL ON TABLE "public"."business_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."business_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."business_subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."campaigns" TO "anon";
GRANT ALL ON TABLE "public"."campaigns" TO "authenticated";
GRANT ALL ON TABLE "public"."campaigns" TO "service_role";



GRANT ALL ON TABLE "public"."cards" TO "anon";
GRANT ALL ON TABLE "public"."cards" TO "authenticated";
GRANT ALL ON TABLE "public"."cards" TO "service_role";



GRANT ALL ON TABLE "public"."email_confirmation_tokens" TO "anon";
GRANT ALL ON TABLE "public"."email_confirmation_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."email_confirmation_tokens" TO "service_role";



GRANT ALL ON SEQUENCE "public"."email_confirmation_tokens_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."email_confirmation_tokens_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."email_confirmation_tokens_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."login_tokens" TO "anon";
GRANT ALL ON TABLE "public"."login_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."login_tokens" TO "service_role";



GRANT ALL ON SEQUENCE "public"."login_tokens_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."login_tokens_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."login_tokens_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."password_reset_tokens" TO "anon";
GRANT ALL ON TABLE "public"."password_reset_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."password_reset_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."person" TO "anon";
GRANT ALL ON TABLE "public"."person" TO "authenticated";
GRANT ALL ON TABLE "public"."person" TO "service_role";



GRANT ALL ON TABLE "public"."person_codes" TO "anon";
GRANT ALL ON TABLE "public"."person_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."person_codes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."person_codes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."person_codes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."person_codes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON SEQUENCE "public"."profiles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."profiles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."profiles_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stamps" TO "anon";
GRANT ALL ON TABLE "public"."stamps" TO "authenticated";
GRANT ALL ON TABLE "public"."stamps" TO "service_role";



GRANT ALL ON TABLE "public"."user_attributes" TO "anon";
GRANT ALL ON TABLE "public"."user_attributes" TO "authenticated";
GRANT ALL ON TABLE "public"."user_attributes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_attributes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_attributes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_attributes_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";








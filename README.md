# DJ Wizzy website

## Local development

```bash
npm install
npm run dev
```

## Supabase setup

1. Create a Supabase project and copy its project URL, anon/publishable key, and service-role key.
2. Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the project URL and anon key. Set `SUPABASE_SERVICE_ROLE_KEY` to the service-role key. The service-role key is server-only; never prefix it with `NEXT_PUBLIC_` or commit it.
3. Run [the Supabase migration](./supabase/migrations/20261003000000_create_content_marketplace_tables.sql) using the Supabase SQL Editor or Supabase CLI. It creates `pages`, `vendors`, and `products`, enables RLS, and installs public-read/vendor-product policies.
4. Import the existing JSON files and marketplace products:

   ```bash
   npm run migrate:pages
   ```

   The script reads `data/pages/*.json`, upserts each document by slug, and imports `marketplace.json` items as published products owned by an approved `DJ Wizzy` vendor. It can be rerun safely for the imported page slugs and vendor product names.
5. In the Supabase SQL Editor, set the application role for the account that should administer content (replace the email):

   ```sql
   update auth.users
   set raw_app_meta_data =
     coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'admin@example.com';
   ```

   `app_metadata` is verified server-side and cannot be assigned by the public sign-up form. Do not use `user_metadata` for authorization. Sign out and sign in again after changing the role so the browser gets a fresh access token.
6. Add the same three environment variables to the Vercel project. The two `NEXT_PUBLIC_` values are included in the client build; `SUPABASE_SERVICE_ROLE_KEY` must remain a server-only secret. Redeploy after setting them.

The admin editor is at `/admin-panel`. Page content is read through `/api/admin/page?slug=...`; writes require a Supabase Auth access token belonging to a user with `app_metadata.role = "admin"`. Product CRUD is available in the Products tab, and public marketplace listings come from `/api/products`.

## Storage and security notes

- The service-role client is isolated in `lib/supabase-admin.ts`, marked `server-only`, and used only by route handlers and the migration utility.
- Public page and product reads are returned with `Cache-Control: no-store` so updates are visible on the next request.
- The service role bypasses RLS. Every admin mutation verifies the Supabase access token and checks the trusted `app_metadata` role before using it.
- Product image fields accept URLs only. This project does not yet upload files; use a dedicated object-storage bucket and upload policies before adding uploads.

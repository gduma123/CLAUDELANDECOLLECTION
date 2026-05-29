# The Claudelande Collection

TanStack Start storefront and booking site for The Claudelande Collection.

## Local Development

```sh
bun install
bun run dev
```

## Deploy From GitHub With Cloudflare Workers

This app builds to a Nitro Cloudflare Worker bundle.

1. In Cloudflare, go to **Workers & Pages**.
2. Select **Create application**.
3. Choose **Import a repository**.
4. Connect GitHub and select `gduma123/CLAUDELANDECOLLECTION`.
5. Use these settings:

```txt
Framework preset: None
Build command: bun install && bun run build
Deploy command: bunx nitro deploy --prebuilt
Root directory: /
```

6. Add the environment variables from `.env.example` in the Cloudflare project settings.

Every push to `main` will trigger a new public deployment.

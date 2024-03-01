# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## concerning prisma

when changing the prisma schema you have to do multiple things:

- FOR JOIN support
  - add   `refresh  refresh[]` to `pg`
  - add `pg pg @relation(fields: [id_pg], references:[id_pg])` to `refresh`

  - add   `auberge  auberge[]` to `pg`
  - add `pg pg @relation(fields: [id_pg], references:[id_pg])` to `auberge`
- change every `Decimal` to `Float`

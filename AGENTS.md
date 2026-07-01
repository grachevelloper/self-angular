# Agent Instructions

- During code review, if the user explicitly says that some markup, formatting, or cosmetic changes are unsaved or should be ignored, do not report findings for those areas. Focus the review on saved functional code, Angular architecture, data flow, tests, and correctness.
- When giving learning tasks for this Angular project, do not provide overly exact implementation snippets unless the user asks for them or is blocked. Prefer goals, constraints, relevant Angular concepts, and small hints so the user can write the code independently.
- For this learning project, do not ask the user to write, fix, or expand tests during feature-learning steps unless the user explicitly asks for testing or the current task is about testing. Treat tests as a later phase near the end. During review, mention test failures only as verification status, not as required immediate work, unless they indicate a compile/runtime issue that blocks the app.

## Project Context

- This is a learning Angular 21 application generated with Angular CLI, using standalone components and Angular SSR.
- The app is a books UI. The `books` feature lives in `src/app/features/books/` with pages, components, model, mocks, and services split by responsibility.
- Root bootstrap uses `src/main.ts` -> `src/app/app.ts`; server bootstrap uses `src/main.server.ts` -> `src/app/app.config.server.ts`.
- `src/app/app.routes.ts` lazy-loads `src/app/features/books/books.routes.ts` for the root path.
- `src/app/app.routes.server.ts` contains only SSR `ServerRoute[]` render-mode config and must not be passed to `provideRouter`.
- After moving page markup out of `App`, the root `App` should stay as a shell with `RouterOutlet` imported and `<router-outlet />` in `src/app/app.html`.

## If task handling with ng-zorro-antd

Read https://ng.ant.design/llms-full.txt

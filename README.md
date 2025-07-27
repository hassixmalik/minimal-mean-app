# Minimal MEAN App (Angular + NestJS Monorepo)

This is a minimal MEAN Stack web application built with Nx. It includes user authentication (signup, signin, signout, forgot password) using Angular (frontend) and NestJS (backend), with no database — user data is stored in a local JSON file.

## Features

-  Signup, Signin, and Signout with JWT (8-hour expiry)
-  Forgot password (logs simulated link)
-  User data stored in `users.json` (no DB)
-  Nx monorepo (Angular in `apps/web`, NestJS in `apps/api`)
-  Clean architecture with shared types in `libs/shared`

## Run Locally

### Start Backend (NestJS)

```bash
npx nx serve api

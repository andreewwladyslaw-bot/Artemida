# Artemida Backend Setup & Development Guide

This guide starts the backend from a fresh clone. Commands are based on the files in `Backend/artemida_backend`.

## 1. Required software

Install these before starting:

- **Git**, to clone and update this repository.
- **Node.js 20 or later** and npm. The backend Dockerfile uses Node 20; use Node 20 LTS for a matching local setup. npm is included with Node.js.
- **Docker Desktop** on Windows/macOS, or Docker Engine with the Docker Compose plugin on Linux. Start Docker before running Compose commands.
- A terminal: PowerShell on Windows, Terminal on macOS/Linux.

You do not need to install PostgreSQL or Redis separately. Compose runs those services in containers.

## 2. Clone the repository and use the development branch

Run these commands from the directory where you want the project folder created (for example, `C:\Users\YourName\Projects` on Windows or `~/Projects` on macOS/Linux):

```sh
git clone https://github.com/klassa-3p-programisty/Artemida.git
cd Artemida
git fetch origin
git branch -a
```

The remote development branch currently present in this repository is spelled **`Developing`** (capital D). The Git workflow document refers to `develop`, but that branch is not present in the checked-in branch list. To track the existing remote branch locally under the requested lowercase name `developing`, run:

```sh
git switch -c developing --track origin/Developing
git pull origin Developing
```

If `git switch` says the local `developing` branch already exists, use `git switch developing` followed by `git pull origin Developing`. Confirm with `git status --short --branch`.

When updating later, from anywhere inside the repository run `git switch developing` and `git pull origin Developing`. If the remote branch has been renamed since this guide was written, check `git branch -r` and use its exact spelling in the pull command.

## 3. Terminal navigation and the backend folder

After cloning, your current directory should be the repository root, `Artemida`.

- `pwd` (macOS/Linux) or `Get-Location` (PowerShell) prints the current directory.
- `cd Backend/artemida_backend` enters the backend application directory. PowerShell also accepts `cd Backend\artemida_backend`.
- `cd ..` goes up one directory. From `Backend/artemida_backend`, this goes to `Backend`; run `cd ..` again to return to the repository root.
- `cd Artemida` enters the project only when your current directory is its parent.

Before running backend or Docker commands, verify you are in `Backend/artemida_backend`:

```sh
pwd
```

On Windows PowerShell, use:

```powershell
Get-Location
```

The path should end with `Artemida/Backend/artemida_backend` (path separators differ by operating system). The backend has its own `package.json`; run npm, Prisma, and Compose commands from this directory.

## 4. Create the local configuration files

The repository has exactly two filenames containing `example` under `Backend/artemida_backend`:

- `env.example` — copy to `.env` in `Backend/artemida_backend`.
- `docker-compose.yaml.example` — copy to `docker-compose.yaml` in `Backend/artemida_backend`.

From the backend application directory, run one of these:

**Windows PowerShell**

```powershell
Copy-Item env.example .env
Copy-Item docker-compose.yaml.example docker-compose.yaml
```

**macOS/Linux**

```sh
cp env.example .env
cp docker-compose.yaml.example docker-compose.yaml
```

Open `.env` and `docker-compose.yaml` in a text editor. Replace the template values in the Compose file: `YOU_USER`, `YOU_DB_PASSWORD`, `EMAIL_FOR_pgAdmin`, and `PASSWORD_FOR_pgAdmin`. Choose a PostgreSQL username/password and use the same username/password in `DATABASE_URL` in `.env`. For example, if you choose `artemida_user` and `local_db_password`, set:

```dotenv
DATABASE_URL="postgresql://artemida_user:local_db_password@localhost:5432/artemida"
```

This is an example of locally chosen credentials, not a repository-provided secret. If your password contains URL-special characters, URL-encode them in `DATABASE_URL`.

The checked-in `env.example` does not list every variable that the application requires at startup. Add these lines to `.env` as well:

```dotenv
APP_HOST_NAME_DEV="localhost"
REDIS_HOST_NAME_DEV="localhost"
REDIS_PORT=6379
SESSION_SECRET="replace-with-a-long-random-local-secret"
PORT=3000
```

Set `APP_PORT=3000` as already shown in the template. `APP_PORT` is printed in the startup message, while `PORT` is the value actually used by `app.listen`; setting both to `3000` keeps the display and actual listener consistent. The application requires `NODE_ENV`, a mode-appropriate app host, `APP_PORT`, a mode-appropriate Redis host, `REDIS_PORT`, `SESSION_SECRET`, and `DATABASE_URL`. For local development use `NODE_ENV="development"`, `APP_HOST_NAME_DEV="localhost"`, and `REDIS_HOST_NAME_DEV="localhost"`. Production-only variables are not needed for local development.

Compose uses these published host ports:

- PostgreSQL: `5432` (host to container `5432`).
- Redis: `6379` (host to container `6379`).
- pgAdmin: `5050` on your computer to port `80` in the container.
- Backend: `3000` as configured above.

Make sure these host ports are free. The Compose template's Redis configuration uses a `REDIS_ARGS` environment value, but the backend connects without a password. Do not add a Redis password unless the application connection is updated to use one too.

## 5. Install backend dependencies

From `Backend/artemida_backend`, run:

```sh
npm ci
```

`npm ci` installs the exact dependency versions recorded in `package-lock.json`. It creates `node_modules`; it does not start the backend.

## 6. Start the database and Redis containers

Keep Docker running. From `Backend/artemida_backend`, build/pull the container images and start the services in the background:

```sh
docker compose -f docker-compose.yaml pull
docker compose -f docker-compose.yaml up -d
```

The Compose file defines three services:

- **postgres** uses `pgvector/pgvector:pg17`, a PostgreSQL 17 image with the pgvector extension available. It stores data in the named `postgres_data` volume and publishes port `5432`.
- **redis** uses `redis:latest` for the backend's session store. It stores data in `redis-data` and publishes port `6379`.
- **pgadmin** provides a browser-based database administration interface on `http://localhost:5050`; use the email and password you set in the Compose file. It is optional for running the backend.

The services share the `pg-network` bridge network. `docker compose up -d` creates and starts them; the `pull` command downloads the images. The Compose file does not define a backend container. You run the NestJS backend directly with npm in the next steps.

Check container state:

```sh
docker compose -f docker-compose.yaml ps
```

The `postgres`, `redis`, and `pgadmin` services should show `Up` or `running`.

## 7. Prepare Prisma and the database

Still in `Backend/artemida_backend`, generate the Prisma client and apply the checked-in migrations:

```sh
npx prisma generate
npx prisma migrate deploy
```

`generate` creates client code in `src/generated/prisma`, as configured in `prisma/schema.prisma`. `migrate deploy` applies committed migrations from `prisma/migrations`; the repository currently contains an initial migration. These commands need the `.env` `DATABASE_URL` to point at the running PostgreSQL container.

There is no seed script or seed data configured in `package.json` or the Prisma configuration, so there is no seed command for this backend.

For future schema development, update `prisma/schema.prisma` and create a migration with:

```sh
npx prisma migrate dev --name describe_your_change
```

Use a short migration name in place of `describe_your_change`. This development command creates/applies a migration and regenerates the Prisma client.

## 8. Run the backend in development mode

From `Backend/artemida_backend`, start NestJS in watch mode:

```sh
npm run start:dev
```

Leave this terminal open while developing. The backend listens on port `3000` and restarts when source files change. Open these URLs in a browser:

- `http://localhost:3000/` — basic application response.
- `http://localhost:3000/api` — Swagger API documentation.
- `http://localhost:3000/health` — health check for the database plus an HTTP ping to `https://docs.nestjs.com`.

The health endpoint therefore also needs outbound internet access for its external HTTP check. A failure from that external check does not necessarily mean PostgreSQL is down.

## 9. Verify the full setup

Open a second terminal. Verify its directory as above, then enter `Backend/artemida_backend` if needed.

1. Run `docker compose -f docker-compose.yaml ps`; all three Compose services should be running.
2. Run `docker compose -f docker-compose.yaml logs postgres redis`; look for startup errors such as authentication failures or port conflicts.
3. Visit `http://localhost:3000/` and `http://localhost:3000/api`.
4. Visit `http://localhost:3000/health`; a healthy response should report the database as up. The docs.nestjs.com ping also needs internet access.
5. Optionally open `http://localhost:5050` and sign in using the pgAdmin credentials you chose. Add a server connection using host `postgres` when connecting from pgAdmin's container network, port `5432`, database `artemida`, and the PostgreSQL credentials from Compose.

## 10. Common maintenance commands

Run all Docker Compose commands from `Backend/artemida_backend` so Compose finds `docker-compose.yaml`.

```sh
# Stop and remove the containers/network; keep named database and Redis data volumes
docker compose -f docker-compose.yaml down

# Start the containers again
docker compose -f docker-compose.yaml up -d

# Recreate containers using current image versions
docker compose -f docker-compose.yaml pull
docker compose -f docker-compose.yaml up -d

# Follow logs for every service (Ctrl+C stops following logs, not containers)
docker compose -f docker-compose.yaml logs -f

# Follow one service's logs
docker compose -f docker-compose.yaml logs -f postgres

# Show current container status
docker compose -f docker-compose.yaml ps
```

To rebuild the backend's local Node dependencies after changing the lockfile, run `npm ci` from `Backend/artemida_backend`. There is no backend service in Compose to build. Do not use `docker compose down -v` unless you intend to delete the named database and Redis data volumes.

To get newer development code, stop the local backend with Ctrl+C, then from the repository root run:

```sh
git switch developing
git pull origin Developing
```

Return to `Backend/artemida_backend`; if dependencies changed, run `npm ci`. If Prisma schema or migrations changed, run `npx prisma generate` and `npx prisma migrate deploy`. Restart `npm run start:dev`.

## 11. Troubleshooting

- **`npm` or `node` is not recognized:** install Node.js 20 LTS, close and reopen the terminal, then check `node --version` and `npm --version`.
- **Docker daemon is unavailable:** start Docker Desktop (or Docker Engine on Linux) and retry `docker compose ...`.
- **Compose says it cannot find the file:** check `Get-Location`/`pwd` and change to `Backend/artemida_backend`. Confirm you copied `docker-compose.yaml.example` to `docker-compose.yaml`.
- **Compose complains about `YOU_USER` or other placeholder values:** edit `docker-compose.yaml` and replace all four template values. Keep the PostgreSQL username/password aligned with `DATABASE_URL` in `.env`.
- **Port already allocated / address in use:** another process uses host port `5432`, `6379`, `5050`, or `3000`. Stop that process or change the host-side port mapping in `docker-compose.yaml` (and the matching connection/port settings in `.env`).
- **Prisma cannot connect or says authentication failed:** verify PostgreSQL is running with `docker compose -f docker-compose.yaml ps`, verify the username/password/database in `DATABASE_URL` match Compose, then inspect `docker compose -f docker-compose.yaml logs postgres`. If you changed PostgreSQL credentials after its named volume was initialized, the old database volume retains its original credentials; preserve data and restore matching credentials, or, only if you are willing to erase local database data, remove volumes with `docker compose -f docker-compose.yaml down -v` and start fresh.
- **`REDIS_HOST_NAME_DEV`/`REDIS_PORT`/`SESSION_SECRET`/host/port error at startup:** confirm the additional required lines in `.env` are present and spelled exactly as shown. Restart the backend after editing `.env`.
- **Redis connection refused:** confirm the `redis` service is running and `.env` has `REDIS_HOST_NAME_DEV="localhost"` and `REDIS_PORT=6379`.
- **The app reports it is listening but browser cannot connect:** set both `APP_PORT=3000` and `PORT=3000`, then restart it. `APP_PORT` alone does not control the listener.
- **Health check is degraded while database appears available:** `/health` also pings `https://docs.nestjs.com`; check internet access, then inspect the response to see which indicator is down.
- **`git pull` cannot find `origin/developing`:** this checkout's remote branch is spelled `Developing`; use `git pull origin Developing`. Check the current remote branch spelling with `git branch -r`.
- **Prisma reports no datasource URL:** confirm `.env` is in `Backend/artemida_backend` and has a valid `DATABASE_URL`, then rerun the Prisma command from that directory.

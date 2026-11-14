# Backend Git Workflow & Engineering Standards

**Project:** Backend Application  
**Technology:** NestJS, TypeScript, Node.js  
**Architecture:** Modular Architecture  
**Database:** PostgreSQL  
**ORM:** Prisma (if applicable)  
**Document Type:** Engineering Standard  
**Status:** Mandatory  
**Applies To:** All Backend Developers

---

# 1. Purpose

This document defines the Git workflow, branching strategy and development standards for all Backend developers working on the project.

The main objectives are:

- Establish a consistent Git workflow.
- Maintain a clean and understandable Git history.
- Ensure architectural consistency across Backend modules.
- Prevent conflicts between developers.
- Maintain reliable API contracts.
- Protect database integrity.
- Establish a consistent Pull Request and Code Review process.
- Ensure that all changes are tested before integration.

Every Backend developer must follow these standards.

# 2. Repository Structure

The project uses a monorepository containing both Backend and Frontend applications.

Example:

```text
project/
├── backend/
├── frontend/
├── docs/
│   ├── backend/
│   └── frontend/
├── .github/
├── README.md
└── CONTRIBUTING.md
```

Backend developers must primarily work within the `backend/` directory.

Changes affecting Frontend, shared configuration or API contracts must be communicated to the responsible developers.

# 3. Branching Strategy

The project uses a simplified Git Flow strategy.

There are two permanent branches:

| Branch | Purpose |
|---|---|
| `main` | Stable production-ready code |
| `develop` | Integration branch for ongoing development |

All Backend development must be performed in separate working branches.

## 3.1. Branch Structure

```text
main
  |
  |
develop
  |
  |--- feature/PROJ-201-auth-module
  |
  |--- feature/PROJ-202-user-management
  |
  |--- fix/PROJ-203-jwt-validation
  |
  |--- refactor/PROJ-204-user-service
  |
  |--- test/PROJ-205-auth-e2e
```

Working branches must be merged into `develop` through Pull Requests.

The `main` branch is updated through the release process.

Direct commits to `main` and `develop` are prohibited.

## 3.2. Branch Responsibilities

### main

- Contains stable production-ready code.
- Must always remain deployable.
- Receives changes through approved releases.
- Must be protected against direct pushes.

### develop

- Contains the latest integrated development changes.
- Serves as the base branch for new tasks.
- Receives approved feature branches.
- Must pass required CI checks before merging.

# 4. Branch Naming Convention

Every working branch must follow this format:

```text
<type>/<TASK-ID>-<description>
```

If the task management system does not provide task IDs:

```text
<type>/<description>
```

Examples:

```text
feature/PROJ-201-auth-module
feature/PROJ-202-user-management
fix/PROJ-203-jwt-validation
refactor/PROJ-204-user-service
```

## 4.1. Branch Types

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | New Backend functionality | `feature/PROJ-201-auth-module` |
| `fix/` | Bug fixes | `fix/PROJ-202-user-validation` |
| `refactor/` | Code restructuring | `refactor/PROJ-203-user-service` |
| `test/` | Adding or modifying tests | `test/PROJ-204-auth-e2e` |
| `docs/` | Documentation changes | `docs/PROJ-205-api-documentation` |
| `chore/` | Configuration and maintenance | `chore/PROJ-206-update-dependencies` |
| `perf/` | Performance improvements | `perf/PROJ-207-database-queries` |
| `hotfix/` | Urgent production fixes | `hotfix/PROJ-208-auth-crash` |

## 4.2. Naming Rules

All branch names must follow these rules:

1. Use English only.
2. Use lowercase letters.
3. Use kebab-case.
4. Separate words using hyphens.
5. Do not use spaces.
6. Do not use personal names.
7. Keep names short and descriptive.
8. Include the task ID when available.

### Correct examples

```text
feature/PROJ-201-auth-module
feature/PROJ-202-create-user
feature/PROJ-203-password-reset
fix/PROJ-204-refresh-token
refactor/PROJ-205-user-service
test/PROJ-206-auth-controller
perf/PROJ-207-optimize-user-query
```

### Incorrect examples

```text
feature/AuthModule
feature/user_service
feature/my-task
feature/work
fix/bug
feature/backend-update
```

# 5. Creating a New Branch

Every developer must create a new branch from the latest `develop`.

## Step 1. Switch to develop

```bash
git checkout develop
```

## Step 2. Update the local branch

```bash
git pull origin develop
```

## Step 3. Create a working branch

Example:

```bash
git checkout -b feature/PROJ-201-auth-module
```

## Step 4. Verify the current branch

```bash
git branch
```

The active branch should be marked with an asterisk.

## Step 5. Start development

All task-related changes must be committed to the newly created branch.

Never implement tasks directly in `develop`.

# 6. NestJS Architecture Requirements

Backend development must follow the established modular architecture.

The application must be divided into modules according to business responsibilities.

Example:

```text
src/
├── main.ts
├── app.module.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── decorators/
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │
│   └── notifications/
│       ├── notifications.module.ts
│       ├── notifications.controller.ts
│       └── notifications.service.ts
│
├── common/
├── config/
├── database/
└── shared/
```

The actual project structure must follow the approved Backend Architecture document.

## 6.1. Module Responsibilities

Every NestJS module must have a clearly defined responsibility.

Examples:

- `AuthModule` — authentication and authorization.
- `UsersModule` — user management.
- `NotificationsModule` — notification functionality.
- `FilesModule` — file management.
- `PaymentsModule` — payment processing.

Developers must avoid creating modules without a clear business or technical responsibility.

## 6.2. Module Isolation

Modules must maintain clear boundaries.

Rules:

1. Avoid accessing another module's internal implementation directly.
2. Communicate through exported providers and defined interfaces.
3. Import modules through NestJS module dependencies.
4. Avoid circular dependencies.
5. Do not duplicate business logic across modules.
6. Keep module responsibilities focused.

Example:

```typescript
@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
```

If one module requires functionality from another module, use its public interface rather than accessing its internal implementation.

## 6.3. Controller Responsibilities

Controllers are responsible for handling incoming HTTP requests.

Controllers should:

- Define API endpoints.
- Receive and validate request data through DTOs and validation pipes.
- Extract request information.
- Delegate business operations to services.
- Return appropriate responses.

Controllers must not contain complex business logic.

Example:

```typescript
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
```

## 6.4. Service Responsibilities

Services contain application and business logic.

Services should:

- Implement business operations.
- Coordinate interactions with repositories and other providers.
- Apply business rules.
- Handle application-level errors.
- Maintain separation between business logic and HTTP transport.

Avoid placing all application logic inside a single large service.

## 6.5. Dependency Injection

Use NestJS Dependency Injection.

Rules:

- Prefer constructor injection.
- Avoid manually instantiating injectable services.
- Register providers in the appropriate modules.
- Avoid unnecessary global providers.
- Keep dependency direction understandable.

# 7. Database and ORM Requirements

Database changes must be handled carefully because they can affect the entire application.

If the project uses Prisma, the following rules apply.

## 7.1. Schema Changes

All database schema modifications must be made through Prisma schema and migration files.

Example:

```text
prisma/
├── schema.prisma
└── migrations/
    ├── 20261113000000_create_users/
    └── migration_lock.toml
```

Rules:

1. Do not modify the production database schema manually.
2. Do not modify already-applied migration files.
3. Create a new migration for every schema change.
4. Review generated SQL before merging.
5. Verify migration compatibility with existing data.
6. Consider whether changes require a coordinated Backend and Frontend deployment.

## 7.2. Prisma Migrations

Example:

```bash
npx prisma migrate dev --name add_user_status
```

Before creating a Pull Request:

- Verify the schema changes.
- Verify the migration.
- Check generated Prisma Client types.
- Test affected database operations.

Production migrations must use the appropriate deployment command:

```bash
npx prisma migrate deploy
```

Do not use `prisma migrate dev` as a production deployment mechanism.

## 7.3. Database Safety

Developers must:

- Avoid destructive migrations without approval.
- Avoid deleting columns that are still used by deployed application versions.
- Consider backward compatibility.
- Never commit database credentials.
- Never commit production data or database dumps containing sensitive information.

# 8. DTO and API Contract Requirements

API contracts must remain consistent and predictable.

## 8.1. DTOs

Use DTOs for request validation and data transfer.

Example:

```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

Rules:

1. Do not use unvalidated request bodies.
2. Do not use database models directly as request DTOs.
3. Keep request and response contracts explicit.
4. Reuse DTOs only when their responsibilities and validation rules are genuinely identical.
5. Avoid unnecessary duplication.

## 8.2. Validation

Use NestJS ValidationPipe and class-validator according to the project configuration.

Example:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

The project's global validation configuration must be respected.

## 8.3. API Changes

Any change affecting an API contract must be communicated to the Frontend team.

Examples:

- Changing endpoint URLs.
- Changing request body structures.
- Changing response structures.
- Changing HTTP status codes.
- Changing authentication requirements.
- Changing validation rules.
- Removing or renaming fields.

Breaking API changes require explicit coordination and an agreed migration strategy.

## 8.4. API Documentation

When using Swagger:

- Update endpoint descriptions.
- Document request DTOs.
- Document response structures.
- Document possible HTTP errors.
- Document authentication requirements.

Swagger documentation must reflect the actual API implementation.

# 9. Authentication and Security Requirements

Security-sensitive code requires additional attention during development and review.

Rules:

1. Never store passwords in plaintext.
2. Use approved password hashing mechanisms.
3. Never expose secrets through API responses.
4. Validate and sanitize incoming data.
5. Protect sensitive endpoints with appropriate Guards.
6. Implement authorization checks on protected operations.
7. Do not trust client-provided roles or permissions.
8. Keep secrets in environment variables or an approved secret management system.
9. Avoid logging passwords, tokens or sensitive personal information.
10. Follow the project's established CORS, Helmet and rate-limiting configuration.

Authentication and authorization changes must receive additional Code Review attention.

# 10. Commit Convention

All commits must follow the Conventional Commits format.

Format:

```text
<type>(<scope>): <description>
```

Examples:

```text
feat(auth): implement JWT authentication
feat(users): add user registration
fix(auth): correct refresh token validation
refactor(users): extract user repository logic
test(auth): add authentication e2e tests
docs(api): update Swagger documentation
chore(deps): update NestJS dependencies
perf(users): optimize user database query
```

## 10.1. Commit Types

| Type | Purpose |
|---|---|
| `feat` | New functionality |
| `fix` | Bug fixes |
| `refactor` | Code restructuring |
| `test` | Tests |
| `docs` | Documentation |
| `chore` | Maintenance |
| `perf` | Performance improvements |
| `build` | Build system changes |
| `ci` | CI/CD configuration changes |

## 10.2. Commit Rules

1. Write commit messages in English.
2. Use imperative descriptions.
3. Keep messages concise.
4. Use the relevant module as the commit scope.
5. Do not combine unrelated changes into one commit.
6. Avoid vague messages.

Correct:

```text
feat(auth): add access token generation
fix(users): handle missing user record
refactor(auth): simplify refresh token service
```

Incorrect:

```text
update
changes
fix stuff
final backend
```

# 11. Testing Requirements

Every Backend change must be tested according to its impact.

NestJS supports several testing levels.

## 11.1. Unit Tests

Unit tests verify individual classes and their behavior.

Examples:

- Service business logic.
- Validation logic.
- Utility functions.
- Error handling.
- Permission checks.

Example:

```text
users.service.spec.ts
auth.service.spec.ts
```

## 11.2. Integration Tests

Integration tests verify interactions between application components and external dependencies.

Examples:

- Service and database interactions.
- Repository operations.
- Module integration.
- External service integrations.

## 11.3. End-to-End Tests

E2E tests verify the application through HTTP endpoints.

Examples:

- User registration.
- Login.
- Token refresh.
- Protected endpoints.
- User management.

Example:

```text
test/
├── app.e2e-spec.ts
└── auth.e2e-spec.ts
```

## 11.4. Testing Rules

Before creating a Pull Request:

- [ ] Relevant unit tests pass.
- [ ] Relevant integration tests pass, where applicable.
- [ ] Relevant E2E tests pass.
- [ ] No existing tests are broken.
- [ ] New business logic has appropriate test coverage.
- [ ] Critical edge cases are tested.

Do not write tests solely to increase coverage percentages. Tests must verify meaningful behavior.

# 12. Synchronizing With Develop

Developers must regularly synchronize their working branches with the latest `develop`.

## Step 1. Fetch remote changes

```bash
git fetch origin
```

## Step 2. Switch to the working branch

```bash
git checkout feature/PROJ-201-auth-module
```

## Step 3. Merge the latest develop

```bash
git merge origin/develop
```

## Step 4. Resolve conflicts

After resolving conflicts:

```bash
git add .
git commit
```

## Step 5. Push changes

```bash
git push origin feature/PROJ-201-auth-module
```

Developers must not overwrite shared remote history using force push.

# 13. Pull Request Process

All Backend changes must be submitted through Pull Requests.

## 13.1. Creating a Pull Request

After completing the task:

```bash
git push -u origin feature/PROJ-201-auth-module
```

Create a Pull Request with the following configuration:

| Field | Value |
|---|---|
| Source branch | `feature/PROJ-201-auth-module` |
| Target branch | `develop` |
| Title | `feat(auth): implement JWT authentication` |

## 13.2. Pull Request Requirements

Every Pull Request must include:

1. Task ID and task link.
2. Description of implemented functionality.
3. List of important changes.
4. List of affected Backend modules.
5. Database changes, if applicable.
6. API contract changes, if applicable.
7. Testing information.
8. Security considerations, if applicable.
9. Known limitations, if applicable.

## 13.3. Before Creating a PR

The developer must verify:

- [ ] The task is completed.
- [ ] The implementation follows the established architecture.
- [ ] No unrelated files were modified.
- [ ] No debugging code remains.
- [ ] No secrets or credentials are committed.
- [ ] TypeScript checks pass.
- [ ] ESLint checks pass.
- [ ] Relevant tests pass.
- [ ] Production build succeeds.
- [ ] Database migrations are reviewed.
- [ ] API documentation is updated where necessary.
- [ ] The branch is synchronized with `develop`.

# 14. Code Review

Every Pull Request must be reviewed by another developer or an authorized reviewer.

The author must not approve their own Pull Request.

Reviewers must check the following areas.

## 14.1. Architecture

- Are module boundaries respected?
- Are responsibilities correctly separated?
- Is business logic placed in services or appropriate application components?
- Are controllers kept lightweight?
- Are dependencies correctly managed?
- Are circular dependencies avoided?

## 14.2. Code Quality

- Is the code readable?
- Are naming conventions followed?
- Is unnecessary duplication avoided?
- Are methods and classes appropriately sized?
- Are error cases handled?

## 14.3. Database

- Are database operations correct?
- Are Prisma queries efficient?
- Are transactions used where necessary?
- Are database migrations safe?
- Are indexes and constraints considered?
- Are N+1 query problems avoided?

## 14.4. API

- Are endpoint contracts consistent?
- Are DTOs properly validated?
- Are HTTP status codes appropriate?
- Are errors handled consistently?
- Is Swagger documentation updated?

## 14.5. Security

- Are protected routes properly secured?
- Are authorization rules enforced server-side?
- Are secrets protected?
- Is sensitive information excluded from logs and responses?
- Are input validation and access control sufficient?

## 14.6. Testing

- Are important business scenarios covered?
- Are edge cases considered?
- Are integration points tested?
- Are existing tests still passing?

## 14.7. Review Decisions

A reviewer can:

- Approve the Pull Request.
- Request changes.
- Leave comments or suggestions.

A Pull Request must not be merged while unresolved blocking review comments remain.

# 15. Merging Rules

The standard merge process:

```text
feature/PROJ-201-auth-module
              |
              v
           develop
              |
              v
             main
```

Rules:

1. Working branches are merged into `develop`.
2. Merging requires successful CI checks.
3. Merging requires the required Code Review approval.
4. Direct pushes to protected branches are prohibited.
5. Completed working branches should be deleted.
6. Releases are merged into `main` through the release process.

Recommended merge strategy: Squash and Merge.

# 16. Hotfix Process

Hotfix branches are reserved for critical production issues.

Unlike regular feature branches, hotfix branches must be created from `main`.

Example:

```bash
git checkout main
git pull origin main

git checkout -b hotfix/PROJ-208-auth-crash
```

After implementing the fix:

1. Create a Pull Request into `main`.
2. Obtain the required review.
3. Run all required CI checks.
4. Merge the hotfix.
5. Backport or merge the same fix into `develop`.

A production hotfix must never exist only in `main`.

# 17. Environment and Configuration Management

Backend configuration must be handled securely.

Rules:

1. Never commit `.env` files containing real credentials.
2. Maintain an `.env.example` file with required variable names and safe placeholder values.
3. Validate environment variables during application startup.
4. Do not hardcode credentials, API keys or connection strings.
5. Coordinate changes to required environment variables with the team.
6. Update configuration documentation when new variables are introduced.

Example:

```text
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
```

Never use real production secrets in examples or documentation.

# 18. Error Handling and Logging

Backend errors must be handled consistently.

Rules:

- Use appropriate NestJS exceptions or the project's established exception handling mechanism.
- Avoid exposing internal stack traces to API clients in production.
- Use a consistent response format for errors.
- Log important application events.
- Avoid logging sensitive information.
- Do not silently suppress unexpected exceptions.
- Include sufficient context in logs for debugging.

# 19. Performance and Reliability

Developers must consider performance and reliability when implementing Backend functionality.

Pay attention to:

- Database query efficiency.
- Proper pagination for large datasets.
- Appropriate indexing.
- Transaction boundaries.
- External API timeouts.
- Error handling for external services.
- Resource management.
- Background job reliability, when applicable.

Avoid unnecessary database requests and expensive synchronous operations.

# 20. Branch Cleanup

After a Pull Request has been successfully merged:

- Delete the remote working branch.
- Delete the local working branch.
- Update the local `develop` branch.

Commands:

```bash
git checkout develop
git pull origin develop

git branch -d feature/PROJ-201-auth-module
```

If the remote branch has not been automatically deleted:

```bash
git push origin --delete feature/PROJ-201-auth-module
```

Never delete permanent branches such as `main` or `develop`.

# 21. Common Git Commands

| Command | Purpose |
|---|---|
| `git status` | Check working tree status |
| `git branch` | List local branches |
| `git branch -a` | List all branches |
| `git fetch origin` | Fetch remote changes |
| `git pull origin develop` | Update local develop |
| `git checkout develop` | Switch to develop |
| `git checkout -b <branch>` | Create a working branch |
| `git add .` | Stage changes |
| `git commit -m "message"` | Create a commit |
| `git push -u origin <branch>` | Push a new branch |
| `git merge origin/develop` | Merge latest develop |
| `git branch -d <branch>` | Delete local branch |

# 22. Developer Responsibilities

Every Backend developer is responsible for:

- Following the branch naming convention.
- Creating separate branches for assigned tasks.
- Respecting the established modular architecture.
- Maintaining clean commit history.
- Writing and maintaining relevant tests.
- Synchronizing working branches with `develop`.
- Protecting database integrity.
- Maintaining API contract consistency.
- Following security requirements.
- Providing clear Pull Request descriptions.
- Participating in Code Reviews.
- Communicating architectural changes to the team.

# 23. Final Rules

The following rules are mandatory:

1. No direct commits to `main` or `develop`.
2. Every task must have its own working branch.
3. Every branch must follow the naming convention.
4. All regular changes must be merged through Pull Requests.
5. Code Review is required.
6. CI checks must pass before merging.
7. Backend modular architecture must be respected.
8. Database migrations must be reviewed.
9. API contract changes must be communicated.
10. Sensitive information must never be committed.
11. Relevant tests must pass.
12. Production hotfixes must also be integrated into `develop`.

---

**The purpose of this workflow is to maintain a reliable, secure and maintainable Backend codebase while allowing developers to work independently and integrate their changes safely.**
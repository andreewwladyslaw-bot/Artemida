# Frontend Git Workflow & Branching Convention

**Project:** Frontend Application  
**Technology:** React, TypeScript  
**Architecture:** Feature-Based Architecture  
**Document Type:** Engineering Standard  
**Status:** Mandatory  
**Applies To:** All Frontend Developers

---

# 1. Purpose

This document defines the standard Git workflow for all frontend developers working on the project.

The main objectives are:

- Maintain a consistent Git branching strategy.
- Make development predictable and transparent.
- Prevent conflicts between developers.
- Ensure proper integration of features.
- Maintain the integrity of the Feature-Based Architecture.
- Establish a consistent Pull Request and Code Review process.

Every frontend developer must follow these rules.

# 2. Repository Structure

The project uses a monorepository containing both Backend and Frontend applications.

Example:

```text
project/
├── backend/
├── frontend/
├── docs/
│   ├── frontend/
│   └── backend/
├── .github/
├── README.md
└── CONTRIBUTING.md
```

Frontend developers must primarily work within the `frontend/` directory.

Changes to shared repository configuration or Backend files must be coordinated with the responsible developers.

# 3. Branching Strategy

The project uses a simplified Git Flow strategy.

There are two permanent branches:

| Branch | Purpose |
|---|---|
| `main` | Stable production-ready code |
| `develop` | Integration branch for ongoing development |

All feature development and regular bug fixes must be performed in separate working branches.

## 3.1. Branch Structure

```text
main
  |
  |
develop
  |
  |--- feature/PROJ-101-login-page
  |
  |--- feature/PROJ-102-user-profile
  |
  |--- fix/PROJ-103-login-validation
  |
  |--- refactor/PROJ-104-auth-feature
```

Working branches are merged into `develop` through Pull Requests.

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
- Must pass the required CI checks before merging.

# 4. Branch Naming Convention

Every working branch must follow this naming format:

```text
<type>/<TASK-ID>-<description>
```

If the task management system does not provide task IDs:

```text
<type>/<description>
```

Examples:

```text
feature/PROJ-101-login-page
fix/PROJ-102-user-validation
refactor/PROJ-103-auth-feature
```

## 4.1. Branch Types

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | New functionality | `feature/PROJ-101-login-page` |
| `fix/` | Bug fixes | `fix/PROJ-102-login-validation` |
| `refactor/` | Code restructuring without changing external behavior | `refactor/PROJ-103-auth-feature` |
| `style/` | UI styling and responsive design | `style/PROJ-104-dashboard-layout` |
| `test/` | Adding or modifying tests | `test/PROJ-105-login-form` |
| `docs/` | Documentation changes | `docs/PROJ-106-frontend-guide` |
| `chore/` | Configuration and maintenance | `chore/PROJ-107-update-dependencies` |
| `hotfix/` | Urgent production fixes | `hotfix/PROJ-108-auth-crash` |

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
feature/PROJ-101-login-page
feature/PROJ-102-user-dashboard
fix/PROJ-103-password-validation
refactor/PROJ-104-user-feature
style/PROJ-105-mobile-navigation
```

### Incorrect examples

```text
feature/LoginPage
feature/user_profile
feature/my-task
feature/work
fix/bug
feature/developer-1
```

## 4.3. Feature-Based Naming

Branch names should describe the task, not reproduce the entire frontend directory structure.

For example, if the application contains:

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

The following branch names are preferred:

```text
feature/user-login
feature/user-registration
feature/user-profile
fix/user-validation
refactor/auth-feature
```

Do not add unnecessary architecture directory names to branch names.

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
git checkout -b feature/PROJ-101-login-page
```

## Step 4. Verify the current branch

```bash
git branch
```

The active branch should be marked with an asterisk.

## Step 5. Start development

All task-related changes must be committed to the newly created branch.

Never implement a task directly in `develop`.

# 6. Development Rules

## 6.1. One Branch = One Task

Each branch must represent one logical task.

A branch must not contain several unrelated features or bug fixes.

Correct:

```text
feature/PROJ-101-login-page
feature/PROJ-102-user-profile
```

Incorrect:

```text
feature/PROJ-101-login-profile-dashboard
```

If a task requires multiple independent features, split it into separate tasks and branches.

However, closely related changes required to complete one feature may remain in the same branch.

## 6.2. Work Within the Assigned Scope

Developers must:

- Work only on assigned tasks.
- Avoid modifying unrelated application modules.
- Avoid unnecessary changes to shared components.
- Follow the established Feature-Based Architecture.
- Coordinate changes that affect shared functionality.

## 6.3. Keep Branches Focused

A working branch should contain only changes related to its assigned task.

Do not include:

- Unrelated formatting changes.
- Temporary debugging code.
- Unnecessary dependency updates.
- Changes belonging to another developer's task.
- Generated files that should not be committed.

# 7. Feature-Based Architecture Requirements

Git workflow must support the architectural structure of the frontend application.

Example:

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
│   ├── auth/
│   ├── user-profile/
│   └── notifications/
├── entities/
└── shared/
```

## 7.1. Feature Isolation

Developers should implement functionality within the appropriate Feature.

For example:

Task: Implement user login.

Expected changes may include:

```text
src/
├── features/
│   └── auth/
│       ├── api/
│       ├── model/
│       └── ui/
└── pages/
    └── login/
```

The exact directory structure must follow the project's architecture documentation.

## 7.2. Shared Layer

The `shared/` directory contains reusable application infrastructure and UI elements.

Changes to shared components can affect multiple features.

Therefore:

- Avoid changing shared components without a clear reason.
- Notify the team when a shared contract changes.
- Check whether existing features depend on the modified component.
- Include affected modules in the Pull Request description.

## 7.3. Cross-Feature Changes

Sometimes a task requires changes to multiple features.

Such changes are allowed when they are necessary for the task.

However:

- The changes must have a clear technical justification.
- All affected features must be identified in the Pull Request.
- Developers responsible for affected modules should be informed when necessary.

Feature isolation must not prevent legitimate integration work.

# 8. Commit Convention

All commits must follow the Conventional Commits format.

Format:

```text
<type>(<scope>): <description>
```

Examples:

```text
feat(auth): implement login form
fix(auth): correct password validation
refactor(user-profile): simplify profile model
style(dashboard): improve responsive layout
test(auth): add login form tests
docs(frontend): update development guide
chore(deps): update react dependencies
```

## 8.1. Commit Types

| Type | Purpose |
|---|---|
| `feat` | New functionality |
| `fix` | Bug fixes |
| `refactor` | Code restructuring |
| `style` | UI and styling changes |
| `test` | Tests |
| `docs` | Documentation |
| `chore` | Maintenance and configuration |
| `perf` | Performance improvements |

## 8.2. Commit Rules

1. Write commit messages in English.
2. Use imperative descriptions.
3. Keep commit messages concise.
4. Do not use vague descriptions.
5. Do not combine unrelated changes into one commit.

Correct:

```text
feat(auth): add login form
fix(auth): handle invalid credentials
```

Incorrect:

```text
update
changes
fix stuff
final version
```

# 9. Synchronizing With Develop

Developers must regularly synchronize their working branches with the latest `develop`.

This reduces the risk of merge conflicts.

## Step 1. Fetch the latest changes

```bash
git fetch origin
```

## Step 2. Switch to the working branch

```bash
git checkout feature/PROJ-101-login-page
```

## Step 3. Update the branch

Recommended approach:

```bash
git merge origin/develop
```

## Step 4. Resolve conflicts if necessary

After resolving conflicts:

```bash
git add .
git commit
```

## Step 5. Push the updated branch

```bash
git push origin feature/PROJ-101-login-page
```

Developers must not overwrite shared remote history using force push.

# 10. Pull Request (PR) Process

A Pull Request is required before merging any working branch into `develop`.

## 10.1. Creating a Pull Request

After completing the task:

```bash
git push -u origin feature/PROJ-101-login-page
```

Create a Pull Request with the following configuration:

| Field | Value |
|---|---|
| Source branch | `feature/PROJ-101-login-page` |
| Target branch | `develop` |
| Title | `feat(auth): implement login page` |

## 10.2. Pull Request Requirements

Every Pull Request must include:

1. Task ID.
2. Description of implemented functionality.
3. List of important changes.
4. List of affected architectural modules.
5. Screenshots for UI changes.
6. Testing information.
7. Known limitations, if applicable.

## 10.3. Before Creating a PR

The developer must verify:

- [ ] The task is completed.
- [ ] The code follows Feature-Based Architecture.
- [ ] No unrelated files were modified.
- [ ] No debugging code remains.
- [ ] TypeScript checks pass.
- [ ] ESLint checks pass.
- [ ] Relevant tests pass.
- [ ] The application builds successfully.
- [ ] The branch is synchronized with `develop`.
- [ ] Commit messages follow the project convention.

# 11. Code Review

Every Pull Request must be reviewed by another developer or an authorized reviewer.

The author must not approve their own Pull Request.

Reviewers must check:

## Code Quality

- Is the code readable?
- Are naming conventions followed?
- Is unnecessary duplication avoided?
- Is the implementation maintainable?

## Architecture

- Are architectural boundaries respected?
- Is business logic placed in the correct Feature?
- Are imports and dependencies correct?
- Is the Shared layer used appropriately?
- Are there any circular dependencies?

## Functionality

- Does the implementation meet the task requirements?
- Are edge cases handled?
- Does the UI behave correctly?
- Is responsive design implemented where required?

## Type Safety

- Are TypeScript types defined correctly?
- Is unnecessary use of `any` avoided?
- Are API response types handled correctly?

## Review Decisions

A reviewer can:

- Approve the Pull Request.
- Request changes.
- Leave comments or suggestions.

A Pull Request must not be merged while unresolved blocking review comments remain.

# 12. Merging Rules

The standard merge process is:

```text
feature/PROJ-101-login-page
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
5. Completed working branches should be deleted after merging.
6. Releases are merged into `main` through the release process.

The team should use the repository's configured merge strategy consistently.

Recommended: Squash and Merge for feature branches to keep the integration history clean.

# 13. Hotfix Process

Hotfix branches are reserved for critical production issues.

Unlike normal feature branches, hotfix branches must be created from `main`.

Example:

```bash
git checkout main
git pull origin main

git checkout -b hotfix/PROJ-108-auth-crash
```

After implementing the fix:

1. Create a Pull Request into `main`.
2. Obtain the required review.
3. Run all required checks.
4. Merge the hotfix.
5. Backport or merge the same fix into `develop`.

The hotfix must not exist only in `main`, otherwise the next release may reintroduce the same bug.

# 14. Handling Merge Conflicts

Merge conflicts occur when multiple developers modify overlapping parts of the code.

When a conflict occurs:

1. Do not panic or blindly accept one side.
2. Identify the conflicting files.
3. Understand both implementations.
4. Discuss the conflict with the responsible developer if necessary.
5. Resolve the conflict while preserving the intended functionality.
6. Run TypeScript, ESLint, tests and build checks.
7. Commit the resolved changes.
8. Push the updated branch.

Never resolve conflicts by deleting another developer's implementation without understanding its purpose.

# 15. Branch Cleanup

After a Pull Request has been successfully merged:

- Delete the remote working branch.
- Delete the local working branch.
- Update the local `develop` branch.

Commands:

```bash
git checkout develop
git pull origin develop

git branch -d feature/PROJ-101-login-page
```

If the remote branch has not been automatically deleted:

```bash
git push origin --delete feature/PROJ-101-login-page
```

Do not delete permanent branches such as `main` or `develop`.

# 16. Common Git Commands

| Command | Purpose |
|---|---|
| `git status` | Check working tree status |
| `git branch` | List local branches |
| `git branch -a` | List all branches |
| `git fetch origin` | Fetch remote changes |
| `git pull origin develop` | Update local develop |
| `git checkout develop` | Switch to develop |
| `git checkout -b <branch>` | Create and switch to a branch |
| `git add .` | Stage changes |
| `git commit -m "message"` | Create a commit |
| `git push -u origin <branch>` | Push a new branch |
| `git merge origin/develop` | Merge latest develop |
| `git branch -d <branch>` | Delete local branch |

# 17. Developer Responsibilities

Every frontend developer is responsible for:

- Following the branch naming convention.
- Creating separate branches for assigned tasks.
- Respecting the Feature-Based Architecture.
- Maintaining clean commit history.
- Synchronizing their branches with `develop`.
- Testing their changes before creating a Pull Request.
- Providing clear Pull Request descriptions.
- Participating in Code Reviews.
- Communicating architectural changes to the team.

# 18. Final Rules

The following rules are mandatory:

1. No direct commits to `main` or `develop`.
2. Every task must have its own working branch.
3. Every branch must follow the naming convention.
4. All regular changes must be merged through Pull Requests.
5. Code Review is required.
6. CI checks must pass before merging.
7. Feature-Based Architecture must be respected.
8. Unrelated changes must not be included in Pull Requests.
9. Production hotfixes must also be integrated into `develop`.
10. Merged working branches must be cleaned up.

**The purpose of this workflow is not to introduce unnecessary bureaucracy. It is to ensure that every developer can work independently while keeping the codebase consistent, maintainable and predictable.**
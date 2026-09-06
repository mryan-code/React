

# dashboard Backend





- [Description](#description)
- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
  - [1. Clone the repositories](#1-clone-the-repositories)
  - [2. Configure environment variables](#2-configure-environment-variables)
  - [3. Install dependencies](#3-install-dependencies)
  - [4. Start the development server](#4-start-the-development-server)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)

## Description

**dashboard Backend** is the server-side component of a system that dials via TWILIO, authenticates and records calls.

## Technologies Used

- **Node.js & TypeScript** – The core technologies for the backend.
- **Jest** – Used for unit and integration testing.
- **Swagger** – Generates API documentation.
- **MySQL** – Relational database for storing project and settings data.
- **Sequelize** – Sequelize is a modern TypeScript and Node.js ORM.
- **Twilio** – Twilio is a cloud-based communication platform.

## Installation and Setup

### 1. Clone the repositories

```bash
git clone https://github.com/eCustom-Solutions/dashboard-api.git
cd dashboard-api
```

### 2. Configure environment variables

```bash
cp env.sample .env
# Edit the .env file and set the required credentials
```

### 3. Install dependencies

```bash
npm ci
```

### 4. Start the development server

```bash
npm run dev
```

## API Documentation

The API documentation is available at:
[http://localhost:9876/api-docs/](http://localhost:9876/api-docs/)

## Running Tests

To run tests, use the following command:

```bash
npm run test
```



## Git Flow

Git Flow is a branching model for Git that provides a robust framework for managing larger projects. This project follows Git Flow conventions for branch management.

### Installation

**macOS (Homebrew)**:

```bash
brew install git-flow
```

**Linux (Debian/Ubuntu)**:

```bash
apt-get install git-flow
```

**Windows (Git for Windows)**:

Git Flow is included with Git for Windows. If not available, install via:

```bash
# Using Chocolatey
choco install gitflow-avh

# Or download from: https://github.com/nvie/gitflow/wiki/Windows
```

**Initialize Git Flow in the repository**:

```bash
git flow init
```

Accept the default branch names when prompted (or customize as needed):

- Production branch: `master`
- Development branch: `dev`
- Feature prefix: `feature/`
- Release prefix: `release/`
- Hotfix prefix: `hotfix/`
- Support prefix: `support/`

### Basic Usage

**Starting a new feature**:

```bash
# Start a new feature branch from develop
git flow feature start <feature-name>

# This creates: feature/<feature-name>
```

**Finishing a feature**:

```bash
# Merge feature back into develop and delete the feature branch
git flow feature finish <feature-name>
```

**Publishing a feature** (push to remote for collaboration):

```bash
git flow feature publish <feature-name>
```

**Pulling a feature** (get a published feature from remote):

```bash
git flow feature pull origin <feature-name>
```

**Starting a release**:

```bash
# Start a release branch from develop
git flow release start <version>

# This creates: release/<version>
```

**Finishing a release**:

```bash
# Merge into main and develop, tag the release, delete the release branch
git flow release finish <version>
```

**Starting a hotfix**:

```bash
# Start a hotfix branch from main for urgent production fixes
git flow hotfix start <hotfix-name>

# This creates: hotfix/<hotfix-name>
```

**Finishing a hotfix**:

```bash
# Merge into master and dev, tag the hotfix, delete the hotfix branch
git flow hotfix finish <hotfix-name>
```

### Branch Naming Conventions


| Branch Type | Prefix     | Example                       | Purpose                            |
| ----------- | ---------- | ----------------------------- | ---------------------------------- |
| Feature     | `feature/` | `feature/user-authentication` | New features and enhancements      |
| Release     | `release/` | `release/1.2.0`               | Preparing a new production release |
| Hotfix      | `hotfix/`  | `hotfix/login-bug`            | Urgent fixes for production        |
| Support     | `support/` | `support/legacy-api`          | Long-term support branches         |


**Branch Workflow Summary**:

```
master (production)
  │
  ├── hotfix/* ──────────-────────┐
  │                              │
  └── dev ◄────────────----──────┤
        │                        │
        ├── feature/* ───────────┤
        │                        │
        └── release/* ───────────┘
```

- `master` – Always reflects production-ready state
- `dev` – Integration branch for features, reflects latest development changes
- `feature/*` – Branch off from `dev`, merge back into `dev`
- `release/*` – Branch off from `dev`, merge into both `master` and `dev`

```
hotfix/* – Branch off from master, merge into both master and dev
```



Use the `-p` (push) flag with the `finish` command to delete the remote branch as well:

**bash**

```
git flow feature finish -p featu
```


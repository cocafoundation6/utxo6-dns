```markdown
# Contributing to UTXO6-DNS

👍🎉 First off, thank you for considering contributing to UTXO6-DNS! It's people like you that make this protocol better for everyone.

The following is a set of guidelines for contributing to this repository. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Project Structure](#project-structure)
3. [How to Contribute](#how-to-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Your First Code Contribution](#your-first-code-contribution)
4. [Development Workflow](#development-workflow)
   - [Branch Naming](#branch-naming)
   - [Commit Messages](#commit-messages)
   - [Development Setup](#development-setup)
5. [Coding Standards](#coding-standards)
   - [TypeScript](#typescript)
   - [Python](#python)
6. [Testing](#testing)
7. [Pull Request Process](#pull-request-process)
8. [License](#license)

---

## Code of Conduct

This project and everyone participating in it are governed by the [MIT License](LICENSE). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: `>= 18.0.0` (for TypeScript SDK)
- **npm**: `>= 9.0.0` or **yarn**: `>= 1.22.0`
- **Python**: `>= 3.10` (for Python SDK)
- **Git**: `>= 2.30.0`

### Project Structure

To help you navigate, here's a quick overview of the repository layout:

```
utxo6-dns/
├── ARCHITECTURE          # High-level architecture design
├── CONTRIBUTING.md       # This file
├── LICENSE               # MIT License
├── README.md             # Project overview and quick start
├── docs/                 # Whitepapers and protocol specifications
├── sdk/
│   ├── typescript/       # Main TypeScript SDK (Resolvers, VRF, PRN)
│   ├── python/           # Python SDK
│   ├── cli/              # Command-line interface tools
│   └── examples/         # Sample usage scripts
├── src/                  # Core protocol implementations (PoC)
└── test/                 # Integration and unit tests
```

## How to Contribute

### Reporting Bugs

If you find a bug, please [open an issue](https://github.com/cocafoundation6/utxo6-dns/issues/new) and include:

- A **clear and descriptive title**.
- **Steps to reproduce** the behavior.
- **Expected behavior** vs. **actual behavior**.
- Screenshots or code snippets if applicable.
- Your environment (OS, Node/Python version).

### Suggesting Enhancements

Feature requests are welcome! When suggesting an enhancement, please:

- Use a **clear and descriptive title**.
- Provide a **detailed description** of the proposed feature.
- Explain **why** this feature would be useful to the UTXO6-DNS ecosystem.
- If possible, outline a **basic implementation approach**.

### Your First Code Contribution

Unsure where to begin? Look for issues tagged with **`good-first-issue`** or **`help-wanted`**. These are typically small, self-contained tasks perfect for newcomers.

## Development Workflow

### Branch Naming

Use the following naming conventions for your branches:

- `feat/your-feature-name` → For new features.
- `fix/your-bug-fix` → For bug fixes.
- `docs/your-doc-update` → For documentation changes.
- `chore/your-chore` → For maintenance tasks (dependencies, configs).

### Commit Messages

We follow the **[Conventional Commits](https://www.conventionalcommits.org/)** specification.

**Format**: `<type>(<scope>): <subject>`

**Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding missing tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(vrf): add ECVRF-EDWARDS25519-SHA512 implementation
fix(resolver): handle empty DNS responses gracefully
docs(readme): update installation instructions
```

### Development Setup

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/utxo6-dns.git
   cd utxo6-dns
   ```
3. **Set up the TypeScript SDK**:
   ```bash
   cd sdk/typescript
   npm install
   npm run build
   ```
4. **Set up the Python SDK** (optional):
   ```bash
   cd sdk/python
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

## Coding Standards

### TypeScript

- Use **ESLint** and **Prettier** for code formatting.
- Run linting before committing:
  ```bash
  npm run lint
  ```
- Use strict TypeScript rules (`strict: true` in `tsconfig.json`).
- Provide JSDoc comments for all public APIs.

### Python

- Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow  Follow **[PEP 8](https://peps.python.org/pep-0008/)**................................................................................................................................
- Use  Use **Black** for automatic formatting. for automatic formatting.
- Use  Use **Flake8** for linting. for linting.
- Use type hints (PEP 484) wherever possible. Use type hints (PEP 484) wherever possible.

## Testing

- **All new features must include unit tests.**
- The test suite must pass locally before submitting a PR. The test suite must pass locally before submitting a PR.
- TypeScript tests are run via  TypeScript tests are run via **Jest**::
  ```bashbash
  cd sdk/typescript
  npm test
  ```
- Python tests are run via  Python tests are run via **pytest**::
  ```bashbash
  cd sdk/python
  pytest
  ```
- Aim for a minimum test coverage of  Aim for a minimum test coverage of **80%**..

## Pull Request Process

1. **Update your fork**: Ensure your branch is up-to-date with the : Ensure your branch is up-to-date with the `main` branch. branch.
   ```bashbash
   git remote add upstream https://github.com/cocafoundation6/utxo6-dns.git
   git fetch upstream
   git rebase upstream/main
   ```
2. **Push** your changes to your fork. your changes to your fork.
3. **Open a Pull Request** (PR) against the  (PR) against the `main` branch of this repository. branch of this repository.
4. In your PR description, include: In your PR description, include:
   - A  A **clear description** of what the PR does. of what the PR does.
   - A link to the  A link to the **related issue** (if any). (if any).
   - Screenshots or logs showing that the changes work. Screenshots or logs showing that the changes work.
5. **Wait for CI checks** to pass (GitHub Actions will run linting and tests). to pass (GitHub Actions will run linting and tests).
6. **Request a review** from a maintainer. At least one approval is required for merging. from a maintainer. At least one approval is required for merging.
7. The maintainer will merge your PR once all checks pass and the code is deemed ready. The maintainer will merge your PR once all checks pass and the code is deemed ready.

## License

By contributing, you agree that your contributions will be licensed under the By contributing, you agree that your contributions will be licensed under the **MIT License** that covers this project. that covers this project.

------

Thank you again for your time and effort! If you have any questions, feel free to open a discussion or reach out to the maintainers.Thank you again for your time and effort! If you have any questions, feel free to open a discussion or reach out to the maintainers.
```

# 📝 Resumier

A cross-platform, AI-powered resume and job application builder. This monorepo supports web, mobile, and desktop apps with a shared codebase using [Turborepo](https://turbo.build/repo) and [pnpm](https://pnpm.io/).

---

## 📦 Project Structure

```
resume-builder/
├── apps/
│   ├── web/        # React (Vite or Next.js)
│   ├── mobile/     # React Native (Expo)
│   └── desktop/    # Tauri wrapper
│
├── packages/
│   ├── ui/         # Shared cross-platform UI components
│   ├── core/       # Logic, hooks, and AI utils
│   └── storage/    # Platform-specific local storage
│
├── turbo.json      # Turbo task runner config
├── package.json    # Monorepo config and scripts
├── pnpm-workspace.yaml
└── .gitignore
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run development servers

```bash
pnpm dev:web       # Web app
pnpm dev:mobile    # Mobile app
pnpm dev:desktop   # Desktop app
```

Or run all with:

```bash
pnpm dev
```

---

## 📚 Scripts

| Command      | Description                |
| ------------ | -------------------------- |
| `pnpm dev`   | Run all dev servers        |
| `pnpm build` | Build all apps/packages    |
| `pnpm lint`  | Lint all workspaces        |
| `pnpm test`  | Run all tests (future use) |

---

## 🌐 Technologies

* **React** – Web UI
* **React Native + Expo** – Mobile app
* **Tauri** – Lightweight native desktop app
* **Turborepo** – Build system and task runner
* **pnpm** – Fast, disk-efficient package manager

---

## 🔒 Security

For information on reporting security vulnerabilities, please see
[`.github/SECURITY.md`](.github/SECURITY.md).

---

## 📬 Contact

For general questions or support, email [adrian.the.hactus@gmail.com](mailto:adrian.the.hactus@gmail.com).

---

## 💵 Compensation

Resumier is maintained by volunteers and does not provide monetary
compensation. Contributors do not receive a base salary, bonuses, or
company stock for their work on this project.

---

## 📄 License

This project is open-source and available under the MIT License.

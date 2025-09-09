# 🌐 CSV Remapper — Web Client

This is the **web client** for the CSV Remapper ecosystem.  
It’s built with **Vite + React + TypeScript** and **MUI** (Material UI), and it connects to the backend **[`csv_remapper_api`](https://github.com/MyNameIsClown/csv_remapper_api)** to remap and transform CSV files through a friendly UI.

Ecosystem:
- [`csv_remapper_lib`](https://github.com/MyNameIsClown/csv_remapper_lib) → Core Python library for CSV transformations.
- [`csv_remapper_api`](https://github.com/MyNameIsClown/csv_remapper_api) → FastAPI REST backend.
- **csv_remapper_web** (this repo) → Frontend client in React.

---

## ✨ Features

- ⚡️ Vite + React + TypeScript for fast DX
- 🎨 MUI components with theming
- 🔌 Configurable API base URL via environment variables
- 📁 Upload CSVs, preview columns, select/rename types, and transform
- 🧰 Clean architecture: components/pages/services/types

---

## 📂 Project Structure

```bash
csv-remapper-web/
├── public/                       # Static assets
├── src/
│   ├── assets/                   # Assets
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Route-level pages (Home, Transform, etc.)
│   ├── styles/                   # Styles and theming
│   ├── utils/                    # Utils and API fetching config
│   ├── App.tsx                   # App root
│   └── main.tsx                  # Vite entry
├── .env_example                  # Example env vars
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### 1) Prerequisites

- **Node.js** ≥ 18  
- A running instance of **csv-remapper-api** (default: `http://localhost:8000`)
- A package manager: **pnpm** (recommended), **npm** or **yarn**

### 2) Clone

```bash
git clone https://github.com/MyNameIsClown/csv_remapper_web.git
cd csv-remapper-web
```

### 3) Install dependencies

Using **pnpm** (recommended):
```bash
pnpm install
```

Using **npm**:
```bash
npm install
```

Using **yarn**:
```bash
yarn
```

### 4) Configure environment

Create a `.env` file (you can copy `.env_example`):

```bash
cp .env_example .env
```

Edit `.env` and set your API base URL:

```dotenv
# .env
VITE_API_BASE_URL="http://localhost:8000"  # csv-remapper-api base URL
```

### 5) Run in development

With **pnpm**:
```bash
pnpm dev
```

With **npm**:
```bash
npm run dev
```

App will be available at:
- http://localhost:5173 (default Vite port)

### 6) Build & Preview

```bash
# Build
pnpm build

# Preview production build locally
pnpm preview
```
---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feat/my-feature`
3. Commit: `git commit -m "feat: add my feature"`
4. Push: `git push origin feat/my-feature`
5. Open a Pull Request

Please:
- Follow the existing code style
- Add/keep tests where it makes sense
- Keep commits meaningful (Conventional Commits recommended)

---

## 📜 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.

---

## 👥 Maintainers & Collaboration

- **Victor Carrasco** ([@MyNameIsClown](https://github.com/MyNameIsClown)) — creator & maintainer

If you'd like to collaborate, open an issue or a PR. 🚀
# 🎟️ Uni Event & Ticketing Management System — v2.01

Welcome to the **v2.01** branch of the Uni Event and Ticketing Management System.

This branch introduces a full refresh of the platform — improving the UI, cleaning up the structure, and switching from **Stripe** to **Quickteller** for payment processing. It is the **active and default branch** for ongoing development.

> 🧠 Note: The `main` branch contains an older version, but all new work happens here in `v-2.01`.

---

## 🛠️ Tech Stack

- ⚛️ React
- ⚡ Vite
- 🟦 TypeScript
- 🎨 Tailwind CSS
- 📦 **npm** (used for package management — see `package-lock.json`)

---

## 🚀 Getting Started

Follow the steps below to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Checkout the Active Branch

You should already be on v-2.01 since it's the default, but if not:

```bash
git checkout v-2.01
```

### 3. Install Dependencies

The project uses npm, as shown by the presence of package-lock.json.

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Your app should now be live at:
http://localhost:5173 (or the next available port)

### 📁 Project Structure

<pre lang="nohighlight"> 
├── src/ 
  ├── components/ # Reusable UI components │ 
  ├── pages/ # Page-level components │ 
  ├── hooks/ # Custom React hooks │ 
  ├── utils/ # Helper functions │ 
  └── assets/ # Images, icons, etc. 
├── public/ # Static files served as-is 
├── index.html # Entry HTML file 
├── tailwind.config.ts # TailwindCSS config 
├── vite.config.ts # Vite config 
├── tsconfig.json # TypeScript config 
├── package.json 
└── package-lock.json # npm lock file ``` 
</pre>

✨ What's New in v2.01

- 💅 A fresh UI experience using Tailwind CSS

- 🔄 Migration from Stripe to Quickteller for handling payments

- 🧼 A cleaner codebase and folder structure

- ⚡️ Powered by Vite for fast builds and instant HMR

- 🧠 More maintainable and scalable setup

🤝 Contributing

1. You're welcome to contribute! Here’s how:

2. Fork this repository

3. Create a new branch

4. Work on your feature or fix

5. Open a pull request targeting the v-2.01 branch

🙌 Support

If you run into any issues or have ideas, open an issue or reach out.

Thanks for checking out the project! 🚀

---

Let me know if you’d like a `Quick Start` code snippet section, an `.env.example` file setup, or Quickteller integration docs when you start working on that!

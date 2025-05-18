# <img src="./public/logo.png" width="34px" alt="" /> Portal Windows

## 📖 Introduction
Shows an approach to managing multiple synchronized browser windows using plain 
web APIs and `localStorage`. It allows you to open and control several (in this case is two) fullscreen windows, 
sharing state between them without any backend.

🔗 [Video](https://www.youtube.com/watch?v=N7wcZw6vXwQ)

---

## 🚀 Main Wep APIs

- 📡 `localStorage` usage
- 🎨 `storage` event in Web Storage API
- ⚡ Creating and dispatching your own custom event for listening of updating window position on desktop
- 🔧 Getting window position and sizes in the viewport of the screen
- 🌐 Simple css animations

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/glowlh/broadcast-windows.git
cd broadcast-windows
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
src/
├── Icons/                  # UI icons used throughout the application
├── Path/                   # Components or logic related to paths calculation
├── StorageManager/         # Manages localStorage synchronization between windows
├── UpdateWindowEvent/      # Defines and dispatches custom events for updating windows
├── WindowObserver/         # Observes window lifecycle events (open/close/focus/move/resize)
├── App.tsx                 # Root React component
├── main.tsx                # Entry point; renders the App component
├── styles.ts               # Style definitions used across the app
├── types.ts                # TypeScript types used throughout the codebase
```
---

## 🧷 Tags

![TypeScript](https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)


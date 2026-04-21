# SmartScore MSPI

A PWA-ready React application built with Vite, React, and TypeScript.

## Features

- ⚡️ Vite for fast development and building
- ⚛️ React 18 with TypeScript
- 📱 PWA-ready (manifest.json and service worker)
- 🎨 Mobile-first responsive design
- 🧹 Clean folder structure
- 🎯 Minimal dependencies
- ♿️ Semantic HTML

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
smartscore-mspi/
├── public/
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker placeholder
├── src/
│   ├── App.tsx            # Main App component
│   ├── App.css            # App styles
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## PWA Features

The application includes:
- `manifest.json` for app metadata and icons
- Service worker (`sw.js`) for offline support and caching
- Automatic service worker registration in `main.tsx`

## Browser Support

Modern browsers that support:
- ES2020
- Service Workers
- Web App Manifest

## License

MIT


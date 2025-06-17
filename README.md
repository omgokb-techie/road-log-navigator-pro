# ELD Trip Planner (Frontend)

## Project Info

A modern frontend application for planning ELD-compliant trips, visualizing routes, and generating daily log sheets for property-carrying drivers.

## Features

- Input trip details: current location, pickup, dropoff, and current cycle used (hours)
- Visualize planned routes on a map (using a free map API)
- Generate and display daily ELD log sheets for the trip
- Responsive, accessible UI with shadcn-ui and Tailwind CSS

## Technologies Used

- [Vite](https://vitejs.dev/) (React + TypeScript)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn-ui](https://ui.shadcn.com/) (Radix UI + Tailwind CSS)
- [Tailwind CSS](https://tailwindcss.com/)
- [axios](https://axios-http.com/) (API requests)
- [lucide-react](https://lucide.dev/) (icons)

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/omgokb-techie/road-log-navigator-pro#
cd road-log-navigator-pro
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add your backend API URL:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

### 4. Start the development server

```sh
npm run dev
```

## Deployment

You can deploy this frontend on [Vercel](https://vercel.com/) or any static hosting provider.

## Custom Domain

To connect a custom domain, navigate to your hosting provider's domain settings and follow their instructions.
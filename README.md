# TenantShout2

A responsive React application for the TenantShout platform, designed to streamline tenant communications and enhance engagement. Built with modern libraries and best practices for performance and maintainability.

## Features

- **Responsive Design:** Optimized for desktop and mobile devices
- **Client-Side Routing:** Powered by React Router DOM for seamless navigation
- **Styled with SCSS & Emotion:** Global styles via SCSS, component-scoped styles via Emotion CSS-in-JS
- **UI Components:** Material-UI (MUI v6) and FontAwesome icons for a consistent, accessible interface


## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gordonmaloney/tenantshout2.git
   ```
2. **Change into the project directory**
   ```bash
   cd tenantshout2
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```

## Running Locally

Start the development server:

```bash
npm start
```

The app will be available at `http://localhost:3000` and will reload on code changes.

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The compiled files will be output to the `build/` directory, ready for deployment.

## Project Structure

```
tenantshout2/
├── public/                   # Static files and HTML template
│   └── index.html
├── src/                      # Application source code
│   ├── Components/           # Reusable UI components (see below)
│   ├── Pages/                # Route-level components/views (see below)
│   ├── App.js                # Root component and router setup
│   ├── index.js              # Entry point
│   ├── Endpoints.jsx         # API link
│   └── index.scss            # Global SCSS styles
├── .gitignore
├── package.json
└── README.md
```


### Styling
Using MUI, but with custom styling in src/MUIStyles.jsx


### Components

The `` directory contains shared UI building blocks:

- **Header.jsx**: Renders the site header with application title and an “ADMIN” button. Uses React Router’s `Link` and Material‑UI’s `Button` with the `BtnStyleSmall` style.
- **Footer.jsx**: Displays Living Rent links and social media icons (Facebook, X/Twitter, Instagram) using FontAwesome icons, wrapped in a responsive MUI `Grid2` and `Box` layout.

### Pages

All top‑level views live under ``, organized by feature:

#### Landing

- **Landing.jsx**: The home page; displays a hero section inside an MUI `Paper`, with a call‑to‑action button linking to campaigns. Fetches campaign data via `useCampaigns` context.
- **FeatureCards.jsx**: Renders a responsive grid of feature highlights using MUI `Card` and local images.
- **FeaturedCampaigns.jsx**: Shows a swipeable carousel of featured campaigns using `react‑swipeable‑views` and a styled MUI `MobileStepper`.

#### TARGETING

- ## All targeting options and logic is in this one folder!!!

- ## .Message/Message.jsx handles the logic for replacing the prompts in the user's message 
- **CampaignTopLevel.jsx**: Wrapper for an individual campaign route. Reads `campaignId` from URL, loads the campaign via `useCampaigns`, and conditionally renders details or a “not found” message. Incorporates responsive layout and a “Report a Bug” dialog.
- **Campaign.jsx**: Handles the multi‑stage user flow: collecting email and postcode, answering prompts (`Prompts.jsx`), and composing the final message (`Message/Message.jsx`). Detects user’s mail client automatically.
- **CampaignBlurbs.jsx**: Displays the campaign blurb and host name with expand/collapse behavior for small screens.
- **CampaignAccordion.jsx**: Renders an FAQ section using MUI `Accordion`, sanitizing HTML with DOMPurify and enabling smooth scroll to panels.

#### Admin

- **AdminLogin.jsx**: Login form for administrators. On success, stores JWT token in local storage.
- **AdminDashboard.jsx**: Protected landing page for admins; lists existing campaigns and links to create or edit.
- **Create.jsx**: Multi‑step campaign setup form (Overview, Prompts, Template). Posts new campaigns to the API via `ENDPOINT` and updates context.
- **Edit.jsx**: Similar to **Create.jsx**, but pre‑loads an existing campaign for editing and sends PUT requests to update.

## Technologies Used

- **React** (v18)
- **React Router DOM** (v6)
- **Axios** (v1)
- **Material-UI** (MUI v6) & **@emotion/react**, **@emotion/styled**
- **FontAwesome** (v6)
- **SCSS** (Sass)
- **react-swipeable-views-react-18-fix**
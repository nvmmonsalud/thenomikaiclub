# The Nomikai Club: Tokyo Whisky & Vinyl Guide

Discover the soul of Tokyo through its legendary whisky salons and intimate vinyl listening bars. This static website serves as a curated guide and planner for night crawlers looking to explore Tokyo's after-dark culture.

## Features

*   **Night Planner:** A personalized route generator on the homepage. Select your focus (Whisky/Vinyl), start time, pace, and group size to get a suggested itinerary.
*   **Curated Listings:** Handpicked lists of the best [Whisky Bars](pages/whisky-bars.html) and [Vinyl Bars](pages/vinyl-bars.html) in Tokyo.
*   **Detailed Guides:** In-depth pages for iconic venues like Bar High Five, JBS, and Bar Benfiddich.
*   **Whisky Reviews:** A dedicated section for reviews of Japanese whiskies.
*   **Mock Authentication:** A demonstration sign-in feature using local storage to persist session state.
*   **Interactive Map:** A stylized map highlighting key nightlife neighborhoods (Ginza, Shinjuku, Shibuya, Ebisu).

## Project Structure

This is a pure static site with no build steps, package managers, or server-side code.

```
├── index.html              # Homepage (Night Planner, Map)
├── pages/                  # Listing and detail pages
│   ├── whisky-bars.html    # List of whisky bars
│   ├── vinyl-bars.html     # List of vinyl bars
│   ├── whisky-reviews.html # Whisky reviews
│   ├── signin.html         # Login page
│   └── ...                 # Individual bar pages
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   ├── main.js         # Navigation and Night Planner logic
│   │   ├── auth.js         # Mock authentication logic
│   │   └── ...
│   └── images/             # SVG assets
├── RESEARCH.md             # Documentation of planned features
└── README.md               # This file
```

## Getting Started

Since there are no dependencies or build scripts, you can run this project simply by opening the HTML files in your browser.

1.  Clone the repository.
2.  Open `index.html` in your preferred web browser.
3.  Navigate through the site to explore bars and test the planner.

## Supabase + Next.js Backend Scaffold

This repository now includes a production-ready Supabase schema (migrations, RLS policies, storage policies, and seed data) plus a minimal Next.js App Router integration.

### Local Supabase setup

1.  Install the Supabase CLI.
2.  Start Supabase locally:

    ```bash
    supabase start
    ```

3.  Apply migrations and seed data:

    ```bash
    supabase db reset
    ```

4.  Copy the environment template and fill in your keys (from `supabase status`):

    ```bash
    cp .env.local.example .env.local
    ```

### Run the Next.js app

```bash
npm install
npm run dev
```

The App Router UI demonstrates:

* Public read of bars and posts.
* Email/password login + registration.
* Authenticated review creation with optional image upload.

### Supabase files

* `supabase/migrations/` contains the schema, RLS policies, helper functions, and storage setup.
* `supabase/seed.sql` seeds sample bars and posts for local development.

## Development & Maintenance

*   **Navigation:** The navigation menu is hardcoded in every HTML file. If you modify the menu in `index.html`, you **must** manually update it in all files within the `pages/` directory to ensure consistency.
*   **Styling:** All styles are contained in `assets/css/style.css`. The design emphasizes a "Tokyo after dark" aesthetic with smooth scrolling and reveal animations.
*   **Security:** A strict Content Security Policy (CSP) is implemented via `<meta>` tags. When adding new resources, ensure they comply with the policy (primarily 'self', Unsplash for images, and Google Fonts).
*   **Frontend Verification:** To verify changes visually, use the `file://` protocol in your browser.

## Planned Enhancements

See [RESEARCH.md](RESEARCH.md) for details on upcoming features like:
*   Shareable Night Plans (via URL hash)
*   Interactive Bar Search
*   Clickable Map Pins

## License

This project is licensed under the terms of the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.

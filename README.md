
# HumanChain AI Safety Incident Dashboard

A responsive and modern dashboard for tracking and managing AI safety incidents.

## Features

- View and manage AI safety incidents
- Filter incidents by severity
- Sort incidents by date
- Expand/collapse incident details
- Report new incidents with real-time validation
- Responsive design for all screen sizes
- Toast notifications for user feedback

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui for UI components
- date-fns for date formatting
- Local state management with React hooks

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:8080 to view the application

## Design Decisions

- Used a card-based layout for clear information hierarchy
- Implemented severity-based color coding for quick visual identification
- Added subtle animations for better user interaction feedback
- Responsive design ensures usability on all device sizes
- Form validation with user-friendly error messages

## Project Structure

```
src/
  ├── components/        # React components
  ├── data/             # Mock data
  ├── hooks/            # Custom React hooks
  ├── pages/            # Page components
  ├── types/            # TypeScript type definitions
  └── utils/            # Utility functions
```


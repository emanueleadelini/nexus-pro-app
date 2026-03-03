# **App Name**: Nexus Agency

## Core Features:

- User Authentication & Authorization: Secure user login/logout with role-based access control (Admin/Client).
- Admin Client Management Dashboard: Admins can view a real-time list of all clients, manage client details, and navigate to client-specific dashboards.
- Editorial Calendar Management: Admins can create, update, and manage editorial posts for each client through a defined workflow (Draft, To Approve, Approved, Published). Clients can view and approve posts.
- Client Material Management: Clients can upload various materials (e.g., logos, images). Admins can review, validate, or reject materials with a reason.
- AI-powered Post Draft: A tool to assist admins in generating initial drafts for social media posts (title and text) based on client requirements.
- Client Credit & Activity Overview: Clients get a clear overview of their remaining post credits and the status of their editorial calendar and uploaded materials.
- Firestore Data Integration: Utilize Firestore for real-time data synchronization across all client and admin dashboards, managing users, clients, posts, and materials as per the defined structure.

## Style Guidelines:

- Primary color: Deep, professional blue (#2261C2) to convey trust and efficiency in a light scheme.
- Background color: Very light desaturated blue (#EBF1F6) for a clean and open feel, ensuring good readability.
- Accent color: Vibrant sky blue (#1ABBE6) for interactive elements, highlights, and status indicators, providing visual clarity and dynamism.
- Headline font: 'Space Grotesk' (sans-serif) for a modern, clear, and slightly technical aesthetic. Body font: 'Inter' (sans-serif) for high readability in longer text blocks and across different screen sizes.
- Use a consistent set of clean, outline-style icons from Material Design to maintain professionalism and intuitiveness.
- Implement a clear, card-based layout with well-defined sections for client information, editorial calendar, and material management. Prioritize whitespace and hierarchical organization for easy navigation.
- Incorporate subtle animations for state changes and user feedback, such as fade-ins for loaded content and brief transformations on interactive elements, to enhance user experience without distraction.
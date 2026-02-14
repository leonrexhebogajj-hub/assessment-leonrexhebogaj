# Assessment Submission - [Leon Rexhebogaj]

## Internship Project: Video Lab

This is a video upload and annotation platform built with **React, Vite, and Supabase**. It allows users to upload videos, watch them, and add timed annotations and bookmarks.

## Technologies Used

*   **Frontend**: React (Vite), CSS3 (Flexbox/Grid), Standard Hooks (useState, useEffect, useRef).
*   **Backend / Database**: Supabase (PostgreSQL, Authentication, Storage).
*   **Hosting**: (Instructions for local run below).

## How to Run the Project

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/leonrexhebogajj-hub/assessment-leonrexhebogaj.git
    cd assessment-leon
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root with your Supabase credentials:
    ```
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## Assumptions & Limitations

*   **Admin View**: As this is a Frontend-focused submission, I prioritized the user interface and interaction (reactive annotations) over a backend role-based access control system for Admins. A true Admin view would require a backend function or "admin" role in the `auth.users` table.
*   **Storage**: Videos are stored in a public Supabase bucket named `VIDEOS`.
*   **Styling**: The design focuses on clarity and usability ("intern-level") rather than complex animations or frameworks like Tailwind, to demonstrate core CSS understanding.

## Features Completed

*   ✅ **User Accounts**: Sign Up & Login/Logout.
*   ✅ **Video Upload**: Supports video files with retry logic for robust uploads.
*   ✅ **Annotations**: Users can add notes at specific timestamps. **(Reactive Feature: Annotations highlight when the video plays past them!)**
*   ✅ **Bookmarks**: Users can save specific moments to revisit later.

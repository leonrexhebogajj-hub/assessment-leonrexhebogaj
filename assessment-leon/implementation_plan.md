# Implementation Plan - Final Polish

We have completed most of the core functionality. To fully satisfy the "Frontend Intern" requirements, we need to address a few specific points to demonstrate "UI behavior" and "interactions".

## Remaining Requirements Checklist

- [x] **User Accounts**: Login implemented.
- [ ] **Annotations Behavior**: Requirement says "Annotations should be **visible when** the video reaches the related timestamp".
    - *Current State*: Annotations are always visible in a list.
    - *Improvement*: Display the annotation text *overlaying* the video or highlight the list item when playback reaches that timestamp. This shows strong Frontend state management skills.
- [x] **Bookmarks**: Implemented.
- [ ] **Admin View**: "Admin users should be able to view all videos, annotations and bookmarks".
    - *Current State*: Videos and Annotations are public. Bookmarks are private (RLS).
    - *Recommendation*: Since you are applying for **Frontend**, building a complex role system is "Backend" work. We can simply ensure the UI handles a basic "Admin" route or just explain this limitation in the README.
- [ ] **README.md**: "Your repository must include a README.md explaining how to run, technologies, assumptions".
    - *Current State*: Default Vite README.
    - *Action*: Rewrite this completely.

## Proposed Changes

### 1. Enhance Annotation UI (Frontend Focus)
Make annotations "alive".
- **File**: `src/components/Annotations.jsx`, `src/components/VideoPlayer.jsx`
- **Feature**: When video plays, check the `currentTime`. If it matches an annotation's timestamp (within 1-2 seconds), display that annotation in a special "Active Note" box or overlay on the video.

### 2. Create Professional README
Use the required format.
- **File**: `README.md`
- **Content**: Setup instructions, Tech Stack (React, Vite, Supabase), Features, and "Assumptions/Limitations" (where we explain the Admin view decision).

### 3. Final Code Cleanup
Review `App.css` and `App.jsx` one last time to ensure standard formatting (Prettier-like). 

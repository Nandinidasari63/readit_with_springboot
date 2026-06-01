# Plan — Issue #3: User Avatar

## Goal
Let users set a profile avatar (DiceBear preset or custom upload), stored as
`avatarUrl` on the user in MongoDB and shown consistently across posts and the navbar.

## Files Affected

### Backend (`backend/`)
| File | Change |
|------|--------|
| `db/client.ts` | Add `avatarUrl?: string` to `User` type |
| `services/user_service.ts` | Add `updateAvatar(userId, avatarUrl)` method |
| `app.ts` | Add `POST /avatar/preset` (save DiceBear URL); add `POST /avatar/upload` (Cloudinary upload with square crop); update `GET /me` to return `avatarUrl`; update `GET /posts` feed to include `avatarUrl` on posts |

### Frontend (`frontend/src/`)
| File | Change |
|------|--------|
| `reducer.tsx` | Add `avatarUrl?: string` to `FeedState`; add `SET_AVATAR` action |
| `api.tsx` | Add `setPresetAvatarApi`, `uploadAvatarApi` |
| `actions.tsx` | Add `handleSetAvatar` |
| `App.tsx` | Show avatar in navbar; add avatar picker button next to username |
| `components/Post.tsx` | Update `PostItem` Avatar to show image when `avatarUrl` present |
| `components/AvatarPicker.tsx` | New — modal with DiceBear preset grid + custom upload tab |

## Tasks

### Task 1 — Backend: avatar storage and endpoints
- Add `avatarUrl?: string` to `User` type in `db/client.ts`
- Add `updateAvatar(userId, avatarUrl)` to `UserService`
- Add `POST /avatar/preset` — accepts `{ avatarUrl }` (must be a DiceBear URL), saves to user
- Add `POST /avatar/upload` — multipart, validates JPG/PNG/WEBP + 2MB, uploads to Cloudinary with square crop (`c_fill,w_200,h_200`), saves URL to user
- Update `GET /me` to include `avatarUrl` in response
- Update `FeedService.getFeed` to attach `avatarUrl` to each post (so post cards can show the author's current avatar)

### Task 2 — Frontend: avatar display
- Add `avatarUrl?: string` to `FeedState` in `reducer.tsx`
- Add `SET_AVATAR` action to reducer
- Update `PostItem` Avatar: show `<Avatar src={avatarUrl}>` when present, fall back to initials
- Update navbar in `App.tsx`: show small avatar next to "Hello, {name}!"

### Task 3 — Frontend: avatar picker
- Add `setPresetAvatarApi` and `uploadAvatarApi` to `api.tsx`
- Add `handleSetAvatar` action to `actions.tsx`
- Create `components/AvatarPicker.tsx`:
  - Modal triggered by clicking avatar in navbar
  - Tab 1: 12 DiceBear preset avatars (`adventurer` style, fixed seeds) shown in a grid
  - Tab 2: file upload (JPG/PNG/WEBP, 2MB limit, client-side validation)
  - Clicking a preset or confirming upload calls `handleSetAvatar` and closes modal

## DiceBear Presets
12 avatars using `https://api.dicebear.com/9.x/adventurer/svg?seed=<seed>`:
seeds: Felix, Aneka, Jasper, Lily, Max, Zoe, Leo, Mia, Sam, Iris, Rex, Nova

## Risk Areas
- `FeedService.getFeed` currently joins users only for subscription IDs — adding `avatarUrl` to posts requires fetching it from the users collection per post author, which adds DB reads. Use a single `$in` lookup across all post authors to avoid N+1.
- `GET /me` is used at app startup to detect logged-in state — adding `avatarUrl` to the response is backward-compatible.

## Out of Scope
- Profile page
- Avatar cropping UI on the client (Cloudinary handles it server-side)
- Avatars in the user search list

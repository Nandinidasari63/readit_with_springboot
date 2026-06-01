# Plan — Issue #1: Image Upload

## Goal
Allow users to attach one image (JPG, PNG, GIF, WEBP, max 5 MB) when creating a
post; the image is stored on the backend server and displayed in the feed.

## Files Affected

### Backend (`backend/`)
| File | Change |
|------|--------|
| `deno.json` | Add `--allow-write` to the `dev` task so Deno can write uploaded files |
| `app.ts` | Add `POST /upload` (receive file, validate, save); add `GET /uploads/:filename` (serve static); update `POST /add` to pass `imageUrl` to service |
| `services/post_service.ts` | Accept optional `imageUrl` in `addPost`, store it in MongoDB |
| `db/client.ts` | Add `imageUrl?: string` to the `Post` type |

### Frontend (`frontend/src/`)
| File | Change |
|------|--------|
| `api.tsx` | Add `uploadImageApi` (multipart POST to `/upload`); update `addPostApi` to send `imageUrl` |
| `actions.tsx` | Update `handleAddPost` signature to accept and pass `imageUrl` |
| `components/Post.tsx` | Add file input + image preview to `PostForm`; display image in `PostItem` |

## Tasks

1. **Backend — upload endpoint & static serving**
   - Add `--allow-write` to `deno.json`
   - Add `POST /upload`: parse multipart, validate type + size, write file to `./uploads/`, return `{ url: "/uploads/<filename>" }`
   - Add `GET /uploads/:filename`: read file from disk, stream as response with correct Content-Type
   - Update `db/client.ts` `Post` type: add `imageUrl?: string`
   - Update `PostService.addPost`: accept and store `imageUrl`
   - Update `POST /add` route: pass `imageUrl` through to service

2. **Frontend — file picker, preview, and display**
   - Add `uploadImageApi` to `api.tsx` (posts `multipart/form-data` to `/upload`)
   - Update `addPostApi` to include `imageUrl` in request body
   - Update `handleAddPost` in `actions.tsx` to accept and pass `imageUrl`
   - Update `PostForm`: add file input, show preview, upload on submit then pass URL
   - Update `PostItem`: render `<img>` if `data.imageUrl` is present

## Risk Areas
- Deno's `--allow-write` flag must be added or uploads will crash at runtime
- CORS is already configured per-origin; static file serving via `/uploads/:filename` will be under the same origin so no additional CORS config needed
- `POST /add` currently parses JSON — after this change it will still parse JSON (imageUrl is a URL string from a prior upload, not the binary)

## Out of Scope
- Multiple images per post
- Image editing or resizing
- Comments image upload
- External storage (S3, Cloudinary)
- Authentication on the `/uploads` static route

# Plan — Issue #2: Video Upload

## Goal
Allow users to attach one video (MP4/MOV/AVI/WEBM, max 500 MB) when creating a
post; the video is compressed server-side to H.264 MP4 via FFmpeg, stored
locally, and played inline in the feed.

## Files Affected

### Backend (`backend/`)
| File | Change |
|------|--------|
| `deno.json` | Add `--allow-run` so Deno can invoke FFmpeg |
| `app.ts` | Add `POST /upload-video` (validate format + size, temp-save, run FFmpeg, return URL); update content-type map in `GET /uploads/:filename` to include `mp4` |
| `services/post_service.ts` | Accept optional `videoUrl` in `addPost` |
| `db/client.ts` | Add `videoUrl?: string` to the `Post` type |
| `POST /add` route in `app.ts` | Pass `videoUrl` through to service |

### Frontend (`frontend/src/`)
| File | Change |
|------|--------|
| `reducer.tsx` | Add `videoUrl?: string` to `Post` type |
| `api.tsx` | Add `uploadVideoApi` (multipart POST to `/upload-video`) |
| `actions.tsx` | Update `handleAddPost` to accept and pass `videoUrl` |
| `components/Post.tsx` | Add video file picker + `<video>` preview to `PostForm`; show processing spinner during upload; render `<video>` in `PostItem` |

## Tasks

1. **Backend — video upload endpoint + FFmpeg compression**
   - Add `--allow-run` to `deno.json`
   - Add `POST /upload-video`: validate MIME + size, write raw file to temp path, run FFmpeg (`-c:v libx264 -crf 23 -preset fast -movflags +faststart`), delete temp file, return `{ url }`
   - Add `mp4` to content-type map in `GET /uploads/:filename`
   - Update `db/client.ts` `Post` type: add `videoUrl?: string`
   - Update `PostService.addPost`: accept and store `videoUrl`
   - Update `POST /add` route: pass `videoUrl` through

2. **Frontend — video picker, preview, processing state, and display**
   - Add `videoUrl?: string` to `Post` type in `reducer.tsx`
   - Add `uploadVideoApi` to `api.tsx`
   - Update `handleAddPost` in `actions.tsx` to accept and pass `videoUrl`
   - Update `PostForm`: video file picker, client-side format + size validation, `<video>` preview, "Processing video..." spinner during upload
   - Update `PostItem`: render `<video controls>` if `data.videoUrl` is present

## Risk Areas
- FFmpeg must be installed and on PATH (`brew install ffmpeg` locally, available by default on Render)
- `--allow-run` in deno.json grants broad shell access — FFmpeg is invoked with a fixed command and a UUID-named temp file to avoid injection
- Compression is synchronous; large files will make the upload request long-lived — the 500 MB limit and fast preset keep this manageable
- A post can have an image OR a video, not both — enforced on the frontend

## Out of Scope
- Async/background video processing with polling
- Thumbnail generation
- Multiple videos per post
- Video + image combined in one post

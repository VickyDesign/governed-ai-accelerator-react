# Governed Production AI Accelerator — React/Vite

A polished, single-viewport enterprise SaaS prototype based on the supplied governance one-pager.

## Screens
- Overview
- Agent Registry
- Agent Detail
- Production Requests
- Request Detail / Approval
- PolicyIQ
- Approvals
- ReadyScan
- RunBridge
- CostLink
- AuditRecord

## Run locally
```bash
npm install
npm run dev
```
Then open the local URL Vite prints, usually `http://localhost:5173`.

## Build for deployment
```bash
npm run build
```
The production build is created in `dist/`.

## Deploy
This is ready for Vercel, Netlify, Cloudflare Pages, or any static hosting service that supports Vite builds. Use `npm run build` as the build command and `dist` as the output directory.

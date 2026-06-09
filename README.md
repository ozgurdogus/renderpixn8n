# n8n-nodes-renderpix

**RenderPix community node for n8n.** Generate images from HTML — with batch rendering, template variables, and async callbacks.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-renderpix.svg)](https://www.npmjs.com/package/n8n-nodes-renderpix)

---

## Installation

```bash
npm install n8n-nodes-renderpix
```

Or search **RenderPix** in the n8n Community Nodes library.

Get your free API key at [renderpix.dev](https://renderpix.dev) — 100 renders/month, no credit card.

---

## Operations

### Render HTML

Convert an HTML string to a PNG, JPEG, or WebP image.

| Parameter | Description |
|---|---|
| HTML | HTML string to render |
| Width / Height | Output dimensions in px |
| Format | `png` / `jpeg` / `webp` |
| Quality | 1–100 (JPEG/WebP) |
| Scale | Device scale factor 0.5–3x |
| Template Variables | Key-value pairs for `{{key}}` placeholders |
| Wait Until | `load` / `domcontentloaded` / `networkidle` |

**Template variables:**

```html
<div>Hello, {{name}}!</div>
<div>{{date}}</div>
```

Pass `vars: { name: "Alice", date: "June 2026" }` — filled before rendering.

---

### Render Batch

Render multiple HTML templates in a single API call. Returns array of base64-encoded images.

| Parameter | Description |
|---|---|
| Items | Array of `{ html, vars }` objects |
| Width / Height | Applied to all items |
| Format | `png` / `jpeg` / `webp` |

**Plan limits:** Starter ≤10, Pro/Scale ≤50 items per call.

**Instagram carousel example (10 slides, 1 API call):**

```json
{
  "items": [
    { "html": "<div>{{title}}</div>", "vars": { "title": "Slide 1" } },
    { "html": "<div>{{title}}</div>", "vars": { "title": "Slide 2" } }
  ],
  "width": 1080,
  "height": 1350,
  "format": "jpeg"
}
```

---

### Screenshot URL

Capture a live webpage as an image.

| Parameter | Description |
|---|---|
| URL | Page to capture |
| Width / Height | Viewport dimensions |
| Format | `png` / `jpeg` / `webp` |
| Full Page | Capture full scrollable page (Pro+) |
| CSS Selector | Capture a specific element (Pro+) |

---

## Credentials

Add a **RenderPix API** credential in n8n:

- **API Key** — from your [RenderPix dashboard](https://renderpix.dev/dashboard.html)

---

## Changelog

### v1.1.0 — June 2026
- **New: Render Batch operation** — render multiple templates in one call
- **New: Template Variables** — `{{key}}` placeholder injection on Render HTML and Render Batch
- **New: Wait Until** — `load` | `domcontentloaded` | `networkidle`

### v1.0.1
- Fix: Windows npm install EINVAL error (shell:true patch)

### v1.0.0
- Initial release: Render HTML, Screenshot URL

---

## Links

- **RenderPix:** https://renderpix.dev
- **Docs:** https://renderpix.dev/docs.html
- **npm:** https://www.npmjs.com/package/n8n-nodes-renderpix
- **Issues:** https://github.com/ozgurdogus/renderpixn8n/issues

# n8n-nodes-renderpix

[n8n](https://n8n.io) community node for **[RenderPix](https://renderpix.dev)** — convert HTML to pixel-perfect images and capture URL screenshots directly inside your n8n workflows.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-renderpix.svg)](https://www.npmjs.com/package/n8n-nodes-renderpix)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

---

## Features

- **Render HTML → Image**: Turn any HTML string into a PNG, JPEG, or WebP image
- **Screenshot URL**: Capture pixel-perfect screenshots of any public webpage
- **Retina / High-DPI**: 1×, 2×, 3× device scale for sharp outputs
- **CSS Selector crop**: Capture only a specific element on the page (Pro+)
- **Full-page capture**: Render the entire scrollable page (Pro+)
- **Three return modes**: Binary file, Base64 string, or Data URL
- **Credential test**: Validate your API key directly from n8n's credential settings

---

## Installation

### Via n8n Community Nodes (Recommended)

1. In n8n, go to **Settings → Community Nodes**
2. Click **Install**
3. Enter: `n8n-nodes-renderpix`
4. Click **Install** and restart n8n

### Manual (Self-hosted n8n)

```bash
cd ~/.n8n/custom
npm install n8n-nodes-renderpix
```

Restart n8n after installation.

---

## Setup

### 1. Get an API Key

Sign up at [renderpix.dev](https://renderpix.dev) and copy your API key from the dashboard. Keys start with `rpx_`.

### 2. Add Credential in n8n

1. Go to **Credentials → New Credential**
2. Search for **RenderPix API**
3. Paste your API key
4. (Optional) Set a custom Base URL if self-hosted
5. Click **Save** — n8n will test the connection automatically

---

## Usage Examples

### Example 1: Generate an OG Image (1200×630)

```html
<div style="
  width: 1200px; height: 630px;
  background: linear-gradient(135deg, #0066ff, #00ccff);
  display: flex; align-items: center; justify-content: center;
  font-family: sans-serif; color: white;
">
  <div style="text-align: center;">
    <h1 style="font-size: 64px; margin: 0;">{{ $json.title }}</h1>
    <p style="font-size: 28px; opacity: 0.8;">renderpix.dev</p>
  </div>
</div>
```

- **Width**: 1200, **Height**: 630, **Format**: PNG, **Return As**: Binary File

### Example 2: Instagram Carousel Slide (1080×1350)

```html
<div style="width:1080px;height:1350px;background:#fff;padding:80px;font-family:sans-serif;">
  <h2 style="font-size:72px;color:#0066ff;">{{ $json.headline }}</h2>
  <p style="font-size:36px;color:#333;line-height:1.6;">{{ $json.body }}</p>
</div>
```

- **Width**: 1080, **Height**: 1350, **Scale**: 2× (Retina)

### Example 3: Certificate Generator

```html
<div style="width:1200px;height:850px;border:8px solid gold;padding:60px;text-align:center;font-family:Georgia,serif;">
  <h1 style="font-size:56px;color:#1a1a1a;">Certificate of Completion</h1>
  <p style="font-size:32px;margin:40px 0;">This certifies that</p>
  <h2 style="font-size:48px;color:#0066ff;">{{ $json.name }}</h2>
  <p style="font-size:24px;color:#666;">has completed <strong>{{ $json.course }}</strong></p>
</div>
```

### Example 4: URL Screenshot

Set **Operation** to **Screenshot URL**, enter the target URL. Combine with an HTTP Request node or Webhook to screenshot dynamic pages.

---

## Node Parameters

### Operation: Render HTML

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| HTML | String | — | Raw HTML to render |
| Width | Number | 1280 | Viewport width in px |
| Height | Number | 720 | Viewport height in px |
| Format | PNG / JPEG / WebP | PNG | Output format |
| Quality | 1–100 | 90 | JPEG/WebP compression (ignored for PNG) |
| Device Scale (DPR) | 1× / 2× / 3× | 1× | Retina multiplier |
| CSS Selector | String | — | Crop to element (Pro+) |
| Full Page | Boolean | false | Capture full scroll height (Pro+) |
| Return As | Binary / Base64 / Data URL | Binary | Output format |
| Binary Property Name | String | data | n8n binary field name (binary mode only) |

### Operation: Screenshot URL

Same parameters as above, but with **URL** instead of **HTML**.

---

## Plan Limits

| Feature | Free | Starter | Pro | Scale |
|---------|------|---------|-----|-------|
| Renders/month | 100 | 2,000 | 10,000 | 100,000 |
| Max resolution | 1280×720 | 1920×1080 | 4K | 4K |
| Formats | PNG | PNG, JPEG | All | All |
| Scale (DPR) | 1× | 1×, 2× | 1×–3× | 1×–3× |
| Full page | ✗ | ✗ | ✓ | ✓ |
| CSS Selector | ✗ | ✗ | ✓ | ✓ |
| SLA | — | — | 99.9% | 99.9% |

---

## Common Workflows

- **Social media automation**: Generate unique images per post from a spreadsheet or Airtable
- **Dynamic OG images**: Trigger on CMS publish webhook → render → upload to CDN
- **Certificate generation**: Form submit → render HTML certificate → email as PDF attachment
- **Batch rendering**: Loop over a list of items and render an image for each
- **Monitoring screenshots**: Scheduled screenshots of dashboards or competitor pages

---

## Troubleshooting

**401 Unauthorized**: Check your API key in credentials. Keys must start with `rpx_`.

**402 Usage Limit**: You've reached your plan's monthly render limit. Upgrade at [renderpix.dev/pricing](https://renderpix.dev/pricing).

**Image appears pixelated**: Enable **Device Scale (DPR) 2×** for retina quality.

**External fonts/CSS not loading**: Use inline styles or embed CSS in a `<style>` tag inside your HTML.

**Node not appearing in n8n**: Restart n8n after installation. Clear `~/.n8n/` cache if needed.

---

## Support

- **Docs**: [renderpix.dev/docs.html](https://renderpix.dev/docs.html)
- **Issues**: [GitHub Issues](https://github.com/renderpix/n8n-nodes-renderpix/issues)
- **Email**: support@renderpix.dev

---

## License

[MIT](LICENSE.md)

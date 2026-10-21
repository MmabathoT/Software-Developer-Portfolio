# Mmabatho Tsatsimpe — Portfolio

A responsive, static portfolio website for Mmabatho Tsatsimpe, a software
developer and aspiring DevOps engineer.

The visual theme uses a clean white canvas with violet and blue accents
inspired by the Reabetswe Technologies logo. Motion includes a staggered hero
introduction, a softly floating code card and certification badge, rotating
orbital accents, a looping skills ticker, and scroll-triggered section reveals.
Reduced-motion preferences are respected.

## GitHub QR code for your CV

The QR code in `assets/github-portfolio-qr.png` links directly to
<https://github.com/MmabathoT>, where recruiters can browse public projects.
Insert the PNG into a CV document, or use `assets/github-portfolio-qr.svg` for a
scalable vector version. Keep the white margin around the code clear when
resizing or placing it.

## Run locally

No build tools or dependencies are required. Open `index.html` in a browser, or
start a local server from this folder:

```powershell
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Projects

The projects section loads public repositories from the GitHub REST API for
`MmabathoT`, with featured project descriptions available immediately as a
fallback. A network connection is needed to refresh the live project list.
Private repositories are not requested or displayed.

## Publish from VS Code with GitHub Pages

1. Open this folder in VS Code and sign in to your GitHub account.
2. In **Source Control**, review and commit the portfolio files.
3. Select **Publish Branch** and choose a new **public** GitHub repository,
   such as `MmabathoTsatsimpe-Portfolio`. Do not publish private work or
   personal documents.
4. In the new repository, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**, then select
   `main` and the `/ (root)` folder.
6. Save. GitHub Pages will provide the website URL after the first deployment.

Git is initialized on the `main` branch in this folder. It has not been
published to GitHub yet.

The full resume PDF is intentionally not included: it contains personal
identifiers and private reference details. Only professional experience,
education, and certifications are summarized here.

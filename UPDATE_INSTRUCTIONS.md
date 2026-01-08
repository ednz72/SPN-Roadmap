# How to Update Your Public Roadmap

Your roadmap is now live at: **https://ednz72.github.io/SPN-Roadmap/**

## Two Versions of Your Roadmap

You have two versions:

1. **Full Version** (with admin panel): `Current_v2.2.4/webapp/`
   - Use this to make edits locally
   - Has password-protected admin panel
   - All features enabled

2. **Public Version** (read-only): `Public_Version/`
   - Published to GitHub Pages
   - No admin panel
   - What the world sees

## When You Make Changes to Your Roadmap

### Step 1: Edit Locally (Full Version)

1. Open the full version: `Current_v2.2.4/webapp/index.html`
2. Click the ⚙️ button, enter password: `achille201`
3. Make your changes (add, edit, or delete items)
4. Export your updated data:
   - Click **"↓ JSON"** button
   - Save the file as `roadmap-data.js`

### Step 2: Update the Public Version

1. Copy the exported `roadmap-data.js` file
2. Replace this file: `Public_Version/roadmap-data.js`

### Step 3: Push Updates to GitHub

Open Terminal and run these commands:

```bash
# Navigate to public version folder
cd "/Users/enricodonzelli/Documents/AI SPN/04_Operations/Tools_and_Systems/Roadmap_Webapp/Public_Version"

# Stage the changes
git add .

# Commit with a message
git commit -m "Update roadmap data"

# Push to GitHub
git push origin main
```

Wait 30-60 seconds, then your live site will be updated automatically!

---

## Quick Reference Commands

### Check what changed:
```bash
cd "/Users/enricodonzelli/Documents/AI SPN/04_Operations/Tools_and_Systems/Roadmap_Webapp/Public_Version"
git status
```

### See your changes before committing:
```bash
git diff roadmap-data.js
```

### Push updates to live site:
```bash
cd "/Users/enricodonzelli/Documents/AI SPN/04_Operations/Tools_and_Systems/Roadmap_Webapp/Public_Version"
git add .
git commit -m "Update roadmap: [brief description of changes]"
git push origin main
```

---

## Important Notes

- **Keep your local version** (`Current_v2.2.4/webapp/`) - this is your editing workspace
- **Always export to JSON** after making changes
- **Copy the exported file** to `Public_Version/roadmap-data.js`
- **Commit and push** to make changes live
- Changes appear on the live site **within 1 minute** of pushing

---

## Your Live URL

Share this URL with anyone who should see your roadmap:
**https://ednz72.github.io/SPN-Roadmap/**

The site is:
- ✅ Public (anyone can view)
- ✅ Read-only (no one can edit)
- ✅ Professional and interactive
- ✅ Works on all devices
- ✅ Exports to PDF, JSON, and Markdown

---

## Need Help?

If you have issues updating:
1. Check that you're in the correct folder
2. Make sure you copied the updated `roadmap-data.js` file
3. Verify git commands ran without errors
4. Wait 60 seconds after pushing for GitHub to deploy

Last updated: January 2026

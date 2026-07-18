# 🚀 Pull Request Creation Guide

## Step 1: Create GitHub/GitLab Repository

### Option A: GitHub

1. Go to https://github.com/new
2. Create repository name: `elevateeX`
3. **Do NOT** initialize with README (we already have one)
4. Click "Create repository"

### Option B: GitLab

1. Go to https://gitlab.com/projects/new
2. Create project name: `elevateeX`
3. Set visibility (Private/Public)
4. **Uncheck** "Initialize repository with a README"
5. Click "Create project"

---

## Step 2: Add Remote & Push

### For GitHub:
```bash
# Add remote
git remote add origin https://github.com/YOUR-USERNAME/elevateeX.git

# Push master branch
git checkout master
git push -u origin master

# Push feature branch
git checkout feature/standalone-admin-portal
git push -u origin feature/standalone-admin-portal
```

### For GitLab:
```bash
# Add remote
git remote add origin https://gitlab.com/YOUR-USERNAME/elevateeX.git

# Push master branch
git checkout master
git push -u origin master

# Push feature branch
git checkout feature/standalone-admin-portal
git push -u origin feature/standalone-admin-portal
```

---

## Step 3: Create Pull/Merge Request

### On GitHub:

1. Go to your repository: `https://github.com/YOUR-USERNAME/elevateeX`
2. Click **"Pull requests"** tab
3. Click **"New pull request"** button
4. Set base: `master` ← compare: `feature/standalone-admin-portal`
5. Click **"Create pull request"**
6. Title will auto-fill from PR template
7. Review the description (auto-populated from template)
8. Click **"Create pull request"**

### On GitLab:

1. Go to your project: `https://gitlab.com/YOUR-USERNAME/elevateeX`
2. Click **"Merge requests"** in left sidebar
3. Click **"New merge request"**
4. Source branch: `feature/standalone-admin-portal`
5. Target branch: `master`
6. Click **"Compare branches and continue"**
7. Title and description will auto-fill
8. Click **"Create merge request"**

---

## Step 4: Using GitHub CLI (Fastest Method)

### Install GitHub CLI:
```bash
# Windows (using winget)
winget install GitHub.cli

# Or download from: https://cli.github.com/
```

### Create Repository & PR:
```bash
# Login to GitHub
gh auth login

# Create repository
gh repo create elevateeX --public --source=. --remote=origin

# Push branches
git push -u origin master
git push -u origin feature/standalone-admin-portal

# Create Pull Request
gh pr create \
  --base master \
  --head feature/standalone-admin-portal \
  --title "🚀 Standalone Admin Portal - Feature Branch" \
  --body-file .github/PULL_REQUEST_TEMPLATE.md
```

---

## Step 5: Alternative - Manual PR Creation (Without Remote)

If you don't want to push to GitHub/GitLab, you can create a local PR summary:

```bash
# Generate diff file
git diff master feature/standalone-admin-portal > admin-portal-changes.diff

# Generate commit log
git log master..feature/standalone-admin-portal --oneline > commit-log.txt
```

Share these files with your team for review.

---

## Quick Command Reference

### Check current branch:
```bash
git branch
```

### Switch branches:
```bash
git checkout master
git checkout feature/standalone-admin-portal
```

### View changes:
```bash
git diff master feature/standalone-admin-portal
```

### View commit history:
```bash
git log --oneline --graph --all
```

---

## Testing Before PR

### Run both servers:

**Terminal 1 - Main Project:**
```bash
cd C:\Users\dhruv\Downloads\elevateeX_3\elevateeX
npm run dev
```

**Terminal 2 - Admin Portal:**
```bash
cd C:\Users\dhruv\Downloads\elevateeX_3\elevateeX\ElevateeX-Admin
npm install
npm run dev
```

### Test these features:
- [ ] Admin login (port 5000)
- [ ] Dashboard displays correctly
- [ ] Create/edit course
- [ ] Add content (videos, PDFs)
- [ ] View customers
- [ ] Revenue analytics
- [ ] Excel export

---

## PR Merge Workflow

After PR is approved:

### GitHub:
1. Click **"Merge pull request"**
2. Choose merge type:
   - **Create merge commit** (recommended)
   - **Squash and merge**
   - **Rebase and merge**
3. Click **"Confirm merge"**
4. Delete branch (optional)

### GitLab:
1. Click **"Merge"** button
2. Check **"Delete source branch"** (optional)
3. Click **"Merge"**

---

## Post-Merge

### Update local repository:
```bash
git checkout master
git pull origin master
git branch -d feature/standalone-admin-portal  # Delete local branch
```

---

## Troubleshooting

### Issue: "remote: Repository not found"
**Solution:** Check remote URL:
```bash
git remote -v
git remote set-url origin https://github.com/YOUR-USERNAME/elevateeX.git
```

### Issue: "failed to push some refs"
**Solution:** Pull first, then push:
```bash
git pull origin feature/standalone-admin-portal --rebase
git push origin feature/standalone-admin-portal
```

### Issue: "Authentication failed"
**Solution:** Use personal access token:
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate token with `repo` scope
3. Use token as password when pushing

---

**Need Help?**
- GitHub Docs: https://docs.github.com/en/pull-requests
- GitLab Docs: https://docs.gitlab.com/ee/user/project/merge_requests/
- Git Docs: https://git-scm.com/doc

---

**Happy Coding!** 🚀

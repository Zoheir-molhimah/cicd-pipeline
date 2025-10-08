# Branch Protection Rules Setup Guide

This document outlines the recommended branch protection rules for your CI/CD pipeline with 3 developers.

## Required Branch Protection Rules

### 1. Main Branch Protection
- **Branch**: `main`
- **Settings**:
  - ✅ Require a pull request before merging
  - ✅ Require approvals (2 reviewers minimum)
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners
  - ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - ✅ Require conversation resolution before merging
  - ✅ Restrict pushes that create files larger than 100MB
  - ✅ Allow force pushes: ❌ Disabled
  - ✅ Allow deletions: ❌ Disabled

### 2. Staging Branch Protection
- **Branch**: `staging`
- **Settings**:
  - ✅ Require a pull request before merging
  - ✅ Require approvals (1 reviewer minimum)
  - ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date before merging
  - ✅ Allow force pushes: ❌ Disabled
  - ✅ Allow deletions: ❌ Disabled

### 3. Develop Branch Protection
- **Branch**: `develop`
- **Settings**:
  - ✅ Require a pull request before merging
  - ✅ Require approvals (1 reviewer minimum)
  - ✅ Require status checks to pass before merging
  - ✅ Allow force pushes: ❌ Disabled
  - ✅ Allow deletions: ❌ Disabled

## Environment Protection Rules

### Production Environment
- **Required reviewers**: 2 (Lead Developer + Senior Developer)
- **Wait timer**: 0 minutes
- **Prevent self-review**: ✅ Enabled
- **Restrict to branches**: `main` only

### Staging Environment
- **Required reviewers**: 1 (Any team member)
- **Wait timer**: 0 minutes
- **Prevent self-review**: ❌ Disabled
- **Restrict to branches**: `staging`, `develop`

## Code Owners Configuration

Create `.github/CODEOWNERS` file:

```
# Global code owners
* @Zoheir-molhimah @Naif-Molhimah @tec

# Critical files require all team members
/.github/ @Zoheir-molhimah @Naif-Molhimah @tec
/package.json @Zoheir-molhimah @Naif-Molhimah @tec
/package-lock.json @Zoheir-molhimah @Naif-Molhimah @tec

# Infrastructure files
/.actions/ @Zoheir-molhimah @tec
/k8s/ @Zoheir-molhimah @tec
/docker/ @Zoheir-molhimah @tec

# Frontend code
/src/ @Zoheir-molhimah @Naif-Molhimah
/public/ @Zoheir-molhimah @Naif-Molhimah

# Backend code
/api/ @Naif-Molhimah @tec
/server/ @Naif-Molhimah @tec
```

## Required Status Checks

### For Main Branch
- `build-and-test`
- `security-scan`
- `code-quality` (from PR checks)

### For Staging Branch
- `build-and-test`
- `security-scan`

### For Develop Branch
- `build-and-test`

## Setup Instructions

1. **Go to Repository Settings**
   - Navigate to your GitHub repository
   - Click on "Settings" tab
   - Click on "Branches" in the left sidebar

2. **Add Branch Protection Rules**
   - Click "Add rule" or "Add branch protection rule"
   - Configure each branch as specified above

3. **Set up Environments**
   - Go to "Settings" → "Environments"
   - Create `staging` environment
   - Create `production` environment
   - Configure protection rules as specified above

4. **Create CODEOWNERS file**
   - Create `.github/CODEOWNERS` file in your repository root
   - Add the content specified above
   - Adjust usernames to match your team members

5. **Configure Secrets**
   - Go to "Settings" → "Secrets and variables" → "Actions"
   - Add required secrets:
     - `SLACK_WEBHOOK_URL` (optional, for notifications)
     - `CODECOV_TOKEN` (optional, for coverage reports)

## Team Workflow

### Development Flow
1. **Feature Development**
   - Create feature branch from `develop`
   - Make changes and commit
   - Create PR to `develop`
   - Get 1 approval from any team member
   - Merge to `develop`

2. **Staging Deployment**
   - Create PR from `develop` to `staging`
   - Get 1 approval from any team member
   - Merge to `staging`
   - Automatic deployment to staging environment

3. **Production Deployment**
   - Create PR from `staging` to `main`
   - Get 2 approvals (Lead + Senior Developer)
   - Merge to `main`
   - Manual approval required for production deployment
   - Automatic deployment after approval

### Emergency Hotfixes
- Create hotfix branch from `main`
- Make minimal changes
- Create PR to `main`
- Get 2 approvals
- Deploy directly to production

## Monitoring and Notifications

- All deployments are logged with commit information
- Slack notifications for deployment status
- GitHub Issues created for production deployments requiring approval
- Commit author tracking in all deployment logs

## Security Considerations

- All code changes require review
- Security scans run on every PR and deployment
- Production deployments require manual approval
- Branch protection prevents direct pushes to main/staging
- Environment-specific secrets and configurations

# 🚀 GitHub Repository Setup & CI/CD Testing Guide

This guide will walk you through setting up your GitHub repository and testing the complete CI/CD pipeline.

## 📋 **Step 1: Create GitHub Repository**

### **1.1 Create Repository on GitHub:**
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** button in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `cicd-pipeline`
   - **Owner**: `Molhimah-Code` (or your GitHub username)
   - **Description**: `CICD Pipeline Application with CI/CD Pipeline`
   - **Visibility**: **Public** (required for free CI/CD features)
   - **Initialize**: ❌ **Don't** check "Add a README file" (we already have files)
   - **Initialize**: ❌ **Don't** check "Add .gitignore" (we already have one)
   - **Initialize**: ❌ **Don't** check "Choose a license" (we'll add MIT later)

5. Click **"Create repository"**

### **1.2 Push Your Code:**
```bash
# Make sure you're in the project directory
cd C:\Users\Dell\Documents\github\cicd-pipeline

# Push to GitHub
git push origin main
```

## 🔧 **Step 2: Set Up Branch Protection Rules**

### **2.1 Configure Main Branch Protection:**
1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Click **"Branches"** in the left sidebar
4. Click **"Add rule"**
5. Configure for `main` branch:
   - **Branch name pattern**: `main`
   - ✅ **Require a pull request before merging**
     - ✅ **Require approvals**: `2`
     - ✅ **Dismiss stale PR approvals when new commits are pushed**
     - ✅ **Require review from code owners**
   - ✅ **Require status checks to pass before merging**
     - Add these status checks:
       - `build-and-test`
       - `security-scan`
       - `code-quality`
   - ✅ **Require conversation resolution before merging**
   - ✅ **Restrict pushes that create files larger than 100MB**
   - ❌ **Allow force pushes**: Disabled
   - ❌ **Allow deletions**: Disabled

6. Click **"Create"**

### **2.2 Configure Staging Branch Protection:**
1. Click **"Add rule"** again
2. Configure for `staging` branch:
   - **Branch name pattern**: `staging`
   - ✅ **Require a pull request before merging**
     - ✅ **Require approvals**: `1`
   - ✅ **Require status checks to pass before merging**
     - Add these status checks:
       - `build-and-test`
       - `security-scan`
   - ❌ **Allow force pushes**: Disabled
   - ❌ **Allow deletions**: Disabled

3. Click **"Create"**

### **2.3 Configure Develop Branch Protection:**
1. Click **"Add rule"** again
2. Configure for `develop` branch:
   - **Branch name pattern**: `develop`
   - ✅ **Require a pull request before merging**
     - ✅ **Require approvals**: `1`
   - ✅ **Require status checks to pass before merging**
     - Add this status check:
       - `build-and-test`
   - ❌ **Allow force pushes**: Disabled
   - ❌ **Allow deletions**: Disabled

3. Click **"Create"**

## 🌍 **Step 3: Set Up Environments**

### **3.1 Create Staging Environment:**
1. Go to **"Settings"** → **"Environments"**
2. Click **"New environment"**
3. Name: `staging`
4. Configure protection rules:
   - **Required reviewers**: `1` (Any team member)
   - **Wait timer**: `0` minutes
   - **Prevent self-review**: ❌ Disabled
   - **Restrict to branches**: `staging`, `develop`

5. Click **"Save protection rules"**

### **3.2 Create Production Environment:**
1. Click **"New environment"** again
2. Name: `production`
3. Configure protection rules:
   - **Required reviewers**: `2` (Lead Developer + Senior Developer)
   - **Wait timer**: `0` minutes
   - **Prevent self-review**: ✅ Enabled
   - **Restrict to branches**: `main` only

4. Click **"Save protection rules"**

## 🔄 **Step 4: Create Test Branches**

```bash
# Create develop branch
git checkout -b develop
git push origin develop

# Create staging branch
git checkout -b staging
git push origin staging

# Create feature branch for testing
git checkout -b feature/test-pipeline
git push origin feature/test-pipeline
```

## 🧪 **Step 5: Test the CI/CD Pipeline**

### **5.1 Test PR Checks:**
1. Go to **"Pull requests"** → **"New pull request"**
2. **Base**: `develop` ← **Compare**: `feature/test-pipeline`
3. **Title**: `Test: CI/CD Pipeline PR Checks`
4. **Description**: 
   ```
   Testing the PR workflow and quality gates
   
   - [x] Code quality checks
   - [x] Security scans
   - [x] Build checks
   - [x] Tests
   ```
5. Click **"Create pull request"**
6. **Verify**: All checks run automatically
7. **Get approval** from any team member
8. **Merge** the PR

### **5.2 Test Staging Deployment:**
1. Create PR from `develop` → `staging`
2. **Title**: `Deploy: Test staging deployment`
3. **Get 1 approval** from any team member
4. **Merge** the PR
5. **Verify**: Staging deployment triggers automatically

### **5.3 Test Production Approval:**
1. Create PR from `staging` → `main`
2. **Title**: `Deploy: Test production deployment`
3. **Get 2 approvals** (from `@Zoheir-molhimah` and `@Naif-Molhimah`)
4. **Merge** the PR
5. **Verify**: Production requires manual approval
6. **Approve** the deployment in GitHub Environments

## 📊 **What You'll See in GitHub Actions**

### **Successful Pipeline Run:**
```
✅ build-and-test
  ✅ Checkout code
  ✅ Setup Node.js
  ✅ Install dependencies
  ✅ Run tests (4 tests passing)
  ✅ Run linting
  ✅ Build application
  ✅ Build and push Docker image
  ✅ Commit Information logged

✅ deploy-staging (if staging branch)
  ✅ Deploy to Staging Environment
  ✅ Run Staging Tests
  ✅ Notify Staging Deployment

✅ deploy-production (if main branch)
  ✅ Pre-deployment Checks
  ✅ Deploy to Production Environment
  ✅ Post-deployment Verification
  ✅ Notify Production Deployment

✅ security-scan
  ✅ Run security audit
  ✅ Run CodeQL Analysis
```

## 🔍 **Monitoring & Verification**

### **Check These Areas:**
1. **GitHub Actions Tab**: All workflows run successfully
2. **Pull Requests**: Required checks pass
3. **Branch Protection**: Direct pushes blocked
4. **Environments**: Manual approval required for production
5. **CODEOWNERS**: Correct reviewers assigned
6. **Commit Tracking**: Author information logged

### **Expected Results:**
- ✅ **4 tests passing** in every run
- ✅ **Docker image built** and pushed
- ✅ **Staging auto-deploys** from staging/develop branches
- ✅ **Production requires approval** from main branch
- ✅ **Commit author tracked** in all deployments
- ✅ **Security scans run** on every PR

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Repository not found**:
   - Verify repository name and owner
   - Check if repository is public

2. **Branch protection not working**:
   - Ensure you have admin access
   - Check if organization requires paid plan

3. **Workflows not triggering**:
   - Verify workflow files are in `.actions/workflows/`
   - Check branch names match workflow triggers

4. **Tests failing**:
   - Run `npm test` locally first
   - Check Node.js version compatibility

5. **Docker build failing**:
   - Test Dockerfile locally
   - Check GitHub Container Registry permissions

### **Debug Commands:**
```bash
# Check local tests
npm test

# Check local build
npm run build

# Check local linting
npm run lint

# Test Docker build
docker build -t aqarthon-app .

# Check git status
git status
git log --oneline
```

## 🎯 **Success Criteria**

Your CI/CD pipeline is working correctly when:

- [ ] ✅ Repository created and code pushed
- [ ] ✅ Branch protection rules configured
- [ ] ✅ Environments set up with approval workflows
- [ ] ✅ PR checks run automatically
- [ ] ✅ Staging deployments work
- [ ] ✅ Production requires manual approval
- [ ] ✅ All tests pass (4/4)
- [ ] ✅ Docker images build successfully
- [ ] ✅ Commit tracking works
- [ ] ✅ Security scans run
- [ ] ✅ Notifications sent (if configured)

## 🎉 **Congratulations!**

Once all steps are complete, you'll have a fully functional CI/CD pipeline with:
- **Automated testing and building**
- **Staging before production**
- **Manual approval workflows**
- **Commit tracking and author information**
- **Security scanning**
- **Branch protection**

Your 3-developer team can now work efficiently with proper code review processes and safe deployment practices!

---

**Need help?** Check the logs in GitHub Actions or refer to the `TESTING_GUIDE.md` for more detailed troubleshooting steps.

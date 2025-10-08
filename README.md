# CICD Pipeline - CI/CD Pipeline

A comprehensive CI/CD pipeline setup for a 3-developer team with staging and production environments, approval workflows, and commit tracking.

## 🚀 Features

- **Multi-environment deployment** (staging → production)
- **Manual approval workflows** for production deployments
- **Commit tracking and author information** in all deployments
- **Automated testing and security scanning**
- **Branch protection rules** with required reviews
- **Pull request checks** with code quality gates
- **Docker containerization** with multi-stage builds
- **Slack notifications** for deployment status

## 📋 Pipeline Overview

### Branch Strategy
- `main` - Production branch (requires 2 approvals)
- `staging` - Staging environment (requires 1 approval)
- `develop` - Development branch (requires 1 approval)
- Feature branches - Created from `develop`

### Workflow Triggers
- **Push to main**: Triggers production deployment (with manual approval)
- **Push to staging**: Triggers staging deployment
- **Push to develop**: Triggers staging deployment
- **Pull Requests**: Triggers code quality checks

## 🛠️ Setup Instructions

### 1. Repository Configuration

1. **Set up branch protection rules** (see [BRANCH_PROTECTION_SETUP.md](.github/BRANCH_PROTECTION_SETUP.md))
2. **Configure environments** in GitHub Settings → Environments
3. **Update CODEOWNERS** file with your team members' GitHub usernames
4. **Add required secrets**:
   - `SLACK_WEBHOOK_URL` (optional, for notifications)
   - `CODECOV_TOKEN` (optional, for coverage reports)

### 2. Environment Setup

#### Production Environment
- **Required reviewers**: 2 (Lead Developer + Senior Developer)
- **Wait timer**: 0 minutes
- **Prevent self-review**: ✅ Enabled
- **Restrict to branches**: `main` only

#### Staging Environment
- **Required reviewers**: 1 (Any team member)
- **Wait timer**: 0 minutes
- **Prevent self-review**: ❌ Disabled
- **Restrict to branches**: `staging`, `develop`

### 3. Team Workflow

#### Development Flow
1. **Feature Development**
   ```
   develop → feature-branch → PR → develop (1 approval)
   ```

2. **Staging Deployment**
   ```
   develop → PR → staging (1 approval) → Auto-deploy to staging
   ```

3. **Production Deployment**
   ```
   staging → PR → main (2 approvals) → Manual approval → Auto-deploy to production
   ```

## 📁 Project Structure

```
cicd-pipeline/
├── .actions/workflows/          # GitHub Actions workflows
│   ├── main.yml                 # Main CI/CD pipeline
│   ├── pr-checks.yml            # Pull request checks
│   └── approval-workflow.yml    # Manual approval workflow
├── .github/
│   ├── CODEOWNERS              # Code ownership rules
│   └── BRANCH_PROTECTION_SETUP.md # Setup instructions
├── src/                        # Source code
├── tests/                      # Test files
├── Dockerfile                  # Docker configuration
├── package.json               # Dependencies and scripts
├── jest.config.js            # Jest test configuration
├── .eslintrc.js              # ESLint configuration
└── .prettierrc               # Prettier configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:staging     # Run staging-specific tests

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Run TypeScript type checking
npm run audit            # Run security audit
```

## 🔒 Security Features

- **CodeQL analysis** on every PR and deployment
- **Security audit** with npm audit
- **Branch protection** prevents direct pushes
- **Environment-specific secrets** management
- **Container security** with non-root user
- **Health checks** for deployed applications

## 📊 Monitoring & Notifications

### Commit Tracking
Every deployment includes:
- Commit SHA
- Author information
- Commit message
- Branch information
- Deployment timestamp

### Notifications
- **Slack notifications** for deployment status
- **GitHub Issues** created for production deployments requiring approval
- **PR comments** with deployment information
- **Workflow status** updates

## 🚨 Emergency Procedures

### Hotfix Deployment
1. Create hotfix branch from `main`
2. Make minimal changes
3. Create PR to `main`
4. Get 2 approvals
5. Deploy directly to production

### Rollback Procedure
1. Identify the last known good commit
2. Create rollback PR to `main`
3. Get 2 approvals
4. Deploy rollback

## 👥 Team Responsibilities

### Developer 1 (Lead Developer)
- Review and approve production deployments
- Infrastructure and CI/CD maintenance
- Frontend code reviews

### Developer 2 (Senior Developer)
- Review and approve production deployments
- Backend code reviews
- Database and API maintenance

### Developer 3 (DevOps Engineer)
- Infrastructure and CI/CD maintenance
- Backend code reviews
- Security and monitoring

## 📞 Support

For questions or issues with the CI/CD pipeline:
1. Check the [Branch Protection Setup Guide](.github/BRANCH_PROTECTION_SETUP.md)
2. Review GitHub Actions logs
3. Contact the DevOps team

## 🔄 Pipeline Status

[![CI/CD Pipeline](https://github.com/Molhimah-Code/cicd-pipeline/workflows/CI/CD%20Pipeline%20-%20Staging%20to%20Production/badge.svg)](https://github.com/Molhimah-Code/cicd-pipeline/actions)

[![PR Checks](https://github.com/Molhimah-Code/cicd-pipeline/workflows/Pull%20Request%20Checks/badge.svg)](https://github.com/Molhimah-Code/cicd-pipeline/actions)

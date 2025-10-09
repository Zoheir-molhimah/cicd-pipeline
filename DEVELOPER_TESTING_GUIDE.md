# 🧪 Developer Testing Guide

## **Branch-Based Testing Strategy**

### **🌿 Branch Structure:**
- **`main`** → Production deployment
- **`staging`** → Staging deployment  
- **`develop`** → Development deployment
- **`feature/*`** → Feature branches (PR checks only)

---

## **1. Testing Individual Developer Workflows**

### **🔧 Local Development Testing**

```bash
# Clone the repository
git clone https://github.com/Zoheir-molhimah/cicd-pipeline.git
cd cicd-pipeline

# Install dependencies
npm install

# Run local tests
npm run test
npm run lint
npm run build

# Start development server
npm run dev
```

### **📋 Local Quality Checks**
```bash
# Code quality
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Testing
npm run test
npm run test:coverage

# Build verification
npm run build
```

---

## **2. Branch-Based CI/CD Testing**

### **🚀 Production Testing (main branch)**
```bash
git checkout main
git pull origin main
# Make a small change
echo "// Test comment" >> src/server.js
git add .
git commit -m "Test: Production deployment"
git push origin main
```
**Expected Result**: 
- ✅ All quality gates pass
- ✅ Production deployment runs
- ⏭️ Staging deployment skipped

### **🧪 Staging Testing (staging branch)**
```bash
git checkout staging
git pull origin staging
# Make a small change
echo "// Test staging" >> src/server.js
git add .
git commit -m "Test: Staging deployment"
git push origin staging
```
**Expected Result**:
- ✅ All quality gates pass
- ✅ Staging deployment runs
- ⏭️ Production deployment skipped

### **🛠️ Development Testing (develop branch)**
```bash
git checkout develop
git pull origin develop
# Make a small change
echo "// Test develop" >> src/server.js
git add .
git commit -m "Test: Development deployment"
git push origin develop
```
**Expected Result**:
- ✅ All quality gates pass
- ✅ Staging deployment runs (same as staging branch)

---

## **3. Feature Branch Testing (Pull Requests)**

### **🔀 Create Feature Branch**
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: Add new feature"
git push origin feature/new-feature
```

### **📝 Create Pull Request**
1. Go to GitHub repository
2. Click "Compare & pull request"
3. Set base branch to `develop` or `main`
4. Create PR

**Expected Result**:
- ✅ PR checks workflow runs
- ✅ Code quality, security, testing gates
- ✅ Build verification
- ✅ Coverage reports

---

## **4. Manual Approval Testing**

### **🎯 Test Production Approval Workflow**
1. Go to GitHub Actions
2. Find "Manual Approval Workflow"
3. Click "Run workflow"
4. Select environment: `production`
5. Add approver and reason
6. Click "Run workflow"

**Expected Result**:
- ✅ Pre-deployment validation
- ✅ Manual approval step
- ✅ Production deployment
- ✅ Notifications

---

## **5. Testing Different Scenarios**

### **❌ Test Failure Scenarios**

#### **Code Quality Failure**
```bash
# Add intentional linting error
echo "const badCode = 'missing semicolon'" >> src/server.js
git add .
git commit -m "Test: Intentional linting error"
git push origin develop
```
**Expected**: Quality gate should fail

#### **Test Failure**
```bash
# Break a test
echo "expect(true).toBe(false);" >> tests/server.test.js
git add .
git commit -m "Test: Intentional test failure"
git push origin develop
```
**Expected**: Testing gate should fail

#### **Build Failure**
```bash
# Break the build
echo "import { nonExistentModule } from './non-existent';" >> src/server.js
git add .
git commit -m "Test: Intentional build failure"
git push origin develop
```
**Expected**: Build gate should fail

---

## **6. Developer-Specific Testing**

### **👨‍💻 For Each Developer:**

1. **Clone Repository**
   ```bash
   git clone https://github.com/Zoheir-molhimah/cicd-pipeline.git
   cd cicd-pipeline
   ```

2. **Create Personal Branch**
   ```bash
   git checkout -b developer/[your-name]
   git push origin developer/[your-name]
   ```

3. **Make Changes and Test**
   ```bash
   # Make your changes
   npm run test
   npm run lint
   npm run build
   
   # Commit and push
   git add .
   git commit -m "feat: Your feature"
   git push origin developer/[your-name]
   ```

4. **Create Pull Request**
   - Base: `develop`
   - Review: Team members
   - Merge: After approval

---

## **7. Monitoring and Debugging**

### **📊 Check Workflow Status**
- Go to: `https://github.com/Zoheir-molhimah/cicd-pipeline/actions`
- Click on any workflow run
- Check individual job logs

### **🔍 Common Issues & Solutions**

#### **Quality Gate Fails**
```bash
# Fix linting issues
npm run lint:fix
git add .
git commit -m "fix: Resolve linting issues"
git push
```

#### **Test Coverage Low**
```bash
# Add more tests
npm run test:coverage
# Check coverage report in coverage/ folder
```

#### **Build Fails**
```bash
# Check build locally
npm run build
# Fix any TypeScript or build errors
```

---

## **8. Best Practices for Developers**

### **✅ Before Pushing:**
1. Run `npm run lint` - Fix any issues
2. Run `npm run test` - Ensure all tests pass
3. Run `npm run build` - Verify build works
4. Check `npm run type-check` - Fix TypeScript errors

### **🔄 Workflow:**
1. Create feature branch from `develop`
2. Make changes and test locally
3. Push to feature branch
4. Create Pull Request to `develop`
5. After review, merge to `develop`
6. Deploy to staging for testing
7. Create PR from `develop` to `main` for production

### **📝 Commit Messages:**
- `feat:` New features
- `fix:` Bug fixes
- `test:` Adding tests
- `docs:` Documentation
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

---

## **9. Quick Test Commands**

```bash
# Full local test suite
npm run test && npm run lint && npm run build

# Quick quality check
npm run lint:fix && npm run test

# Development server
npm run dev

# Production build test
npm run build && npm start
```

---

**🎯 This guide ensures every developer can test the CI/CD pipeline thoroughly!**

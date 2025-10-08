# PowerShell script to set up branches for CI/CD testing
# Run this after creating the GitHub repository

Write-Host "🚀 Setting up branches for CI/CD testing..." -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository!" -ForegroundColor Red
    exit 1
}

# Check current branch
$currentBranch = git branch --show-current
Write-Host "📍 Current branch: $currentBranch" -ForegroundColor Yellow

# Create develop branch
Write-Host "🌱 Creating develop branch..." -ForegroundColor Cyan
git checkout -b develop
git push origin develop
Write-Host "✅ Develop branch created and pushed" -ForegroundColor Green

# Create staging branch
Write-Host "🎭 Creating staging branch..." -ForegroundColor Cyan
git checkout -b staging
git push origin staging
Write-Host "✅ Staging branch created and pushed" -ForegroundColor Green

# Create feature branch for testing
Write-Host "🧪 Creating feature branch for testing..." -ForegroundColor Cyan
git checkout -b feature/test-pipeline
git push origin feature/test-pipeline
Write-Host "✅ Feature branch created and pushed" -ForegroundColor Green

# Return to main branch
git checkout main
Write-Host "📍 Returned to main branch" -ForegroundColor Yellow

Write-Host ""
Write-Host "🎉 Branch setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to GitHub and set up branch protection rules" -ForegroundColor White
Write-Host "2. Create environments (staging, production)" -ForegroundColor White
Write-Host "3. Test PR workflow from feature → develop" -ForegroundColor White
Write-Host "4. Test staging deployment from develop → staging" -ForegroundColor White
Write-Host "5. Test production approval from staging → main" -ForegroundColor White
Write-Host ""
Write-Host "See GITHUB_SETUP_GUIDE.md for detailed instructions" -ForegroundColor Cyan

#!/bin/bash

# ===============================================
# CICD Pipeline - Branch Protection Setup Script
# ===============================================

set -e

echo "🔒 Setting up Branch Protection Rules for CICD Pipeline..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# GitHub API configuration
REPO_OWNER="Molhimah-Code"
REPO_NAME="cicd-pipeline"
GITHUB_TOKEN="${GITHUB_TOKEN:-$1}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo -e "${RED}❌ Error: GitHub token is required${NC}"
    echo "Usage: $0 <github_token>"
    echo "Or set GITHUB_TOKEN environment variable"
    exit 1
fi

# API base URL
API_BASE="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}"

echo -e "${BLUE}📋 Repository: ${REPO_OWNER}/${REPO_NAME}${NC}"

# Function to make API calls
api_call() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${API_BASE}${endpoint}"
    else
        curl -s -X "$method" \
            -H "Authorization: token $GITHUB_TOKEN" \
            -H "Accept: application/vnd.github.v3+json" \
            "${API_BASE}${endpoint}"
    fi
}

# Function to check if branch exists
branch_exists() {
    local branch="$1"
    local response=$(api_call "GET" "/branches/$branch")
    echo "$response" | grep -q '"name"' && return 0 || return 1
}

# Function to create branch if it doesn't exist
create_branch() {
    local branch="$1"
    local base_branch="$2"
    
    if ! branch_exists "$branch"; then
        echo -e "${YELLOW}📝 Creating branch: $branch${NC}"
        
        # Get the SHA of the base branch
        local base_sha=$(api_call "GET" "/git/refs/heads/$base_branch" | grep -o '"sha":"[^"]*"' | cut -d'"' -f4)
        
        if [ -n "$base_sha" ]; then
            api_call "POST" "/git/refs" "{\"ref\":\"refs/heads/$branch\",\"sha\":\"$base_sha\"}" > /dev/null
            echo -e "${GREEN}✅ Created branch: $branch${NC}"
        else
            echo -e "${RED}❌ Failed to get base branch SHA${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}✅ Branch $branch already exists${NC}"
    fi
}

# Function to set up branch protection
setup_branch_protection() {
    local branch="$1"
    local protection_config="$2"
    
    echo -e "${BLUE}🛡️ Setting up protection for branch: $branch${NC}"
    
    local response=$(api_call "PUT" "/branches/$branch/protection" "$protection_config")
    
    if echo "$response" | grep -q '"url"'; then
        echo -e "${GREEN}✅ Branch protection enabled for: $branch${NC}"
    else
        echo -e "${RED}❌ Failed to enable branch protection for: $branch${NC}"
        echo "Response: $response"
    fi
}

# Create required branches
echo -e "${BLUE}🌿 Creating required branches...${NC}"
create_branch "develop" "main"
create_branch "staging" "main"
create_branch "hotfix" "main"

# Branch protection configurations
echo -e "${BLUE}🔒 Setting up branch protection rules...${NC}"

# MAIN BRANCH PROTECTION (Most Restrictive)
main_protection='{
    "required_status_checks": {
        "strict": true,
        "contexts": [
            "code-quality-gate",
            "security-gate", 
            "testing-gate",
            "build-gate"
        ]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
        "required_approving_review_count": 2,
        "dismiss_stale_reviews": true,
        "require_code_owner_reviews": true,
        "require_last_push_approval": true,
        "bypass_pull_request_allowances": {
            "users": ["Zoheir-molhimah"],
            "teams": ["admins"]
        }
    },
    "restrictions": {
        "users": ["Zoheir-molhimah", "Naif-Molhimah", "tec"],
        "teams": ["maintainers"]
    },
    "allow_force_pushes": false,
    "allow_deletions": false,
    "block_creations": true,
    "required_conversation_resolution": true
}'

# STAGING BRANCH PROTECTION
staging_protection='{
    "required_status_checks": {
        "strict": true,
        "contexts": [
            "code-quality-gate",
            "security-gate",
            "testing-gate"
        ]
    },
    "enforce_admins": false,
    "required_pull_request_reviews": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews": true,
        "require_code_owner_reviews": true,
        "require_last_push_approval": false
    },
    "restrictions": {
        "users": ["Zoheir-molhimah", "Naif-Molhimah", "tec"],
        "teams": ["developers"]
    },
    "allow_force_pushes": false,
    "allow_deletions": false,
    "block_creations": false,
    "required_conversation_resolution": true
}'

# DEVELOP BRANCH PROTECTION
develop_protection='{
    "required_status_checks": {
        "strict": false,
        "contexts": [
            "code-quality-gate",
            "testing-gate"
        ]
    },
    "enforce_admins": false,
    "required_pull_request_reviews": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews": false,
        "require_code_owner_reviews": false,
        "require_last_push_approval": false
    },
    "restrictions": {
        "users": ["Zoheir-molhimah", "Naif-Molhimah", "tec"],
        "teams": ["developers"]
    },
    "allow_force_pushes": false,
    "allow_deletions": false,
    "block_creations": false,
    "required_conversation_resolution": false
}'

# HOTFIX BRANCH PROTECTION (Emergency fixes)
hotfix_protection='{
    "required_status_checks": {
        "strict": true,
        "contexts": [
            "code-quality-gate",
            "security-gate",
            "testing-gate"
        ]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews": true,
        "require_code_owner_reviews": true,
        "require_last_push_approval": true,
        "bypass_pull_request_allowances": {
            "users": ["Zoheir-molhimah"],
            "teams": ["admins"]
        }
    },
    "restrictions": {
        "users": ["Zoheir-molhimah", "Naif-Molhimah", "tec"],
        "teams": ["maintainers"]
    },
    "allow_force_pushes": false,
    "allow_deletions": false,
    "block_creations": true,
    "required_conversation_resolution": true
}'

# Apply branch protection rules
setup_branch_protection "main" "$main_protection"
setup_branch_protection "staging" "$staging_protection"
setup_branch_protection "develop" "$develop_protection"
setup_branch_protection "hotfix" "$hotfix_protection"

# Set up environment protection rules
echo -e "${BLUE}🌍 Setting up environment protection...${NC}"

# Production environment (requires manual approval)
production_env='{
    "wait_timer": 0,
    "prevent_self_review": false,
    "reviewers": [
        {"type": "User", "id": "Zoheir-molhimah"},
        {"type": "User", "id": "tec"}
    ],
    "deployment_branch_policy": {
        "protected_branches": true,
        "custom_branch_policies": false
    }
}'

# Staging environment (auto-deploy)
staging_env='{
    "wait_timer": 0,
    "prevent_self_review": false,
    "reviewers": [],
    "deployment_branch_policy": {
        "protected_branches": false,
        "custom_branch_policies": true
    }
}'

# Apply environment protection
api_call "PUT" "/environments/production" "$production_env" > /dev/null
api_call "PUT" "/environments/staging" "$staging_env" > /dev/null

echo -e "${GREEN}✅ Environment protection configured${NC}"

# Create required status checks
echo -e "${BLUE}📊 Setting up required status checks...${NC}"

# These will be created automatically when the workflows run
echo -e "${GREEN}✅ Status checks will be created on first workflow run${NC}"

# Summary
echo -e "${GREEN}"
echo "🎉 Branch Protection Setup Complete!"
echo "=================================="
echo ""
echo "📋 Protection Summary:"
echo "• main: 2 approvals required, all checks must pass"
echo "• staging: 1 approval required, quality & security checks"
echo "• develop: 1 approval required, basic checks"
echo "• hotfix: 1 approval required, emergency access for admins"
echo ""
echo "🔒 Security Features:"
echo "• Code owner reviews required"
echo "• Required status checks"
echo "• Conversation resolution required"
echo "• Force push protection"
echo "• Branch deletion protection"
echo ""
echo "🌍 Environment Protection:"
echo "• production: Manual approval required"
echo "• staging: Auto-deploy with branch policies"
echo ""
echo "📝 Next Steps:"
echo "1. Push your code to trigger the first workflow"
echo "2. Status checks will be automatically created"
echo "3. Test the protection by creating a PR"
echo "4. Verify approval workflow works correctly"
echo -e "${NC}"

echo -e "${BLUE}🔗 Repository URL: https://github.com/${REPO_OWNER}/${REPO_NAME}${NC}"
echo -e "${BLUE}🔗 Actions URL: https://github.com/${REPO_OWNER}/${REPO_NAME}/actions${NC}"
echo -e "${BLUE}🔗 Settings URL: https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/branches${NC}"

# 🔐 Security Configuration Guide

## Problem: Protecting Secrets from Git

Your application contains **sensitive information** that should NEVER be pushed to GitHub:
- Database passwords
- JWT secret keys
- API keys and tokens

## Solution: Local Configuration Files

We use **local configuration files** that override the defaults only on your machine.

---

## 📁 Configuration File Strategy

### Files Pushed to GitHub ✅
- `application.properties` - Safe defaults, NO secrets
- `application.properties.example` - Template for others
- `.env.example` - Template for environment variables
- `.gitignore` - Ignores all local secret files

### Files NOT Pushed to GitHub ❌
- `application-local.properties` - Your actual database & JWT secrets
- `.env` - Your environment variables
- `application-dev.properties` - Local development config

These files are in `.gitignore` and stay on your machine only!

---

## 🚀 Setup for Local Development

### Step 1: Create Your Local Config File

Copy the example to your local config:

```bash
cd school-admin-backend/src/main/resources

# Copy the example
cp application.properties.example application-local.properties

# Edit with your actual credentials
nano application-local.properties  # or use your editor
```

### Step 2: Update Your Credentials

In `application-local.properties`, fill in your real values:

```properties
# YOUR ACTUAL DATABASE PASSWORD
spring.datasource.password=your_real_postgres_password

# YOUR ACTUAL JWT SECRET (generate a strong one)
app.jwt.secret=your_actual_secret_key_min_256_bits
```

### Step 3: Run with Local Profile

When running Spring Boot, activate the `local` profile:

**Option A: Maven**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
```

**Option B: IntelliJ IDEA**
1. Run → Edit Configurations
2. Add VM options: `-Dspring.profiles.active=local`
3. Run the application

**Option C: Eclipse**
1. Run → Run Configurations
2. Arguments → VM arguments: `-Dspring.profiles.active=local`

---

## 🔑 Generating a Secure JWT Secret

Generate a strong JWT secret key (min 256 bits):

```bash
# macOS/Linux
openssl rand -base64 32

# Example output:
# h8K2jL9pQ5xR2mN7vB4cD6eF8gH1iJ3kL5nO7pQ9sT1uV3xW5yZ7
```

Copy this value to `application-local.properties`:
```properties
app.jwt.secret=h8K2jL9pQ5xR2mN7vB4cD6eF8gH1iJ3kL5nO7pQ9sT1uV3xW5yZ7
```

---

## ✅ Verify Your Setup

Check that secrets are NOT in the committed files:

```bash
# This should show NO passwords or secrets
git show HEAD:school-admin-backend/src/main/resources/application.properties

# This should show the template
git show HEAD:school-admin-backend/src/main/resources/application.properties.example

# Verify local file is ignored
cat .gitignore | grep application-local
```

---

## 🔄 For Team Members

When someone clones your repository:

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/school-admin-system.git
   cd school-admin-system
   ```

2. **Create their local config**
   ```bash
   cd school-admin-backend/src/main/resources
   cp application.properties.example application-local.properties
   ```

3. **Edit with their credentials**
   ```bash
   # Fill in their PostgreSQL password & generate a new JWT secret
   nano application-local.properties
   ```

4. **Run with local profile**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=local"
   ```

---

## 📋 Checklist Before Every Push to GitHub

- ✅ No passwords in `application.properties` (should be empty/placeholder)
- ✅ No JWT secrets in `application.properties` (should be `${JWT_SECRET:...}`)
- ✅ `.env` file exists locally but NOT in Git
- ✅ `application-local.properties` exists locally but NOT in Git
- ✅ `.gitignore` includes all secret files

Run this to verify:
```bash
git status
# Should show: application-local.properties as ignored
# Should NOT show: application-local.properties as modified

git diff --cached school-admin-backend/src/main/resources/
# Should NOT contain any passwords or secrets
```

---

## 🆘 Oops! I Accidentally Pushed Secrets

If you accidentally pushed secrets:

```bash
# 1. Remove from Git history
git rm --cached school-admin-backend/src/main/resources/application.properties
echo "application-local.properties" >> .gitignore

# 2. Create safe version
cp application.properties.example application.properties
# Edit to remove all real secrets

# 3. Commit
git add .
git commit -m "Remove secrets from application.properties"
git push

# 4. ⚠️ ROTATE YOUR SECRETS
# Generate new JWT secret and update your database password!
```

---

## 🎯 Summary

| File | Push to GitHub? | Contains Secrets? | Purpose |
|------|---|---|---|
| `application.properties` | ✅ YES | ❌ NO | Safe defaults, pushed to repo |
| `application.properties.example` | ✅ YES | ❌ NO | Template for developers |
| `application-local.properties` | ❌ NO (in .gitignore) | ✅ YES | Your actual secrets (local only) |
| `.env` | ❌ NO (in .gitignore) | ✅ YES | Your environment variables (local only) |

**Golden Rule:** If it contains a password, secret, or API key → It should be in `.gitignore` ✅

---

**Your application is now secure! 🎉**

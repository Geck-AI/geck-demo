# 🛍️ THE STORE - E-commerce Demo App

> **A modern e-commerce application built for AI-powered testing with Geck**

<div align="center">

![NextJS](https://img.shields.io/badge/Built_with-NextJS_14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge)

</div>

---

## 🎯 Quick Start Guide

**Three simple steps to get started:**

1. **🚀 Setup** - Get the e-commerce app running locally
2. **🔧 Install** - Add the Geck plugin to your IDE  
3. **🧪 Test** - Run automated test cases with AI

This demo application showcases a complete e-commerce experience with user authentication, product browsing, shopping cart functionality, and order processing - perfect for testing modern web application flows.

---

## 🚀 Setup Sample E-commerce App

### Prerequisites
- Node.js 18+ installed
- Your favorite code editor (Cursor recommended)

### Installation Steps

1. **📋 Copy Environment Configuration**
   ```bash
   cp .env.example .env.development
   ```

2. **📦 Install Dependencies & Start Server**
   ```bash
   npm install
   npm run dev
   ```
   
   🎉 **Your app will be live at** [http://localhost:3005](http://localhost:3005)

---

## 🔧 Installing Geck Plugin

<div align="center">
<img src="https://img.shields.io/badge/Geck-AI_Powered_Testing-purple?style=for-the-badge&logo=robot" alt="Geck Plugin">
</div>

### 🛠️ Installation Process

| Step | Action | Details |
|------|--------|---------|
| **1️⃣** | **Open Extensions** | `Cmd+Shift+X` (Mac) or `Ctrl+Shift+X` (Windows/Linux) |
| **2️⃣** | **Search "Geck"** | Look for the official Geck extension by GeckAI |
| **3️⃣** | **Install** | Click install and wait for completion |
| **4️⃣** | **Setup Account** | Click Geck icon → Create account → Sign in |
| **5️⃣** | **Configure** | Add OpenAI API key in Geck settings |

### 🔑 Requirements & Dependencies

```yaml
System Requirements:
  - VS Code: ≥ 1.85
  - Node.js: ≥ 18
  - OpenAI API: Access to o3 and CUA models

Auto-Installed:
  - Playwright: Installs on first run
  - Browser drivers: You may not to install relevant browsers if you want to test on them
  ```

### ✅ Verification Checklist

After successful installation, you should see:

- [ ] 🎯 Geck icon in your sidebar
- [ ] 📂 `.geck/` directory in project root (once you open plugin)  
- [ ] ⚙️ Geck settings panel accessible (`Geck: Settings` in command pallet)
- [ ] 🔑 API key validation passes (settings page)
- [ ] 🎭 Playwright installation confirmed (settings page)

### 🚨 Troubleshooting

<details>
<summary><strong>🔧 Geck Sidebar Not Loading?</strong></summary>

Try these solutions in order:

1. **🔄 Restart Cursor** (close and reopen completely)
2. **🔍 Check Console**: Help → Toggle Developer Tools → Console
3. **♻️ Reinstall**: Disable extension → Re-enable extension  
4. **📱 Get Help**: Contact `support@geck.ai`

</details>

---

## 🧪 Using Geck Plugin

<div align="center">
<img src="https://img.shields.io/badge/Write_Tests_In-Plain_English-green?style=for-the-badge&logo=openai" alt="Plain English Tests">
</div>

### 🎨 How It Works

1. You write what you want to test in plain english. 
2. Geck will generate "steps" to accoplish what you want to test.
3. Execute the test; once each step completes the status will turn green on those steps. If the test fails, you know exactly at which step the test failed. 

### 📋 Pre-built Test Cases

Your workspace comes with **15 comprehensive test cases** covering:

| Category | Tests | Coverage |
|----------|-------|----------|
| 🔐 **Authentication** | 3 tests | User Registration, Valid Login, Invalid Login |
| 🧭 **Navigation** | 4 tests | Home Page Elements, Logo Navigation, Cart Navigation, Category Filters |
| 📱 **Product Views** | 3 tests | Product Detail Page, PDP Back Navigation, Product Not Found |
| 🛒 **Shopping Cart** | 3 tests | Add to Cart, Cart Item Management, Empty Cart |
| 💳 **Checkout** | 2 tests | Simple Checkout, Checkout Form Validation |

### 🎮 Getting Started

1. **📂 Open Geck Sidebar**
   - Click the Geck icon in sidebar, or
   - Use command palette: `Open Geck Sidebar`

2. **👤 Register (One-time)**
   - Free access for one year
   - Enter OTP when prompted

3. **🔍 Explore Test Cases**
   - Tests auto-populate from `/test` folder
   - Organized by category in JSON files: `authentication-testcases.json`, `navigation-testcases.json`, `product-viewing-testcases.json`, `shopping-cart-testcases.json`, `checkout-testcases.json`


### ▶️ Execution Options

| Option | Description | Best For |
|--------|-------------|----------|
| **🎬 Browser Mode** | Visual execution | Debugging, Learning |
| **👻 Headless Mode** | Background execution | CI/CD, Batch Testing |
| **🤖 CUA Model** | Advanced AI agent | Complex workflows |
| **⚡ Code Generation** | Fast execution | Simple test cases |

### 🔧 Configuration

Access settings via `Geck: Settings`:
- **Execution Mode**: Browser vs Headless
- **AI Model**: CUA vs Code Generation  
- **Log Level**: Debug, Info, Error
- **API Keys**: OpenAI configuration

---

## 🆘 Support & Resources

<div align="center">

| Resource | Link |
|----------|------|
| 📧 **Support Email** | `support@geck.ai` |
| 📁 **Logs Location** | `.geck/logs/` folder |
| 🛠️ **Developer Tools** | Help → Toggle Developer Tools |

</div>

---

## 🎉 What's Next?

1. **🏃‍♂️ Run your first test** - Try the authentication flow
2. **✏️ Customize tests** - Modify existing cases for your needs  
3. **🚀 Scale up** - Add more complex user scenarios
4. **🔄 Integrate** - Connect with your CI/CD pipeline

<div align="center">

**Happy Testing with Geck! 🦎✨**

</div>
## Requirements

1. Node version >= 8.0.0
2. A running MongoDB instance

## Setup

Clone the project with [degit](https://github.com/Rich-Harris/degit)

```bash
npm install -g degit
degit mwardle/authentication-tutorial
cd authentication-tutorial
```

Install dependencies:

```bash
npm install
```

Create a `.env` file for your configuration with contents similar to the following:

```txt
# disable secure cookies for dev
MYAPP_SECURE_COOKIES=false
# secrets for cookie signing, current one comes first
MYAPP_COOKIE_SECRETS='["thisisasecret"]'
# no proxy in dev, change for production if using nginx, etc.
MYAPP_TRUST_PROXY=false
# mongodb database connection string for session data
MYAPP_MONGODB_SESSION_URI=mongodb://127.0.0.1:27017/myappsessions
# mongodb database connection string for application data
MYAPP_MONGODB_URI=mongodb://127.0.0.1:27017/myapp

```

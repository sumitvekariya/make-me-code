---
title: 'Firebase Hosting: Preview and Deploy via GitHub Actions'
description: Preview and Deploy your Angular or Scully app on Firebase Hosting automated via GitHub Actions
published: true
publishedAt: 2020-11-09T11:58:00.000Z
updatedAt: 2020-11-09T11:58:00.000Z
tags:
  - Firebase
  - Angular
  - GitHub
  - Scully
keywords:
  - CI/CD
  - Hosting
  - Jamstack
  - Tailwind CSS
authors:
  - Marc Stammerjohann
github: https://github.com/notiz-dev/angular-scully-tailwindcss
---

You start building an [Angular](https://notiz.dev/blog/angular-10-with-tailwindcss) or a [Scully](https://notiz.dev/blog/jamstack-angular-scully-tailwind-css) application and at some point you want to invite colleagues, friends, family or customers to check it out. [Firebase Hosting](https://firebase.google.com/docs/hosting/use-cases#what_is_firebase_hosting) allows to host your static or dynamic web apps for **FREE** 💸. You are setting up a GitHub workflow deploying your Scully app (works with Angular and any other web framework) to **preview** and **live** channel. 

Demo [source code](https://github.com/notiz-dev/angular-scully-tailwindcss) and [hosted](https://angular-scully-tailwindcss.web.app/blog) on Firebase 🔥.

Before you dive straight into this you will need a

* [Firebase Account](https://console.firebase.google.com/)
* [GitHub Account](https://github.com/join) and a private or public repo for your web app

Use your existing web application or create a new one by following [Angular 10 with Tailwind CSS](https://notiz.dev/blog/angular-10-with-tailwindcss) or [Jamstack: Angular + Scully + Tailwind CSS](https://notiz.dev/blog/jamstack-angular-scully-tailwind-css) to get started.

## Getting started

Install [Firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) minimum in `v8.12.0` for [preview channels](https://firebase.googleblog.com/2020/10/preview-channels-firebase-hosting.html) support.

<div shortcode="code" tabs="BASH">

```bash
# install firebase cli
npm install -g firebase-tools

# init firebase hosting
firebase init hosting
# hosting already setup, prepare GitHub workflow
firebase init hosting:github
```

</div>

Follow the CLI prompts to setup Firebase hosting and GitHub workflow.

<div shortcode="figure" caption="Hosting Setup">

![Hosting Setup](assets/img/blog/firebase-hosting-preview-deploy/firebase-hosting-setup.gif)

</div>

## Firebase Hosting Setup

Start by selecting an **existing** Firebase project, create one in [Firebase console](https://console.firebase.google.com/), or create a **new** project through the CLI.

Next enter the public directory containing all files of your web app including `index.html` which is uploaded to Firebase hosting

<div shortcode="code" tabs="BASH">

```bash
# Angular
dist/<project-name>

# Scully `outDir` specified in your scully.<project-name>.ts defaults to
dist/static
```

</div>

You can change the `public` directory anytime in `firebase.json` file.

Answer the next question "Configure as a single-page app (rewrite all urls to /index.html)?" with **yes** for Angular apps (and other single-page apps) and **no** for Scully apps (and other static-site apps).

Let Firebase CLI initialize your GitHub repository for [automatic deploys](https://firebase.google.com/docs/hosting/github-integration#set-up). Several steps are taken care by the Firebase CLI for you

* Creating a Firebase service account with deployment permissions to Firebase Hosting
* Encrypt and add secret to GitHub repository
* Creating GitHub workflow `yaml` files

Enter **no** for the next two questions to overwrite `dist/static/404.html` and `dist/static/index.html`, let those be generated by Scully.

Select a GitHub repository to setup your secret token for your workflow and enter a build script to build Angular and Scully like `npm ci && npm run build:ci`. For a Scully build add the following two scripts to your `package.json`:

<div shortcode="code" tabs="package.json">

```json
"build:ci": "npm run build:prod && npm run scully:ci"
"scully:ci": "scully -- --host='0.0.0.0' --scanRoutes --serverTimeout=60000",
```

</div>

If you like to deploy to live channel on merged Pull Request answer with **yes** and enter your branch name for the live channel for example `main`. 

## GitHub Workflow

You should have now two workflows if you used the Firebase CLI. The workflows use the GitHub Action [Deploy to Firebase Hosting](https://github.com/marketplace/actions/deploy-to-firebase-hosting), currently in **alpha** release.

Workflow to deploy to a preview channel on Pull Request `.github/workflows/firebase-hosting-pull-request.yml`

<div shortcode="code" tabs="firebase-hosting-pull-request.yml">

```yaml
# This file was auto-generated by the Firebase CLI
# https://github.com/firebase/firebase-tools

name: Deploy to Firebase Hosting on PR
'on': pull_request
jobs:
  build_and_preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: 'npm ci && npm run build:ci'
      # Add additional build steps here
      # - run: ...
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-firebase-project-id
          # default expire value 7 days
          # expires: 7d
        env:
          FIREBASE_CLI_PREVIEWS: hostingchannels
```

</div>

Workflow to deploy to your live channel on push to `main` branch `.github/workflows/firebase-hosting-merge.yml`

<div shortcode="code" tabs="firebase-hosting-merge.yml">

```yaml
# This file was auto-generated by the Firebase CLI
# https://github.com/firebase/firebase-tools

name: Deploy to Firebase Hosting on merge
'on':
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: 'npm ci && npm run build:ci'
      # Add additional build steps here
      # - run: ...
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-firebase-project-id
        env:
          FIREBASE_CLI_PREVIEWS: hostingchannels
```

</div>

Deploying to the live channel requires `channelId` set to `live`. If left blank the action creates a new preview channel using the PR-branch name. 

Additional option for the preview channel is `expires` which defaults to 7 days. Change the [expiration](https://firebase.google.com/docs/hosting/manage-hosting-resources#preview-channel-expiration) of your preview channel to maximum 30 days. It supports the syntax `h` for hours, `d` for days and `w` for weeks, for example `19h`, `30d`, `3w`.

## Preview and Live Channel

Create a Pull Request with the above GitHub workflows and you should see the GitHub Action start building

<div shortcode="figure" caption="GitHub Action run on Pull Request">

![GitHub Action run on Pull Request](assets/img/blog/firebase-hosting-preview-deploy/optimized/github-action-pull-request-building.png)

</div>

After the workflow finished successfully, the Firebase action creates a comment with the preview URL for this PR.

<div shortcode="figure" caption="Preview URL created by Firebase Action">

![Preview URL created by Firebase Action](assets/img/blog/firebase-hosting-preview-deploy/optimized/preview-url-created-by-firebase-action.png)

</div>

View the preview of your web app, if you are not happy with your changes repeat it. Here is the Scully demo blog in the preview channel on Firebase Hosting.

<div shortcode="figure" caption="Preview on Firebase Hosting">

![Preview URL created by Firebase Action](assets/img/blog/firebase-hosting-preview-deploy/optimized/scully-preview-on-firebase-hosting.png)

</div>

Finally, merge your Pull Request to trigger the deployment to the live channel. Find the [Scully demo blog](https://angular-scully-tailwindcss.web.app/blog) on the live channel.

It was never easier to ship improvements to your web application to preview, ask colleagues or customers for a review 👌❓ and simply deploy your changes to the live channel 🚀 by merging your PR. 
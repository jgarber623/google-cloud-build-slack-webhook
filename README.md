# google-cloud-build-slack-webhook

**Send [Google Cloud Build](https://cloud.google.com/cloud-build/) notifications to [Slack](https://slack.com) using [Google Cloud Functions](https://cloud.google.com/functions/).**

[![Dependencies](https://img.shields.io/depfu/jgarber623/google-cloud-build-slack-webhook.svg?style=for-the-badge)](https://depfu.com/github/jgarber623/google-cloud-build-slack-webhook)

<img src="https://raw.githubusercontent.com/jgarber623/google-cloud-build-slack-webhook/master/screenshot.png" alt="Screenshot of a Slack channel displaying Google Cloud Build notifications" width="50%">

## Getting Started

Before using google-cloud-build-slack-webhook, you'll need to have a few things squared away:

1. a [Google Cloud](https://cloud.google.com) account,
1. an application built with Google Cloud Build,
1. a Slack workspace (with permissions to create [Incoming Webhooks](https://api.slack.com/incoming-webhooks)),
1. the [Google Cloud SDK](https://cloud.google.com/sdk/docs/) installed on your cmoputer,
1. [Node.js](https://nodejs.org) installed on your computer, and
1. comfort with the command line.

_**Note:** For this walkthrough, we'll use `indieweb-endpoints-cc` as the Google Cloud project ID. You'll want to substitute that value with your own project's ID._

## Installation and Configuration

With Node.js installed, clone this repository and run `npm install` to install the project's dependencies.

_**Note:** Give the Google Cloud Build documentation article [Configuring notifications for third-party services](https://cloud.google.com/cloud-build/docs/configure-third-party-notifications) a read. It's a solid rundown of the steps necessary to set up notifications to Slack using webhooks. The following are a few customized steps for deploying google-cloud-build-slack-webhook._

First, follow the steps outlined in the documentation linked above to create a new Incoming Webhook in your Slack workspace. With the webhook's URL, create a `.env` file in the root of this project:

```bash
cp .env{.sample,}
```

Populate the `.env` file with your project's GitHub repository URL and your newly-created Slack webhook URL:

```text
GITHUB_REPO_URL=https://github.com/jgarber623/indieweb-endpoints.cc
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx/xxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```

Using the Google Cloud SDK, set the current project:

```bash
gcloud config set project indieweb-endpoints-cc
```

Next, export a unique `BUCKET_NAME` variable. This will be used when creating and interacting with a bucket on [Google Cloud Storage](https://cloud.google.com/storage/). Bucket names must be globally unique (thus the `date | md5 | cut -c -10` bits borrowed from [Philippe Modard's `setup.sh` script](https://github.com/Philmod/google-cloud-build-slack/blob/master/setup.sh)).

```bash
export BUCKET_NAME=$(gcloud config get-value project)_cloudbuild_webhook_$(date | md5 | cut -c -10)
```

_**Note:** You'll want to keep this bucket name handy for future command line sessions. Keep it somewhere safe!_

Use `gsutil` to create the bucket on Google Cloud Storage:

```bash
gsutil mb gs://$BUCKET_NAME
```

You should now be able to deploy to Google Cloud Functions:

```bash
npm run deploy
```

If all goes well, you'll now receive notifications of Slack when Google Cloud Build runs on your project!

## Acknowledgments

The following documentation and projects served as guides and inspiration for the development of google-cloud-build-slack-webhook:

- Google Cloud Build documentation's [Configuring notifications for third-party services](https://cloud.google.com/cloud-build/docs/configure-third-party-notifications)
- Google Cloud Build's [Build Resource documentation](https://cloud.google.com/cloud-build/docs/api/reference/rest/Shared.Types/Build)
- Slack's [@slack/webhook](https://slack.dev/node-slack-sdk/webhook) Node.js module
- Slack's [Messaging for Slack apps](https://api.slack.com/messaging) documentation
- Philippe Modard's [google-cloud-build-slack](https://github.com/Philmod/google-cloud-build-slack) project

google-cloud-build-slack-webhook is written and maintained by [Jason Garber](https://sixtwothree.org).

## License

google-cloud-build-slack-webhook is freely available under the [MIT License](https://opensource.org/licenses/MIT). Use it, learn from it, fork it, improve it, change it, tailor it to your needs.

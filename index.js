require('dotenv').config();

const { IncomingWebhook } = require('@slack/webhook');
const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

const statusCodes = {
  CANCELLED: {
    color: '#fbbc05',
    text: 'Build cancelled'
  },
  FAILURE: {
    color: '#ea4335',
    text: 'Build failed'
  },
  INTERNAL_ERROR: {
    color: '#ea4335',
    text: 'Internal error encountered during build'
  },
  QUEUED: {
    color: '#fbbc05',
    text: 'New build queued'
  },
  SUCCESS: {
    color: '#34a853',
    text: 'Build successfully completed'
  },
  TIMEOUT: {
    color: '#ea4335',
    text: 'Build timed out'
  },
  WORKING: {
    color: '#34a853',
    text: 'New build in progress'
  }
};

const createSlackMessage = (build) => {
  let statusMessage = statusCodes[build.status].text;
  // let branchName = build.source.repoSource.branchName;
  let branchName = build.substitutions.BRANCH_NAME;
  // let commitSha = build.sourceProvenance.resolvedRepoSource.commitSha.substring(0,7);
  let commitSha = build.substitutions.SHORT_SHA;

  return {
    text: `${statusMessage} for *${build.projectId}*.`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${statusMessage} for *${build.projectId}*.`
        }
      }
    ],
    attachments: [
      {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Build Log:* <${build.logUrl}|${build.id}>`
            }
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `*Branch:* <${process.env.GITHUB_REPO_URL}/tree/${branchName}|${branchName}>`
              },
              {
                type: 'mrkdwn',
                text: `*Commit:* <${process.env.GITHUB_REPO_URL}/commit/${commitSha}|${commitSha}>`
              }
            ]
          }
        ],
        color: statusCodes[build.status].color
      }
    ]
  };
};

module.exports.subscribe = async (event) => {
  const build = JSON.parse(Buffer.from(event.data, 'base64').toString());
  const message = createSlackMessage(build);

  await webhook.send(message);
};

# Bolt for JavaScript (TypeScript) Template App

This is a generic Bolt for JavaScript (TypeScript) template app used to build out Slack apps.

Before getting started, make sure you have a development workspace where you have permissions to install apps. If you don’t have one setup, go ahead and [create one](https://slack.com/create).

## Installation

#### Create a Slack App

1. Open [https://api.slack.com/apps/new](https://api.slack.com/apps/new) and choose "From an app manifest"
2. Choose the workspace you want to install the application to
3. Copy the contents of [manifest.json](./manifest.json) into the text box that says `*Paste your manifest code here*` (within the JSON tab) and click _Next_
4. Review the configuration and click _Create_
5. Click _Install to Workspace_ and _Allow_ on the screen that follows. You'll then be redirected to the App Configuration dashboard.

#### Environment Variables

Before you can run the app, you'll need to store some environment variables.

1. Copy [`.env.example`](./.env.example) to [`.env`](./.env)
2. Open your apps configuration page from [this list](https://api.slack.com/apps). On the _Basic Information_ tab, copy the _Signing Secret_ into your `.env` file under `SLACK_SIGNING_SECRET`. Then click _OAuth & Permissions_ in the left hand menu, then copy the _Bot User OAuth Token_ into your `.env` file under `SLACK_BOT_TOKEN`.


#### Prepare for Local Development

1. In the terminal run `slack app link`
2. Copy your App ID from the app you just created
3. Open your [`hooks.json`](./.slack/hooks.json) file under `/.slack/hooks.json` and add a `start` hook:
```json
{
  "hooks": {
    "get-hooks": "npx -q --no-install -p @slack/cli-hooks slack-cli-get-hooks",
    "start": "pnpm dev"
  }
}
```
4. Open your [`config.json`](./.slack/config.json) file under `/.slack/config.json` and update your manifest source to `local`.
```json
{
  "manifest": {
    "source": "local"
  },
  "project_id": "532d5129-2ac9-4605-a109-33b93e3f7472"
}
```
5. Start your local server with automatic tunneling using the `pnpm dev:tunnel` command. You can also use the generic `slack run` command if you do not want automatic tunneling and manifest updates.

6. Open your Slack workspace and add your new Slackbot to a channel. Send the message `hi` and your Slackbot should respond with `hi, how are you?`. 

## Project Structure

### [`manifest.json`](./manifest.json)

[`manifest.json`](./manifest.json) is a configuration for Slack apps. With a manifest, you can create an app with a pre-defined configuration, or adjust the configuration of an existing app.

### [`/src/app.ts`](./src/app.ts)

[`app.ts`](./src/app.ts) is the entry point of the application. This file is kept minimal and primarily serves to route inbound requests.

[`/src/listeners`](./src/listeners)

Every incoming request is routed to a "listener". Inside this directory, we group each listener based on the Slack Platform feature used, so [`/listeners/shortcuts`](./src/listeners/shortcuts/index.ts) handles incoming [Shortcuts](https://api.slack.com/interactivity/shortcuts) requests, [`/listeners/views`](./src/listeners/views/index.ts) handles [View submissions](https://api.slack.com/reference/interaction-payloads/views#view_submission) and so on.

### [`/src/server`](./src/server)

This is your nitro server directory. Inside you have an [`api`](./src/server/api) folder that contains a [`events.post.ts`](./src/server/api/events.post.ts) file. This matches the request URL's defined in your [`manifest.json`](./manifest.json) file. Nitro uses file based routing for incoming requests. You can learn more about this [here](https://nitro.build/guide/routing).
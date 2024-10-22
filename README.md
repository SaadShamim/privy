This is the clientside frontend for the seedclub telegram app. It is incharge of auth, and wallet connect logic that integrates privy, aswell as making backend calls to our system.

# Guides

## Bot Deployment

### Bot Setup

- Use bot father on telegram to setup the bot
- to register the bot endpoint (webhook) use get request to register the bot:

  `https://api.telegram.org/bot{api_token}/setWebhook?url{url}`

  for example: `https://api.telegram.org/bot7497657938:AAHKJA-1TkQWCXORh3j75IWMjN2m72xz0pI/setWebhook?url=https://ec25-50-100-63-5.ngrok-free.app/telegram-webhook`

- this will trigger the /telegram-webhook endpoint on every bot message from the user

### Frontend Setup

# Environment Setup

Create a `.env.local` file in the `apps/dashboard` directory with the following variables:

```env
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxx
RESEND_AUDIENCE_ID=your-audience-id-here
```

## Getting Your Resend Credentials

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Create an audience and copy the audience ID
4. Add both values to your `.env.local` file

## Running the App

```bash
cd apps/dashboard
bun dev
```

The landing page will be available at http://localhost:3000


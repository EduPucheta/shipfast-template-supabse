# ShipFast — Javascript

Hey maker 👋 it's Marc from [ShipFast](https://shipfa.st/docs). Let's get your startup off the ground, FAST ⚡️

<sub>**Watch/Star the repo to be notified when updates are pushed**</sub>

## Get Started

1. Follow the [Get Started Tutorial](https://shipfa.st/docs) to clone the repo and run your local server 💻

<sub>**Looking for the /pages router version?** Use this [documentation](https://shipfa.st/docs-old) instead</sub>

2. Follow the [Ship In 5 Minutes Tutorial](https://shipfa.st/docs/tutorials/ship-in-5-minutes) to learn the foundation and ship your app quickly ⚡️

## Links

- [📚 Documentation](https://shipfa.st/docs)
- [📣 Updates](https://shipfast.beehiiv.com/)
- [🧑‍💻 Discord](https://shipfa.st/dashboard)

## Support

Reach out to me on [Twitter](https://twitter.com/marc_louvion) or marc@shipfa.st

\_

Let's ship it, FAST ⚡️

P.S.

- Want to showcase your startups? Get your [Indie Page](https://indiepa.ge?ref=shipfast_readme) and share your entrepreneur's journey. Join 3,132 founders ⭐️
- Don't get banned from Stripe for 1 dispute. Use [ByeDispute](https://byedispute.com/?ref=shipfast_readme) to prevent them from happenening 🛡️
- Make your launch go viral and get your first customers with [LaunchViral](https://launchvir.al/?ref=shipfast_readme) 🚀

# Feedback Widget Integration Guide

This guide explains how to integrate the feedback widget into your website.

## Installation

1. Add the following script to your website's HTML, just before the closing `</body>` tag:

```html
<script src="https://your-domain.com/widget.js?space_id=YOUR_SPACE_ID"></script>
```

2. Replace `YOUR_SPACE_ID` with your actual space ID from the Feedbackito dashboard.

## Features

- **Flexible Positioning**: Choose between bottom-right corner or right-side centered positioning
- Floating feedback button with customizable themes
- Star or heart rating system
- Optional comment field
- Mobile-responsive design
- Secure iframe integration

## Widget Positioning

The widget supports two positioning options that you can configure when creating or editing surveys:

### 1. Bottom Right (Default)
- Position: Bottom-right corner of the screen
- Best for: Most general use cases
- CSS: `bottom: 20px; right: 20px;`

### 2. Right Side (Centered)
- Position: Right side of the screen, vertically centered
- Best for: Websites with important content at the bottom
- CSS: `right: 20px; top: 50%; transform: translateY(-50%);`
- Similar to: Hotjar positioning

## Configuration

To change your widget position:

1. Go to your Feedbackito dashboard
2. Click **"Create New Survey"** or edit an existing survey
3. In the **Customization** section, select your preferred **Widget Position** from the dropdown
4. Save your survey

The widget will automatically reposition based on your selection without requiring any changes to your website code.

## Why Survey-Level Configuration?

Widget positioning is configured at the **survey level** rather than the space level because:

- **Different surveys** might need different positioning strategies
- **A/B testing** different positions for different surveys
- **Survey-specific positioning** based on content or target audience
- **More granular control** over user experience
- **Better alignment** with survey-specific settings like themes and targeting

## Customization

The widget supports the following themes:
- light
- dark
- cupcake
- bumblebee
- emerald
- corporate
- synthwave
- retro
- cyberpunk
- valentine
- halloween
- garden
- forest
- aqua
- lofi
- pastel
- fantasy
- wireframe
- black
- luxury
- dracula
- cmyk
- autumn
- business
- acid
- lemonade
- night
- coffee
- winter
- dim
- nord
- sunset

## Security

The widget is loaded in an iframe for security and isolation. Communication between the widget and the parent window is handled through secure postMessage events.

## Testing

You can test the different widget positions using our demo page:
- [Widget Position Test Page](/test-widget-positions.html)

## Support

For support or questions, please contact us at support@your-domain.com.

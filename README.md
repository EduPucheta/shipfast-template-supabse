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

This guide explains how to integrate the feedback widget into your website with domain-specific targeting.

## Installation

1. Add the following script to your website's HTML, just before the closing `</body>` tag:

```html
<script src="https://your-domain.com/widget.js"></script>
```

2. Configure your surveys in the dashboard to target specific domains or allow all websites.

## Features

- **Domain-specific targeting**: Each survey can be configured to appear only on specific websites
- Floating feedback button in the bottom-right corner
- Customizable themes
- Star or heart rating system
- Optional comment field
- Mobile-responsive design
- Secure iframe integration

## Domain Targeting

When creating surveys, you can choose between:

### All Websites (No Restrictions)
- The survey will appear on any website where the tracking code is installed
- Useful for global surveys or when you control all the websites

### Specific Websites or Domains
- Configure the survey to appear only on specific domains or URLs
- Perfect for targeting different surveys to different websites
- Supports multiple targeting formats:
  - `example.com` - Matches example.com and all subdomains
  - `www.example.com` - Matches only www.example.com
  - `https://example.com/shop` - Matches specific pages
  - `localhost` - Useful for development testing

### How Multiple Surveys Work
- Only one survey will be displayed per domain at a time
- If multiple surveys match a domain, the most recently created active survey will be shown
- You can have different surveys for different domains using the same tracking code
- Example: Survey A for `shop.example.com`, Survey B for `blog.example.com`, Survey C for all other domains

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

## Support

For support or questions, please contact us at support@your-domain.com.

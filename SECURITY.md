# Security policy

## Supported versions

| Version | Supported |
|---|---|
| 1.0.x | Yes |

## Reporting

Please report security issues through GitHub's private security advisory flow for `omxreedit/omjapan` if private reporting is available for this repository; otherwise contact the maintainer through the channels listed in the repository README. Do not publish exploit details before a fix is available.

## Scope and design notes

- The app has no account, server API, advertisement SDK or analytics upload.
- Learning content is local; native capabilities are exposed through a narrow `OmBridge`.
- Release signing material is generated outside the repository and is never committed.
- External links open with `ACTION_VIEW` and are limited to verified HTTPS URLs in bundled data.

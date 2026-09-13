# Security Policy

## Supported Versions

The following versions of **CV Template** currently receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

---

## Architectural Security & Privacy Model

**CV Template** was designed with security and data sovereignty as fundamental core requirements:

1. **100% Client-Side Execution**:
   - The application does not transmit any resume data, personal details, contact information, employment histories, or uploaded avatars to any external server.
   - All persistence is maintained strictly within the browser's local sandbox via `localStorage`.

2. **No Third-Party Analytics or Trackers**:
   - Zero telemetry, tracking scripts, ad pixels, or third-party cookies exist in the codebase.

3. **Content Sanitization**:
   - All user inputs rendered into template previews are escaped or rendered safely via strict DOM property binding to prevent Cross-Site Scripting (XSS).

4. **Offline Capability**:
   - The application functions 100% offline once cached by the Service Worker, ensuring documents can be authored and exported in air-gapped environments.

---

## Reporting a Vulnerability

If you discover a security issue or vulnerability in CV Template, please do not open a public GitHub issue.

Instead, please report it privately:
- Email the maintainers directly or use GitHub's private vulnerability reporting feature on the repository.
- Include detailed steps to reproduce the vulnerability, along with sample input payloads or environment details.
- Maintainers will acknowledge receipt within 48 hours and coordinate a fix and advisory release.

Thank you for helping keep our software secure!

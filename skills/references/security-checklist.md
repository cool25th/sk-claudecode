# Security Checklist

Quick reference for security hardening. Use alongside `security-review`, `cloud-security`, and `shipping` skills.

## Input Handling
- [ ] All user input validated at system boundaries
- [ ] No injection vectors (SQL, NoSQL, OS command, LDAP)
- [ ] HTML output encoded to prevent XSS
- [ ] File uploads restricted by type, size, and content
- [ ] URL redirects validated against an allowlist

## Authentication & Authorization
- [ ] Passwords hashed with strong algorithm (bcrypt, scrypt, argon2)
- [ ] Sessions managed securely (httpOnly, secure, sameSite cookies)
- [ ] Authorization checked on every protected endpoint
- [ ] No IDOR vulnerabilities (users can't access other users' resources)
- [ ] Password reset tokens time-limited and single-use
- [ ] Rate limiting on authentication endpoints
- [ ] Multi-factor authentication for sensitive operations

## Data Protection
- [ ] Secrets in environment variables (not code)
- [ ] Sensitive fields excluded from API responses and logs
- [ ] Data encrypted in transit (HTTPS)
- [ ] Data encrypted at rest (if required)
- [ ] `.env` files in `.gitignore`
- [ ] No secrets in git history

## API Security
- [ ] CORS configured to specific origins (not wildcard `*`)
- [ ] Rate limiting on all public endpoints
- [ ] Request size limits configured
- [ ] API keys rotated regularly
- [ ] Webhook endpoints verify signatures

## HTTP Headers
- [ ] `Strict-Transport-Security` (HSTS)
- [ ] `Content-Security-Policy` (CSP)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: DENY` (or CSP `frame-ancestors`)
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`

## Dependencies
- [ ] `npm audit` shows no critical or high vulnerabilities
- [ ] Dependencies updated regularly
- [ ] Lock file committed (`package-lock.json`)
- [ ] No deprecated packages with known vulnerabilities

## Error Handling
- [ ] Error messages don't expose internals (stack traces, SQL, file paths)
- [ ] Generic error responses for authentication failures
- [ ] Errors logged server-side with context
- [ ] Client sees user-friendly error messages

## Session Management
- [ ] Sessions expire after inactivity
- [ ] Sessions invalidated on password change
- [ ] Session tokens are sufficiently random
- [ ] Concurrent session limits (if applicable)

## Logging & Monitoring
- [ ] Security events logged (login attempts, permission denials)
- [ ] Logs don't contain sensitive data (passwords, tokens, PII)
- [ ] Alerts configured for suspicious activity
- [ ] Log retention policies defined

## OWASP Top 10 Quick Check

| Risk | Mitigation |
|------|-----------|
| Injection | Parameterized queries, input validation |
| Broken Auth | Strong hashing, rate limiting, MFA |
| Sensitive Data Exposure | Encryption, minimized API responses |
| XXE | Disable external entity processing |
| Broken Access Control | Check authorization on every request |
| Security Misconfiguration | Security headers, no defaults |
| XSS | Output encoding, CSP |
| Insecure Deserialization | Validate and sanitize |
| Known Vulnerabilities | `npm audit`, update dependencies |
| Insufficient Logging | Log security events, monitor alerts |

# Evaluator Documentation - Internship Readiness Audit

This document is for the assessment evaluator to understand the design, architecture, and intentional defects built into the **AI-Assisted Service Request Management System**.

---

## 1. Architecture Overview

The system is configured as a Monorepo workspace containing:
- **Client**: Single Page React app structured via Vite, TypeScript, and Tailwind CSS.
- **Server**: Node.js + Express + TypeScript service using MongoDB (Mongoose) for object storage.
- **AI Analyzer**: Mocked deterministic AI text-analyzer returning ticket categorization and suggested priority details.

---

## 2. Intentionally Introduced Defects

| Issue ID | Area | Severity | Symptom | Expected Candidate Discovery & Fix |
|---|---|---|---|---|
| **AUTH-01** | Auth | High | Plaintext Password Storage | Registration inserts raw password into `passwordHash`. Candidates must integrate `bcryptjs` hashing. |
| **AUTH-02** | Auth | High | Token Key Mismatch | Login endpoint returns key `accessToken` but frontend parses `token`. Candidates must align response keys. |
| **AUTH-03** | Auth | High | Session Lost on Refresh | `AuthContext` useEffect reads from `token` but `login()` saves to `user_session_token`. Candidates must align key names. |
| **SEC-01** | Security | Critical | Registration Privilege Escalation | Dropdown on Register page permits setting role to `ADMIN`. Candidates must delete the dropdown and force `USER` role. |
| **SEC-02** | Security | Critical | Broken Object Level Auth (IDOR) | `/requests` routes lack ownership filtering, allowing users to view and edit tickets belonging to others. Candidates must check request ownership. |
| **AI-01** | AI | Medium | AI Endpoint 404 | Frontend requests `/ai/analyze` but backend registers `/ai/analyze-request`. Candidates must match endpoint names. |
| **AI-02** | AI | Medium | AI Response Key Mismatch | Frontend reads `aiSummary` but backend returns `summary`. Candidates must match response properties. |
| **AI-03** | AI | High | Database Enum validation crash | AI suggests priority `"CRITICAL"` for general inquiries. Submitting this crashes database validation. Candidates must return valid priorities. |
| **CORS-01** | CORS | High | CORS Request Blocked | Origin contains trailing slash (`http://localhost:3000/`) and methods omit `PUT`/`PATCH`. Candidates must clean CORS headers and options. |
| **UX-01** | UX | Low | stuck Loading state | AI analyzer and profile update buttons remain permanently in loading state if the request fails. Candidates must add proper error catch handlers resetting states. |
| **SEED-01** | Seed | Low | Seed Script Fails | Seed script requires `DB_SEED_MODE=active` to run. Candidates must add this env variable. |

---

## 3. Technical Defence Questions

During the candidate presentation, ask:
1. **Explain the CORS preflight issue**: "Why did the status update fail on the browser even though the backend console registered no errors?"
   * *Expected Answer*: The browser blocked the preflight OPTIONS request because the backend CORS middleware didn't authorize `PUT`/`PATCH` methods and was missing the `Authorization` allowed header.
2. **Explain the database validation crash**: "What caused the backend to crash when submitting a generic ticket after getting AI suggestions?"
   * *Expected Answer*: The AI engine returned `"CRITICAL"` for priority, which is not defined in the `ServiceRequest` Mongoose schema priorities enum, triggering a validation failure.
3. **What is BOLA / IDOR and how did you resolve it?**: "Why was it possible for standard users to see or cancel other employees' tickets?"
   * *Expected Answer*: The query in `/requests` was fetching all documents instead of filtering by the logged-in user's ID (`req.user.id`).

---

## 4. Scoring Guidelines

- **Minimal (0-30%)**: App builds but fails to run. Seed script is not configured, or environment CORS blocks requests.
- **Functional (31-60%)**: Login, registration, and basic ticket creation work. AI panel displays returned details but BOLA remains unfixed.
- **Advanced (61-90%)**: Gaps resolved. Session remains active on refresh. Data is isolated correctly.
- **Outstanding (91-100%)**: Code includes regression tests covering BOLA and invalid priorities, clean error handling, and robust input validation.

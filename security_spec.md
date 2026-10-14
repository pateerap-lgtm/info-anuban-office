# Security Specification for School Management Portal

## Data Invariants
1. Settings: The `/settings/general` document contains global public configurations (schoolName, affiliation, logoUrl, bgUrl, columns, adminPin). Any visitor can read the configuration to render the portal.
2. Cards: Documents in `/cards/{cardId}` store school management system links. Any visitor can read active cards to click through to system URLs.
3. Card validation requires valid URL format, title length constraints, and numeric order.

## Firestore Rules Design
- Public read access for settings and cards.
- Safe update/create validation enforcing maximum lengths and types to prevent malformed injections.

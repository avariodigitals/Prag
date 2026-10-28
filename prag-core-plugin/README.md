Prag Core 1.2.0 adds shared user access enforcement and welcome emails.

Install the entire `prag-core-plugin` folder on Central, including both PHP files. Deploy the corresponding Prag-Admin changes alongside it. No changes are needed in prag-b2b.

The portal needs `WP_APP_USER` and `WP_APP_PASSWORD` for its server-side reads of `prag-core/v1/admin-config`; an Author cannot read that configuration directly because it contains mail credentials. Existing production credentials are already configured locally.

Central now uses `prag_admin_config.roleModuleVisibility` and per-user `b2cModules` to hide and deny unassigned admin areas. WordPress's own capabilities and post ownership still apply. Multiple roles are additive, while per-user modules narrow that combined access. Empty per-user module arrays keep the existing “Role default” meaning. Administrators retain their administrative capabilities.

Every newly created WordPress user receives a welcome email. Accounts created by an administrator receive their supplied or generated temporary password. Customers who register themselves receive a welcome and reset link without emailing their chosen password. Staff must replace temporary credentials through the portal's `/change-password` screen or the WordPress password-reset link before using their assigned areas. Passwords are held in request memory only, and are not saved to configuration, audit logs, or user metadata.

Welcome emails use the SMTP settings saved in Portal → Admin Settings. When `useWordPressMailer` is enabled, WordPress's configured mailer is used instead. Mail acceptance is recorded as `prag_welcome_email_status` (`sent` or `failed`), and the portal reports creation separately from email failure. “Sent” means accepted by the mail transport, not confirmed inbox delivery. Existing users are not emailed or reset automatically.

Verification:

- In Prag: `php tests/prag-user-access.test.php`
- In Prag-Admin: `node --test tests/accessPolicy.test.cjs`
- In Prag-Admin: `node tests/access.integration.cjs` (starts localhost-only mock WordPress and Next development servers; does not mutate live users or send mail)
- In Prag-Admin: `npm run build`

Portal administrators can use **Resend Access Email** on an existing user. The action replaces their password with a fresh random temporary password, emails it with login/reset links, and requires staff to change it. It refuses inactive accounts, concurrent requests, and repeat sends within five minutes. If mail fails after replacement, the UI says the password was replaced and permits retry after the mail settings are corrected.

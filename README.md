# next-event mini app

Hosted URL target:

- `https://next-event.app.simplylog.co.il`

Behavior:

- Hebrew-first UI with English fallback.
- RTL/LTR is resolved from host runtime (`LanguageDirection`, `LanguageCode`, `CultureInfo`).
- Event navigation is page-based (`PageIndex + 1`) over EventLog result order.
- Current default filter: open events from the last year.
- FullEvent report creation includes automatic polling until terminal status (`Completed`, `Error`, `Failed`) or timeout.

## Host configuration snippets

Add/update `Security.AuthorizedApps` JSON with:

```json
{
  "next-event": {
    "Url": "https://next-event.app.simplylog.co.il",
    "TestValue": "hasAnyRoles('admin','Manager','SiteManager','User')"
  }
}
```

Optional app-scoped Connections examples:

```json
{
  "Type": "String",
  "Group": "Connections",
  "Name": "next-event.allowedOrigins",
  "Value": "[\"https://mnt.ylm.co.il\", \"https://ylm.ylm.co.il\"]"
}
```

## Deployment

From repository root:

```powershell
pwsh -File docs/skills/simplylog-mini-app-builder/deploy-app.ps1 -AppName next-event
```

Required local (uncommitted) env files in `docs/skills/simplylog-mini-app-builder`:

- `github.env`
- `cloudflare.env`

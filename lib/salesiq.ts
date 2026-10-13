const DEFAULT_SALESIQ_WIDGET_CODE = 'siq7f354a9f8f29eefa04acd8f76de79b15389e83109974604f61f319fb69114d7a';

function parseSalesIqWidgetCode(value?: string): string | undefined {
  const raw = (value ?? '').trim();
  if (!raw) return undefined;
  const code = raw.match(/[?&]wc=(siq[a-z0-9_-]+)/i)?.[1]
    ?? raw.replace(/^[\'"`]+|[\'"`]+$/g, '');
  return /^siq[a-z0-9_-]{8,}$/i.test(code) ? code : undefined;
}

/** Deployment override > admin setting > official PRAG fallback. */
export function resolveSalesIqWidgetCode(environmentCode?: string, adminCode?: string): string {
  if (environmentCode?.trim()) {
    const code = parseSalesIqWidgetCode(environmentCode);
    if (!code) throw new Error('ZOHO_SALESIQ_WIDGET_CODE must contain a valid SalesIQ widget code (siq...).');
    return code;
  }
  return parseSalesIqWidgetCode(adminCode) ?? DEFAULT_SALESIQ_WIDGET_CODE;
}

/** Remove legacy SalesIQ embed tags from admin snippets; keep other integrations. */
export function stripSalesIqEmbed(snippet?: string): string {
  const raw = (snippet ?? '').trim();
  // A shared $zoho namespace can also belong to other Zoho integrations.
  if (!/salesiq|zsiqscript/i.test(raw)) return raw;

  return raw
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, (script) =>
      /salesiq\.zohopublic\.com|zsiqscript|\$zoho\s*(?:\.salesiq|\[\s*['"]salesiq['"]\s*\])/i.test(script)
        ? ''
        : script,
    )
    // The official bootstrap is sometimes pasted as JavaScript without tags.
    .replace(/(?:window\.)?\$zoho\s*=\s*(?:window\.)?\$zoho\s*\|\|\s*\{\s*\}\s*;?/g, '')
    .replace(/(?:window\.)?\$zoho\.salesiq\s*=\s*(?:window\.)?\$zoho\.salesiq\s*\|\|\s*\{\s*(?:ready\s*:\s*function\s*\(\s*\)\s*\{\s*\}\s*)?\}\s*;?/g, '')
    .replace(/(?:window\.)?\$zoho\.salesiq\.widgetcode\s*=\s*(['"])[^'"]*\1\s*;?/g, '')
    .trim();
}

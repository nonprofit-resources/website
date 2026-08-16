/** Favicon clones that should use the vendor's canonical mark. */
export const MARK_ALIAS: Record<string, string> = {
  "awesome-free-nonprofits": "github",
  "awesome-nonprofit": "github",
  "aws-promotional-credit": "aws",
  "github-sponsors": "github",
  instalay: "github",
};

/**
 * Dark-mode file stem (`{id}.png` / `{id}.svg`) for marks that invert or ship a
 * white lockup. Colorful vendor marks (Google, Microsoft, YouTube, Canva) skip this.
 */
export const DARK_MARK_FOR: Record<string, string> = {
  aws: "aws-dark",
  devcentr: "devcentr-dark",
  github: "github-dark",
  "hci-nerdz": "hci-nerdz-dark",
  "nonprofit-crm": "nonprofit-crm-dark",
  openshellorg: "openshellorg-dark",
  placeholder: "placeholder-dark",
};

export function resolvedMarkHint(hint: string) {
  return MARK_ALIAS[hint] ?? hint;
}

export function darkMarkHint(hint: string) {
  return DARK_MARK_FOR[resolvedMarkHint(hint)];
}

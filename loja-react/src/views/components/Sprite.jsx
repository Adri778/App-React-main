// VIEW · Sprite SVG com as ilustrações de produto (injetado uma vez).
// Usa innerHTML bruto para não precisar converter cada atributo SVG em JSX.
const SPRITE = `
  <defs>
    <g id="s-tv"><rect x="6" y="10" width="52" height="34" rx="4" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M24 54h16M32 44v10" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><circle cx="14" cy="17" r="1.6" fill="currentColor"/></g>
    <g id="s-airfryer"><path d="M18 20h28l-3 30a4 4 0 01-4 3.6H25a4 4 0 01-4-3.6z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><rect x="24" y="12" width="16" height="9" rx="3" fill="none" stroke="currentColor" stroke-width="3.2"/><circle cx="32" cy="34" r="6.5" fill="none" stroke="currentColor" stroke-width="3"/></g>
    <g id="s-headphones"><path d="M12 38v-6a20 20 0 0140 0v6" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><rect x="8" y="36" width="11" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="3.2"/><rect x="45" y="36" width="11" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="3.2"/></g>
    <g id="s-blender"><path d="M22 8h20l-4 26H26z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><path d="M26 34h12v8H26z" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M24 42h16l-2 10H26z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/></g>
    <g id="s-fan"><rect x="24" y="40" width="16" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="3.2"/><circle cx="32" cy="24" r="16" fill="none" stroke="currentColor" stroke-width="3.2"/><circle cx="32" cy="24" r="3.5" fill="currentColor"/><path d="M32 24c0-8 6-11 6-11M32 24c8 0 11 6 11 6M32 24c0 8-6 11-6 11M32 24c-8 0-11-6-11-6" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>
    <g id="s-microwave"><rect x="6" y="16" width="52" height="32" rx="4" fill="none" stroke="currentColor" stroke-width="3.2"/><rect x="12" y="22" width="28" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M47 24v6M47 36v2" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></g>
    <g id="s-phone"><rect x="19" y="6" width="26" height="52" rx="6" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M28 51h8" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><path d="M29 11h6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></g>
    <g id="s-robot"><circle cx="32" cy="34" r="22" fill="none" stroke="currentColor" stroke-width="3.2"/><circle cx="32" cy="34" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 20l5 5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="44" cy="24" r="2" fill="currentColor"/></g>
    <g id="s-coffee"><path d="M16 20h30v10a15 15 0 01-15 15 15 15 0 01-15-15z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><path d="M46 24h5a5 5 0 010 10h-5" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 10c0 3-3 4-3 7M32 10c0 3-3 4-3 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M14 52h34" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></g>
    <g id="s-speaker"><rect x="18" y="6" width="28" height="52" rx="7" fill="none" stroke="currentColor" stroke-width="3.2"/><circle cx="32" cy="38" r="9" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="32" cy="18" r="3.5" fill="none" stroke="currentColor" stroke-width="2.6"/></g>
    <g id="s-camera"><rect x="8" y="18" width="40" height="28" rx="5" fill="none" stroke="currentColor" stroke-width="3.2"/><circle cx="28" cy="32" r="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M48 26l8-5v22l-8-5z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/></g>
    <g id="s-fridge"><rect x="18" y="6" width="28" height="52" rx="5" fill="none" stroke="currentColor" stroke-width="3.2"/><path d="M18 26h28" stroke="currentColor" stroke-width="3.2"/><path d="M24 15v6M24 32v10" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></g>
    <g id="s-house"><path d="M32 10L54 28v26a2 2 0 01-2 2H12a2 2 0 01-2-2V28z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><path d="M26 56V38h12v18" fill="none" stroke="currentColor" stroke-width="3"/></g>
    <g id="s-tools"><path d="M40 8a10 10 0 00-9 15L10 44l6 6 21-21a10 10 0 003-21l-6 7-6-1-1-6z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></g>
    <g id="s-bolt"><path d="M34 6L14 36h14l-4 22 22-32H30z" fill="currentColor"/></g>
  </defs>`;

export default function Sprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute' }}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: SPRITE }}
    />
  );
}

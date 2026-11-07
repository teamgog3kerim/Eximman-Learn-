import React from 'react';

export const AcademyWorkspaceSkin: React.FC = () => (
  <style>{`
    .academy-workspace {
      --workspace-paper: #fbf8f0;
      --workspace-wash: #f1eee4;
      --workspace-ink: #213630;
      --workspace-muted: #65756d;
      --workspace-line: #d9d8cc;
      --workspace-green: #1d5f52;
      --workspace-green-deep: #153f39;
      --workspace-green-soft: #e1ebe3;
      --workspace-ochre: #b86f35;
      --workspace-solid: #153f39;
      color: var(--workspace-ink);
      min-width: 0;
    }
    .dark .academy-workspace {
      --workspace-paper: #1e2926;
      --workspace-wash: #26332f;
      --workspace-ink: #edf1eb;
      --workspace-muted: #a0ada7;
      --workspace-line: #34413c;
      --workspace-green: #8bc9b8;
      --workspace-green-deep: #b5dfd2;
      --workspace-green-soft: #263a35;
      --workspace-ochre: #e6b57d;
      --workspace-solid: #263b35;
    }
    .academy-workspace .bg-white { background-color: var(--workspace-paper) !important; }
    .academy-workspace .bg-neutral-900 { background-color: var(--workspace-solid) !important; }
    .academy-workspace .bg-neutral-50,
    .academy-workspace .bg-neutral-50\\/50,
    .academy-workspace .bg-neutral-50\\/60,
    .academy-workspace .bg-neutral-50\\/70,
    .academy-workspace .bg-neutral-100,
    .academy-workspace .bg-neutral-100\\/70 { background-color: var(--workspace-wash) !important; }
    .academy-workspace .text-neutral-900,
    .academy-workspace .text-neutral-800,
    .academy-workspace .text-neutral-700 { color: var(--workspace-ink) !important; }
    .academy-workspace .text-neutral-600,
    .academy-workspace .text-neutral-500,
    .academy-workspace .text-neutral-400 { color: var(--workspace-muted) !important; }
    .academy-workspace .border-neutral-100,
    .academy-workspace .border-neutral-200,
    .academy-workspace .border-neutral-300 { border-color: var(--workspace-line) !important; }
    .academy-workspace .bg-amber-700,
    .academy-workspace .bg-amber-800 { background-color: var(--workspace-green) !important; }
    .academy-workspace .hover\\:bg-amber-800:hover,
    .academy-workspace .hover\\:bg-amber-900:hover { background-color: var(--workspace-green-deep) !important; }
    .academy-workspace .text-amber-700,
    .academy-workspace .text-amber-800 { color: var(--workspace-green) !important; }
    .academy-workspace .border-amber-200,
    .academy-workspace .border-amber-300 { border-color: color-mix(in srgb, var(--workspace-ochre) 38%, var(--workspace-line)) !important; }
    .academy-workspace .bg-amber-50,
    .academy-workspace .bg-amber-50\\/50,
    .academy-workspace .bg-amber-50\\/60 { background-color: color-mix(in srgb, var(--workspace-ochre) 10%, var(--workspace-paper)) !important; }
    .academy-workspace h1,
    .academy-workspace h2,
    .academy-workspace h3,
    .academy-workspace h4 { text-wrap: pretty; }
    .academy-workspace .rounded-2xl,
    .academy-workspace .rounded-3xl { border-radius: 1.15rem; }
    .academy-workspace input:not([type="checkbox"]),
    .academy-workspace select,
    .academy-workspace textarea {
      background-color: color-mix(in srgb, var(--workspace-paper) 78%, var(--workspace-wash)) !important;
      border-color: var(--workspace-line) !important;
      color: var(--workspace-ink) !important;
      border-radius: .65rem;
    }
    .academy-workspace button { transition: background-color .18s ease, border-color .18s ease, color .18s ease, transform .18s ease; }
    .academy-workspace button:not(:disabled):active { transform: translateY(1px); }
    .academy-workspace button:disabled { cursor: not-allowed; }
    .academy-workspace input[type="checkbox"] { accent-color: var(--workspace-green); }
    .academy-workspace table { border-color: var(--workspace-line); }
    .academy-workspace thead { background-color: var(--workspace-green-soft); }
    .academy-workspace th { color: var(--workspace-muted); }
    .academy-workspace tbody tr:hover { background-color: color-mix(in srgb, var(--workspace-green-soft) 72%, transparent); }
    .academy-workspace .academy-section-kicker { color: var(--workspace-ochre); }
    .academy-route-visual {
      background: linear-gradient(135deg, color-mix(in srgb, var(--workspace-green-soft) 78%, var(--workspace-paper)), var(--workspace-paper));
      border: 1px solid var(--workspace-line);
      border-radius: 1rem;
      overflow: hidden;
    }
    .academy-route-visual text { font-family: var(--font-sans); fill: var(--workspace-ink); }
    .academy-route-visual .route-label { font-size: 12px; font-weight: 700; }
    .academy-route-visual .route-note { font-size: 10px; fill: var(--workspace-muted); }
    .academy-route-visual .route-line { stroke: var(--workspace-green); stroke-width: 4; stroke-linecap: round; }
    .academy-route-visual .route-node { fill: var(--workspace-paper); stroke: var(--workspace-green); stroke-width: 3; }
    @media (max-width: 640px) {
      .academy-workspace table { min-width: 620px; }
      .academy-route-visual .route-label { font-size: 10px; }
      .academy-route-visual .route-note { font-size: 8px; }
    }
    @media print {
      .academy-workspace .academy-route-visual { background: #fff !important; }
    }
  `}</style>
);

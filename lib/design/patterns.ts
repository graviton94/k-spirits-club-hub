export const surfaces = {
  soft: 'bg-card/45 backdrop-blur-md border border-border/55',
  default: 'bg-card/60 backdrop-blur-lg border border-border/60',
  hero: 'bg-background/70 backdrop-blur-xl border border-border/65',
  panel: 'bg-card/60 backdrop-blur-lg border border-border/60',
  panelSoft: 'bg-card/45 backdrop-blur-md border border-border/55',
  elevated: 'rounded-[1.5rem] md:rounded-[2rem] shadow-lg',
  elevatedSoft: 'rounded-xl md:rounded-2xl shadow-md',
  glassNav: 'bg-background/78 backdrop-blur-xl border border-border/65 shadow-[0_16px_36px_rgba(0,0,0,0.2)]',
};

export const typography = {
  sectionTitle: 'text-xl md:text-3xl font-black tracking-tight text-foreground',
  sectionTitleSoft: 'text-lg md:text-2xl font-extrabold tracking-tight text-foreground/90',
  eyebrow: 'text-[10px] md:text-xs font-black text-foreground/60 uppercase tracking-[0.14em]',
  metric: 'text-xs md:text-sm font-black text-foreground/75 tracking-wide',
  sectionMeta: 'text-[10px] md:text-xs font-black text-foreground/60 uppercase tracking-widest',
  body: 'text-[13px] md:text-sm text-muted-foreground leading-relaxed',
};

export const chips = {
  primary: 'px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl bg-primary/15 text-primary text-[10px] md:text-xs font-black border border-primary/30 uppercase tracking-[0.08em]',
  primarySm: 'px-1.5 py-0 md:px-2 md:py-0.5 rounded-md md:rounded-lg bg-primary/12 text-primary text-[9px] md:text-xs font-bold border border-primary/25 uppercase tracking-[0.08em]',
  primaryMd: 'px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl bg-primary/20 text-primary text-xs md:text-sm font-black border border-primary/35 uppercase tracking-[0.08em]',
  accent: 'px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl bg-accent/15 text-accent text-[10px] md:text-xs font-black border border-accent/30 uppercase tracking-[0.08em]',
  accentSm: 'px-1.5 py-0 md:px-2 md:py-0.5 rounded-md md:rounded-lg bg-accent/12 text-accent text-[9px] md:text-xs font-bold border border-accent/25 uppercase tracking-[0.08em]',
  accentMd: 'px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl bg-accent/20 text-accent text-xs md:text-sm font-black border border-accent/35 uppercase tracking-[0.08em]',
  subtle: 'px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl bg-muted/70 text-foreground/75 text-[10px] md:text-xs font-bold border border-border/60 uppercase tracking-[0.08em]',
  subtleSm: 'px-1.5 py-0 md:px-2 md:py-0.5 rounded-md md:rounded-lg bg-muted/60 text-foreground/70 text-[9px] md:text-xs font-semibold border border-border/55 uppercase tracking-[0.08em]',
  subtleMd: 'px-2 py-0.5 md:px-3 md:py-1 rounded-lg md:rounded-xl bg-muted/80 text-foreground/80 text-xs md:text-sm font-bold border border-border/60 uppercase tracking-[0.08em]',
};

export const interactive = {
  focusRing: 'ring-2 ring-primary/50 border-primary shadow-primary/10',
  hoverBorder: 'hover:border-primary/40',
  hoverSurface: 'hover:bg-primary/5',
};

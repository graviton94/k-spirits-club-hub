export const surfaces = {
  panel: 'bg-card/60 backdrop-blur-xl border border-border/60',
  panelSoft: 'bg-card/40 backdrop-blur-lg border border-border/50',
  elevated: 'rounded-[2rem] shadow-xl',
  elevatedSoft: 'rounded-2xl shadow-lg',
  glassNav: 'glass-premium border border-border/60 shadow-[0_20px_50px_rgba(0,0,0,0.28)]',
};

export const typography = {
  sectionTitle: 'text-2xl font-black tracking-tighter text-foreground uppercase italic',
  sectionMeta: 'text-xs font-black text-foreground/60 uppercase tracking-widest',
  body: 'text-sm text-muted-foreground leading-relaxed',
};

export const chips = {
  primary: 'px-3 py-1 rounded-xl bg-primary/10 text-primary text-[10px] font-black border border-primary/20 uppercase tracking-widest',
  accent: 'px-3 py-1 rounded-xl bg-accent/10 text-accent text-[10px] font-black border border-accent/20 uppercase tracking-widest',
  subtle: 'px-3 py-1 rounded-xl bg-muted/60 text-foreground/70 text-[10px] font-black border border-border/50 uppercase tracking-widest',
};

export const interactive = {
  focusRing: 'ring-2 ring-primary/50 border-primary shadow-primary/10',
  hoverBorder: 'hover:border-primary/40',
  hoverSurface: 'hover:bg-primary/5',
};

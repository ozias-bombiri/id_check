# Design System Guide

## Vue d'ensemble

Ce projet utilise un système de design cohérent basé sur :
- **Variables SCSS globales** (`_design-tokens.scss`)
- **Mixins réutilisables** (`_mixins.scss`)
- **Typographie standardisée** (`_typography.scss`)

Tous les styles doivent utiliser ces outils pour maintenir une cohérence visuelle.

---

## 📦 Design Tokens

### Couleurs

#### Couleurs principales
```scss
$color-primary: #0f172a;           // Dark Navy
$color-primary-light: #1e3a8a;     // Deep Blue
$color-primary-lighter: #3b82f6;   // Bright Blue
$color-primary-bg: #fbfdff;        // Very light blue bg
```

#### Couleurs de statut
```scss
$color-success: #22c55e;   // Vert
$color-error: #b91c1c;     // Rouge
$color-warning: #f59e0b;   // Amber
$color-info: #06b6d4;      // Cyan
```

#### Texte et les fonds
```scss
$color-text-primary: #0f172a;
$color-text-secondary: #1f2937;
$color-text-muted: #475569;
$color-text-light: #6b7280;

$color-surface: #ffffff;
$color-bg-white: #ffffff;
$color-bg-light: #f9fafb;
$color-bg-lighter: #f3f4f6;
$color-bg-pale: #f1f5f9;
```

### Typography

#### Tailles de polices
```scss
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
$font-size-3xl: 1.875rem;  // 30px
$font-size-4xl: 2.25rem;   // 36px
$font-size-5xl: 2.5rem;    // 40px
```

#### Poids de police
```scss
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Espacement

Le système d'espacement utilise une base de 4px :
```scss
$spacing-1: 0.25rem;   // 4px
$spacing-2: 0.5rem;    // 8px
$spacing-3: 0.75rem;   // 12px
$spacing-4: 1rem;      // 16px
$spacing-5: 1.25rem;   // 20px
$spacing-6: 1.5rem;    // 24px
$spacing-8: 2rem;      // 32px
// ... jusqu'à spacing-20
```

### Border Radius

```scss
$radius-sm: 6px;
$radius-md: 8px;      // Default
$radius-lg: 12px;     // Cards
$radius-xl: 16px;
$radius-full: 9999px; // Badges
```

### Ombres

```scss
$shadow-light: 0 4px 20px rgba(0, 0, 0, 0.05);
$shadow-medium: 0 6px 24px rgba(15, 23, 42, 0.12);
$shadow-dark: 0 8px 28px rgba(2, 6, 23, 0.06);
$shadow-extra: 0 14px 36px rgba(2, 6, 23, 0.08);
```

---

## 🎨 Mixins Courants

### Mises en page

```scss
// Flexbox utilitaires
@include flex-center;      // Centré en flex
@include flex-between;     // Space-between
@include flex-column;      // Direction column

// Conteneurs
@include section;          // Section avec padding
@include container;        // Container avec max-width
```

### Typographie

```scss
@include heading-1;        // H1 style
@include heading-3;        // H3 style
@include body-normal;      // Corps normal
@include body-small;       // Petit corps
@include label-text;       // Étiquettes
```

### Composants

```scss
// Sections
@include hero-section;     // Hero avec gradient

// Cartes
@include card;             // Carte avec shadow et hover
@include card-header;      // En-tête de carte

// Formulaires
@include form-group;       // Grille de formulaire
@include form-input;       // Input/Select style

// Boutons
@include btn-primary;      // Bouton primaire vert
@include btn-secondary;    // Bouton secondaire
@include btn-danger;       // Bouton danger rouge
@include btn-outline;      // Bouton outline

// Tableaux
@include data-table;       // Style tableau avec zebra

// Badges
@include badge-primary;
@include badge-success;
@include badge-error;
```

### Responsive

```scss
@include respond-to('sm');  // 480px+
@include respond-to('md');  // 768px+
@include respond-to('lg');  // 1024px+
@include respond-to('xl');  // 1280px+
```

---

## 📋 Bonnes pratiques

### 1. Toujours importer les styles en haut d'un composant

```scss
@import '../../styles/design-tokens.scss';
@import '../../styles/mixins.scss';
```

### 2. Utiliser les variables au lieu des valeurs hard-coded

❌ **Mauvais**
```scss
.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
```

✅ **Bon**
```scss
.card {
  @include card;
}
```

### 3. Utiliser les mixins pour les patterns courants

❌ **Mauvais** - Code dupliqué
```scss
.button-1 {
  padding: 12px 20px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.button-2 {
  padding: 12px 20px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}
```

✅ **Bon** - Utiliser les mixins
```scss
.button-1 {
  @include btn-primary;
}

.button-2 {
  @include btn-primary;
}
```

### 4. Responsive design

```scss
.card {
  padding: $spacing-8;
  
  @include respond-to('sm') {
    padding: $spacing-4;
  }
}
```

### 5. Utiliser des classes utilitaires

```html
<!-- Espacement -->
<div class="mt-4 mb-2 p-3">...</div>

<!-- Flex -->
<div class="flex flex-center gap-3">...</div>

<!-- Typographie -->
<p class="text-primary font-semibold">...</p>
```

---

## 🎯 Patterns de composants

### Card avec formulaire
```typescript
// home.component.html
<div class="card">
  <div class="card-header">
    <h3>Formulaire</h3>
  </div>
  <form>
    <div class="form-grid">
      <input type="text" placeholder="Champ 1" />
      <input type="text" placeholder="Champ 2" />
    </div>
    <div class="form-actions">
      <button class="btn-primary">Envoyer</button>
      <button class="btn-secondary">Annuler</button>
    </div>
  </form>
</div>
```

```scss
// component.scss
@import '../../styles/design-tokens.scss';
@import '../../styles/mixins.scss';

.card {
  @include card;
}

.card-header {
  @include card-header;
}

.form-grid {
  @include form-group;
}

.form-actions {
  display: flex;
  gap: $spacing-3;
  margin-top: $spacing-6;
}
```

### Table avec données
```scss
.table-container {
  overflow-x: auto;
  border-radius: $radius-lg;
}

.data-table {
  @include data-table;
}

.actions-cell {
  button {
    @include btn-primary;
    margin-right: $spacing-2;
  }
}
```

---

## 📐 Breakpoints

| Nom  | Taille | Cas d'usage |
|------|--------|-----------|
| `sm` | 480px  | Mobile + |
| `md` | 768px  | Tablette |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Desktop large |

### Exemple

```scss
.grid {
  grid-template-columns: repeat(4, 1fr);
  
  @include respond-to('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @include respond-to('md') {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include respond-to('sm') {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔄 Transitions

```scss
$transition-fast: 150ms ease-in-out;
$transition-base: 250ms ease-in-out;
$transition-slow: 400ms ease-in-out;

.element {
  transition: all $transition-base;
  
  &:hover {
    transform: translateY(-2px);
  }
}
```

---

## ✅ Checklist avant commit

- [ ] Tous les styles utilisent les variables de design tokens
- [ ] Aucun code SCSS dupliqué (utiliser les mixins)
- [ ] Les breakpoints responsive sont en place
- [ ] Les hover states sont définis
- [ ] Les couleurs respectent le système établi
- [ ] Les espacements suivent le système 4px
- [ ] Les transitions sont cohérentes
- [ ] Les ombres utilisent les variables prédéfinies

---

## 📞 Support

Pour toute question sur les styles ou le design system, consultez ce guide ou demandez à l'équipe design.

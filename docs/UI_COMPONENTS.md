# UI components

DaisyUI 5 is installed through Tailwind CSS 4 and its official PostCSS plugin. A custom `fixmate` theme and the `d-` prefix keep library components separate from legacy CSS. The shared Button uses DaisyUI button variants; status badges and home search/popular-repair chips use DaisyUI components. Radix Slot preserves accessible link-button composition, with class-variance-authority selecting variants.

Notifications use Sonner through the existing useToast interface. Existing forms, cards, layouts, and native confirmation dialogs retain custom styling with refreshed typography and colors. DaisyUI is one of the assignment's explicitly accepted libraries. Global Tailwind preflight is omitted to preserve existing form semantics/styles. Reference: https://daisyui.com/docs/install/nextjs/ and https://daisyui.com/docs/config/.

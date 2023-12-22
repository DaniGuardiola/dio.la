import plugin from "tailwindcss/plugin";

export const tailwindPrintVariantPlugin = plugin(({ addVariant }) => {
  addVariant("print", "@media print");
  addVariant("not-print", "@media not print");
});

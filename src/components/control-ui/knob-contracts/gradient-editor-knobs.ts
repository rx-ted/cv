export const gradientEditorKnobs = [
  "--cui-gradient-editor-preview-radius",
  "--cui-gradient-editor-preview-ring-color",
  "--cui-gradient-editor-track-radius",
  "--cui-gradient-editor-stop-radius",
  "--cui-gradient-editor-stop-border-color",
  "--cui-gradient-editor-stop-border-width",
  "--cui-gradient-editor-stop-shadow",
] as const;
export type GradientEditorKnobStyle = Partial<Record<(typeof gradientEditorKnobs)[number], string>>;

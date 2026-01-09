import { OGImagePreview } from "@/components/og-image-preview";

export default function TestOGPreviewPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">OG Image Preview</h1>
      <p className="text-muted-foreground mb-8">
        Preview how your OG images will look. Check positioning and styling
        before deploying.
      </p>
      <OGImagePreview />
    </div>
  );
}

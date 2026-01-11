"use client";

import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  copyToClipboard,
  downloadFile,
  downloadFilesAsZip,
  generateFilename,
} from "@/lib/utils/output-utils";
import type { ToolOutput } from "@/lib/utils/tool-registry";

interface OutputActionsProps {
  output: ToolOutput;
  toolName?: string;
  copied: boolean;
  onCopiedChange: (copied: boolean) => void;
}

export function OutputActions({
  output,
  toolName,
  copied,
  onCopiedChange,
}: OutputActionsProps) {
  const canCopy = !!(
    output.content ||
    (output.files && output.files.length > 0)
  );
  const canDownload = !!(
    output.content ||
    (output.files && output.files.length > 0)
  );

  const handleCopy = async () => {
    let textToCopy = "";

    if (output.content) {
      textToCopy = output.content;
    } else if (output.files && output.files.length > 0) {
      // Copy first file content
      const firstFile = output.files[0];
      textToCopy =
        firstFile.content instanceof Blob
          ? await firstFile.content.text()
          : firstFile.content;
    }

    const success = await copyToClipboard(textToCopy);
    if (success) {
      onCopiedChange(true);
      toast.success("Copied to clipboard");
      setTimeout(() => onCopiedChange(false), 2000);
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = async () => {
    try {
      if (output.files && output.files.length > 1) {
        // Multiple files - download as ZIP
        await downloadFilesAsZip(output.files);
        toast.success("Files downloaded as ZIP");
      } else if (output.files && output.files.length === 1) {
        // Single file
        const file = output.files[0];
        const content =
          file.content instanceof Blob
            ? file.content
            : new Blob([file.content], { type: file.mimeType });
        downloadFile(content, {
          filename: file.filename,
          mimeType: file.mimeType,
        });
        toast.success("File downloaded");
      } else if (output.content) {
        // Content-based output
        const filename = generateFilename(output, toolName);
        downloadFile(output.content, {
          filename,
          mimeType: output.mimeType || "text/plain",
        });
        toast.success("File downloaded");
      }
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  };

  if (!canCopy && !canDownload) return null;

  return (
    <div className="flex items-center gap-2 justify-end">
      {canCopy && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="gap-2 px-2 sm:px-3"
          aria-label={copied ? "Copied" : "Copy"}
          title={copied ? "Copied" : "Copy"}
        >
          {copied ? (
            <>
              <CheckIcon className="size-4" />
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon className="size-4" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </Button>
      )}
      {canDownload && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="gap-2 px-2 sm:px-3"
          aria-label="Download"
          title="Download"
        >
          <DownloadIcon className="size-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
      )}
    </div>
  );
}

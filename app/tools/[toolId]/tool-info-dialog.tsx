"use client";

import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ToolContent } from "@/tools";

type Props = {
  toolTitle: string;
  toolName: string;
  content: ToolContent;
};

export function ToolInfoDialog({ toolTitle, toolName, content }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label={`About ${toolTitle}`}
          title={`About ${toolTitle}`}
        >
          <InfoIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>About {toolTitle}</DialogTitle>
          <DialogDescription>
            Quick reference: what it is, how to use it, and common questions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-sm font-semibold">What is it?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content.whatIs}
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">What can you do with it?</h3>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              {content.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold">How do you use it?</h3>
            <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
              {content.howItWorks.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>

          {content.useCases?.length ? (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold">Common use cases</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {content.useCases.map((useCase, i) => (
                  <li key={i}>{useCase}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {content.faq?.length ? (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold">FAQ</h3>
              <div className="space-y-3">
                {content.faq.map((item, i) => (
                  <div key={i} className="border rounded-md p-3">
                    <div className="text-sm font-medium">{item.question}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <p className="text-xs text-muted-foreground">
            Tip: {toolName} runs fully in your browser — no server uploads.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

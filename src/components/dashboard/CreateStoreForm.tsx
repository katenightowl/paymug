"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Input } from "@/components/ui";
import type { CreateStoreResponse } from "./CreateStoreForm.types";

export function CreateStoreForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [useCurrentPaymentCredentials, setUseCurrentPaymentCredentials] =
    useState(true);
  const [useCurrentGitHubCredentials, setUseCurrentGitHubCredentials] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const response = await fetch("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug: slug || name,
        useCurrentPaymentCredentials,
        useCurrentGitHubCredentials,
      }),
    });
    const data = (await response.json()) as CreateStoreResponse;
    setSaving(false);
    if (!response.ok) {
      setError(data.error || "Could not create store");
      return;
    }
    router.push("/dashboard/setup");
    router.refresh();
  }

  return (
    <form
      onSubmit={create}
      className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <Input
        label="Store name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <Input
        label="Store URL"
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
        placeholder={name || "my-store"}
      />
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">
          Reuse integrations
        </legend>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={useCurrentPaymentCredentials}
            onChange={(event) =>
              setUseCurrentPaymentCredentials(event.target.checked)
            }
            className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
          />
          <span>
            <span className="block font-medium">Use current PayPal setup</span>
            <span className="mt-0.5 block text-muted">
              Reuse the current store’s payment credentials and webhook.
            </span>
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={useCurrentGitHubCredentials}
            onChange={(event) =>
              setUseCurrentGitHubCredentials(event.target.checked)
            }
            className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--accent)]"
          />
          <span>
            <span className="block font-medium">Use current GitHub setup</span>
            <span className="mt-0.5 block text-muted">
              Reuse the authorized GitHub account for repository delivery.
            </span>
          </span>
        </label>
      </fieldset>
      <p className="text-sm text-muted">
        The new store becomes active immediately. You can configure its cover,
        products, and setup checklist next.
      </p>
      {error && <Alert>{error}</Alert>}
      <Button type="submit" disabled={saving}>
        {saving ? "Creating…" : "Create store"}
      </Button>
    </form>
  );
}

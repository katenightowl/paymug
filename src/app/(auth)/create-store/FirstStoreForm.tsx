"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Input } from "@/components/ui";
import type { CreateFirstStoreResponse } from "./FirstStoreForm.types";

export function FirstStoreForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || name,
          useCurrentPaymentCredentials: false,
          useCurrentGitHubCredentials: false,
        }),
      });
      const data = (await response.json()) as CreateFirstStoreResponse;
      if (!response.ok) {
        throw new Error(data.error || "Could not create store");
      }
      router.push("/dashboard/setup");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not create store"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={create} className="mt-6 space-y-4">
      {error && <Alert>{error}</Alert>}
      <Input
        label="Store name"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Acme Digital"
        required
      />
      <Input
        label="Store URL"
        name="slug"
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
        placeholder={name || "acme-digital"}
      />
      <p className="text-sm text-muted">
        You can update your store details and connect payments after this step.
      </p>
      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Creating…" : "Create store"}
      </Button>
    </form>
  );
}

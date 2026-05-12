import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, User, MessageSquare, Send } from "lucide-react";
import PageShell from "@/components/PageShell";
import { Card, NeonButton, SectionTitle } from "@/components/ui-kit";
import { useApp } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — E-Learning Nova" }] }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useApp();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("contact.sent"));
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-2xl">
        <SectionTitle title={t("contact.title")} center />
        <Card>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2"><User className="h-4 w-4" />{t("contact.name")}</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-border focus:neon-border outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2"><Mail className="h-4 w-4" />{t("contact.email")}</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-border focus:neon-border outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 flex items-center gap-2"><MessageSquare className="h-4 w-4" />{t("contact.message")}</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass border border-border focus:neon-border outline-none resize-none"
              />
            </div>
            <NeonButton type="submit" className="w-full"><Send className="h-4 w-4" />{t("contact.send")}</NeonButton>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}

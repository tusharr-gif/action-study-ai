import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Sparkles, Brain, Target, Loader2, Eraser } from "lucide-react";

type Mode = "beginner" | "intermediate" | "exam";

const SECTIONS: { key: string; label: string; icon: string }[] = [
  { key: "🔍 Key Concepts:", label: "Key Concepts", icon: "🔍" },
  { key: "📌 Important Topics:", label: "Important Topics", icon: "📌" },
  { key: "⚡ Action Plan:", label: "Action Plan", icon: "⚡" },
  { key: "📖 Explanation:", label: "Explanation", icon: "📖" },
  { key: "🧪 Practice Questions:", label: "Practice Questions", icon: "🧪" },
  { key: "📅 Study Plan:", label: "Study Plan", icon: "📅" },
  { key: "🚨 Mistakes to Avoid:", label: "Mistakes to Avoid", icon: "🚨" },
];

function parseSections(text: string) {
  const result: Record<string, string> = {};
  const indices = SECTIONS.map((s) => ({ ...s, idx: text.indexOf(s.key) })).filter((s) => s.idx >= 0);
  indices.sort((a, b) => a.idx - b.idx);
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].idx + indices[i].key.length;
    const end = i + 1 < indices.length ? indices[i + 1].idx : text.length;
    result[indices[i].key] = text.slice(start, end).trim();
  }
  return result;
}

const Index = () => {
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [mode, setMode] = useState<Mode>("intermediate");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sections = useMemo(() => parseSections(output), [output]);
  const hasOutput = output.trim().length > 0;

  const generate = async () => {
    if (!content.trim()) {
      toast({ title: "Add some content", description: "Paste notes or a topic to analyze." });
      return;
    }
    setLoading(true);
    setOutput("");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/study-companion`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ content, mode }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "Rate limited", description: "Too many requests. Please wait a moment.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "Credits required", description: "Add credits to your Lovable AI workspace.", variant: "destructive" });
        } else {
          toast({ title: "Request failed", description: "Please try again.", variant: "destructive" });
        }
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      let acc = "";

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });

        let nl;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              acc += delta;
              setOutput(acc);
            }
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        toast({ title: "Stream error", description: "Connection issue while generating.", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    abortRef.current?.abort();
    setContent("");
    setOutput("");
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <header className="border-b border-border bg-background/60 backdrop-blur-xl sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-elegant">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Study Companion</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Document-to-Action engine</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Powered by Lovable AI
          </div>
        </div>
      </header>

      <main className="container py-8 grid lg:grid-cols-[420px_1fr] gap-6">
        {/* Input panel */}
        <section className="space-y-4">
          <Card className="p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Your study material</h2>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 20000))}
              placeholder="Paste notes, a syllabus, an article, or just a topic like 'Photosynthesis for Class 10 boards'..."
              className="min-h-[260px] resize-none text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{content.length.toLocaleString()} / 20,000</span>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 hover:text-foreground transition-smooth"
              >
                <Eraser className="h-3 w-3" /> Clear
              </button>
            </div>
          </Card>

          <Card className="p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Learning mode</h2>
            </div>
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="intermediate">Standard</TabsTrigger>
                <TabsTrigger value="exam">Exam</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground mt-3">
              {mode === "beginner" && "Simple analogies, friendly pace."}
              {mode === "intermediate" && "Structured, balanced depth."}
              {mode === "exam" && "Crisp, high-yield, exam-focused."}
            </p>
          </Card>

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full h-12 bg-gradient-hero text-primary-foreground hover:opacity-95 shadow-elegant"
            size="lg"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate study plan</>
            )}
          </Button>
        </section>

        {/* Output panel */}
        <section>
          {!hasOutput && !loading && (
            <Card className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-10 border-dashed shadow-none bg-background/50">
              <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow mb-4">
                <Sparkles className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Turn notes into action</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Paste any topic or notes on the left. We'll extract key concepts, build a personalized
                action plan, generate practice questions, and flag mistakes to avoid.
              </p>
            </Card>
          )}

          {(hasOutput || loading) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {SECTIONS.map((s) => {
                const body = sections[s.key];
                const isPending = !body && loading;
                return (
                  <Card
                    key={s.key}
                    className="p-5 shadow-card hover:shadow-elegant transition-smooth"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{s.icon}</span>
                      <h3 className="font-semibold text-sm tracking-tight">{s.label}</h3>
                      {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground ml-auto" />}
                    </div>
                    {body ? (
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
                        {body}
                      </pre>
                    ) : (
                      <div className="space-y-2">
                        <div className="h-2 rounded bg-muted animate-pulse w-3/4" />
                        <div className="h-2 rounded bg-muted animate-pulse w-1/2" />
                        <div className="h-2 rounded bg-muted animate-pulse w-2/3" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="container py-8 text-center text-xs text-muted-foreground">
        Built with Lovable Cloud · Single-session study assistant
      </footer>
    </div>
  );
};

export default Index;

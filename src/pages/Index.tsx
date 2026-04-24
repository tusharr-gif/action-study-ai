import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Sparkles, Brain, Target, Loader2, Eraser, ArrowRight, Zap, GraduationCap } from "lucide-react";

type Mode = "beginner" | "intermediate" | "exam";

const SECTIONS: { key: string; label: string; icon: string; tone: string }[] = [
  { key: "🔍 Key Concepts:", label: "Key Concepts", icon: "🔍", tone: "from-violet-500/20 to-indigo-500/10" },
  { key: "📌 Important Topics:", label: "Important Topics", icon: "📌", tone: "from-fuchsia-500/20 to-pink-500/10" },
  { key: "⚡ Action Plan:", label: "Action Plan", icon: "⚡", tone: "from-amber-500/25 to-orange-500/10" },
  { key: "📖 Explanation:", label: "Explanation", icon: "📖", tone: "from-sky-500/20 to-cyan-500/10" },
  { key: "🧪 Practice Questions:", label: "Practice Questions", icon: "🧪", tone: "from-emerald-500/20 to-teal-500/10" },
  { key: "📅 Study Plan:", label: "Study Plan", icon: "📅", tone: "from-blue-500/20 to-indigo-500/10" },
  { key: "🚨 Mistakes to Avoid:", label: "Mistakes to Avoid", icon: "🚨", tone: "from-rose-500/25 to-red-500/10" },
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
  const outputRef = useRef<HTMLDivElement | null>(null);

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

    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);

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
        if (resp.status === 429) toast({ title: "Rate limited", description: "Too many requests. Please wait.", variant: "destructive" });
        else if (resp.status === 402) toast({ title: "Credits required", description: "Add credits to your Lovable AI workspace.", variant: "destructive" });
        else toast({ title: "Request failed", description: "Please try again.", variant: "destructive" });
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
            if (delta) { acc += delta; setOutput(acc); }
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

  const examples = [
    "Photosynthesis for Class 10 boards",
    "Big-O notation & sorting algorithms",
    "Causes of World War I — exam revision",
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Animated background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-soft" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-70" />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full bg-accent/25 blur-3xl animate-blob [animation-delay:-6s]" />
        <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-[hsl(var(--accent-2))]/25 blur-3xl animate-blob [animation-delay:-12s]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-elegant">
              <Brain className="h-5 w-5 text-primary-foreground" />
              <span className="absolute -inset-0.5 rounded-2xl bg-gradient-aurora opacity-40 blur animate-gradient-shift -z-10" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight leading-none">Study Companion</h1>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Document → Action</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full glass border border-border/60">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Powered by Lovable AI
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container pt-16 pb-10 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-border/60 text-xs font-medium mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          AI-powered study planner · Built for serious learners
        </div>
        <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl leading-[1.02] tracking-tight max-w-4xl mx-auto animate-fade-in-up">
          Turn any notes into a
          <span className="block text-gradient-aurora animate-gradient-shift">winning action plan.</span>
        </h2>
        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up [animation-delay:120ms]">
          Paste a topic, lecture, or syllabus. Get key concepts, a focused study plan,
          practice questions, and the mistakes to avoid — instantly.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up [animation-delay:200ms]">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => setContent(ex)}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass text-xs font-medium hover:border-primary/40 transition-smooth"
            >
              {ex}
              <ArrowRight className="h-3 w-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </section>

      {/* Main grid */}
      <main className="container pb-16 grid lg:grid-cols-[440px_1fr] gap-6 items-start">
        {/* Input column */}
        <section className="space-y-4 lg:sticky lg:top-24 animate-fade-in-up [animation-delay:280ms]">
          <Card className="relative p-6 glass-strong border-border/60 shadow-card overflow-hidden noise">
            <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-base">Your study material</h3>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 20000))}
              placeholder="Paste notes, a syllabus, an article — or simply a topic like 'Photosynthesis for Class 10'…"
              className="min-h-[240px] resize-none text-sm leading-relaxed bg-background/60 border-border/60 focus-visible:ring-primary/40"
            />
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span className="tabular-nums">{content.length.toLocaleString()} / 20,000</span>
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 hover:text-foreground transition-smooth"
              >
                <Eraser className="h-3 w-3" /> Clear
              </button>
            </div>
          </Card>

          <Card className="p-6 glass-strong border-border/60 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-lg bg-accent/15 flex items-center justify-center">
                <Target className="h-3.5 w-3.5 text-accent" />
              </div>
              <h3 className="font-display font-bold text-base">Learning mode</h3>
            </div>
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList className="grid grid-cols-3 w-full bg-secondary/60">
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="intermediate">Standard</TabsTrigger>
                <TabsTrigger value="exam">Exam</TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              {mode === "beginner" && "Friendly pace with simple analogies — perfect for first exposure."}
              {mode === "intermediate" && "Structured explanations with balanced depth."}
              {mode === "exam" && "Crisp, high-yield, exam-focused. No fluff."}
            </p>
          </Card>

          <Button
            onClick={generate}
            disabled={loading}
            className="group relative w-full h-14 text-base font-semibold bg-gradient-hero text-primary-foreground hover:opacity-95 shadow-elegant overflow-hidden"
            size="lg"
          >
            <span className="absolute inset-0 bg-gradient-aurora opacity-0 group-hover:opacity-30 transition-opacity animate-gradient-shift" />
            {loading ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing your material…</>
            ) : (
              <><Zap className="h-5 w-5" /> Generate study plan <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </Button>

          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { n: "7", l: "Sections" },
              { n: "<10s", l: "To plan" },
              { n: "0", l: "Setup" },
            ].map((s) => (
              <div key={s.l} className="text-center px-2 py-3 rounded-xl glass border-border/40">
                <div className="font-display font-bold text-lg text-gradient">{s.n}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Output column */}
        <section ref={outputRef} className="min-h-[600px]">
          {!hasOutput && !loading && (
            <Card className="relative h-full min-h-[600px] flex flex-col items-center justify-center text-center p-10 border-dashed border-2 border-border/60 shadow-none bg-card/40 backdrop-blur-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none" />
              <div className="relative h-20 w-20 rounded-3xl bg-gradient-accent flex items-center justify-center shadow-accent-glow mb-6 animate-float">
                <GraduationCap className="h-9 w-9 text-accent-foreground" />
              </div>
              <h3 className="font-display text-3xl font-bold mb-3">Your plan appears here</h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Drop in any topic on the left. We'll extract key concepts, build a personalized
                action plan, generate practice questions, and flag mistakes to avoid.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 max-w-md">
                {SECTIONS.slice(0, 5).map((s) => (
                  <span key={s.key} className="text-xs px-2.5 py-1 rounded-full glass border-border/60">
                    {s.icon} {s.label}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {(hasOutput || loading) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {SECTIONS.map((s, i) => {
                const body = sections[s.key];
                const isPending = !body && loading;
                return (
                  <Card
                    key={s.key}
                    className="group relative p-5 glass-strong border-border/60 shadow-card hover-lift overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.tone} opacity-60 pointer-events-none`} />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{s.icon}</span>
                        <h4 className="font-display font-bold text-sm tracking-tight">{s.label}</h4>
                        {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground ml-auto" />}
                      </div>
                      {body ? (
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
                          {body}
                        </pre>
                      ) : (
                        <div className="space-y-2">
                          <div className="h-2.5 rounded bg-muted/80 animate-pulse w-3/4" />
                          <div className="h-2.5 rounded bg-muted/80 animate-pulse w-1/2" />
                          <div className="h-2.5 rounded bg-muted/80 animate-pulse w-2/3" />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="container py-10 text-center text-xs text-muted-foreground border-t border-border/40">
        Built with Lovable Cloud · Crafted for focused learners
      </footer>
    </div>
  );
};

export default Index;

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Plus, 
  FileText, 
  Zap, 
  BrainCircuit, 
  Target, 
  Timer, 
  TrendingUp, 
  MessageSquareCode,
  ChevronRight,
  BookOpen,
  Upload,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Lightbulb,
  ListChecks,
  Activity,
  Terminal,
  Cpu,
  Upload
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Mission Control");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string; status: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("");
  const [streamingConcepts, setStreamingConcepts] = useState<string[]>([]);
  const [streamingTasks, setStreamingTasks] = useState<{ title: string; duration: string }[]>([]);
  const [analysisResult, setAnalysisResult] = useState<{
    title: string;
    concepts: string[];
    tasks: { title: string; duration: string }[];
  } | null>(null);

  const processFiles = (newFiles: File[]) => {
    setIsUploading(true);
    setAnalysisResult(null);
    setUploadProgress(0);
    setStreamingConcepts([]);
    setStreamingTasks([]);
    
    const fileName = newFiles[0]?.name || "Document.pdf";
    const steps = [
      { msg: "Initializing Neural Engine...", progress: 10 },
      { msg: "Scanning Document Architecture...", progress: 30 },
      { msg: "Extracting Semantic Nodes...", progress: 50 },
      { msg: "Mapping Cognitive Dependencies...", progress: 70 },
      { msg: "Optimizing Study Trajectory...", progress: 90 },
      { msg: "Finalizing Action Plan...", progress: 100 },
    ];

    const concepts = ["Wave-Particle Duality", "Schrödinger Equation", "Quantum Entanglement", "Heisenberg Uncertainty Principle"];
    const tasks = [
      { title: "Derive Probability Densities", duration: "15 min" },
      { title: "Review Photoelectric Effect", duration: "10 min" },
      { title: "Practice Spin Matrices", duration: "20 min" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAnalysisStep(steps[currentStep].msg);
        setUploadProgress(steps[currentStep].progress);
        
        // Start streaming concepts at step 2
        if (currentStep === 2) {
           concepts.forEach((c, i) => {
             setTimeout(() => setStreamingConcepts(prev => [...prev, c]), i * 400);
           });
        }
        
        // Start streaming tasks at step 4
        if (currentStep === 4) {
           tasks.forEach((t, i) => {
             setTimeout(() => setStreamingTasks(prev => [...prev, t]), i * 500);
           });
        }

        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setAnalysisResult({
            title: fileName,
            concepts,
            tasks
          });
          setFiles(prev => [{ name: fileName, size: "2.4 MB", status: "Analyzed" }, ...prev]);
          toast.success("AI Synthesis Complete!", {
             icon: <Sparkles className="w-4 h-4 text-primary" />,
             style: { background: '#050505', border: '1px solid #333', color: '#fff' }
          });
        }, 800);
      }
    }, 1200);
  };

  const [actionItems] = useState([
    { id: 1, title: "Review Quantum Mechanics Notes", time: "25 min", difficulty: "High", type: "Study" },
    { id: 2, title: "Practice Calculus Integrals", time: "40 min", difficulty: "Medium", type: "Practice" },
    { id: 3, title: "Revise Bio-Cell Mapping", time: "15 min", difficulty: "Low", type: "Revise" },
  ]);

  const sidebarItems = [
    { icon: Target, label: "Mission Control" },
    { icon: FileText, label: "Document Hub" },
    { icon: TrendingUp, label: "Skill Analytics" },
    { icon: BrainCircuit, label: "Study Vault" },
    { icon: Zap, label: "Practice Arena" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Mission Control":
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="xl:col-span-2 space-y-8">
              {!isUploading && !analysisResult ? (
                <Card className="glass border-white/10 shadow-glow-soft overflow-hidden group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-3xl font-black text-white tracking-tight">Document-to-Action Engine</CardTitle>
                        <CardDescription className="text-slate-400 font-bold text-lg">Drop PDFs to extract real-time intelligence</CardDescription>
                      </div>
                      <Zap className="w-12 h-12 text-primary opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className={`relative border-2 border-dashed rounded-[40px] p-20 flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
                        isDragging ? "border-primary bg-primary/20 scale-[0.98] shadow-glow" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                      } cursor-pointer`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFiles(Array.from(e.dataTransfer.files)); }}
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <input id="file-upload" type="file" multiple className="hidden" onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))} />
                      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 ${isDragging ? "bg-primary rotate-12 scale-110 shadow-glow" : "bg-primary/20 group-hover:bg-primary/30"}`}>
                        <Upload className={`w-12 h-12 ${isDragging ? "text-white" : "text-primary"}`} />
                      </div>
                      <div className="text-center space-y-3">
                        <p className="text-white font-black text-3xl tracking-tight leading-none">Click or drag to start</p>
                        <p className="text-slate-500 font-bold text-xl">PDF, JPG, MD, and Voice Queries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : isUploading ? (
                <Card className="glass border-primary/40 shadow-glow overflow-hidden animate-in zoom-in-95 duration-500">
                  <CardHeader className="bg-primary/10 border-b border-white/5 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                          <Activity className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-black text-white uppercase tracking-tighter">Live Neural Synthesis</CardTitle>
                          <div className="flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                             <CardDescription className="text-primary font-black text-sm uppercase tracking-widest">{analysisStep}</CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-3xl font-black text-white">{uploadProgress}%</p>
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest">Optimizing</p>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                       <div className="h-full bg-gradient-hero rounded-full shadow-glow transition-all duration-1000" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest">
                           <Terminal className="w-4 h-4" /> Live Concept Stream
                        </div>
                        <div className="flex flex-wrap gap-3 min-h-[100px]">
                           {streamingConcepts.map((c, i) => (
                             <Badge key={i} className="bg-primary/20 text-white border-primary/30 px-4 py-2 text-sm font-bold animate-in slide-in-from-left-4 duration-500 shadow-glow-soft">
                               {c}
                             </Badge>
                           ))}
                           {streamingConcepts.length === 0 && <p className="text-slate-600 font-bold italic">Awaiting data nodes...</p>}
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center gap-2 text-accent font-black uppercase text-xs tracking-widest">
                           <Cpu className="w-4 h-4" /> Action Plan Synthesis
                        </div>
                        <div className="space-y-3 min-h-[150px]">
                           {streamingTasks.map((t, i) => (
                             <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 animate-in slide-in-from-right-4 duration-500 shadow-glow-soft">
                                <span className="text-white font-black">{t.title}</span>
                                <Badge className="bg-accent/20 text-accent border-none">{t.duration}</Badge>
                             </div>
                           ))}
                           {streamingTasks.length === 0 && <p className="text-slate-600 font-bold italic">Synthesizing study trajectory...</p>}
                        </div>
                     </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass border-green-500/30 shadow-glow overflow-hidden animate-in zoom-in-95 duration-500">
                  <CardHeader className="bg-green-500/10 border-b border-white/5 p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-black text-white">{analysisResult?.title}</CardTitle>
                          <CardDescription className="text-green-400 font-black uppercase tracking-widest text-xs">Synthesis Complete • Neural Model Applied</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full h-12 w-12" onClick={() => setAnalysisResult(null)}>
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest">
                          <Lightbulb className="w-5 h-5" /> Mastered Concepts
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {analysisResult?.concepts.map((c, i) => (
                            <Badge key={i} className="bg-white/5 hover:bg-primary/20 text-white border-white/10 px-5 py-2 text-base font-bold transition-all hover:scale-110 cursor-default">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-accent font-black uppercase text-xs tracking-widest">
                          <ListChecks className="w-5 h-5" /> Live Action Plan
                        </div>
                        <div className="space-y-3">
                          {analysisResult?.tasks.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/40 transition-all cursor-pointer group shadow-glow-soft">
                              <span className="text-white font-black group-hover:text-accent text-lg">{t.title}</span>
                              <Badge className="bg-accent/20 text-accent border-none font-black px-3 py-1">{t.duration}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6 pt-8 border-t border-white/10">
                      <Button className="flex-1 bg-gradient-hero hover:scale-105 transition-all text-white font-black h-16 rounded-2xl shadow-glow text-lg" onClick={() => {
                        toast.success("Tasks added to Mission Control!");
                        setAnalysisResult(null);
                      }}>
                        Deploy Plan <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 font-black h-16 rounded-2xl text-lg text-slate-300" onClick={() => setActiveTab("Study Vault")}>
                        Store in Vault
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="glass border-white/5 shadow-elegant overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-8">
                  <div>
                    <CardTitle className="text-2xl font-black text-white">Adaptive Memory Map</CardTitle>
                    <CardDescription className="text-slate-400 font-bold text-lg">Real-time cognitive retention tracker</CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <Badge className="bg-green-500/20 text-green-400 border-none font-black px-4 py-2 text-sm">92% Ready</Badge>
                    <Badge className="bg-red-500/20 text-red-400 border-none font-black px-4 py-2 text-sm">Needs Revision</Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,135,245,0.15)_0%,transparent_70%)]" />
                  <div className="flex flex-col items-center gap-4 relative z-10">
                    <BrainCircuit className="w-20 h-20 text-primary animate-pulse" />
                    <p className="text-white font-black text-2xl tracking-tighter">Neural Engine Synchronizing...</p>
                    <div className="flex gap-1">
                       {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="glass border-white/10 shadow-elegant overflow-hidden h-[450px] flex flex-col">
                <CardHeader className="bg-white/[0.03] border-b border-white/10 p-6">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8 text-accent shadow-glow" />
                    <CardTitle className="text-2xl font-black text-white">AI Priorities</CardTitle>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1">
                  <CardContent className="p-0">
                    {actionItems.map((item, i) => (
                      <div key={i} onClick={() => toast.success(`Active: ${item.title}`)} className="p-6 border-b border-white/5 hover:bg-white/[0.05] transition-all group cursor-pointer flex items-center justify-between">
                        <div className="space-y-3">
                          <p className="font-black text-white text-lg group-hover:text-primary transition-colors">{item.title}</p>
                          <div className="flex items-center gap-5 text-sm font-bold text-slate-400">
                            <span className="flex items-center gap-2"><Timer className="w-5 h-5 text-slate-500" /> {item.time}</span>
                            <Badge className={`px-3 py-1 rounded-lg font-black uppercase text-[10px] ${
                              item.difficulty === 'High' ? 'bg-red-500/20 text-red-400' : 
                              item.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                            }`}>{item.difficulty}</Badge>
                          </div>
                        </div>
                        <ChevronRight className="w-7 h-7 text-slate-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                    <div className="p-8 flex justify-center">
                      <Button variant="ghost" onClick={() => setActiveTab("Study Vault")} className="text-sm text-primary hover:text-white hover:bg-primary/20 uppercase tracking-[0.2em] font-black">
                        Analyze Full Directory
                      </Button>
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>

              <Card className="glass border-primary/20 shadow-glow-soft bg-gradient-to-br from-primary/15 to-transparent">
                <CardHeader className="p-6 pb-2">
                  <div className="flex items-center gap-3">
                    <MessageSquareCode className="w-8 h-8 text-primary shadow-glow" />
                    <CardTitle className="text-2xl font-black text-white">AI Coach</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="bg-black/60 rounded-[30px] p-6 border border-primary/30 shadow-2xl">
                    <p className="text-lg text-slate-200 italic leading-relaxed font-bold">
                      "You've mastered Calculus basic derivatives! I suggest skipping 'Chain Rule Intro' and jumping straight to 
                      <strong className="text-primary mx-1 font-black underline decoration-primary/30 underline-offset-4">Integration by Parts</strong> to maintain high momentum."
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={() => toast.success("Plan Synchronized!")} size="lg" className="bg-primary text-white hover:bg-primary/90 font-black flex-1 h-16 rounded-2xl shadow-glow text-lg">
                      Accept & Sync
                    </Button>
                    <Button size="lg" variant="ghost" className="flex-1 text-slate-400 font-black hover:bg-white/5 h-16 rounded-2xl">Skip</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "Document Hub":
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-6xl font-black text-white tracking-tighter">Knowledge Base</h3>
                <p className="text-slate-400 font-bold text-xl mt-2">Neural indexing of your synthesized materials</p>
              </div>
              <Button onClick={() => document.getElementById('file-upload')?.click()} className="bg-primary hover:bg-primary/90 text-white font-black h-16 px-10 rounded-2xl shadow-glow text-lg">
                <Plus className="w-6 h-6 mr-2" /> Upload New Node
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {files.length === 0 ? (
                <div className="col-span-full py-40 border-2 border-dashed border-white/10 rounded-[60px] flex flex-col items-center justify-center text-slate-500 bg-white/[0.01]">
                  <div className="w-32 h-32 rounded-[40px] bg-white/5 flex items-center justify-center mb-8">
                    <FileText className="w-16 h-16 opacity-30" />
                  </div>
                  <p className="text-3xl font-black text-white">Your hub is empty</p>
                  <p className="text-slate-500 mt-3 font-bold text-lg">Upload a document to initialize the learning engine</p>
                  <Button variant="link" className="text-primary font-black mt-6 text-xl hover:no-underline hover:text-white" onClick={() => setActiveTab("Mission Control")}>Return to Mission Control</Button>
                </div>
              ) : (
                files.map((file, i) => (
                  <Card key={i} className="glass border-white/10 hover:border-primary/50 transition-all group overflow-hidden rounded-[30px] shadow-glow-soft">
                    <CardContent className="p-8 flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110 group-hover:rotate-6">
                        <FileText className="w-10 h-10 text-slate-400 group-hover:text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden space-y-2">
                        <p className="font-black text-xl text-white truncate">{file.name}</p>
                        <div className="flex items-center gap-3">
                           <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black">{file.status}</Badge>
                           <p className="text-xs font-black text-slate-500">{file.size}</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-12 w-12 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-2xl" onClick={() => setFiles(f => f.filter((_, idx) => idx !== i))}>
                        <X className="w-6 h-6" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 animate-in fade-in duration-700">
            <div className="w-32 h-32 rounded-[40px] bg-primary/10 flex items-center justify-center shadow-glow">
              <TrendingUp className="w-16 h-16 text-primary animate-bounce" />
            </div>
            <div className="space-y-3">
              <h3 className="text-5xl font-black text-white tracking-tighter">{activeTab} Interface</h3>
              <p className="text-slate-400 max-w-2xl mx-auto text-xl font-bold leading-relaxed">
                Our neural engine is currently optimizing the {activeTab.toLowerCase()} trajectory based on your latest study sessions.
              </p>
            </div>
            <div className="flex gap-6">
               <Button className="bg-primary hover:bg-primary/90 text-white font-black h-16 px-12 rounded-2xl shadow-glow text-lg" onClick={() => setActiveTab("Mission Control")}>Back to Center</Button>
               <Button variant="outline" className="border-white/10 hover:bg-white/5 h-16 px-12 rounded-2xl text-lg font-black text-slate-400">Roadmap</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-100 font-sans selection:bg-primary/30 antialiased overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-25%] right-[-10%] w-[1000px] h-[1000px] rounded-full bg-primary/15 blur-[180px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-25%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-accent/15 blur-[180px] animate-pulse duration-[12s]" />
      </div>

      <div className="relative z-10 flex h-screen">
        <aside className="w-20 lg:w-80 border-r border-white/5 bg-black/70 backdrop-blur-3xl flex flex-col items-center lg:items-start p-8 gap-12 shrink-0">
          <div className="flex items-center gap-5 px-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow transition-transform hover:scale-110">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <span className="hidden lg:block font-black text-3xl tracking-tighter text-gradient-aurora">Study OS</span>
          </div>

          <nav className="flex-1 w-full space-y-4">
            {sidebarItems.map((item, i) => (
              <button key={i} onClick={() => setActiveTab(item.label)} className={`flex items-center gap-5 w-full p-5 rounded-[24px] transition-all duration-500 group ${
                activeTab === item.label ? "bg-primary/20 text-white shadow-glow" : "hover:bg-white/5 text-slate-400"
              }`}>
                <item.icon className={`w-7 h-7 transition-all duration-500 ${activeTab === item.label ? "text-primary scale-110 shadow-glow" : "group-hover:text-primary group-hover:scale-110"}`} />
                <span className={`hidden lg:block font-black text-xl tracking-tight ${activeTab === item.label ? "text-white" : "group-hover:text-slate-100"}`}>{item.label}</span>
                {activeTab === item.label && <div className="hidden lg:block ml-auto w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />}
              </button>
            ))}
          </nav>
          
          <div className="w-full p-8 bg-white/[0.03] rounded-[40px] border border-white/5 space-y-5">
            <div className="hidden lg:block space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[12px] uppercase tracking-[0.3em] text-slate-500 font-black">Neural Mastery</p>
                <p className="text-sm text-primary font-black">75%</p>
              </div>
              <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                <div className="h-full w-[75%] bg-gradient-hero rounded-full shadow-glow animate-pulse" />
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 lg:p-16 space-y-16 no-scrollbar scroll-smooth">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-5">
                 <h2 className="text-7xl font-black text-white tracking-tighter">{activeTab}</h2>
                 <Badge className="bg-primary/20 text-primary border-none font-black px-4 py-1.5 text-xs rounded-lg">SYS_V2.5</Badge>
              </div>
              <p className="text-slate-500 uppercase text-xs tracking-[0.4em] font-black flex items-center gap-4">
                <span className={`w-3 h-3 rounded-full animate-ping ${activeTab === "Mission Control" ? "bg-green-500" : "bg-primary shadow-glow"}`} />
                {activeTab === "Mission Control" ? "Neural Engine Live" : "Trajectory Synchronized"}
              </p>
            </div>
            <Button onClick={() => { toast.success("New AI session starting..."); setActiveTab("Mission Control"); }} className="bg-gradient-hero hover:scale-105 transition-all text-white font-black h-16 px-10 rounded-2xl shadow-glow border-none text-xl">
               <Plus className="w-7 h-7 mr-2" /> Start Node
            </Button>
          </header>

          <div className="pb-32">
            {renderContent()}
          </div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass { background: rgba(5, 5, 5, 0.8); backdrop-filter: blur(40px) saturate(250%); }
        .shadow-glow { box-shadow: 0 0 40px rgba(155, 135, 245, 0.4); }
        .shadow-glow-soft { box-shadow: 0 0 25px rgba(155, 135, 245, 0.2); }
        .text-gradient-aurora {
          background: linear-gradient(120deg, #9b87f5, #d946ef, #0ea5e9, #f97316, #9b87f5);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: aurora 15s ease infinite;
        }
        @keyframes aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Index;

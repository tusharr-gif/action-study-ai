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
  Loader2,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Lightbulb,
  ListChecks
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Mission Control");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string; status: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    title: string;
    concepts: string[];
    tasks: { title: string; duration: string }[];
  } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const processFiles = (newFiles: File[]) => {
    setIsUploading(true);
    setAnalysisResult(null);
    toast.info(`Analyzing ${newFiles[0]?.name || 'document'}...`, {
      style: { background: '#1a1a1a', color: '#9b87f5', border: '1px solid #333' }
    });
    
    // Simulate complex AI analysis
    setTimeout(() => {
      const fileName = newFiles[0]?.name || "Quantum_Physics_Notes.pdf";
      const processed = newFiles.map(f => ({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(2) + " MB",
        status: "Analyzed"
      }));
      
      setFiles(prev => [...processed, ...prev]);
      setIsUploading(false);
      
      // Generate mocked analysis result
      setAnalysisResult({
        title: fileName,
        concepts: ["Wave-Particle Duality", "Schrödinger Equation", "Quantum Entanglement", "Heisenberg Uncertainty Principle"],
        tasks: [
          { title: "Derive Probability Densities", duration: "15 min" },
          { title: "Review Photoelectric Effect", duration: "10 min" },
          { title: "Practice Spin Matrices", duration: "20 min" }
        ]
      });
      
      toast.success("Intelligence extraction complete!", {
        icon: <Sparkles className="w-4 h-4 text-primary" />
      });
    }, 2500);
  };

  const [actionItems, setActionItems] = useState([
    { id: 1, title: "Review Quantum Mechanics Notes", time: "25 min", difficulty: "High", type: "Study" },
    { id: 2, title: "Practice Calculus Integrals", time: "40 min", difficulty: "Medium", type: "Practice" },
    { id: 3, title: "Revise Bio-Cell Mapping", time: "15 min", difficulty: "Low", type: "Revise" },
  ]);

  const sidebarItems = [
    { icon: Target, label: "Mission Control" },
    { icon: FileText, label: "Document Hub" },
    { icon: TrendingUp, label: "Skill Analytics" },
    { icon: BookOpen, label: "Study Vault" },
    { icon: Zap, label: "Practice Arena" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Mission Control":
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Document-to-Action Engine or Analysis Result */}
            <div className="xl:col-span-2 space-y-6">
              {!analysisResult ? (
                <Card className="glass border-white/10 shadow-glow-soft overflow-hidden group">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-white">Document-to-Action Engine</CardTitle>
                        <CardDescription className="text-slate-300 font-medium">Drop nodes, PDFs, or images to extract intelligence</CardDescription>
                      </div>
                      <Zap className={`w-10 h-10 text-primary ${isUploading ? 'animate-pulse' : 'opacity-80'}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div 
                      className={`relative border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center gap-6 transition-all duration-500 ${
                        isDragging ? "border-primary bg-primary/20 scale-[0.99] shadow-glow" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20"
                      } cursor-pointer`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <input 
                        id="file-upload" 
                        type="file" 
                        multiple 
                        className="hidden" 
                        onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
                      />
                      
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDragging ? "bg-primary rotate-12 scale-110 shadow-glow" : "bg-primary/20 group-hover:bg-primary/30"}`}>
                        {isUploading ? (
                          <Loader2 className="w-10 h-10 text-white animate-spin" />
                        ) : (
                          <Upload className={`w-10 h-10 ${isDragging ? "text-white" : "text-primary"}`} />
                        )}
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-white font-bold text-2xl tracking-tight">
                          {isDragging ? "Release to Analyze" : "Click or drag documents to start"}
                        </p>
                        <p className="text-slate-400 font-medium text-lg">Supports PDF, JPG, MD, and Voice Queries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass border-primary/30 shadow-glow overflow-hidden animate-in zoom-in-95 duration-500">
                  <CardHeader className="bg-primary/10 border-b border-white/5 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white">{analysisResult.title}</CardTitle>
                          <CardDescription className="text-primary font-semibold">Analysis Successful</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full" onClick={() => setAnalysisResult(null)}>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Concepts */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                          <Lightbulb className="w-4 h-4" /> Key Concepts Extracted
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.concepts.map((c, i) => (
                            <Badge key={i} className="bg-white/5 hover:bg-primary/20 text-slate-100 border-white/10 px-3 py-1 text-sm font-medium transition-colors">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Tasks */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-accent font-bold uppercase text-xs tracking-widest">
                          <ListChecks className="w-4 h-4" /> AI Generated Action Plan
                        </div>
                        <div className="space-y-2">
                          {analysisResult.tasks.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all cursor-pointer group">
                              <span className="text-slate-200 font-semibold group-hover:text-accent">{t.title}</span>
                              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-[10px] font-bold">{t.duration}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4 border-t border-white/5">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 shadow-glow" onClick={() => {
                        toast.success("Tasks added to Mission Control!");
                        setAnalysisResult(null);
                      }}>
                        Add to Priorities <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5 font-bold h-12" onClick={() => setActiveTab("Study Vault")}>
                        Save to Vault
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Performance Section (Visible on Mission Control) */}
              <Card className="glass border-white/5 shadow-elegant overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-xl font-bold text-white">Adaptive Memory Map</CardTitle>
                    <CardDescription className="text-slate-400 font-medium">Cognitive retention tracking</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-none font-bold">92% Ready</Badge>
                    <Badge className="bg-red-500/20 text-red-400 border-none font-bold">Needs Revision</Badge>
                  </div>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,135,245,0.1)_0%,transparent_70%)]" />
                  <div className="flex flex-col items-center gap-3 relative z-10">
                    <BrainCircuit className="w-16 h-16 text-primary animate-pulse" />
                    <p className="text-slate-200 font-bold text-lg">Synthesizing Learning Patterns...</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Modules (Priorities & Coach) */}
            <div className="space-y-6">
              {/* Smart Study Priorities */}
              <Card className="glass border-white/10 shadow-elegant overflow-hidden h-[400px] flex flex-col">
                <CardHeader className="bg-white/[0.03] border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-accent" />
                    <CardTitle className="text-xl font-bold text-white">AI Priorities</CardTitle>
                  </div>
                </CardHeader>
                <ScrollArea className="flex-1">
                  <CardContent className="p-0">
                    {actionItems.map((item, i) => (
                      <div 
                        key={i} 
                        onClick={() => toast.success(`Started: ${item.title}`)}
                        className="p-5 border-b border-white/5 hover:bg-white/[0.05] transition-all group cursor-pointer flex items-center justify-between"
                      >
                        <div className="space-y-2">
                          <p className="font-bold text-slate-100 text-base group-hover:text-primary transition-colors">{item.title}</p>
                          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                            <span className="flex items-center gap-1.5"><Timer className="w-4 h-4 text-slate-500" /> {item.time}</span>
                            <Badge variant="outline" className={`text-[10px] uppercase font-black py-0 h-5 border-none ${
                              item.difficulty === 'High' ? 'bg-red-500/20 text-red-400' : 
                              item.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                              {item.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                    <div className="p-6 flex justify-center">
                      <Button variant="ghost" onClick={() => setActiveTab("Study Vault")} className="text-sm text-primary hover:text-white hover:bg-primary/20 uppercase tracking-widest font-black">
                        View all optimized tasks
                      </Button>
                    </div>
                  </CardContent>
                </ScrollArea>
              </Card>

              {/* AI Coach Feedback */}
              <Card className="glass border-primary/20 shadow-glow-soft bg-gradient-to-br from-primary/10 to-transparent">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquareCode className="w-6 h-6 text-primary" />
                    <CardTitle className="text-xl font-bold text-white">AI Coach</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="bg-black/40 rounded-2xl p-5 border border-primary/30 shadow-inner">
                    <p className="text-base text-slate-200 italic leading-relaxed font-medium">
                      "You've mastered Calculus basic derivatives! I suggest skipping 'Chain Rule Intro' and jumping straight to 
                      <strong className="text-primary mx-1 font-bold">Integration by Parts</strong> to maintain high momentum."
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => toast.success("Plan Synchronized!")}
                      size="lg" 
                      className="bg-primary text-white hover:bg-primary/90 font-bold flex-1 shadow-glow"
                    >
                      Accept & Learn
                    </Button>
                    <Button size="lg" variant="ghost" className="flex-1 text-slate-300 font-bold hover:bg-white/5">Suggest Break</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "Document Hub":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-4xl font-black text-white tracking-tight">Knowledge Base</h3>
                <p className="text-slate-400 font-medium text-lg mt-1">Your synthesized study materials</p>
              </div>
              <Button onClick={() => document.getElementById('file-upload')?.click()} className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 shadow-glow">
                <Plus className="w-5 h-5 mr-2" /> Upload New
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.length === 0 ? (
                <div className="col-span-full py-32 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-slate-500 bg-white/[0.01]">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <FileText className="w-12 h-12 opacity-40" />
                  </div>
                  <p className="text-2xl font-bold text-slate-300">Your hub is empty</p>
                  <p className="text-slate-500 mt-2">Upload a PDF to see the magic happen</p>
                  <Button variant="link" className="text-primary font-bold mt-4 text-lg" onClick={() => setActiveTab("Mission Control")}>Back to Mission Control</Button>
                </div>
              ) : (
                files.map((file, i) => (
                  <Card key={i} className="glass border-white/10 hover:border-primary/50 transition-all group overflow-hidden">
                    <CardContent className="p-6 flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all group-hover:scale-110">
                        <FileText className="w-8 h-8 text-slate-400 group-hover:text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden space-y-1">
                        <p className="font-bold text-lg text-white truncate">{file.name}</p>
                        <p className="text-sm font-bold text-primary">{file.status}</p>
                        <p className="text-xs font-medium text-slate-500">{file.size}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl" onClick={() => setFiles(f => f.filter((_, idx) => idx !== i))}>
                        <X className="w-5 h-5" />
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
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 animate-in fade-in duration-700">
            <div className="w-24 h-24 rounded-[30px] bg-primary/10 flex items-center justify-center shadow-glow-soft">
              <TrendingUp className="w-12 h-12 text-primary animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white tracking-tight">{activeTab} Module</h3>
              <p className="text-slate-400 max-w-lg mx-auto text-lg font-medium leading-relaxed">
                This high-fidelity interface is being synchronized with your learning patterns. Our neural engine is optimizing your {activeTab.toLowerCase()} experience.
              </p>
            </div>
            <div className="flex gap-4">
               <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8" onClick={() => setActiveTab("Mission Control")}>Return to Control</Button>
               <Button variant="outline" className="border-white/10 hover:bg-white/5 h-12 px-8">View Roadmap</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 font-sans selection:bg-primary/30 antialiased overflow-hidden">
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-primary/10 blur-[150px] animate-pulse duration-[8s]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-accent/10 blur-[150px] animate-pulse duration-[10s]" />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Left Navigation Sidebar */}
        <aside className="w-20 lg:w-72 border-r border-white/5 bg-black/60 backdrop-blur-3xl flex flex-col items-center lg:items-start p-6 gap-10 shrink-0">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <span className="hidden lg:block font-black text-2xl tracking-tighter text-gradient-aurora">Study OS</span>
          </div>

          <nav className="flex-1 w-full space-y-3">
            {sidebarItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.label ? "bg-primary/15 text-white shadow-glow-soft" : "hover:bg-white/5 text-slate-400"
                }`}
              >
                <item.icon className={`w-6 h-6 transition-all duration-300 ${
                  activeTab === item.label ? "text-primary scale-110" : "group-hover:text-primary group-hover:scale-110"
                }`} />
                <span className={`hidden lg:block font-bold text-lg ${
                  activeTab === item.label ? "text-white" : "group-hover:text-slate-100"
                }`}>{item.label}</span>
                {activeTab === item.label && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow" />}
              </button>
            ))}
          </nav>
          
          <div className="w-full p-6 bg-white/[0.03] rounded-3xl border border-white/5 space-y-4">
            <div className="hidden lg:block space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-black">Daily Mastery</p>
                <p className="text-xs text-primary font-black">75%</p>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                <div className="h-full w-[75%] bg-gradient-hero rounded-full shadow-glow animate-pulse" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-12 no-scrollbar scroll-smooth">
          {/* Header Section */}
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                 <h2 className="text-5xl font-black text-white tracking-tighter">{activeTab}</h2>
                 <Badge className="bg-primary/20 text-primary border-none font-black px-3 py-1">V2.4.0</Badge>
              </div>
              <p className="text-slate-400 uppercase text-xs tracking-[0.3em] font-black flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full animate-ping ${activeTab === "Mission Control" ? "bg-green-500" : "bg-primary"}`} />
                {activeTab === "Mission Control" ? "Adaptive Neural Engine Active" : "Module Fully Synchronized"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => {
                  toast.success("New AI-optimized session starting...");
                  setActiveTab("Mission Control");
                }}
                className="bg-gradient-hero hover:scale-105 transition-all text-white font-black h-14 px-8 rounded-2xl shadow-glow border-none text-lg"
              >
                <Plus className="w-6 h-6 mr-2" /> New Study Session
              </Button>
            </div>
          </header>

          <div className="pb-20">
            {renderContent()}
          </div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass { background: rgba(10, 10, 10, 0.7); backdrop-filter: blur(25px) saturate(200%); }
        .shadow-glow { box-shadow: 0 0 30px rgba(155, 135, 245, 0.4); }
        .shadow-glow-soft { box-shadow: 0 0 20px rgba(155, 135, 245, 0.15); }
        .text-gradient-aurora {
          background: linear-gradient(120deg, #9b87f5, #d946ef, #0ea5e9, #f97316);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: aurora 10s ease infinite;
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

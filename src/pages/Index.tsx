import { useState, useCallback } from "react";
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
  X
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("Mission Control");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string; status: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
    toast.info(`Processing ${newFiles.length} file(s)...`);
    
    // Simulate upload delay
    setTimeout(() => {
      const processed = newFiles.map(f => ({
        name: f.name,
        size: (f.size / 1024 / 1024).toFixed(2) + " MB",
        status: "Analyzed"
      }));
      setFiles(prev => [...processed, ...prev]);
      setIsUploading(false);
      toast.success("Intelligence extracted from documents!");
    }, 2000);
  };

  // Mocked Study OS Data
  const actionItems = [
    { id: 1, title: "Review Quantum Mechanics Notes", time: "25 min", difficulty: "High", type: "Study" },
    { id: 2, title: "Practice Calculus Integrals", time: "40 min", difficulty: "Medium", type: "Practice" },
    { id: 3, title: "Revise Bio-Cell Mapping", time: "15 min", difficulty: "Low", type: "Revise" },
  ];

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
            {/* Document-to-Action Engine */}
            <Card className="xl:col-span-2 glass border-white/5 shadow-elegant overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Document-to-Action Engine</CardTitle>
                    <CardDescription>Drop nodes, PDFs, or images to extract intelligence</CardDescription>
                  </div>
                  <Zap className={`w-8 h-8 text-primary ${isUploading ? 'animate-pulse' : 'opacity-50'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
                    isDragging ? "border-primary bg-primary/10 scale-[0.99]" : "border-white/10 bg-white/[0.02] hover:bg-primary/[0.03]"
                  } cursor-pointer group`}
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
                  
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isDragging ? "bg-primary scale-110" : "bg-primary/10 group-hover:bg-primary/20"}`}>
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Upload className={`w-8 h-8 ${isDragging ? "text-white" : "text-primary"}`} />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-slate-200 font-semibold text-lg">
                      {isDragging ? "Drop to Extract" : "Click or drag documents to start"}
                    </p>
                    <p className="text-slate-500 text-sm mt-1">Supports PDF, JPG, MD, and Voice Queries</p>
                  </div>

                  {files.length > 0 && (
                    <div className="absolute top-4 right-4 flex -space-x-2">
                      {files.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg bg-accent/20 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                          <FileText className="w-4 h-4 text-accent" />
                        </div>
                      ))}
                      {files.length > 3 && (
                        <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                          +{files.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Smart Study Priorities */}
            <Card className="glass border-white/5 shadow-elegant overflow-hidden h-full">
              <CardHeader className="bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  <CardTitle className="text-lg">AI Priorities</CardTitle>
                </div>
              </CardHeader>
              <ScrollArea className="h-[320px]">
                <CardContent className="p-0">
                  {actionItems.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => toast.success(`Started: ${item.title}`)}
                      className="p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-semibold group-hover:text-primary transition-colors">{item.title}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> {item.time}</span>
                          <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4 border-white/10 bg-white/5">
                            {item.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  <div className="p-4 flex justify-center">
                    <Button variant="ghost" onClick={() => setActiveTab("Study Vault")} className="text-xs text-slate-500 hover:text-white uppercase tracking-widest font-bold">
                      View all optimized tasks
                    </Button>
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>

            {/* AI Coach Feedback */}
            <Card className="glass border-white/5 shadow-elegant bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquareCode className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg text-primary">AI Coach Feedback</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-black/40 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm text-slate-300 italic">
                    "You've mastered Calculus basic derivatives! I suggest skipping 'Chain Rule Intro' and jumping straight to 
                    <strong> Integration by Parts</strong> to maintain high momentum."
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => toast.success("AI Recommendation Applied!")}
                    size="sm" 
                    className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 flex-1"
                  >
                    Accept & Learn
                  </Button>
                  <Button size="sm" variant="ghost" className="flex-1">Suggest Break</Button>
                </div>
              </CardContent>
            </Card>

            {/* Adaptive Memory Map */}
            <Card className="xl:col-span-2 glass border-white/5 shadow-elegant overflow-hidden">
               <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                   <CardTitle className="text-lg">Adaptive Memory Map</CardTitle>
                   <CardDescription>Topics tracking based on forgetting patterns</CardDescription>
                 </div>
                 <div className="flex gap-2">
                   <Badge className="bg-green-500/20 text-green-500 border-none">92% Ready</Badge>
                   <Badge className="bg-red-500/20 text-red-500 border-none">Needs Revision</Badge>
                 </div>
               </CardHeader>
               <CardContent className="h-64 flex items-center justify-center text-slate-500 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(155,135,245,0.05)_0%,transparent_70%)]" />
                 <div className="flex flex-col items-center gap-2 relative z-10">
                   <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
                   <p className="text-sm font-medium">Cognitive Dependency Map Loading...</p>
                 </div>
               </CardContent>
            </Card>
          </div>
        );
      case "Document Hub":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Your Knowledge Base</h3>
              <Button onClick={() => document.getElementById('file-upload')?.click()} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> Upload New
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.length === 0 ? (
                <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-500">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p>No documents uploaded yet</p>
                  <Button variant="link" onClick={() => setActiveTab("Mission Control")}>Back to Mission Control</Button>
                </div>
              ) : (
                files.map((file, i) => (
                  <Card key={i} className="glass border-white/5 hover:border-primary/30 transition-all group">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <FileText className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-semibold truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{file.size} • {file.status}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-600 hover:text-red-400" onClick={() => setFiles(f => f.filter((_, idx) => idx !== i))}>
                        <X className="w-4 h-4" />
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
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in duration-500">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-slate-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{activeTab} Module</h3>
              <p className="text-slate-500 max-w-md mx-auto mt-2">
                This high-fidelity interface is being synchronized with your learning patterns. Check back soon for full real-time analysis.
              </p>
            </div>
            <Button variant="outline" onClick={() => setActiveTab("Mission Control")}>Return to Control</Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-primary/30 antialiased overflow-hidden">
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Left Navigation Sidebar */}
        <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center lg:items-start p-4 gap-8 shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="hidden lg:block font-bold text-xl tracking-tight text-gradient-aurora">Study OS</span>
          </div>

          <nav className="flex-1 w-full space-y-2">
            {sidebarItems.map((item, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all group ${
                  activeTab === item.label ? "bg-primary/10 text-white" : "hover:bg-white/5 text-slate-400"
                }`}
              >
                <item.icon className={`w-6 h-6 transition-colors ${
                  activeTab === item.label ? "text-primary" : "group-hover:text-primary"
                }`} />
                <span className={`hidden lg:block font-medium ${
                  activeTab === item.label ? "text-slate-100" : "group-hover:text-slate-100"
                }`}>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="w-full p-4 border-t border-white/5 space-y-4">
            <div className="hidden lg:block">
              <div className="flex justify-between items-end mb-2">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Daily Goal</p>
                <p className="text-[10px] text-primary font-bold">75%</p>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[75%] bg-gradient-accent animate-pulse" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 no-scrollbar">
          {/* Header Section */}
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{activeTab}</h2>
              <p className="text-slate-400 mt-1 uppercase text-xs tracking-widest font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-ping ${activeTab === "Mission Control" ? "bg-green-500" : "bg-primary"}`} />
                {activeTab === "Mission Control" ? "Adaptive Learning Engine Active" : "Module Synchronized"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => {
                  toast.success("New AI-optimized session starting...");
                  setActiveTab("Mission Control");
                }}
                className="bg-gradient-hero hover-lift shadow-glow border-none"
              >
                <Plus className="w-5 h-5 mr-2" /> New Study Session
              </Button>
            </div>
          </header>

          {renderContent()}
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); }
        .shadow-glow { box-shadow: 0 0 20px rgba(155, 135, 245, 0.2); }
        .hover-lift:hover { transform: translateY(-2px); transition: transform 0.2s ease; }
      `}</style>
    </div>
  );
};

export default Index;

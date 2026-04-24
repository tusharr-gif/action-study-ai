import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FileText, 
  Zap, 
  BrainCircuit, 
  Target, 
  Timer, 
  TrendingUp, 
  MessageSquareCode,
  Clock,
  ChevronRight,
  BookOpen
} from "lucide-react";

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);

  // Mocked Study OS Data from Profile
  const actionItems = [
    { id: 1, title: "Review Quantum Mechanics Notes", time: "25 min", difficulty: "High", type: "Study" },
    { id: 2, title: "Practice Calculus Integrals", time: "40 min", difficulty: "Medium", type: "Practice" },
    { id: 3, title: "Revise Bio-Cell Mapping", time: "15 min", difficulty: "Low", type: "Revise" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-primary/30 antialiased">
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Left Navigation Sidebar - OS Menu */}
        <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center lg:items-start p-4 gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="hidden lg:block font-bold text-xl tracking-tight text-gradient-aurora">Study OS</span>
          </div>

          <nav className="flex-1 w-full space-y-2">
            {[
              { icon: Target, label: "Mission Control" },
              { icon: FileText, label: "Document Hub" },
              { icon: TrendingUp, label: "Skill Analytics" },
              { icon: BookOpen, label: "Study Vault" },
              { icon: Zap, label: "Practice Arena" },
            ].map((item, i) => (
              <button key={i} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-all group">
                <item.icon className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="hidden lg:block text-slate-400 font-medium group-hover:text-slate-100">{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="w-full p-4 border-t border-white/5 space-y-4">
            <div className="hidden lg:block">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold">Performance</p>
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
              <h2 className="text-3xl font-bold text-white tracking-tight">Mission Control</h2>
              <p className="text-slate-400 mt-1 uppercase text-xs tracking-widest font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                Adaptive Learning Engine Active
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-gradient-hero hover-lift shadow-glow">
                <Plus className="w-5 h-5 mr-2" /> New Study Session
              </Button>
            </div>
          </header>

          {/* Grid Layout for Study OS Modules */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Document-to-Action Engine (Input Module) */}
            <Card className="xl:col-span-2 glass border-white/5 shadow-elegant">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Document-to-Action Engine</CardTitle>
                    <CardDescription>Drop nodes, PDFs, or images to extract intelligence</CardDescription>
                  </div>
                  <Zap className="w-8 h-8 text-primary opacity-50" />
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:bg-primary/[0.03] transition-colors cursor-pointer"
                  onClick={() => setIsUploading(true)}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-200 font-semibold">Click or drag documents to start</p>
                    <p className="text-slate-500 text-sm mt-1">Supports PDF, JPG, MD, and Voice Queries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Study Priorities (Dashboard Module) */}
            <Card className="glass border-white/5 shadow-elegant overflow-hidden">
              <CardHeader className="bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  <CardTitle className="text-lg">AI Priorities</CardTitle>
                </div>
              </CardHeader>
              <ScrollArea className="h-[300px]">
                <CardContent className="p-0">
                  {actionItems.map((item, i) => (
                    <div key={i} className="p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors group cursor-pointer flex items-center justify-between">
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
                    <Button variant="ghost" className="text-xs text-slate-500 hover:text-white uppercase tracking-widest font-bold">
                      View all optimized tasks
                    </Button>
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>

            {/* AI Real-Time Coach Module */}
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
                  <Button size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 flex-1">Accept & Learn</Button>
                  <Button size="sm" variant="ghost" className="flex-1">Suggest Break</Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights Module */}
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
               <CardContent className="h-64 flex items-center justify-center text-slate-500">
                 <div className="flex flex-col items-center gap-2">
                   <BrainCircuit className="w-12 h-12 opacity-20" />
                   <p className="text-sm">Cognitive Dependency Map Loading...</p>
                 </div>
               </CardContent>
            </Card>

          </div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Index;

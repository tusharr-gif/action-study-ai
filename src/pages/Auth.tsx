import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome, Github, Facebook, Smartphone, ArrowRight, CheckCircle2, Scan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type AuthStep = "DETAILS" | "OTP" | "FACE" | "SUCCESS";

const Auth = () => {
  const [step, setStep] = useState<AuthStep>("DETAILS");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isFaceVerifying, setIsFaceVerifying] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNextStep = () => {
    if (step === "DETAILS") {
      if (!name || !phone) {
        toast.error("Please fill in all details");
        return;
      }
      setStep("OTP");
    } else if (step === "OTP") {
      if (otp.length !== 6) {
        toast.error("Enter a valid 6-digit OTP");
        return;
      }
      setStep("FACE");
    }
  };

  useEffect(() => {
    if (step === "FACE") {
      setIsFaceVerifying(true);
      // Simulate face verification process
      const timer = setTimeout(() => {
        setIsFaceVerifying(false);
        setStep("SUCCESS");
      }, 3500);

      // Access webcam for realistic effect
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch(err => console.error("Webcam error:", err));
      }

      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === "SUCCESS") {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] animate-bounce" />

      <div className="container relative z-10 flex flex-col items-center justify-center gap-8 py-12">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow mb-2 animate-in zoom-in-50 duration-500">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-aurora">
            Study Companion
          </h1>
          <p className="text-muted-foreground font-medium">Verify your identity to continue</p>
        </div>

        <Card className="w-full max-w-md glass border-white/20 shadow-elegant animate-in slide-in-from-bottom-5 duration-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">
              {step === "DETAILS" && "Get Started"}
              {step === "OTP" && "Verify Phone"}
              {step === "FACE" && "Face ID Scanning"}
              {step === "SUCCESS" && "Verified Successfully"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "DETAILS" && "Enter your info to create an account"}
              {step === "OTP" && `We've sent a code to ${phone}`}
              {step === "FACE" && "Look into the camera and stay still"}
              {step === "SUCCESS" && "Welcome back! Redirecting you..."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-8">
            {step === "DETAILS" && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/50 border-white/30 focus:border-primary/50 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+91 XXXXX XXXXX" 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white/50 border-white/30 focus:border-primary/50 transition-all duration-300"
                  />
                </div>
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-muted-foreground">Or continue with</span></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="hover:bg-red-50 hover:text-red-600 transition-colors duration-300"><Chrome className="w-5 h-5" /></Button>
                  <Button variant="outline" className="hover:bg-slate-900 hover:text-white transition-colors duration-300"><Github className="w-5 h-5" /></Button>
                  <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"><Facebook className="w-5 h-5" /></Button>
                </div>
              </div>
            )}

            {step === "OTP" && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-2 text-center">
                  <Label htmlFor="otp">Enter 6-digit code</Label>
                  <div className="flex justify-center gap-2">
                    <Input 
                      id="otp" 
                      placeholder="000000" 
                      maxLength={6}
                      className="text-center text-2xl tracking-[0.5em] font-bold h-14 bg-white/50 border-white/30"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <Button variant="link" className="text-sm text-primary">Resend Code</Button>
                </div>
              </div>
            )}

            {step === "FACE" && (
              <div className="flex flex-col items-center justify-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/30 shadow-glow">
                  {/* Face Scan Overlay Animation */}
                  <div className="absolute inset-0 z-10">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                  <video 
                    ref={videoRef}
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {!videoRef.current?.srcObject && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <Scan className="w-16 h-16 text-muted-foreground animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-primary animate-pulse font-medium">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Analyzing biometric data...
                </div>
              </div>
            )}

            {step === "SUCCESS" && (
              <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in zoom-in-50 duration-500">
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <p className="text-xl font-bold text-green-600 animate-in fade-in slide-in-from-bottom-2">Face Identity Verified</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4 px-8 pb-8">
            {(step === "DETAILS" || step === "OTP") && (
              <Button 
                onClick={handleNextStep} 
                className="w-full h-12 text-lg font-semibold bg-gradient-hero hover-lift shadow-glow group"
              >
                {step === "DETAILS" ? "Continue" : "Verify & Next"}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            
            {(step === "OTP" || step === "FACE") && step !== "SUCCESS" && (
              <Button 
                variant="ghost" 
                onClick={() => setStep(step === "OTP" ? "DETAILS" : "OTP")}
                className="w-full"
              >
                Go Back
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Footer info */}
        <p className="text-sm text-muted-foreground opacity-60">
          Protected by StudyCompanion Biometrics System
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Auth;

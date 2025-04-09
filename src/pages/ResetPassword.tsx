
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Target email and password for new admin
  const targetEmail = "root@ughoron.com";
  const newPassword = "UghoronAdmin2024"; // Password for new admin

  const createAdminAccount = async () => {
    try {
      setIsLoading(true);
      
      // Try to create user directly via the Supabase edge function without authentication
      const response = await fetch(`https://lipqduurjuahriznyaqw.supabase.co/functions/v1/manage-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-initial-admin",
          userData: {
            email: targetEmail,
            password: newPassword,
            fullName: "Root Admin"
          },
        }),
      });
      
      const result = await response.json();
      
      // Store debug info
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        result
      });
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to create admin account");
      }
      
      toast({
        title: "Success",
        description: `Admin account ${targetEmail} created successfully`,
      });
      
      setIsComplete(true);
    } catch (error) {
      console.error("Error creating admin account:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Try to login with the new credentials
  const tryLogin = async () => {
    try {
      setIsLoading(true);
      
      // First sign out the current user
      await supabase.auth.signOut();
      
      // Then attempt to sign in with the new credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login Successful",
        description: "You've been logged in with the new admin account",
      });
      
      // Redirect to home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Could not login with the new credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Run the account creation automatically when the component loads
  useEffect(() => {
    createAdminAccount();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-estate-background-dark to-estate-background">
      <div className="w-full max-w-md p-6 glass-card-ultra-light rounded-lg border border-estate-primary/20">
        <h1 className="text-2xl font-bold text-white mb-4">Create Admin Account</h1>
        <p className="text-white mb-6">
          {isComplete 
            ? `Admin account ${targetEmail} has been created with password "${newPassword}".`
            : `Creating admin account for ${targetEmail}...`}
        </p>
        
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : !isComplete ? (
          <div className="flex flex-col space-y-3">
            <Button 
              className="w-full apple-button"
              onClick={createAdminAccount}
            >
              Retry Creation
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
              onClick={() => setShowDebugDialog(true)}
            >
              Show Debug Info
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <Button 
              className="w-full apple-button"
              onClick={tryLogin}
            >
              Login with New Admin
            </Button>
            
            <Button 
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate("/auth")}
            >
              Go to Login Page
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
              onClick={() => setShowDebugDialog(true)}
            >
              Show Debug Info
            </Button>
          </div>
        )}
      </div>

      <Dialog open={showDebugDialog} onOpenChange={setShowDebugDialog}>
        <DialogContent className="max-w-md bg-black/80 text-white border border-estate-primary/20">
          <DialogHeader>
            <DialogTitle>Debug Information</DialogTitle>
            <DialogDescription className="text-white/70">
              Technical details about the admin creation attempt
            </DialogDescription>
          </DialogHeader>
          <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-xs text-white/80">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResetPassword;

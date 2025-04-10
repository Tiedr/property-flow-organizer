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
  const [accountExists, setAccountExists] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Target email and password for new admin
  const targetEmail = "root@ughoron.com";
  const newPassword = "UghoronAdmin2024"; // Password for new admin

  // Check if admin account already exists
  const checkAdminExists = async () => {
    setIsLoading(true);
    try {
      // Try to sign in with the admin credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: newPassword,
      });
      
      if (data.user) {
        // If login successful, account exists
        setAccountExists(true);
        setIsComplete(true);
        
        toast({
          title: "Admin Account Found",
          description: `The admin account ${targetEmail} already exists.`,
        });
        
        // Sign out again since we were just checking
        await supabase.auth.signOut();
      } else if (error?.message?.includes("Invalid login credentials")) {
        // Account might exist with different password
        setAccountExists(true);
        setIsComplete(false);
        
        toast({
          title: "Admin Account Found",
          description: "An account with this email already exists, but the password may be different.",
        });
      } else if (error?.message?.includes("not found")) {
        // Account does not exist
        setAccountExists(false);
        // Proceed to create the admin account
        createAdminAccount();
      } else {
        // Other error occurred
        throw error;
      }
    } catch (error: any) {
      console.log("Error checking admin account:", error);
      // If we can't check, assume we need to create it
      setAccountExists(false);
      createAdminAccount();
    } finally {
      setIsLoading(false);
    }
  };

  const createAdminAccount = async () => {
    try {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
  
  // Check if admin account exists when component loads
  useEffect(() => {
    checkAdminExists();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-estate-background-dark to-estate-background">
      <div className="w-full max-w-md p-6 glass-card-ultra-light rounded-lg border border-estate-primary/20">
        <h1 className="text-2xl font-bold text-white mb-4">Admin Account Setup</h1>
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <p className="text-white mb-2">Checking admin account status...</p>
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : accountExists ? (
          <div className="flex flex-col space-y-4">
            <p className="text-white mb-2">
              Admin account {targetEmail} already exists.
            </p>
            
            <Button 
              className="w-full apple-button"
              onClick={tryLogin}
            >
              Login with Admin Account
            </Button>
            
            <Button 
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate("/auth")}
            >
              Go to Login Page
            </Button>
          </div>
        ) : isComplete ? (
          <div className="flex flex-col space-y-4">
            <p className="text-white mb-2">
              Admin account {targetEmail} has been created successfully with password "{newPassword}".
            </p>
            
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
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <p className="text-white mb-2">
              Creating admin account for {targetEmail}...
            </p>
            
            <Button 
              className="w-full apple-button"
              onClick={createAdminAccount}
            >
              Retry Creation
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate("/auth")}
            >
              Go to Login Page
            </Button>
          </div>
        )}
        
        <div className="mt-4">
          <Button
            variant="ghost"
            className="w-full border-white/10 text-white/50 hover:bg-white/5 text-sm"
            onClick={() => setShowDebugDialog(true)}
          >
            Debug Info
          </Button>
        </div>
      </div>

      <Dialog open={showDebugDialog} onOpenChange={setShowDebugDialog}>
        <DialogContent className="max-w-md bg-black/80 text-white border border-estate-primary/20">
          <DialogHeader>
            <DialogTitle>Debug Information</DialogTitle>
            <DialogDescription className="text-white/70">
              Technical details about the admin account
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

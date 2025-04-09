
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const targetEmail = "admin@ughoron.com";
  const newPassword = "UghoronAdmin2024"; // New password

  const resetPassword = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to perform this action",
          variant: "destructive",
        });
        return;
      }
      
      const response = await fetch(`https://lipqduurjuahriznyaqw.supabase.co/functions/v1/manage-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: "reset-password",
          userData: {
            email: targetEmail,
            newPassword: newPassword
          },
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to reset password");
      }
      
      toast({
        title: "Success",
        description: result.message,
      });
      
      setIsComplete(true);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Run the password reset automatically when the component loads
  useEffect(() => {
    resetPassword();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-estate-background-dark to-estate-background">
      <div className="w-full max-w-md p-6 glass-card-ultra-light rounded-lg border border-estate-primary/20">
        <h1 className="text-2xl font-bold text-white mb-4">Password Reset</h1>
        <p className="text-white mb-6">
          {isComplete 
            ? `Password for ${targetEmail} has been reset to "${newPassword}".`
            : `Resetting password for ${targetEmail}...`}
        </p>
        
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : !isComplete ? (
          <Button 
            className="w-full apple-button"
            onClick={resetPassword}
          >
            Retry Reset
          </Button>
        ) : (
          <Button 
            className="w-full apple-button"
            onClick={() => window.location.href = "/auth"}
          >
            Go to Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

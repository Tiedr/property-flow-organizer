
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PromoteAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const targetEmail = "edafesamson50@gmail.com";

  const promoteToAdmin = async () => {
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
          action: "promote",
          userData: {
            email: targetEmail,
          },
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to promote user");
      }
      
      toast({
        title: "Success",
        description: result.message,
      });
      
      setIsComplete(true);
    } catch (error) {
      console.error("Error promoting user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to promote user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Run the promotion automatically when the component loads
  useEffect(() => {
    promoteToAdmin();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-estate-background-dark to-estate-background">
      <div className="w-full max-w-md p-6 glass-card-ultra-light rounded-lg border border-estate-primary/20">
        <h1 className="text-2xl font-bold text-white mb-4">User Promotion</h1>
        <p className="text-white mb-6">
          {isComplete 
            ? `User ${targetEmail} has been promoted to admin.`
            : `Promoting user ${targetEmail} to admin role...`}
        </p>
        
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : !isComplete ? (
          <Button 
            className="w-full apple-button"
            onClick={promoteToAdmin}
          >
            Retry Promotion
          </Button>
        ) : (
          <Button 
            className="w-full apple-button"
            onClick={() => window.location.href = "/"}
          >
            Return to Home
          </Button>
        )}
      </div>
    </div>
  );
};

export default PromoteAdmin;

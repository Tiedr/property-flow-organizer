
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const PromoteAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, userRole } = useAuth();
  
  const promoteToAdmin = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Update the user's profile to set them as an admin
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_admin: true,
          role: 'admin' 
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your account has been promoted to admin",
      });
      
      // Redirect to home page after a short delay
      setTimeout(() => navigate('/'), 1500);
      
    } catch (error: any) {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-estate-background-dark to-estate-background">
      <div className="w-full max-w-md p-6 glass-card-ultra-light rounded-lg border border-estate-primary/20">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            className="p-1 mr-2" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Promote Account</h1>
        </div>
        
        <div className="space-y-4">
          {isAdmin ? (
            <div className="text-white">
              <div className="flex items-center mb-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
                <ShieldCheck className="h-6 w-6 mr-2 text-green-300" />
                <p>Your account already has admin privileges.</p>
              </div>
              
              <p className="mb-4">Current role: <span className="font-semibold">{userRole || 'Not set'}</span></p>
              
              <Button 
                variant="outline" 
                className="w-full apple-button"
                onClick={() => navigate('/users')}
              >
                Go to User Management
              </Button>
            </div>
          ) : (
            <>
              <p className="text-white mb-2">
                This page allows you to promote your account to admin status. 
                Admin users have full access to all features of the application.
              </p>
              
              {userRole && (
                <p className="text-white mb-4">
                  Current role: <span className="font-semibold">{userRole}</span>
                </p>
              )}
              
              <Button 
                className="w-full apple-button"
                onClick={promoteToAdmin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Promoting...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Promote to Admin
                  </>
                )}
              </Button>
            </>
          )}
          
          <div className="pt-2">
            <Button 
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoteAdmin;

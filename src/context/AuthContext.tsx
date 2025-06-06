
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UserRole = "admin" | "secretary" | "sales";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  userRole: UserRole | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAdmin: false,
  userRole: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status and role when auth state changes
        // Use setTimeout to prevent recursion issues
        if (session?.user) {
          setTimeout(() => {
            checkUserPermissions(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setUserRole(null);
        }
      }
    );

    // Check current session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkUserPermissions(session.user.id);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserPermissions = async (userId: string) => {
    try {
      // Direct database query to fetch user permissions
      // This avoids RLS recursion because we're not calling RPC functions
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, role')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setIsAdmin(false);
        setUserRole(null);
        return;
      }
      
      // If profile exists, use its values
      if (profileData) {
        setIsAdmin(!!profileData.is_admin);
        setUserRole((profileData.role as UserRole) || null);
        
        console.log("User permissions from profile:", { 
          isAdmin: !!profileData.is_admin,
          role: profileData.role || null 
        });
      } else {
        setIsAdmin(false);
        setUserRole(null);
      }
    } catch (error) {
      console.error("Error checking user permissions:", error);
      setIsAdmin(false);
      setUserRole(null);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, userRole, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};


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
        if (session?.user) {
          checkUserPermissions(session.user.id);
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
          checkUserPermissions(session.user.id);
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
      // Call the database function directly using RPC
      // This avoids infinite recursion since we're using security definer functions
      const { data, error } = await supabase.rpc('is_admin', { user_id: userId });
      
      if (error) {
        throw error;
      }

      // Set admin status based on the function result
      setIsAdmin(!!data);
      
      // Get user role (might be null if not set)
      const { data: roleData, error: roleError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (roleError && roleError.code !== 'PGRST116') {
        console.error("Error fetching user role:", roleError);
      } else {
        setUserRole((roleData?.role as UserRole) || null);
      }
      
      console.log("User permissions:", { isAdmin: !!data, role: roleData?.role || null });
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

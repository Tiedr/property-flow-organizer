
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Loader2, UserPlus, Trash, ShieldCheck, ShieldOff, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type UserRole = "admin" | "secretary" | "sales";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  role: UserRole | null;
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ 
    email: "", 
    password: "", 
    fullName: "", 
    isAdmin: false,
    role: "sales" as UserRole
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // First get user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Then get user emails from auth.users (this would normally be done through admin API)
      // Since we can't directly query auth.users, we'll use a placeholder
      // In a real app, this would be done through a secure admin API endpoint
      
      const userProfiles = (profiles || []).map(profile => ({
        id: profile.id,
        email: "Loading...", // This would be filled by admin API
        full_name: profile.full_name,
        is_admin: profile.is_admin || false,
        role: (profile.role as UserRole) || null,
        created_at: profile.created_at
      }));
      
      setUsers(userProfiles);
      
      // In a real implementation, you would fetch the emails securely through a server function
      
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Email and password are required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real implementation, user creation would be done through admin APIs
      // or server functions for security
      toast({
        title: "User Creation",
        description: "User would be created through Supabase Admin API or Edge Function",
      });
      
      // Reset form and close dialog
      setNewUser({ email: "", password: "", fullName: "", isAdmin: false, role: "sales" });
      setIsAddDialogOpen(false);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAdminStatus = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isCurrentlyAdmin })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !isCurrentlyAdmin } : user
      ));
      
      toast({
        title: "Success",
        description: `Admin status ${!isCurrentlyAdmin ? "granted" : "revoked"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin status",
        variant: "destructive",
      });
    }
  };

  const changeUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-muted-foreground">Manage users and their permissions</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4 sm:mt-0 apple-button">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card className="glass-card overflow-hidden mb-8">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900/40">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Admin Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id} className="border-b border-white/5">
                    <TableCell>{user.full_name || "Not set"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role || "sales"}
                        onValueChange={(value) => changeUserRole(user.id, value as UserRole)}
                      >
                        <SelectTrigger className="w-[130px] glass-input">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-estate-primary/20">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="secretary">Secretary</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.is_admin ? "bg-indigo-500/20 text-indigo-300" : "bg-blue-500/20 text-blue-300"
                      }`}>
                        {user.is_admin ? "Admin" : "User"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 w-8 p-0 ${user.is_admin ? "text-indigo-400 hover:text-indigo-300" : "text-blue-400 hover:text-blue-300"} hover:bg-white/10`}
                          onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                          title={user.is_admin ? "Remove Admin Status" : "Grant Admin Status"}
                        >
                          {user.is_admin ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        )}
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="glass-card-ultra-light border-estate-primary/20">
          <DialogHeader>
            <DialogTitle className="text-gradient">Add New User</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new user account. Users will be able to access the system after creation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUser} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-white/70">Email</label>
              <Input
                id="email"
                type="email"
                className="glass-input"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm text-white/70">Password</label>
              <Input
                id="password"
                type="password"
                className="glass-input"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm text-white/70">Full Name (Optional)</label>
              <Input
                id="fullName"
                type="text"
                className="glass-input"
                value={newUser.fullName}
                onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm text-white/70">User Role</label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({...newUser, role: value as UserRole})}
              >
                <SelectTrigger className="w-full glass-input">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="glass-card border-estate-primary/20">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="secretary">Secretary</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isAdmin"
                type="checkbox"
                className="rounded border-gray-400"
                checked={newUser.isAdmin}
                onChange={(e) => setNewUser({...newUser, isAdmin: e.target.checked})}
              />
              <label htmlFor="isAdmin" className="text-sm text-white/70">Grant admin privileges</label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="apple-button-secondary">
                Cancel
              </Button>
              <Button type="submit" className="apple-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default UserManagement;

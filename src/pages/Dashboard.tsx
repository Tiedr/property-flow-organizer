
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client, Project } from "@/types";
import { generateMockClients, generateMockProjects } from "@/services/mockData";
import DataTable from "@/components/data/DataTable";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Generate mock data
    const mockClients = generateMockClients(15);
    setClients(mockClients);
    
    const mockProjects = generateMockProjects(mockClients, 25);
    setProjects(mockProjects);
  }, []);

  // Prepare chart data
  const getProjectStatusData = () => {
    const statusCount = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(statusCount).map(status => ({
      name: status,
      projects: statusCount[status]
    }));
  };

  const getProjectTypeData = () => {
    const typeCount = projects.reduce((acc, project) => {
      acc[project.type] = (acc[project.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(typeCount).map(type => ({
      name: type,
      projects: typeCount[type]
    }));
  };

  const getRecentProjects = () => {
    return [...projects]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-estate-muted">
          Welcome to PropertyFlow. Here's an overview of your projects and clients.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-estate-muted">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-estate-muted">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-estate-muted">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {projects.filter(p => p.status === "In Progress").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-estate-muted">Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {projects.filter(p => p.status === "Completed").length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getProjectStatusData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="projects" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Project Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getProjectTypeData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="projects" fill="#1e40af" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Projects</CardTitle>
            <Link to="/projects" className="text-sm text-estate-primary hover:underline">
              View all projects
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={getRecentProjects()}
            columns={[
              { key: "name", header: "Project Name" },
              { key: "clientName", header: "Client" },
              { key: "type", header: "Type" },
              { key: "status", header: "Status" },
              { 
                key: "budget", 
                header: "Budget",
                renderCell: (item: Project) => `$${item.budget.toLocaleString()}` 
              },
            ]}
            onRowClick={(project) => window.location.href = `/projects/${project.id}`}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;

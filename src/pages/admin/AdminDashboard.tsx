import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminAffiliates from "@/components/admin/AdminAffiliates";
import AdminOverrides from "@/components/admin/AdminOverrides";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminRefresh from "@/components/admin/AdminRefresh";

const AdminHead = () => (
  <Helmet>
    <meta name="robots" content="noindex,nofollow" />
    <title>Admin</title>
  </Helmet>
);

export default function AdminDashboard() {
  const { loading, session, isAdmin, user } = useAdminAuth();

  if (loading) {
    return <><AdminHead /><div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div></>;
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <AdminHead />
        <h1 className="text-xl font-semibold">Not authorized</h1>
        <p className="text-muted-foreground text-sm">
          Your account ({user?.email}) is signed in but does not have the admin role.
        </p>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <AdminHead />
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">AffiliateAI Admin</h1>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <AdminRefresh />
          <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="analytics">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="overrides">Overrides</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="pt-6"><AdminAnalytics /></TabsContent>
          <TabsContent value="affiliates" className="pt-6"><AdminAffiliates /></TabsContent>
          <TabsContent value="overrides" className="pt-6"><AdminOverrides /></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

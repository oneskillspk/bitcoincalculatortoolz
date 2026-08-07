import { supabase } from "./src/integrations/supabase/client";

async function check() {
  console.log("Checking database...");
  
  // Check contact_submissions table
  const { error: contactError } = await supabase.from('contact_submissions').select('count', { count: 'exact', head: true });
  console.log("Contact submissions access:", contactError ? contactError.message : "Success");

  // Check newsletter function
  const { error: newsletterError } = await supabase.rpc('subscribe_newsletter', { sub_email: 'test@example.com' });
  console.log("Newsletter RPC access:", newsletterError ? newsletterError.message : "Success (or likely exists if it didn't say 404)");
}

check();

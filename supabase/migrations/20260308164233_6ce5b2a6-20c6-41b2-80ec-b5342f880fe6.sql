-- contact_submissions: block SELECT, UPDATE, DELETE
CREATE POLICY "Deny select on contact_submissions" ON public.contact_submissions FOR SELECT USING (false);
CREATE POLICY "Deny update on contact_submissions" ON public.contact_submissions FOR UPDATE USING (false);
CREATE POLICY "Deny delete on contact_submissions" ON public.contact_submissions FOR DELETE USING (false);

-- newsletter_subscribers: block SELECT, UPDATE, DELETE
CREATE POLICY "Deny select on newsletter_subscribers" ON public.newsletter_subscribers FOR SELECT USING (false);
CREATE POLICY "Deny update on newsletter_subscribers" ON public.newsletter_subscribers FOR UPDATE USING (false);
CREATE POLICY "Deny delete on newsletter_subscribers" ON public.newsletter_subscribers FOR DELETE USING (false);

-- contact_rate_limits: block everything
CREATE POLICY "Deny select on contact_rate_limits" ON public.contact_rate_limits FOR SELECT USING (false);
CREATE POLICY "Deny insert on contact_rate_limits" ON public.contact_rate_limits FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny update on contact_rate_limits" ON public.contact_rate_limits FOR UPDATE USING (false);
CREATE POLICY "Deny delete on contact_rate_limits" ON public.contact_rate_limits FOR DELETE USING (false);

-- seo_audits: block INSERT, UPDATE, DELETE
CREATE POLICY "Deny insert on seo_audits" ON public.seo_audits FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny update on seo_audits" ON public.seo_audits FOR UPDATE USING (false);
CREATE POLICY "Deny delete on seo_audits" ON public.seo_audits FOR DELETE USING (false);

-- seo_issues: block INSERT, UPDATE, DELETE
CREATE POLICY "Deny insert on seo_issues" ON public.seo_issues FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny update on seo_issues" ON public.seo_issues FOR UPDATE USING (false);
CREATE POLICY "Deny delete on seo_issues" ON public.seo_issues FOR DELETE USING (false);

-- content_scores: block INSERT, UPDATE, DELETE
CREATE POLICY "Deny insert on content_scores" ON public.content_scores FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny update on content_scores" ON public.content_scores FOR UPDATE USING (false);
CREATE POLICY "Deny delete on content_scores" ON public.content_scores FOR DELETE USING (false);

-- performance_metrics: block INSERT, UPDATE, DELETE
CREATE POLICY "Deny insert on performance_metrics" ON public.performance_metrics FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny update on performance_metrics" ON public.performance_metrics FOR UPDATE USING (false);
CREATE POLICY "Deny delete on performance_metrics" ON public.performance_metrics FOR DELETE USING (false);
SitemapGenerator::Sitemap.default_host = ENV["WEBSITE_URL"]
SitemapGenerator::Sitemap.ping_search_engines("#{ENV["WEBSITE_URL"]}/sitemap.xml.gz")
SitemapGenerator::Sitemap.create do
  add root_path
  add new_user_registration_path
  add new_user_session_path
end


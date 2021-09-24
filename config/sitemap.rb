SitemapGenerator::Sitemap.default_host = "https://stylistpage.com"
SitemapGenerator::Sitemap.ping_search_engines("https://stylistpage.com/sitemap.xml.gz")
SitemapGenerator::Sitemap.create_index = true
SitemapGenerator::Sitemap.create do
  add "/auth/sign_in"
  add "/auth/sign_up"
  add "/terms_of_service"
  add "/privacy_policy"
end


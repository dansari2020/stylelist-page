SitemapGenerator::Sitemap.default_host = "https://stylistpage.herokuapp.com"
SitemapGenerator::Sitemap.ping_search_engines("https://stylistpage.herokuapp.com/sitemap.xml.gz")
SitemapGenerator::Sitemap.create do
  add root_path
  add new_user_registration_path
  add new_user_session_path
end


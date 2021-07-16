require "test_helper"

class AuthControllerTest < ActionDispatch::IntegrationTest
  test "should get check_email" do
    get auth_check_email_url
    assert_response :success
  end
end

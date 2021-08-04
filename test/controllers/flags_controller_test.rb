require "test_helper"

class FlagsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get flags_create_url
    assert_response :success
  end
end

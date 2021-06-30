require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get users_index_url
    assert_response :success
  end

  test "should get profile" do
    get users_profile_url
    assert_response :success
  end

  test "should get manage_account" do
    get users_manage_account_url
    assert_response :success
  end

  test "should get update" do
    get users_update_url
    assert_response :success
  end
end

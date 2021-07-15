require "test_helper"

class FeedbackMailerTest < ActionMailer::TestCase
  test "feedback_email" do
    mail = FeedbackMailer.feedback_email
    assert_equal "Feedback email", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end
end

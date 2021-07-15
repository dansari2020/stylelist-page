class FeedbacksController < ApplicationController
  before_action :authenticate_duck
  def new
    render turbo_stream: turbo_stream.replace("setting", partial: "feedbacks/form", locals: {feedback: feedback})
  end

  def create
    respond_to do |format|
      @feedback = current_user.feedbacks.create(feedback_params)
      if @feedback.valid?
        flash[:success] = "Thank you for your feedbacks."
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace("setting",
            partial: "feedbacks/form",
            locals: {feedback: feedback})
        end
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace("setting",
            partial: "feedbacks/form",
            locals: {feedback: @feedback})
        end
      end
    end
  end

  private

  def feedback_params
    params.require(:feedback).permit(:subject, :description)
  end

  def feedback
    current_user.feedbacks.new
  end
end

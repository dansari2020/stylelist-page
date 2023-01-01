import { Controller } from "stimulus"
import { Turbo } from "@hotwired/turbo-rails"

export default class extends Controller {
  static targets = ["form"]

  initialize() {
    this.listener = this.listener.bind(this)
  }

  connect() {
    this.formTarget.addEventListener("turbo:submit-end", this.listener)
  }

  disconnect() {
    this.formTarget.removeEventListener("turbo:submit-end", this.listener)
  }

  listener(event) {
    const fetchResponse = event.detail.fetchResponse
    if (fetchResponse && fetchResponse.response.status === 201) {
      Turbo.visit(fetchResponse.response.headers.get('Url'))
    }
  }
}
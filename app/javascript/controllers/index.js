// Load all the controllers within this directory and all subdirectories.
// Controller files must be named *_controller.js or *_controller.ts.

import { application } from "./application"

import HelloController from "./hello_controller"
application.register("hello", HelloController)


// import { Application } from "stimulus"
// import { definitionsFromContext } from "stimulus/webpack-helpers"

import { TimepickerUI } from "timepicker-ui";
window.TimepickerUI = TimepickerUI

// const application = Application.start()
// const context = require.context("controllers", true, /_controller\.(js|ts)$/)
// application.load(definitionsFromContext(context))

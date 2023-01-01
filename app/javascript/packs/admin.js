// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs";
import "@hotwired/turbo-rails";
import * as ActiveStorage from "@rails/activestorage";
import "channels";

// import alpinejs and its necessary rails adaptation
import "alpine-turbo-drive-adapter";
import "alpinejs";

// import tailwind into javascript
require("stylesheets/admin.scss");

Rails.start();
ActiveStorage.start();

import "./controllers";
import "./libs";

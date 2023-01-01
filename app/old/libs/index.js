// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);

// We listen to the resize event
window.addEventListener("resize", () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});

function tagSelect() {
  return {
    open: false,
    textInput: "",
    tags: [],
    tagIds: [],
    removeTags: [],
    init() {
      this.tags = JSON.parse(this.$el.parentNode.getAttribute("data-tags"));
      this.tagIds = JSON.parse(this.$el.parentNode.getAttribute("data-tagIds"));
    },
    addTag(tag) {
      tag = tag.trim();
      if (tag != "" && !this.hasTag(tag)) {
        this.tags.push(tag);
      }
      this.clearSearch();
      this.$refs.textInput.focus();
      this.fireTagsUpdateEvent();
    },
    toggleTag(tag) {
      tag = tag.trim();
      if (this.hasTag(tag)) {
        index = this.tags.indexOf(tag);
        this.removeTag(index);
      } else {
        this.tags.push(tag);
      }
      this.fireTagsUpdateEvent();
    },
    fireTagsUpdateEvent() {
      this.$el.dispatchEvent(
        new CustomEvent("tags-update", {
          detail: { tags: this.tags, removeTags: this.removeTags },
          bubbles: true,
        })
      );
    },
    hasTag(tag) {
      var tag = this.tags.find((e) => {
        return e.toLowerCase() === tag.toLowerCase();
      });
      return tag != undefined;
    },
    removeTag(index) {
      if (this.tagIds[index] !== undefined) {
        this.removeTags.push(this.tagIds[index]);
        this.tagIds.splice(index, 1);
      }
      this.tags.splice(index, 1);
      this.fireTagsUpdateEvent();
    },
    search(q) {
      if (q.includes(",")) {
        q.split(",").forEach(function (val) {
          this.addTag(val);
        }, this);
      }
      this.toggleSearch();
    },
    clearSearch() {
      this.textInput = "";
      this.toggleSearch();
    },
    toggleSearch() {
      this.open = this.textInput != "";
    },
    focusTag() {
      this.clearSearch();
      this.$refs.textInput.focus();
    },
  };
}
window.tagSelect = tagSelect;

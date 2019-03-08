import '../../../../@polymer/polymer/polymer-legacy.js';

/** @polymerBehavior Polymer.ypTranslatedPagesBehavior */
export const ypTranslatedPagesBehavior = {

  properties: {
    pages: {
      type: Array
    },

    translatedPages: {
      type: Array,
      computed: '_translatedPages(pages, language)'
    }
  },

  _translatedPages: function (pages, language) {
    if (pages) {
      return JSON.parse(JSON.stringify(pages));
    } else {
      return [];
    }
  },

  openPageFromId: function (pageId) {
    this.pages.forEach(function (page) {
      if (page.id==pageId) {
        this._openPage(page)
      }
    }.bind(this));
  },

  openUserInfoPage: function (pageId) {
    if (this.pages && this.pages.length>0) {
      this._openPage(this.pages[pageId]);
    } else {
      this.async(function () {
        this._openPage(this.pages[pageId]);
      }, 1000);
    }
  },

  _openPageFromMenu: function (event) {
    var index = JSON.parse(event.currentTarget.getAttribute('data-args'));
    var page = this.pages[index];
    this._openPage(page);
    this.$$("paper-listbox").select(null);
  },

  _openPage: function (page) {
    window.appGlobals.activity('open', 'pages', page.id);
    this.getDialogAsync("pageDialog", function (dialog) {
      var pageLocale = 'en';
      if (page.title[window.locale]) {
        pageLocale = window.locale;
      }
      dialog.open(page.title[pageLocale], page.content[pageLocale]);
    }.bind(this));
  },

  _getLocalizePageTitle: function (page) {
    var pageLocale = 'en';
    if (page.title[window.locale]) {
      pageLocale = window.locale;
    }
    return page.title[pageLocale];
  },

  _setPages: function (event, pages) {
    this.set('pages', pages);
  }
};

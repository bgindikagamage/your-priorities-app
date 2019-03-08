import '../../../../@polymer/polymer/polymer-legacy.js';
import '../yp-behaviors/yp-language-behavior.js';

/**
 * @polymerBehavior Polymer.ypEditDialogBehavior
 */
export const ypEditDialogBehavior = {

  properties: {

    new: {
      type: Boolean,
      value: true,
      observer: "_setupNewUpdateState"
    },

    editHeaderText: {
      type: String
    },

    saveText: {
      type: String
    },

    toastText: {
      type: String
    },

    params: {
      type: String
    },

    method: {
      type: String,
      value: "POST"
    },

    refreshFunction: {
      type: Function,
      value : null
    }
  },

  listeners: {
    'iron-form-response': '_formResponse'
  },

  _logoImageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedLogoImageId', image.id);
  },

  _headerImageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedHeaderImageId', image.id);
  },

  _defaultDataImageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedDefaultDataImageId', image.id);
  },

  _defaultPostImageUploaded: function (event, detail) {
    var image = JSON.parse(detail.xhr.response);
    this.set('uploadedDefaultPostImageId', image.id);
  },

  customFormResponse: function () {
  },

  _formResponse: function (event, detail) {
    if (typeof this._customRedirect == 'function') {
      this._customRedirect(detail.response);
    }
    if (typeof this.refreshFunction == 'function') {
      this.refreshFunction(detail.response);
    }
    if (event && event.detail && event.detail.response && event.detail.response.isError) {
      console.log("Not clearing form because of user error");
    } else {
      this._clear();
    }
    this.customFormResponse(event, detail);
  },

  _setupNewUpdateState: function () {
    if (this.new) {
      this.saveText = this.t('create');
      this.method = "POST";
    } else {
      this.saveText = this.t('update');
      this.method = "PUT";
    }
    this._setupTranslation();
  },

  open: function (newOrUpdate, params) {
    if (window.appUser && window.appUser.loggedIn()===true) {
      if (newOrUpdate && newOrUpdate==="new") {
        this.new = true;
      } else {
        this.new = false;
      }
      if (params)
        this.params = params;
      if (typeof this.setupAfterOpen === 'function') {
        this.setupAfterOpen(params);
      }
      this.$$("#editDialog").open();
    } else {
      window.appUser.loginForEdit(this.id, newOrUpdate, params, this.refreshFunction);
    }
  },

  close: function () {
    this.$.editDialog.close();
  }
};

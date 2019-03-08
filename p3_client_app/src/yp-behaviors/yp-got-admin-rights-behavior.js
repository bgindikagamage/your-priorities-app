import '../../../../@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior Polymer.ypGotAdminRightsBehavior
 */
export const ypGotAdminRightsBehavior = {

  properties: {
    gotAdminRights: {
      type: Boolean,
      notify: true,
      value: false,
      observer: '_gotAdminRightsChanged'
    }
  },

  listeners: {
    'yp-user-got-admin-rights': '_gotAdminRights'
  },

  _gotAdminRightsChanged: function () {},

  ready: function () {
    if (window.appUser && window.appUser.adminRights) {
      this.set('gotAdminRights', 1);
    }
  },

  _gotAdminRights: function (event, detail) {
    this.set('gotAdminRights', detail);
  }
};

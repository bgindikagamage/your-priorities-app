import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../lite-signal/lite-signal.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { YpPostBehavior } from '../yp-post/yp-post-behaviors.js';
import '../yp-user/yp-user-image.js';
import './ac-notification-truncated-name-list.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        text-align: left;
        margin-bottom: 24px;
      }

      .pointerCursor {
        cursor: pointer;
      }

      .icon {
        min-width: 24px;
        min-height: 24px;
        max-width: 24px;
        max-height: 24px;
        margin: 6px;
        margin-bottom: 0;
        padding-bottom: 0;
      }

      .name {
        padding-top: 4px;
        padding-bottom: 0;
        font-style: italic;
        color: #777;
      }

      .shortText {
        padding-right: 8px;
        color: #444;
        padding-bottom: 4px;
      }

      .leftContainer {
        margin-right: 8px;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <div class="layout vertical pointerCursor" on-tap="_goTo">
      <div class="layout horizontal">
        <div class="layout vertical center-center self-start leftContainer">
          <yp-user-image small="" user="[[user]]"></yp-user-image>
          <iron-icon icon\$="[[icon]]" class="icon"></iron-icon>
        </div>
        <div class="layout vertical">
          <div class="name">[[nameTruncated]]</div>
          <div hidden\$="[[!shortText]]" class="shortText">[[shortTextTruncated]]</div>
        </div>
      </div>
    </div>

    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
`,

  is: 'ac-notification-list-general-item',

  behaviors: [
    ypLanguageBehavior,
    YpPostBehavior,
    ypGotoBehavior,
    ypTruncateBehavior,
    ypMediaFormatsBehavior
  ],

  properties: {
    notification: {
      type: Object,
      observer: '_notificationChanged'
    },

    user: {
      type: Object,
      value: null
    },

    nameTruncated: {
      type: String,
      computed: '_nameTruncated(notification)'
    },

    icon: {
      type: String
    },

    shortText: {
      type: String
    },

    shortTextTruncated: {
      type: String,
      computed: '_shortTextTruncated(shortText)'
    }
  },

  _goTo: function () {
    var gotoLocation;
    if (this.post) {
      this.goToPost(this.post.id)
    } else {
      if (this.notification.AcActivities[0].Group && this.notification.AcActivities[0].Group.name!="hidden_public_group_for_domain_level_points") {
        gotoLocation = "/group/"+this.notification.AcActivities[0].Group.id+"/news/"+this.notification.AcActivities[0].id
      } else if (this.notification.AcActivities[0].Community) {
        gotoLocation = "/community/"+this.notification.AcActivities[0].Community.id+"/news/"+this.notification.AcActivities[0].id
      } else if (this.notification.AcActivities[0].Domain) {
        gotoLocation = "/domain/" + this.notification.AcActivities[0].Domain.id + "/news/" + this.notification.AcActivities[0].id
      }
      if (gotoLocation) {
        this.redirectTo(gotoLocation);
      }
    }
  },

  _nameTruncated: function (notification) {
    if (notification.AcActivities[0].Post) {
      return this.truncate(notification.AcActivities[0].Post.name, 42);
    } else if (notification.AcActivities[0].Group && notification.AcActivities[0].Group.name!="hidden_public_group_for_domain_level_points") {
      return this.truncate(notification.AcActivities[0].Group.name, 42);
    } else if (notification.AcActivities[0].Community) {
      return this.truncate(notification.AcActivities[0].Community.name, 42);
    } else if (notification.AcActivities[0].Domain) {
      return this.truncate(notification.AcActivities[0].Domain.name, 42);
    }
  },

  _shortTextTruncated: function (shortText) {
    if (shortText) {
      return this.truncate(shortText, 60);
    } else {
      return "";
    }
  },

  goToPost: function () {
    if (this.post) {
      var postUrl = '/post/' + this.post.id + '/news';
      window.appGlobals.activity('open', 'post', postUrl);
      this.async(function () {
        this.redirectTo(postUrl);
        this.fire('yp-close-right-drawer');
      });
    }
  },

  _notificationChanged: function (notification) {
    if (notification) {
      this.set('post', notification.AcActivities[0].Post);
      this.set('user', notification.AcActivities[0].User);
    } else {
    }
  },

  _addWithComma: function (text, toAdd) {
    var returnText = "";
    if (text!='') {
      returnText += text+",";
    }
    return returnText+toAdd;

  }
});

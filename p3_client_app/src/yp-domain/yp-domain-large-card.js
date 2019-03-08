import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/neon-animation/web-animations.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/neon-animation/web-animations.js';
import '../../../../@polymer/paper-material/paper-material.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { ypGotAdminRightsBehavior } from '../yp-behaviors/yp-got-admin-rights-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { LargeCardBehaviors } from '../yp-behaviors/yp-large-card-behaviors.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-domain-stats.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
      }

      .description {
      }

      .stats {
        position: absolute;
        bottom: 0;
        right: 8px;
      }

      yp-domain-stats {
        color :#fff;
      }

      .domain-name {
        padding: 0;
        padding-bottom: 4px;
        padding-right: 1px;
        margin: 0;
        min-height: 54px;
        font-size: 42px;
        font-weight: bold;
      }

      .large-card {
        background-color: #fefefe;
        color: #333;
        height: 243px;
        width: 432px;
        padding: 0 !important;
        margin-top: 0 !important;
      }

      .image, video {
        width: 432px;
        height: 243px;
      }

      .description-and-stats {
        width: 100%;
      }

      .edit {
        color: #FFF;
        position: absolute;
        top: 0;
        right: 0px;
        padding-right: 0;
        margin-right: 0;
      }

      h1 {
        font-size: 42px;
      }

      .textBox {
        margin-left: 32px;
        position: relative;
      }

      .description {
        padding: 0;
        margin: 0;
      }

      .domainDescription {
        padding-left: 16px;
        padding-right: 16px;
        padding-top: 16px;
      }

      .domain-name {
        background-color: var(--primary-color-800, #000);
        color: #fafafa;
        padding: 12px;
        padding-left: 16px;
        vertical-align: middle;
        margin: 0;
        padding-right: 24px;
      }

      @media (max-width: 960px) {
        :host {
          max-width: 423px;
          padding: 0 !important;
          padding-top: 8px !important;
          width: 100%;
        }

        .large-card {
          width: 100%;
          height: 100%;
          margin-left: 8px;
          margin-right: 8px;
          margin-top: 8px !important;
        }

        .top-card {
          margin-bottom: 16px;
        }

        iron-image, video, .image {
          width: 100%;
          height: 230px;
        }

        .imageCard {
          height: 230px;
        }

        .imageCard[is-video] {
          background-color: transparent;
        }

        .domain-name {
          font-size: 22px;
          padding-bottom: 12px;
          min-height: 28px;
        }

        .description {
          padding-bottom: 42px;
        }

        .stats {
        }

        .textBox {
          margin-left: 8px;
        }
      }

      @media (max-width: 375px) {
        iron-image, video, .image {
          height: 225px;
        }

        .imageCard {
          height: 225px;
        }
      }

      @media (max-width: 375px) {
        iron-image, video, .image {
          height: 207px;
        }

        .imageCard {
          height: 205px;
        }
      }

      @media (max-width: 360px) {
        iron-image, video, .image {
          height: 200px;
        }

        .imageCard {
          height: 200px;
        }
      }

      @media (max-width: 320px) {
        iron-image, video, .image {
          height: 180px;
        }

        .imageCard {
          height: 180px;
        }
      }

      [hidden] {
        display: none !important;
      }

      a {
        text-decoration: none;
        color: inherit;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout horizontal wrap">
      <paper-material is-video\$="[[domainVideoURL]]" id="cardImage" elevation="3" animated="" class="large-card imageCard top-card">
        <template is="dom-if" if="[[domainVideoURL]]" restamp="">
          <video id="videoPlayer" data-id\$="[[domainVideoId]]" controls="" preload="meta" class="image" src="[[domainVideoURL]]" playsinline="" poster="[[domainVideoPosterURL]]"></video>
        </template>
        <template is="dom-if" if="[[!domainVideoURL]]">
          <iron-image class="image" hidden\$="[[hideImage]]" sizing="cover" src\$="[[_domainLogoImagePath(domain)]]"></iron-image>
        </template>
      </paper-material>
      <paper-material id="card" elevation="4" animated="" class="large-card textBox">
        <div class="layout vertical">
          <div class="layout horizontal wrap">
            <div class="layout vertical description-and-stats">
              <div class="descriptionContainer">
                <div class="domain-name">
                  <yp-magic-text text-type="domainName" content-language="[[domain.language]]" disable-translation="[[domain.configuration.disableNameAutoTranslation]]" text-only="" content="[[domain.name]]" content-id="[[domain.id]]">
                  </yp-magic-text>
                </div>
                <template is="dom-if" if="[[domain.id]]">
                  <yp-magic-text id="description" class="description domainDescription" text-type="domainContent" content-language="[[domain.language]]" content="[[domain.description]]" content-id="[[domain.id]]">
                  </yp-magic-text>
                </template>
              </div>
            </div>
          </div>
          <paper-menu-button vertical-align="top" horizontal-align="[[editMenuAlign]]" class="edit" hidden\$="[[!showMenuItem]]">
            <paper-icon-button aria-label\$="[[t('openDomainMenu')]]" icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
            <paper-listbox slot="dropdown-content" on-iron-select="_menuSelection">
              <paper-item hidden\$="[[!hasDomainAccess]]" id="editMenuItem">[[t('domain.edit')]]</paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="createOrganizationMenuItem">[[t('domain.createOrganization')]]</paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="pagesMenuItem">[[t('pages.managePages')]]</paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="usersMenuItem">[[t('domainUsers')]]</paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="moderationMenuItem">
                [[t('flaggedContent')]] <span hidden\$="[[!flaggedContentCount]]">&nbsp; ([[flaggedContentCount]])</span>
              </paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="moderationAllMenuItem">
                [[t('manageAllContent')]]
              </paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="adminsMenuItem">[[t('domainAdmins')]]</paper-item>
              <paper-item hidden\$="[[!hasDomainAccess]]" id="organizationsGridMenuItem">[[t('organizationsAdmin')]]</paper-item>
              <a hidden\$="[[!hasDomainAccess]]" target="_blank" href\$="[[exportLoginsUrl]]"><paper-item id="exportLogins">[[t('exportLogins')]]</paper-item></a>

              <paper-item id="addCommunityMenuItem">[[t('community.add')]]</paper-item>
              <paper-item id="addCommunityFolderMenuItem" hidden\$="[[!hasDomainAccess]]">[[t('newCommunityFolder')]]</paper-item>
            </paper-listbox>
          </paper-menu-button>
        </div>
        <yp-domain-stats class="stats" domain="[[domain]]"></yp-domain-stats>
      </paper-material>
    </div>

    <template is="dom-if" if="[[domain]]" restamp="">
      <template is="dom-if" if="[[hasDomainAccess]]" restamp="">
        <yp-ajax method="GET" disable-user-error="" hidden="" url="/api/domains/[[domain.id]]/flagged_content_count" auto="" on-response="_setFlaggedContentCount"></yp-ajax>
      </template>
    </template>

    <iron-media-query query="(max-width: 945px)" query-matches="{{narrowScreen}}"></iron-media-query>
    <lite-signal on-lite-signal-got-admin-rights="_gotAdminRights"></lite-signal>
    <lite-signal on-lite-signal-yp-pause-media-playback="_pauseMediaPlayback"></lite-signal>
`,

  is: 'yp-domain-large-card',

  behaviors: [
    ypLanguageBehavior,
    LargeCardBehaviors,
    AccessHelpers,
    ypGotAdminRightsBehavior,
    ypMediaFormatsBehavior,
    ypTruncateBehavior
  ],

  properties: {

    domain: {
      type: Object,
      notify: true,
      value: null,
      observer: '_domainChanged'
    },

    elevation: {
      type: Number
    },

    hideImage: {
      type: Boolean,
      value: false
    },

    hasDomainAccess: {
      type: Boolean,
      value: false,
      computed: '_hasDomainAccess(domain, gotAdminRights)'
    },

    showMenuItem: {
      type: Boolean,
      value: false,
      computed: '_showMenuItem(hasDomainAccess, domain)'
    },

    domainVideoURL: {
      type: String,
      computed: '_domainVideoURL(domain)'
    },

    domainVideoPosterURL: {
      type: String,
      computed: '_domainVideoPosterURL(domain)'
    },

    domainVideoId: Number,

    flaggedContentCount: {
      type: Number,
      value: null
    },

    exportLoginsUrl: {
      type: String,
      computed: '_exportLoginsUrl(hasDomainAccess, domain)'
    },
  },

  _exportLoginsUrl: function (access, domain) {
    if (access && domain) {
      return '/api/domains/'+domain.id+'/export_logins';
    } else {
      return null;
    }
  },

  _domainChanged: function (domain, previousDomain) {
    this.setupMediaEventListeners(domain, previousDomain);
  },

  _domainVideoURL: function (domain) {
    if (domain && domain.configuration &&
      domain.configuration.useVideoCover &&
      domain.DomainLogoVideos) {
      var videoURL = this._getVideoURL(domain.DomainLogoVideos);
      if (videoURL) {
        this.set('domainVideoId', domain.DomainLogoVideos[0].id);
        return videoURL;
      } else {
        return null;
      }
    } else {
      return null;
    }
  },

  _domainVideoPosterURL: function (domain) {
    if (domain && domain.configuration &&
      domain.configuration.useVideoCover &&
      domain.DomainLogoVideos) {
      var videoPosterURL = this._getVideoPosterURL(domain.DomainLogoVideos);
      if (videoPosterURL) {
        return videoPosterURL;
      } else {
        return null;
      }
    } else {
      return null;
    }
  },

  _showMenuItem: function (hasDomainAccess, domain) {
    return hasDomainAccess || (domain && !domain.only_admins_can_create_communities)
  },

  _hasDomainAccess: function(domain, gotAdminRights) {
    if (domain && gotAdminRights) {
      if (this.checkDomainAccess(domain)!=null) {
        return true
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  _menuSelection: function (event, detail) {
    if (detail.item.id==="editMenuItem")
      this._openEdit();
    else if (detail.item.id==="createOrganizationMenuItem")
      this._newOrganization();
    else if (detail.item.id==="pagesMenuItem")
      this._openPagesDialog();
    else if (detail.item.id==="organizationsGridMenuItem")
      this._openOrganizationsGrid();
    else if (detail.item.id==="usersMenuItem")
      this._openUsersDialog();
    else if (detail.item.id==="adminsMenuItem")
      this._openAdminsDialog();
    else if (detail.item.id==="moderationMenuItem")
      this._openContentModeration();
    else if (detail.item.id==="moderationAllMenuItem")
      this._openAllContentModeration();
    else if (detail.item.id==="addCommunityMenuItem")
      this.fire('yp-new-community');
    else if (detail.item.id==="addCommunityFolderMenuItem")
      this.fire('yp-new-community-folder');
    this.$$("paper-listbox").select(null);
  },

  _openUsersDialog: function () {
    window.appGlobals.activity('open', 'domainUsers');
    dom(document).querySelector('yp-app').getUsersGridAsync(function (dialog) {
      dialog.setup(null, null, this.domain.id, false);
      dialog.open(this.domain.name);
    }.bind(this));
  },

  _openAdminsDialog: function () {
    window.appGlobals.activity('open', 'domainAdmins');
    dom(document).querySelector('yp-app').getUsersGridAsync(function (dialog) {
      dialog.setup(null, null, this.domain.id, true);
      dialog.open(this.domain.name);
    }.bind(this));
  },

  _openOrganizationsGrid: function () {
    window.appGlobals.activity('open', 'domain.organizationsGrid');
    dom(document).querySelector('yp-app').getDialogAsync("organizationsGrid", function (dialog) {
      dialog.open();
    }.bind(this));
  },

  _openPagesDialog: function () {
    window.appGlobals.activity('open', 'domain.pagesAdmin');
    dom(document).querySelector('yp-app').getDialogAsync("pagesGrid", function (dialog) {
      dialog.setup(null, null, this.domain.id, false);
      dialog.open();
    }.bind(this));
  },

  _openEdit: function () {
    window.appGlobals.activity('open', 'domainEdit');
    dom(document).querySelector('yp-app').getDialogAsync("domainEdit", function (dialog) {
      dialog.setup(this.domain, false, this._refresh.bind(this));
      dialog.open('edit', {domainId: this.domain.id});
    }.bind(this));
  },

  _openContentModeration: function () {
    window.appGlobals.activity('open', 'domainContentModeration');
    dom(document).querySelector('yp-app').getContentModerationAsync(function (dialog) {
      dialog.setup(null, null, this.domain.id, false);
      dialog.open(this.domain.name);
    }.bind(this));
  },

  _openAllContentModeration: function () {
    window.appGlobals.activity('open', 'domainAllContentModeration');
    dom(document).querySelector('yp-app').getContentModerationAsync(function (dialog) {
      dialog.setup(null, null, this.domain.id, '/moderate_all_content');
      dialog.open(this.domain.name);
    }.bind(this));
  },

  _newOrganization: function () {
    window.appGlobals.activity('open', 'organizationEdit');
    dom(document).querySelector('yp-app').getDialogAsync("organizationEdit", function (dialog) {
      dialog.setup(null, true, this._refresh.bind(this));
      dialog.open('new', {domainId: this.domain.id});
    }.bind(this));
  },

  _refresh: function (domain) {
    if (domain) {
      this.set('domain', domain);
    }
    this.fire("update-domain");
  },

  _domainName: function (domain) {
    if (domain && domain.name) {
      return this.truncate(this.trim(domain.name), 200);
    } else if (domain) {
      return domain.short_name;
    }
  },

  _domainLogoImagePath: function (domain) {
    if (domain) {
      return this.getImageFormatUrl(domain.DomainLogoImages, 0);
    }
  },

  _domainHeaderImagePath: function (domain) {
    if (domain) {
      return this.getImageFormatUrl(domain.DomainHeaderImages, 0);
    }
  }
});

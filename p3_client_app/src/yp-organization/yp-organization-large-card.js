import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../@polymer/iron-image/iron-image.js';
import '../../../../@polymer/iron-media-query/iron-media-query.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-menu-button/paper-menu-button.js';
import '../../../../@polymer/paper-listbox/paper-listbox.js';
import '../../../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../../../@polymer/paper-material/paper-material.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { LargeCardBehaviors } from '../yp-behaviors/yp-large-card-behaviors.js';
import { ypGotoBehavior } from '../yp-behaviors/yp-goto-behavior.js';
import './yp-organization-behaviors.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import { ypMediaFormatsBehavior } from '../yp-behaviors/yp-media-formats-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
import { CommunityBehaviors } from '../yp-community/yp-community-behaviors.js';
import { dom } from '../../../../@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        display: block;
        @apply --layout-vertical;
        width: 864px;
      }

      .communityAccess {
        padding-bottom: 8px;
      }

      .description {
        padding: 16px !important;
        line-height: var(--description-line-height, 1.3);
      }

      .stats {
        @apply --layout-self-center;
        position: absolute;
        bottom: 0;
        right: 16px;
      }

      yp-community-stats {
        color :#fff;
      }

      .community-name {
        padding: 0;
        padding-bottom: 4px;
        padding-right: 1px;
        margin: 0;
      }

      iron-image {
        width: 432px;
        height: 243px;
      }

      .large-card {
        background-color: var(--primary-color, #000);
        color: #fff;
        height: 243px;
        width: 864px;
        margin-top: 16px;
        margin-bottom: 16px;
      }

      .description-and-stats {
        max-width: 432px;
      }

      .edit {
        color: #FFF;
        position: absolute;
        top: 0;
        right: 0;
        padding-right: 0;
        margin-right: 0;
      }

      .contentContainer {
        @apply --layout-horizontal;
      }

      .description-and-stats {
        padding-bottom: 32px;
      }

      @media (max-width: 900px) {
        :host {
          width: 432px;
        }

        .large-card {
          width: 432px;
          height: 486px;
        }
      }

      @media (max-width: 480px) {
        :host {
          width: 306px;
        }

        .large-card {
          width: 306px;
          height: 486px;
        }

        iron-image {
          width: 216px;
          height: 122px;
        }
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <iron-media-query query="(max-width: 480px)" query-matches="{{phoneSize}}"></iron-media-query>

    <template is="dom-if" if="[[community]]">
      <paper-material id="card" elevation="5" animated="" class="large-card">
        <div class="contentContainer layout horizontal wrap">
          <template is="dom-if" if="[[phoneSize]]">
            <div>
              <iron-image class="image" sizing="cover" src\$="[[communityLogoImagePath]]"></iron-image>
            </div>
          </template>
          <template is="dom-if" if="[[!phoneSize]]">
            <iron-image class="image" sizing="contain" src\$="[[communityLogoImagePath]]"></iron-image>
          </template>
          <div class="layout vertical description-and-stats">
            <div class="description">
              <h2 class="community-name">[[communityNameFull]]</h2>
              <div class="communityAccess">[[_communityAccessText(community.access)]]</div>
              <div>[[communityDescriptionFull]]</div>
            </div>
          </div>
          <yp-community-stats class="stats" community="[[community]]"></yp-community-stats>
          <paper-menu-button class="edit" hidden\$="[[!checkCommunityAccess(community)]]">
            <paper-icon-button aria-label\$="[[t('openOrganizationMenu')]]" icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
            <paper-listbox slot="dropdown-content" on-iron-select="_menuSelection">
              <paper-item id="editMenuItem">[[t('community.edit')]]</paper-item>
              <paper-item id="deleteMenuItem">[[t('community.delete')]]</paper-item>
            </paper-listbox>
          </paper-menu-button>
        </div>
      </paper-material>
    </template>
`,

  is: 'yp-community-large-card',

  properties: {
    phoneSize: {
      type: Boolean
    },

    community: {
      type: Object
    }
  },

  behaviors: [
    ypLanguageBehavior,
    CommunityBehaviors,
    LargeCardBehaviors,
    AccessHelpers,
    ypGotoBehavior,
    ypTruncateBehavior,
    ypMediaFormatsBehavior
  ],

  _communityAccessText: function(access) {
    switch (access) {
      case 0:
        return this.t("community.public");
        break;
      case 1:
        return this.t("community.closed");
        break;
      case 2:
        return this.t("community.secret");
        break;
    }
  },

  _menuSelection: function (event, detail) {
    if (detail.item.id=="editMenuItem")
      this._openEdit();
    else if (detail.item.id=="deleteMenuItem")
      this._openDelete();

    this.$$("paper-listbox").select(null);
  },

  _openDelete: function () {
    dom(document).querySelector('yp-app').getDialogAsync("apiActionDialog", function (dialog) {
      dialog.setup('/api/communities/' + this.community.id,
        this.t('community.deleteConfirmation'),
        this._onDeleted.bind(this));
      dialog.open();
    }.bind(this));
  },

  _openEdit: function () {
    dom(document).querySelector('yp-app').getDialogAsync("communityEdit", function (dialog) {
      dialog.setup(this.community, false, this._refresh.bind(this));
      dialog.open('edit', {communityId: this.community.id});
    }.bind(this));
  },

  _onDeleted: function () {
    this.redirectTo("/domain/"+this.community.domain_id);
  },

  _refresh: function (community) {
    if (community) {
      this.set('community', community);
    }
    this.fire("update-community");
  }
});

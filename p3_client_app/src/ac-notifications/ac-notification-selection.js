import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/paper-radio-button/paper-radio-button.js';
import '../../../../@polymer/paper-radio-group/paper-radio-group.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      .half {
        width: 50%;
      }

      .notificationName {
        padding-top: 16px;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
        padding-bottom: 4px;
        color: #333;
        border-bottom: solid 1px #ddd;
      }

      .notificationSub {
        color: #888;
      }

      paper-radio-button {
        padding-top: 8px;
        padding-bottom: 8px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="layout vertical">
      <div class="notificationName">[[name]]</div>
      <div class="layout horizontal wrap">
        <div class="layout vertical half">
          <div class="notificationSub">[[t('notification.method')]]</div>
          <div class="layout horizontal">
            <paper-radio-group id="notificationMethodGroup" name="method" class="method" attr-for-selected="enum-value" selected="{{method}}">
              <template is="dom-repeat" items="[[availableMethods]]">
                <paper-radio-button enum-value\$="[[item.enumValue]]">[[item.name]]</paper-radio-button>
              </template>
            </paper-radio-group>
          </div>
        </div>
        <div class="layout vertical half">
          <div class="notificationSub">[[t('notification.frequency')]]</div>
          <div class="layout horizontal">
            <paper-radio-group id="notificationFrequencyGroup" name="frequency" attr-for-selected="enum-value" class="frequency" selected="{{frequency}}">
              <template is="dom-repeat" items="[[availableFrequencies]]">
                <paper-radio-button disabled\$="[[_isDelayed(item)]]" enum-value\$="[[item.enumValue]]">[[item.name]]</paper-radio-button>
              </template>
            </paper-radio-group>
          </div>
        </div>
      </div>
    </div>
`,

  is: 'ac-notification-selection',

  behaviors: [
    ypLanguageBehavior
  ],

  properties: {
    name: String,

    setting: {
      type: Object,
      notify: true,
      observer: '_settingChanged'
    },

    frequency:  {
      type: Number,
      notify: true,
      observer: "_frequencyChanged"
    },

    method: {
      type: Number,
      notify: true,
      observer: "_methodChanged"
    },

    availableFrequencies: {
      type: Array,
      computed: '_getAvailableFrequencies(language, method)'
    },

    availableMethods: {
      type: Object,
      computed: '_availableMethods(language)'
    }
  },

  _availableMethods: function (language) {
    if (language) {
      return [
        {
          name: this.t('notification.muted'),
          enumValue: 0
        },
        {
          name: this.t('notification.browser'),
          enumValue: 1
        },
        {
          name: this.t('notification.email'),
          enumValue: 2
        }
      ]
    } else {
      return [];
    }
  },

  _methodChanged: function (value) {
    value = parseInt(value);
    if (this.setting.method!=value) {
      this.set('setting.method', value);
    }
  },

  _frequencyChanged: function (value) {
    value = parseInt(value);
    if (this.setting.frequency!=value) {
      this.set('setting.frequency', value);
    }
  },

  _settingChanged: function (value) {
    if (value) {
      this.set('method', value.method);
      this.set('frequency', value.frequency);
    }
  },

  _isDelayed: function (item) {
    return item.enumValue>0;
  },

  _getAvailableFrequencies: function (language, method) {
    var frequencyArray = [];
    if (language) {
      if (!method || method==0) {
      } else if (method==1) {
        this.set('frequency', 0);
        frequencyArray = [
          {
            name: this.t('notification.asItHappens'),
            enumValue: 0
          }
        ]
      } else if (method==2) {
        frequencyArray = [
          {
            name: this.t('notification.asItHappens'),
            enumValue: 0
          },
          {
            name: this.t('notification.hourly'),
            enumValue: 1
          },
          {
            name: this.t('notification.daily'),
            enumValue: 2
          },
          {
            name: this.t('notification.weekly'),
            enumValue: 3
          },
          {
            name: this.t('notification.monthly'),
            enumValue: 5
          }
        ]
      }
    }
    return frequencyArray;
  }
});

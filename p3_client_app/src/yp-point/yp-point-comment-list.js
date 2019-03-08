import '../../../../@polymer/polymer/polymer-legacy.js';
import '../../../../@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '../../../../lite-signal/lite-signal.js';
import '../../../../@polymer/iron-image/iron-image.js';
import { IronResizableBehavior } from '../../../../@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import '../yp-app-globals/yp-app-icons.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import './yp-point-comment.js';
import './yp-point-comment-edit.js';
import { Polymer } from '../../../../@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '../../../../@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        width: 100%;
      }

      yp-point-comment-edit {

      }

      iron-list {
       max-height: 500px;
       width:  550px;
        --iron-list-items-container: {
        };
      }

      .listContainer {
        padding-top: 24px;
        height: 100%;
        width: 100%;
      }

      .container {
      }

      #commentCount {
        font-size: 14px;
      }

      paper-icon-button.openCloseButton {
        width: 56px;
        height: 56px;
        padding-left: 0;
        margin-left: 0;
      }

      .commentText {
        font-size: 14px;
        text-transform: lowercase;
        padding-right: 6px;
      }

      @media (max-width: 520px) {
        iron-list {
          width: 420px;
        }
      }

      @media (max-width: 450px) {
        iron-list {
          width: 318px;
        }
      }

      @media (max-width: 359px) {
        iron-list {
          width: 307px;
        }
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <div class="container layout vertical">
      <div class="layout horizontal start-justified" hidden\$="[[disableOpenClose]]">
        <div class="layout horizontal center-center" hidden\$="[[!commentsCount]]">
          <div class="commentText">[[t('point.comments')]]</div>
          <div id="commentCount">[[commentsCount]]</div>
        </div>
        <div class="layout horizontal center-center" hidden\$="[[_noComments(commentsCount)]]">
          <div class="commentText">[[t('noComments')]]</div>
        </div>
        <div class="layout horizontal">
          <paper-icon-button title\$="[[t('openComments')]]" class="openCloseButton" icon="hardware:keyboard-arrow-right" on-tap="_setOpen" hidden\$="[[open]]"></paper-icon-button>
          <paper-icon-button title\$="[[t('closeComments')]]" class="openCloseButton" icon="hardware:keyboard-arrow-down" on-tap="_setClosed" hidden\$="[[!open]]"></paper-icon-button>
        </div>
      </div>
      <template is="dom-if" if="[[open]]" restamp="">
        <div class="layout vertical listContainer">
          <iron-list id="list" items="[[comments]]" as="point">
            <template>
              <yp-point-comment point="[[point]]" tabindex\$="[[tabIndex]]"></yp-point-comment>
            </template>
          </iron-list>
          <yp-point-comment-edit on-refresh="_refresh" point="[[point]]" image="[[image]]"></yp-point-comment-edit>
        </div>
      </template>
      <div class="layout horizontal center-center">
        <yp-ajax id="commentsListAjax" method="GET" on-response="_commentsResponse"></yp-ajax>
        <yp-ajax id="commentsCountListAjax" method="GET" on-response="_countResponse"></yp-ajax>
      </div>
    </div>
`,

  is: 'yp-point-comment-list',

  properties: {

    comments: {
      type: Array
    },

    point: {
      type: Object,
      notify: true,
      observer: "_pointChanged"
    },

    image: {
      type: Object,
      notify: true,
      observer: "_imageChanged"
    },

    open: {
      type: Boolean,
      value: false,
      observer: "_openChanged"
    },

    loadingList: {
      type: Boolean
    },

    commentsCount: {
      type: Number,
      value: null
    },

    disableOpenClose: {
      type: Boolean,
      value: false
    }
  },

  behaviors: [
    ypLanguageBehavior,
    IronResizableBehavior
  ],

  listeners: {
    'yp-point-deleted': '_refresh'
  },

  _openChanged: function (newOpenValue) {
    if (newOpenValue) {
      this.$.commentsListAjax.generateRequest();
    }
  },

  _noComments: function (commentCount) {
    return !(commentCount==0)
  },

  _setOpen: function () {
    this.set('open', true);
    this.async(function () {
      this.notifyResize();
      this.fire('iron-resize');
    },20);
  },

  _setClosed: function () {
    this.set('open', false);
    this.async(function () {
      this.fire('iron-resize');
      this.notifyResize();
    },20);
  },

  generateRequest: function () {
    this.$.commentsListAjax.generateRequest();
  },

  _pointChanged: function(newPoint) {
    this.set('comments', []);
    this.set('commentsCount', null);
    if (newPoint) {
      this.$.commentsListAjax.url = '/api/points/'+newPoint.id+'/comments';
      this.$.commentsCountListAjax.url = '/api/points/'+newPoint.id+'/commentsCount';
      this.$.commentsCountListAjax.generateRequest();
    }
  },

  _refresh: function () {
    this.$.commentsListAjax.generateRequest();
    this.$.commentsCountListAjax.generateRequest();
  },

  _imageChanged: function(newImage) {
    if (newImage) {
      this.$.commentsListAjax.url = '/api/images/'+newImage.id+'/comments';
      this.$.commentsCountListAjax.url = '/api/images/'+newImage.id+'/commentsCount';
      this.$.commentsCountListAjax.generateRequest();
    }
  },

  _countResponse: function (event, detail) {
    this.set('commentsCount', detail.response.count);
    this.fire('yp-set-comments-count', { count: this.commentsCount })
  },

  _commentsResponse: function (event, detail) {
    var comment = detail.response;
    this.set('comments', comment);
    if (comment && comment.length>0) {
      this.$$("#list").scrollToIndex(comment.length-1);
    }
    this.notifyResize();
    this.async(function () {
      this.$$("#list").fire('iron-resize');
    });
  }
});

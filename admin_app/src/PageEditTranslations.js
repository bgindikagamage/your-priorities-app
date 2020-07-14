import 'chart.js';
import { html, css } from 'lit-element';
import { nothing } from 'lit-html';
import {ifDefined} from 'lit-html/directives/if-defined';

import { YpBaseElement } from './YpBaseElement';
import { ShadowStyles } from './ShadowStyles';
import '@material/mwc-select';
import '@material/mwc-button';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-textarea';
import '@material/mwc-linear-progress';



export class PageEditTranslations extends YpBaseElement {
  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        #mainSelect {
          text-align: right;
          margin-right: 22px;
          margin-top: 8px;
        }

        .wordCloudContainer {
          margin-top: 16px;
          margin-bottom: 64px;
        }

        mwc-linear-progress {
          margin-bottom: 8px;
        }

        .timeButtons {
          margin-top: 8px;
        }

        .item {
          max-width: 1008px;
          width: 1008px;
          background-color: white;
          margin-bottom: 16px;
          padding: 8px;
        }

        .originalText {
          width: 400px;
          flex: 1;
          padding: 8px;
        }

        .textType {
          width: 120px;
          padding: 8px;
        }

        .translatedText {
          flex: 2;
        }

        .innerTranslatedText {
          padding: 8px;
        }

        .dont-break-out {
          /* These are technically the same, but use both */
          overflow-wrap: break-word;
          word-wrap: break-word;

          -ms-word-break: break-all;
          /* This is the dangerous one in WebKit, as it breaks things wherever */
          word-break: break-all;
          /* Instead use this non-standard one: */
          word-break: break-word;

          /* Adds a hyphen where the word breaks, if supported (No Blink) */
          -ms-hyphens: auto;
          -moz-hyphens: auto;
          -webkit-hyphens: auto;
          hyphens: auto;

        }

        mwc-linear-progress {
          width: 800px;
          margin-top: -4px;
          padding-top: 0;
          margin-bottom: 12px;
        }

        .progressPlaceHolder {
          margin-top: -4px;
          padding-top: 0;
          height: 4px;
          margin-bottom: 12px;
        }

        mwc-select {
          margin-bottom: 32px;
        }
    `];
  }

  static get properties() {
    return {
      collectionType: { type: String },
      collectionId: { type: String },
      items: { type: Array },
      waitingOnData: { type: Boolean },
      editActive: { type: Object },
      collection: { type: Object },
      targetLocale: { type: String }
    };
  }

  getTranslationText() {
    this.waitingOnData = true;
    fetch(`${this.getTextForTranslationsUrl}?targetLocale=${this.targetLocale}`,{ credentials: 'same-origin' })
    .then(res => this.handleNetworkErrors(res))
    .then(res => res.json())
    .then(response => {
      this.waitingOnData = false;
      this.items = response;
    })
    .catch(error => {
      this.waitingOnData = false;
      this.fire('app-error', error);
    });
  }

  constructor() {
    super();
    this.waitingOnData = false;
    this.editActive = {};

    this.supportedLanguages = {
      en: 'English (US)',
      en_GB: 'English (GB)',
      fr: 'Français',
      is: 'Íslenska',
      es: 'Español',
      it: 'Italiano',
      ar: 'اَلْعَرَبِيَّةُ',
      ar_EG: 'اَلْعَرَبِيَّةُ (EG)',
      ca: 'Català',
      ro_MD: 'Moldovenească',
      de: 'Deutsch',
      da: 'Dansk',
      sv: 'Svenska',
      en_CA: 'English (CA)',
      nl: 'Nederlands',
      no: 'Norsk',
      uk: 'українська',
      sq: 'Shqip',
      ky: 'Кыргызча',
      uz: 'Ўзбек',
      tr: 'Türkçe',
      fa: 'فارسی',
      pl: 'Polski',
      pt: 'Português',
      pt_BR: 'Português (Brazil)',
      ru: 'Русский',
      hu: 'Magyar',
      zh_TW: '国语 (TW)',
      sr: 'Srpski',
      sr_latin: 'Srpski (latin)',
      hr: 'Hravtski',
      kl: 'Kalaallisut',
      sl: 'Slovenščina'
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.getTextForTranslationsUrl = `/api/${this.collectionType}/${this.collectionId}/get_translation_texts`;
  }

  firstUpdated() {
    super.firstUpdated();
  }

  selectLanguage (event) {
    if (event.target && event.target.value) {
      this.targetLocale = event.target.value;
      this.getTranslationText();
    }
  }

  openEdit(item) {
    this.editActive[item.indexKey] = true;
    this.requestUpdate();
  }

  cancelEdit(item) {
    delete this.editActive[item.indexKey];
    this.requestUpdate();
  }

  saveItem(item, options) {
    if (!options) {
      // eslint-disable-next-line no-param-reassign
      item.translatedText = this.$$(`#editFor${item.indexKey}`).value;
    }
    const updateUrl = `/api/${this.collectionType}/${this.collectionId}/update_translation`;
    fetch(updateUrl, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentId: item.contentId,
        content: item.originalText,
        textType: item.textType,
        translatedText: item.translatedText,
        extraId: item.extraId,
        targetLocale: this.targetLocale
      })
    });
    this.cancelEdit(item);
  }

  autoTranslate(item) {
    const updateUrl = this.getUrlFromTextType(item);
    fetch(`${updateUrl}?contentId=${item.contentId}&textType=${item.textType}&targetLanguage=${this.targetLocale}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(translation => {
      if (translation) {
        // eslint-disable-next-line no-param-reassign
        item.translatedText = translation.content;
        this.saveItem(item, { saveDirectly: true });
        this.requestUpdate();
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getUrlFromTextType(item) {
    let url;
    switch(item.textType) {
      case 'postName':
      case 'postContent':
      case 'postTranscriptContent':
        url = `/api/posts/${item.contentId}/translatedText`;
        break;
      case 'pointContent':
      case 'pointAdminCommentContent':
        url = `/api/points/${item.contentId}/translatedText`;
        break;
      case 'domainName':
      case 'domainContent':
        url = `/api/domains/${item.contentId}/translatedText`;
        break;
      case 'customRatingName':
        url = `/api/ratings/${item.contentId}/${item.extraId}/translatedText`;
        break;
      case 'communityName':
      case 'communityContent':
        url = `/api/communities/${item.contentId}/translatedText`;
        break;
      case 'alternativeTextForNewIdeaButtonClosed':
      case 'alternativeTextForNewIdeaButtonHeader':
      case 'customThankYouTextNewPosts':
      case 'alternativePointForHeader':
      case 'customAdminCommentsTitle':
      case 'alternativePointAgainstHeader':
      case 'alternativePointForLabel':
      case 'alternativePointAgainstLabel':
      case 'groupName':
      case 'groupContent':
        url = `/api/groups/${item.contentId}/translatedText`;
        break;
      case 'categoryName':
        url = `/api/categories/${item.contentId}/translatedText`;
        break;
      case 'statusChangeContent':
        url = `/api/posts/${item.extraId}/${item.contentId}/translatedStatusText`;
        break;
      default:
        return null;
    }
    return url;
  }

  get languages() {
    let arr = [];
    const highlighted = [];
    let highlightedLocales = ['en','en_GB','is','fr','de','es','ar'];
    if (this.collection.configuration && this.collection.configuration.highlightedLanguages) {
      highlightedLocales = this.collection.configuration.highlightedLanguages.split(",");
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const key in this.supportedLanguages) {
      if (this.supportedLanguages.hasOwnProperty(key)) {
        if (highlightedLocales.indexOf(key) > -1) {
          highlighted.push({ locale: key, name: this.supportedLanguages[key] });
        } else {
          arr.push({ locale: key, name: this.supportedLanguages[key] });
        }
      }
    }

    arr = arr.sort(function (a, b) {
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });

    return highlighted.concat(arr);
  }

  getMaxLength(item) {
    if (item.textType==="groupName" || item.textType=="postName" || item.textType=="communityName") {
      return 60;
    } else if (item.textType=="groupContent" || item.textType=="communityContent") {
      return 300;
    } else {
      return 2500;
    }
  }

  renderItem(item) {
    return html`
      <div class="layout horizontal shadow-animation shadow-elevation-3dp item">
        <div class="textType">
          ${ this.t(item.textType) } <br\> id: ${ item.contentId }
        </div>
        <div class="originalText dont-break-out">
          ${ item.originalText }
        </div>

        <div class="layout vertical translatedText dont-break-out">
          ${ this.editActive[item.indexKey] ? html`
            <mwc-textarea
              rows="5"
              id="editFor${item.indexKey}"
              .maxLength="${this.getMaxLength(item)}"
              charCounter
              .label="${this.t('editTranslation')}"
              .value="${item.translatedText ? item.translatedText : ''}">
            </mwc-textarea>
            <div class="layout horizontal endAligned">
              <mwc-button .label="${this.t('cancel')}" @click="${() => this.cancelEdit(item)}"></mwc-button>
              <mwc-button .label="${this.t('save')}" @click="${() => this.saveItem(item)}"></mwc-button>
            </div>
          ` : html`
            <div class="innerTranslatedText">${ item.translatedText ? item.translatedText : this.t('noTranslation') }</div>
            <div class="layout horizontal endAligned">
              <mwc-button .label="${this.t('edit')}" @click="${() => this.openEdit(item)}"></mwc-button>
              <mwc-button
                .label="${this.t('autoTranslate')}"
                ?hidden="${item.translatedText}" @click="${ () => this.autoTranslate(item)}"></mwc-button>
            </div>
          `}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="container layout vertical center-center">
        ${ this.waitingOnData ? html`
         <mwc-linear-progress indeterminate ?hidden="${!this.waitingOnData}"></mwc-linear-progress>
        ` : html`
          <div class="progressPlaceHolder"></div>
        `}
        <div class="layout vertical">
          <div class="layout horizontal center-center">
            <mwc-select outlined .label="${this.t('selectLanguage')}" id="mainSelect" class="layout selfEnd" @selected="${this.selectLanguage}">
              ${ this.languages.map( language => html`
                <mwc-list-item  .value="${language.locale}">${language.name}</mwc-list-item>
              `)}
            </mwc-select>
          </div>
          ${ this.items ? this.items.map(item => this.renderItem(item)) : nothing }
        </div>
      </div>
    `;
  }
}

window.customElements.define('page-edit-translations', PageEditTranslations);


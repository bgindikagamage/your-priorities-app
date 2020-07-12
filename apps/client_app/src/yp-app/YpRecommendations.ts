import { YpCodeBase } from '../@yrpri/YpCodeBase.js'
import { YpServerApi } from '../@yrpri/YpServerApi.js';
import { YpNavHelpers } from './YpNavHelpers.js';

export class YpRecommendations extends YpCodeBase {

  recommendationsGroupCache: Record<number,Array<YpPost>> = {}

  recommendationsSeenPostIds: object|null = null

  recommendationCallbacks: Record<number,Function> = {}

  lastRecommendationResponseLengths: Record<number,number> = {}

  currentPostId: number|null = null

  currentlyDownloadingIds: Record<number,boolean> = {}

  preCacheLimit = 3

  serverApi: YpServerApi;

  getNextRecommendationForGroup (groupId: number, currentPostId: number, recommendationCallback: Function) {
    this.currentPostId=currentPostId;
    this.recommendationCallbacks[groupId] = recommendationCallback;
    if (!this.recommendationsGroupCache[groupId]) {
      console.log("Recommendation getting initial cache from server groupId: "+groupId);
      this.$.recommendationsForGroupAjax.url = '/api/recommendations/groups/'+groupId+'/getPostRecommendations';
      this.$.recommendationsForGroupAjax.body = {};
      this.$.recommendationsForGroupAjax.generateRequest();
    } else if (this.recommendationsGroupCache[groupId].length>0) {
      console.log("Recommendation getting next from cache groupId: "+groupId);
      const selectedPost = this._getSelectedPost(groupId);
      if (selectedPost)
        window.appGlobals.showRecommendationInfoIfNeeded();
      recommendationCallback(selectedPost);
    } else {
      console.log("Recommendation found no post on cache or server groupId: "+groupId);
      recommendationCallback(null);
    }
  }

  _preCacheMediaForPost(post: YpPost) {
    setTimeout(() => {
      let imagePath=null;
      if ((!post.cover_media_type || post.cover_media_type==='none') && !post.Category) {
        imagePath = "https://i.imgur.com/sdsFAoT.png";
        console.log("Recommendation downloading default image: "+post.id);
      } else  if ((!post.cover_media_type || post.cover_media_type==='none') && post.Category) {
        imagePath = this._getCategoryImagePath(post);
        console.log("Recommendation downloading category image: "+post.id);
      } else if (post.cover_media_type==='image') {
        imagePath = this.getImageFormatUrl(post.PostHeaderImages, 0);
        console.log("Recommendation downloading image: "+post.id);
      }

      if (imagePath) {
        new Image().src=imagePath;
        console.log("Recommendation preCaching image: "+imagePath);
      }
      else
        console.log("Recommendation no image download for: "+post.id);
    });
  }

  getImageFormatUrl(images: Array<YpImage>|undefined, formatId: number) {
    if (images && images.length>0) {
      const formats = JSON.parse(images[images.length-1].formats);
      if (formats && formats.length>0)
        return formats[formatId];
    } else {
      return "";
    }
  }

  _getCategoryImagePath(post: YpPost) {
    if (post && post.Category && post.Category.CategoryIconImages) {
      return this.getImageFormatUrl(post.Category.CategoryIconImages, 0);
    } else {
      return "";
    }
  }

  _downloadItemToCache(postId: number) {
    setTimeout(() => {
      if (!this.currentlyDownloadingIds[postId]) {
        this.currentlyDownloadingIds[postId]=true;
        console.log("Recommendation downloading for cache: "+postId);
        fetch('/api/posts/'+postId).then((response) => {
          this.currentlyDownloadingIds[postId]=false;
          return response.json();
        }).then((post) => {
          if (post) {
            this._preCacheMediaForPost(post);
          } else {
            console.error("Recommendation no post to save to cache");
          }
          window.appGlobals.cache.postItemsCache[postId]=post;
          console.log("Recommendation saved post to cache: "+postId);
        }).catch((ex) => {
          console.error("Recommendation: Error in getting post for cache", ex);
          this.currentlyDownloadingIds[postId]=false;
        });
      } else {
        console.warn("Recommendation already downloading: "+postId);
      }
    });
  }

  _ensureNextItemsAreCached(groupId: number) {
    for (let i = 0; i < Math.min(this.recommendationsGroupCache[groupId].length-1, this.preCacheLimit); i++) {
     if (!window.appGlobals.cache.postItemsCache[this.recommendationsGroupCache[groupId][i].id]) {
       this._downloadItemToCache(this.recommendationsGroupCache[groupId][i].id);
     } else {
       console.log("Recommendation already in cache for group: "+groupId);
     }
    }
  }

  getRecommendationsForGroupResponse(groupId: number) {
    this.serverApi.getRecommendationsForGroup(groupId).then((recommendations: Array<YpPost>) => {
      this.lastRecommendationResponseLengths[groupId] = recommendations.length;
      if (!this.recommendationsGroupCache[groupId]) {
        this.recommendationsGroupCache[groupId] = recommendations;
      } else {
        this.recommendationsGroupCache[groupId] = this.recommendationsGroupCache[groupId].concat(recommendations);
      }
      if (this.recommendationCallbacks[groupId]) {
        this.recommendationCallbacks[groupId](this._getSelectedPost(groupId));
        delete this.recommendationCallbacks[groupId];
      }
    })
  }

  _getSelectedPost(groupId: number) {
    if (this.recommendationsGroupCache[groupId]) {
      let post = this.recommendationsGroupCache[groupId][0] as YpPost|null;
      if (post) {
        console.info("Recommendation found post: "+post.id+" recCacheLength: "+this.recommendationsGroupCache[groupId].length);
        if (post.id===this.currentPostId) {
          console.info("Recommendation not showing current post id: "+post.id+" recCacheLength: "+this.recommendationsGroupCache[groupId].length);
          this.recommendationsGroupCache[groupId].shift();
          if (this.recommendationsGroupCache[groupId].length>0) {
            post = this.recommendationsGroupCache[groupId][0];
            console.info("Recommendation found 2nd time: "+post.id+" recCacheLength: "+this.recommendationsGroupCache[groupId].length);
          } else {
            console.info("Recommendation not found 2nd time: "+post.id+" recCacheLength: "+this.recommendationsGroupCache[groupId].length);
            post = null;
          }
        }

        if (post) {
          this._ensureNextItemsAreCached(groupId);
        }

        return post;
      } else {
        console.warn("Recommendation no post for getSelectedPost, groupId: "+groupId);
        return null;
      }
    } else {
      return null;
    }
  }

  reset () {
    this.recommendationsSeenPostIds = {};
    this.lastRecommendationResponseLengths = {};
    this.recommendationCallbacks = {};
    this.recommendationsGroupCache = {};
  }

  constructor(serverApi: YpServerApi) {
    super();
    this.serverApi = serverApi;
  }
}

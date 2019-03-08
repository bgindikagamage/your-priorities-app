import '../../../../@polymer/polymer/polymer-legacy.js';

/**
 * @polymerBehavior Polymer.ypActivityGroupTitleBehavior
 */
export const ypActivityGroupTitleBehavior = {

  properties: {
    hasGroupHeader: {
      type: Boolean,
      computed: '_hasGroupHeader(activity.Group, postId, groupId)'
    },

    groupTitle: {
      type: Boolean,
      computed: '_groupTitle(activity.Group, postId, groupId, communityId)'
    },

    groupId: {
      type: Number,
      value: null
    },

    communityId: {
      type: Number,
      value: null
    }
  },

  _hasGroupHeader: function (group, postId, groupId) {
    return (group && group.name!='hidden_public_group_for_domain_level_points' && !postId && !groupId)
  },

  _groupTitle: function (group, postId, groupId, communityId) {
    if (group && !postId && !groupId) {
      var title = "";
      if (!communityId && this.activity.Community && this.activity.Community.name != this.activity.Group.name) {
        title += this.activity.Community.name + " - ";
      }
      title += this.activity.Group.name;
      return title;
    } else {
      return "";
    }
  }
};

'use strict';

// Shared service for feed controllers
// Consolidates common logic from 16+ feed controllers

angular.module('ringid.feed')
  .factory('FeedSharedService', ['$q', '$rootScope', 'feedFactory', 'Api', 'OPERATION_TYPES', 'Utils',
    function($q, $rootScope, feedFactory, Api, OPERATION_TYPES, Utils) {
      
      const service = {
        // Get user feed based on context (my wall vs friend wall)
        getFeedForUser(uId) {
          const isCurrentUser = $rootScope.currentUser && $rootScope.currentUser.equals(uId);
          const action = isCurrentUser 
            ? OPERATION_TYPES.SYSTEM.TYPE_MY_NEWS_FEED
            : OPERATION_TYPES.SYSTEM.TYPE_FRIEND_NEWSFEED;
          
          return {
            pagekey: action + '.' + uId,
            action: action,
            params: { actn: action, fndId: uId },
            forAdd: isCurrentUser ? 'my' : 'friend'
          };
        },

        // Load tag user list
        loadTagUserList(tagUserIds) {
          const users = [];
          if (tagUserIds && tagUserIds.length) {
            for (let i = 0; i < tagUserIds.length; i++) {
              tagUserIds[i].fn = tagUserIds[i].nm;
              users.push({
                data: () => ({ target: tagUserIds[i] }),
                promise: Api.user.getMutualFriends(tagUserIds[i])
              });
            }
          }
          return users;
        },

        // Handle feed media (images/videos)
        getMediaFeeds(mediaType) {
          return {
            mediaType: mediaType,
            action: mediaType === 'audio' 
              ? OPERATION_TYPES.NEWS_FEED_MEDIA_TYPE_AUDIO 
              : OPERATION_TYPES.NEWS_FEED_MEDIA_TYPE_VIDEO
          };
        },

        // Common feed sort
        sortFeeds(feeds, sortBy = 'time') {
          if (sortBy === 'at') {
            return feeds.sort((a, b) => b.at - a.at);
          }
          return feeds;
        },

        // Share feed helpers
        createShareData(feed, shareType = 'normal') {
          return {
            feed: feed,
            type: shareType,
            timestamp: Date.now()
          };
        },

        // Tag user in feed
        tagUserInFeed(feedId, userIds) {
          const deferred = $q.defer();
          // Implementation based on existing tag controllers
          Api.feed.tag(userIds, feedId)
            .then(response => deferred.resolve(response))
            .catch(error => deferred.reject(error));
          return deferred.promise;
        }
      };

      return service;
    }
  ]);

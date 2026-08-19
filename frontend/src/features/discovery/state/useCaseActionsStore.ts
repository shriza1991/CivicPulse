import { useState, useEffect } from 'react';

export function useCaseActionsStore() {
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('nivaran_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [followedCases, setFollowedCases] = useState<string[]>(() => {
    const saved = localStorage.getItem('nivaran_followed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('nivaran_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('nivaran_followed', JSON.stringify(followedCases));
  }, [followedCases]);

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleFollow = (id: string) => {
    setFollowedCases((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);
  const isFollowed = (id: string) => followedCases.includes(id);

  return {
    bookmarks,
    followedCases,
    toggleBookmark,
    toggleFollow,
    isBookmarked,
    isFollowed,
  };
}

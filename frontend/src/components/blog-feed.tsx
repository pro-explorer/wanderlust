import axios from 'axios';
import { useEffect, useState } from 'react';
import FeaturedPostCard from '@/components/featured-post-card';
import LatestPostCard from '@/components/latest-post-card';
import { CATEGORIES } from '@/constants/categories';
import { categoryProps } from '@/utils/category-props';
import { FeaturedPostCardSkeleton } from '@/components/skeletons/featured-post-card-skeleton';
import { LatestPostCardSkeleton } from '@/components/skeletons/latest-post-card-skeleton';

export default function BlogFeed() {
  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [posts, setPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);

  useEffect(() => {
    let categoryEndpoint =
      selectedCategory === 'featured'
        ? '/api/posts/featured'
        : `/api/posts/categories/${selectedCategory}`;

    axios
      .get(import.meta.env.VITE_API_PATH + categoryEndpoint)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedCategory]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_PATH + '/api/posts/latest')
      .then((response) => {
        setLatestPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="-mx-4 flex flex-wrap">
        <div className="w-full p-4 md:w-2/3">
          <h1 className="mb-4 text-2xl font-semibold dark:text-white">
            {selectedCategory === 'featured'
              ? 'Featured Posts'
              : `Posts related to "${selectedCategory}"`}
          </h1>
          <div className="flex flex-col gap-4">
            {posts.length === 0
              ? Array(5)
                  .fill(0)
                  .map((_, index) => <FeaturedPostCardSkeleton key={index} />)
              : posts
                  .slice(0, 5)
                  .map((post, index) => <FeaturedPostCard key={index} post={post} />)}
          </div>
        </div>
        <div className="w-full p-4 md:w-1/3">
          <div className="mb-6">
            <div className="text-gray-500 dark:text-white">Discover by topic</div>
            <h2 className="mb-4 text-2xl font-semibold dark:text-white">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category ? 'featured' : category)
                  }
                  className={
                    selectedCategory === category
                      ? categoryProps(category, true)
                      : categoryProps(category)
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-white">What's new ?</div>
            <h2 className="mb-4 text-2xl font-semibold dark:text-white">Latest Posts</h2>
            <div className="flex flex-col gap-2">
              {latestPosts.length === 0
                ? Array(5)
                    .fill(0)
                    .map((_, index) => <LatestPostCardSkeleton key={index} />)
                : latestPosts
                    .slice(0, 5)
                    .map((post, index) => <LatestPostCard key={index} post={post} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

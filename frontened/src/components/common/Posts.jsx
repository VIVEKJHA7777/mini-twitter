import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType,username,userId }) => {
    // Getting the endpoints based on the feed type
    const getPostEndpoint = () => {
        switch (feedType) {
            case "forYou":
                return "/api/posts/all";
            case "following":
                return "/api/posts/following";
            case "posts":
                return `/api/posts/${username}`;
            case "likes":
                return `/api/posts/likes/${userId}`;
            default:
                return "/api/posts/all";
        }
    };

    const POST_ENDPOINT = getPostEndpoint();

    const { data: posts, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["posts"], // Include feedType in queryKey to differentiate queries
        queryFn: async () => {
            const res = await fetch(POST_ENDPOINT);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            return data;
        },
        refetchOnWindowFocus: true // Ensure this option is set
    });

    useEffect(() => {
        refetch();
    }, [feedType, refetch,username]);

    return (
        <>
            {(isLoading || isRefetching) && (
                <div className='flex flex-col justify-center'>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && !isRefetching && posts?.length === 0 && (
                <p className='text-center my-4'>No posts in this tab. Switch 👻</p>
            )}
            {!isLoading && !isRefetching && posts && (
                <div>
                    {posts.map((post) => (
                        <Post key={post._id} post={post} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Posts;

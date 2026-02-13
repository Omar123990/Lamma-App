import { Card, CardHeader, Button, Skeleton } from "@heroui/react";
import { Layout, FileText, Home } from "lucide-react";
import PostCard from "../post/PostCard";
import { useNavigate } from "react-router-dom";

export default function ProfilePosts({ myPosts, isLoading }) {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const safePosts = Array.isArray(myPosts) ? myPosts : [];
    const validPosts = safePosts.filter(post => post && post._id).reverse(); 

    return (
        <Card className="w-full bg-white/5 border border-white/10 backdrop-blur-md min-h-[200px]">
            <CardHeader className="flex gap-3 px-6 pt-6">
                <Layout className="text-gray-400" />
                <h3 className="text-xl font-bold text-white">My Posts</h3>
            </CardHeader>

            <div className="p-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((n) => (
                            <Card key={n} className="w-full space-y-5 p-4 bg-white/5 border border-white/10" radius="lg">
                                <div className="flex gap-3">
                                    <Skeleton className="rounded-full w-12 h-12 bg-white/10" />
                                    <div className="w-full flex flex-col gap-2">
                                        <Skeleton className="h-3 w-3/5 rounded-lg bg-white/10" />
                                        <Skeleton className="h-3 w-4/5 rounded-lg bg-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-20 rounded-lg bg-white/10" />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : validPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {validPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl mb-2">
                            <FileText size={48} className="text-gray-500 opacity-50" />
                        </div>
                        <p className="text-gray-400 text-lg">You don&apos;t have any posts</p>

                        <Button
                            color="primary"
                            variant="shadow"
                            endContent={<Home size={18} />}
                            onClick={goToHome}
                        >
                            Post Now!
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}
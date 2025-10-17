import PostDto from "./post/postDto";
import ForumCommentDto from "./postComment/forumCommentDto";

export interface ForumEntityPayloads {
    addPost: PostDto;
    editPost: { postId: number; postData: PostDto };

    addComment: { postId: number; newComment: ForumCommentDto };
    editComment: { commentId: number; commentData: ForumCommentDto };
}

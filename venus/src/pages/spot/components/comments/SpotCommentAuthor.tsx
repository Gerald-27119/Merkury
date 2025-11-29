import SpotCommentAuthorDto from "../../../../model/interface/spot/comment/spotCommentAuthorDto";
import { useNavigate } from "react-router-dom";

type SpotCommentAuthorProps = {
    author: SpotCommentAuthorDto;
};

export default function SpotCommentAuthor({ author }: SpotCommentAuthorProps) {
    const navigate = useNavigate();

    const handleNavigateToAuthorProfile = (username: string) => {
        navigate(`/account/profile/${username}`);
    };

    return (
        <div
            className="flex cursor-pointer items-center space-x-3"
            onClick={() => handleNavigateToAuthorProfile(author.username)}
        >
            <img
                src={author.profilePhotoUrl}
                alt={author.username}
                className="3xl:h-10 aspect-square h-7 rounded-full object-cover 2xl:h-8"
            />
            <p className="3xl:text-3xl text-xl 2xl:text-2xl">
                {author.username}
            </p>
        </div>
    );
}

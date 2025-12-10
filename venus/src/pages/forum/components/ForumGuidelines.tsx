export default function ForumGuidelines() {
    return (
        <div className="w-md md:w-2xl">
            <h1 className="mb-5 text-3xl font-bold">Forum Guidelines</h1>

            <div className="dark:bg-darkBgSoft bg-lightBgSoft mb-4 rounded-lg p-4 text-lg shadow-md">
                <p>
                    Welcome to our community forum! To keep discussions friendly
                    and productive, please follow these guidelines:
                </p>

                <ul className="list-inside list-disc space-y-2 p-2 text-base">
                    <li>
                        <strong>Be Respectful:</strong> Treat all members with
                        respect. Personal attacks, harassment, or hate speech
                        are not allowed.
                    </li>
                    <li>
                        <strong>Stay On Topic:</strong> Keep discussions
                        relevant to the thread or forum category.
                    </li>
                    <li>
                        <strong>No Spam:</strong> Avoid posting advertisements,
                        repeated messages, or irrelevant links.
                    </li>
                    <li>
                        <strong>Use Clear Titles:</strong> Make your post titles
                        descriptive so others can understand your topic quickly.
                    </li>
                    <li>
                        <strong>Protect Privacy:</strong> Do not share personal
                        information about yourself or others.
                    </li>
                    <li>
                        <strong>Report Problems:</strong> Use the report
                        function if you see inappropriate content.
                    </li>
                    <li>
                        <strong>Follow the Law:</strong> Do not post illegal
                        content or promote illegal activity.
                    </li>
                </ul>

                <p className="mt-2">
                    Thank you for contributing to a positive and welcoming
                    community!
                </p>

                <img
                    src="https://ucarecdn.com/0961d845-01b3-4d35-bdd2-8d64969bf5da/mercuryLogo.png"
                    alt="logo.png"
                    className="mx-auto mt-6 h-62 w-64 rounded-full"
                />
            </div>
        </div>
    );
}

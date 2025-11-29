import useSelectorTyped from "../../../../hooks/useSelectorTyped";
import { useState } from "react";
import { ConfigProvider, Rate } from "antd";

export default function AddSpotCommentModal() {
    const [spotRating, setSpotRating] = useState<number>(0);

    const { spotName } = useSelectorTyped((state) => state.addSpotCommentModal);
    return (
        <div className="bg-black/70">
            <div className="bg-darkBgSoft rounded-2xl">
                <h1>{spotName}</h1>
                <ConfigProvider
                    theme={{
                        components: {
                            Rate: {
                                starBg: "#ffffff",
                                starColor: "#fadb14",
                            },
                        },
                    }}
                >
                    <Rate
                        data-testid="current-view-spots-rating-from-form"
                        allowHalf
                        value={spotRating}
                        onChange={(value) => setSpotRating(value)}
                    />
                </ConfigProvider>
                <>text</>
                <div>
                    <button>Cancel</button>
                    <button>Publish</button>
                </div>
            </div>
        </div>
    );
}

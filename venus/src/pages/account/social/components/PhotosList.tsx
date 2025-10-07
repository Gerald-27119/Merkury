import DateBadge from "../../components/DateBadge";
import Photo from "../../photos/components/Photo";
import DatedMediaGroup from "../../../../model/interface/account/media/datedMediaGroup";

interface PhotosListProps {
    photos: DatedMediaGroup[];
}

export default function PhotosList({ photos }: PhotosListProps) {
    return (
        <div className="flex h-full flex-col gap-3 lg:mx-27">
            {photos?.length
                ? photos?.map(({ date, media }) => (
                      <div className="flex flex-col space-y-3" key={date}>
                          <DateBadge date={date} />
                          <ul className="3xl:grid-cols-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                              {media?.map((m) => (
                                  <Photo photo={m} key={m.id} />
                              ))}
                          </ul>
                      </div>
                  ))
                : null}
            {!photos?.length ? (
                <p className="flex h-full items-center justify-center text-center text-lg">
                    This user hasn't added any photos.
                </p>
            ) : null}
        </div>
    );
}

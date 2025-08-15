import DatedCommentsGroup from "./datedCommentsGroup";

export interface DatedCommentsGroupPageDto {
    items: DatedCommentsGroup[];
    hasNext: boolean;
}

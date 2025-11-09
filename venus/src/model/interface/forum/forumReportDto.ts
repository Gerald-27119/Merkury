import { ForumReportReason } from "../../enum/forum/forumReportReason";

export default interface ForumReportDto {
    reason: ForumReportReason;
    details: string;
}

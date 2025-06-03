import { UserRelationEditType } from "../../model/enum/account/social/userRelationEditType";

/**
 * Resolves the appropriate edit type (ADD or REMOVE) based on the current relation status.
 *
 * @param {boolean} [isCurrentlyRelated] - Indicates if the relation (friend/follow) already exists.
 * If `true`, the function returns `REMOVE`. Otherwise, it returns `ADD`.
 *
 * @returns {UserRelationEditType} - The action to perform: add or remove the relation.
 */
export const resolveRelationEditType = (
  isCurrentlyRelated?: boolean,
): UserRelationEditType => {
  return isCurrentlyRelated
    ? UserRelationEditType.REMOVE
    : UserRelationEditType.ADD;
};

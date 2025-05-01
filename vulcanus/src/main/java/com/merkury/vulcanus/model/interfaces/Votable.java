package com.merkury.vulcanus.model.interfaces;

import com.merkury.vulcanus.model.entities.UserEntity;

import java.util.Set;

public interface Votable {
    Set<UserEntity> getUpvotedBy();
    Set<UserEntity> getDownvotedBy();
    void setUpvotes(int upvotes);
    void setDownvotes(int downvotes);
}


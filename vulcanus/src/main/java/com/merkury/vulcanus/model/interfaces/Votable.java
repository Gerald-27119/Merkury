package com.merkury.vulcanus.model.interfaces;

import com.merkury.vulcanus.model.entities.UserEntity;

import java.util.Set;

public interface Votable {
    Set<UserEntity> getUpVotedBy();
    Set<UserEntity> getDownVotedBy();
    void setUpVotes(Integer upVotes);
    void setDownVotes(Integer downVotes);
}


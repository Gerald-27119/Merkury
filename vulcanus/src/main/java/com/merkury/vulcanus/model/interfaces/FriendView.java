package com.merkury.vulcanus.model.interfaces;

public interface FriendView {
    UserInfo getFriend();

    interface UserInfo {
        String getUsername();

        String getProfilePhoto();
    }
}

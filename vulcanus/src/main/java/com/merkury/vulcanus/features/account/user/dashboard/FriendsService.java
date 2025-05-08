package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.UserNotFoundByUsernameException;
import com.merkury.vulcanus.model.dtos.account.friends.FriendDto;
import com.merkury.vulcanus.model.mappers.user.dashboard.FriendsMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendsService {
    private final UserEntityRepository userEntityRepository;

    public List<FriendDto> getUserFriends(String username) throws UserNotFoundByUsernameException {
        var user = userEntityRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundByUsernameException(username));

        return user.getFriendships().stream().map(FriendsMapper::toDto).toList();
    }

    public void editUserFriends(String username, String friendUsername, String type){
    }

    private void addUserFriends(String username, String friendUsername){

    }

    private void removeUserFriends(String username, String friendUsername){

    }
}

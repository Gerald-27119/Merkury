package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.exception.exceptions.EmailTakenException;
import com.merkury.vulcanus.exception.exceptions.InvalidProviderException;
import com.merkury.vulcanus.exception.exceptions.UsernameTakenException;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.PasswordGenerator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegisterServiceTest {

    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordGenerator passwordGenerator;

    @Captor
    private ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);

    @InjectMocks
    private RegisterService registerService;

    @Test
    void registerOauth2UserWithGoogleProviderShouldSaveUser() throws EmailTakenException, UsernameTakenException, InvalidProviderException {
        when(userEntityRepository.findByUsernameOrEmail(anyString(),anyString())).thenReturn(Optional.empty());

        registerService.registerOauth2User("test@example.com", "testuser", "google");

        verify(userEntityRepository, times(1)).save(userCaptor.capture());
        UserEntity savedUser = userCaptor.getValue();

        assertThat(savedUser.getProvider()).isEqualTo(Provider.GOOGLE);
    }

    @Test
    void registerOauth2UserWithGithubProviderShouldSaveUser() throws EmailTakenException, UsernameTakenException, InvalidProviderException {
        when(userEntityRepository.findByUsernameOrEmail(anyString(),anyString())).thenReturn(Optional.empty());

        registerService.registerOauth2User("test@example.com", "testuser", "github");

        verify(userEntityRepository, times(1)).save(userCaptor.capture());
        UserEntity savedUser = userCaptor.getValue();

        assertThat(savedUser.getProvider()).isEqualTo(Provider.GITHUB);
    }

    @Test
    void registerOauth2UserWithInvalidProviderShouldThrowInvalidProviderException() {
        assertThrows(InvalidProviderException.class,
                () -> registerService.registerOauth2User("test@example.com", "testuser", "invalidProvider"));
    }

    @Test
    void registerOauth2UserWithNullProviderShouldThrowInvalidProviderException() {
        assertThrows(InvalidProviderException.class,
                () -> registerService.registerOauth2User("test@example.com", "testuser", null));
    }

    @Test
    void registerOauth2UserWithTakenEmailShouldThrowEmailTakenException() {
        UserEntity existingUser = new UserEntity();
        existingUser.setEmail("test@example.com");
        when(userEntityRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.of(existingUser));


        assertThrows(EmailTakenException.class, () -> {
            registerService.registerOauth2User("test@example.com", "testuser", "google");
        });
    }

    @Test
    void registerOauth2UserWithTakenUsernameShouldThrowUsernameTakenException() {
        UserEntity existingUser = new UserEntity();
        existingUser.setEmail("unique@example.com");
        existingUser.setUsername("testuser");
        when(userEntityRepository.findByUsernameOrEmail(anyString(), anyString())).thenReturn(Optional.of(existingUser));


        assertThrows(UsernameTakenException.class, () -> {
            registerService.registerOauth2User("test@example.com", "testuser", "google");
        });
    }
}

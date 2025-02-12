package com.merkury.vulcanus.features.account;

import com.merkury.vulcanus.exception.exceptions.EmailTakenException;
import com.merkury.vulcanus.exception.exceptions.UsernameTakenException;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.utils.PasswordGenerator;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class RegisterServiceTest {

    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private AutoCloseable openMocks;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PasswordGenerator passwordGenerator;

    @Captor
    ArgumentCaptor<UserEntity> userCaptor = ArgumentCaptor.forClass(UserEntity.class);

    @InjectMocks
    private RegisterService registerService;

    @BeforeEach
    void setUp() {
        openMocks = MockitoAnnotations.openMocks(this);
        registerService = new RegisterService(userEntityRepository, passwordEncoder, passwordGenerator);
    }

    @AfterEach
    public void tearDown() throws Exception {
        openMocks.close();
    }

    @Test
    void registerOauth2UserWithGoogleProviderShouldSaveUser() throws EmailTakenException, UsernameTakenException {
        when(userEntityRepository.existsByEmail(anyString())).thenReturn(false);
        when(userEntityRepository.existsByUsername(anyString())).thenReturn(false);

        registerService.registerOauth2User("test@example.com", "testuser", "google");

        verify(userEntityRepository, times(1)).save(userCaptor.capture());
        UserEntity savedUser = userCaptor.getValue();

        assertThat(savedUser.getProvider()).isEqualTo(Provider.GOOGLE);
    }

    @Test
    void registerOauth2UserWithGithubProviderShouldSaveUser() throws EmailTakenException, UsernameTakenException {
        when(userEntityRepository.existsByEmail(anyString())).thenReturn(false);
        when(userEntityRepository.existsByUsername(anyString())).thenReturn(false);

        registerService.registerOauth2User("test@example.com", "testuser", "github");

        verify(userEntityRepository, times(1)).save(userCaptor.capture());
        UserEntity savedUser = userCaptor.getValue();

        assertThat(savedUser.getProvider()).isEqualTo(Provider.GITHUB);
    }

    @Test
    void registerOauth2UserWithInvalidProviderShouldThrowIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class,
                () -> registerService.registerOauth2User("test@example.com", "testuser", "invalidProvider"));
    }

    @Test
    void registerOauth2UserWithNullProviderShouldThrowIllegalArgumentException() {
        assertThrows(IllegalArgumentException.class,
                () -> registerService.registerOauth2User("test@example.com", "testuser", null));
    }

    @Test
    void registerOauth2UserWithTakenEmailShouldThrowEmailTakenException() {
        when(userEntityRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(EmailTakenException.class, () -> {
            registerService.registerOauth2User("test@example.com", "testuser", "google");
        });
    }

    @Test
    void registerOauth2UserWithTakenUsernameShouldThrowUsernameTakenException() {
        when(userEntityRepository.existsByUsername(anyString())).thenReturn(true);

        assertThrows(UsernameTakenException.class, () -> {
            registerService.registerOauth2User("test@example.com", "testuser", "google");
        });
    }
}

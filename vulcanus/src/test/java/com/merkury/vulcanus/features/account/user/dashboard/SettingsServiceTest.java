package com.merkury.vulcanus.features.account.user.dashboard;

import com.merkury.vulcanus.exception.exceptions.*;
import com.merkury.vulcanus.model.dtos.account.settings.UserDataDto;
import com.merkury.vulcanus.model.dtos.account.settings.UserEditDataDto;
import com.merkury.vulcanus.model.entities.UserEntity;
import com.merkury.vulcanus.model.enums.Provider;
import com.merkury.vulcanus.model.enums.user.dashboard.UserSettingsType;
import com.merkury.vulcanus.model.mappers.user.dashboard.SettingsMapper;
import com.merkury.vulcanus.model.repositories.UserEntityRepository;
import com.merkury.vulcanus.security.jwt.JwtService;
import com.merkury.vulcanus.utils.user.dashboard.UserEntityFetcher;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SettingsServiceTest {

    @Mock
    private UserEntityRepository userEntityRepository;

    @Mock
    private UserEntityFetcher userEntityFetcher;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private SettingsService settingsService;


    @Test
    void shouldReturnUserDataForExistingUser() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder()
                .id(1L)
                .username("john")
                .email("john@example.com")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("john")).thenReturn(user);

        var expectedDto = new UserDataDto("john", "john@example.com", Provider.NONE);

        try (MockedStatic<SettingsMapper> mapperMock = mockStatic(SettingsMapper.class)) {
            mapperMock.when(() -> SettingsMapper.toDto(user)).thenReturn(expectedDto);

            var result = settingsService.getUserData("john");

            assertEquals(expectedDto, result);
            mapperMock.verify(() -> SettingsMapper.toDto(user));
        }
    }

    @Test
    void shouldThrowExternalProviderAccountExceptionWhenUserHasExternalProvider() throws UserNotFoundByUsernameException {
        var user = UserEntity.builder()
                .id(1L)
                .username("john")
                .provider(Provider.GOOGLE)
                .build();

        when(userEntityFetcher.getByUsername("john")).thenReturn(user);

        var editData = new UserEditDataDto(
                "newJohn",
                null,
                null,
                null,
                null,
                null,
                UserSettingsType.USERNAME
        );

        assertThrows(
                ExternalProviderAccountException.class,
                () -> settingsService.editUserSettings(response, editData, "john")
        );
        verify(userEntityRepository, never()).save(any());
        verify(jwtService, never()).refreshUserToken(any(), any());
    }

    @Test
    void shouldChangeUsernameWhenNewIsDifferentAndNotTaken() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getById(1L)).thenReturn(user);
        when(userEntityRepository.findAllByUsername("newName")).thenReturn(List.of());

        var editData = new UserEditDataDto(
                null,
                null,
                "newName",
                null,
                null,
                null,
                UserSettingsType.USERNAME
        );

        settingsService.editUserSettings(response, editData, "user1");

        assertEquals("newName", user.getUsername());
        verify(userEntityRepository).save(user);
        verify(jwtService).refreshUserToken(user, response);
    }

    @Test
    void shouldThrowSameUsernameExceptionWhenNewUsernameEqualsCurrent() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        var editData = new UserEditDataDto(
                null,
                null,
                "user1",
                null,
                null,
                null,
                UserSettingsType.USERNAME
        );

        assertThrows(
                SameUsernameException.class,
                () -> settingsService.editUserSettings(response, editData, "user1")
        );

        verify(userEntityRepository, never()).save(any());
        verify(jwtService, never()).refreshUserToken(any(), any());
    }

    @Test
    void shouldThrowUsernameTakenExceptionWhenNewUsernameAlreadyExists() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityRepository.findAllByUsername("takenName")).thenReturn(List.of(UserEntity.builder().id(2L).build()));

        var editData = new UserEditDataDto(
                null,
                null,
                "takenName",
                null,
                null,
                null,
                UserSettingsType.USERNAME
        );

        assertThrows(
                UsernameTakenException.class,
                () -> settingsService.editUserSettings(response, editData, "user1")
        );

        verify(userEntityRepository, never()).save(any());
        verify(jwtService, never()).refreshUserToken(any(), any());
    }

    @Test
    void shouldChangeEmailWhenDifferentAndNotTaken() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .email("old@mail.com")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getById(1L)).thenReturn(user);
        when(userEntityRepository.findAllByEmail("new@mail.com")).thenReturn(List.of());

        var editData = new UserEditDataDto(
                null,
                "new@mail.com",
                null,
                null,
                null,
                null,
                UserSettingsType.EMAIL
        );

        settingsService.editUserSettings(response, editData, "user1");

        assertEquals("new@mail.com", user.getEmail());
        verify(userEntityRepository).save(user);
        verify(jwtService).refreshUserToken(user, response);
    }

    @Test
    void shouldThrowSameEmailExceptionWhenEmailIsTheSame() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .email("same@mail.com")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        var editData = new UserEditDataDto(
                null,
                "same@mail.com",
                null,
                null,
                null,
                null,
                UserSettingsType.EMAIL
        );

        assertThrows(
                SameEmailException.class,
                () -> settingsService.editUserSettings(response, editData, "user1")
        );

        verify(userEntityRepository, never()).save(any());
        verify(jwtService, never()).refreshUserToken(any(), any());
    }

    @Test
    void shouldThrowEmailTakenExceptionWhenEmailAlreadyExists() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .email("old@mail.com")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityRepository.findAllByEmail("taken@mail.com"))
                .thenReturn(List.of(UserEntity.builder().id(2L).build()));

        var editData = new UserEditDataDto(
                null,
                "taken@mail.com",
                null,
                null,
                null,
                null,
                UserSettingsType.EMAIL
        );

        assertThrows(
                EmailTakenException.class,
                () -> settingsService.editUserSettings(response, editData, "user1")
        );

        verify(userEntityRepository, never()).save(any());
        verify(jwtService, never()).refreshUserToken(any(), any());
    }

    @Test
    void shouldChangePasswordWhenAllConditionsAreMet() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .password("encodedOld")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);
        when(userEntityFetcher.getById(1L)).thenReturn(user);

        var oldPassword = "Oldpass1!";
        var newPassword = "Newpass1!";
        var confirmPassword = "Newpass1!";

        when(passwordEncoder.matches(newPassword, "encodedOld")).thenReturn(false);
        when(passwordEncoder.matches(oldPassword, "encodedOld")).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNew");

        var editData = new UserEditDataDto(
                newPassword,
                null,
                null,
                null,
                oldPassword,
                confirmPassword,
                UserSettingsType.PASSWORD
        );

        settingsService.editUserSettings(response, editData, "user1");

        assertEquals("encodedNew", user.getPassword());
        verify(userEntityRepository).save(user);
        verify(jwtService).refreshUserToken(user, response);
    }

    @Test
    void shouldThrowInvalidPasswordExceptionWhenNewPasswordDoesNotMatchRegex() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .password("encodedOld")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        var editData = new UserEditDataDto(
                "short",
                null,
                null,
                null,
                "Oldpass1!",
                "short",
                UserSettingsType.PASSWORD
        );

        assertThrows(
                InvalidPasswordException.class,
                () -> settingsService.editUserSettings(response, editData, "user1")
        );

        verify(userEntityRepository, never()).save(any());
        verify(jwtService, never()).refreshUserToken(any(), any());
    }

    @Test
    void shouldThrowSamePasswordExceptionWhenNewPasswordIsSameAsOldEncoded() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .password("encodedOld")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        var newPassword = "Newpass1!";

        when(passwordEncoder.matches(newPassword, "encodedOld")).thenReturn(true);

        var editData = new UserEditDataDto(
                newPassword,
                null,
                null,
                null,
                "Oldpass1!",
                newPassword,
                UserSettingsType.PASSWORD
        );

        assertThrows(
                SamePasswordException.class,
                () -> settingsService.editUserSettings(response, editData, "user1")
        );

        verify(userEntityRepository, never()).save(any());
        verify(jwtService, never()).refreshUserToken(any(), any());
    }

    @Test
    void shouldThrowInvalidPasswordExceptionWhenOldPasswordIsWrong() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .password("encodedOld")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        var oldPassword = "WrongOld1!";
        var newPassword = "Newpass1!";

        when(passwordEncoder.matches(newPassword, "encodedOld")).thenReturn(false);
        when(passwordEncoder.matches(oldPassword, "encodedOld")).thenReturn(false);

        var editData = new UserEditDataDto(
                oldPassword,
                null,
                null,
                null,
                newPassword,
                newPassword,
                UserSettingsType.PASSWORD
        );

        assertThrows(
                InvalidPasswordException.class,
                () -> settingsService.editUserSettings(response, editData, "user1")
        );

        verify(userEntityRepository, never()).save(any());
        verify(jwtService, never()).refreshUserToken(any(), any());
    }

    @Test
    void shouldThrowInvalidPasswordExceptionWhenNewPasswordAndConfirmDoNotMatch() throws Exception {
        var user = UserEntity.builder()
                .id(1L)
                .username("user1")
                .password("encodedOld")
                .provider(Provider.NONE)
                .build();

        when(userEntityFetcher.getByUsername("user1")).thenReturn(user);

        var oldPassword = "Oldpass1!";
        var newPassword = "Newpass1!";
        var confirmPassword = "Different1!";

        when(passwordEncoder.matches(newPassword, "encodedOld")).thenReturn(false);
        when(passwordEncoder.matches(oldPassword, "encodedOld")).thenReturn(true);

        var editData = new UserEditDataDto(
                newPassword,
                null,
                null,
                null,
                oldPassword,
                confirmPassword,
                UserSettingsType.PASSWORD
        );

        assertThrows(
                InvalidPasswordException.class,
                () -> settingsService.editUserSettings(response, editData, "user1")
        );

        verify(userEntityRepository, never()).save(any());
        verify(jwtService, never()).refreshUserToken(any(), any());
    }
}

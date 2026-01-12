package com.merkury.vulcanus.features.password.reset;

import com.merkury.vulcanus.model.repositories.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetTokenCleanupService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    //jak sie nie da locka na krócej niż trwa rotacja schedulera to wywala błędy
    @Scheduled(cron = "0 */15 * * * *")
    @SchedulerLock(name = "cleanupExpiredTokens", lockAtMostFor = "29m", lockAtLeastFor = "14m")
    public void cleanupExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();

        log.info("Cleaning up expired password reset tokens");
        passwordResetTokenRepository.deleteByExpirationDateBefore(LocalDateTime.now());
        System.out.println("Deleting password reset tokens...");
    }
}
